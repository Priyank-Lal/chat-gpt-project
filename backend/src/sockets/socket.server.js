const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const {
  generateResponse,
  generateVector,
  generateImage,
} = require("../services/ai.service");
const { createMemory, queryMemory } = require("../services/vector.service");
const { uploadImage } = require("../services/cloudinary.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("Authentication Error: No Token Provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);
      const user = await userModel.findOne({ _id: decoded.id });
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication Error: Invalid Token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      socket.emit("ai-response-start");

      let uploadedFileUrl = null;

      if (messagePayload.file && messagePayload.fileData) {
        const buffer = Buffer.from(messagePayload.fileData);
        const base64Data = buffer.toString("base64");
        const dataUri = `data:${messagePayload.fileType};base64,${base64Data}`;

        const uploaded = await uploadImage(dataUri); // pass as string
        uploadedFileUrl = uploaded
      }

      
      const [messageFromUser, userVectors] = await Promise.all([
        messageModel.create({
          userID: socket.user._id,
          chatID: messagePayload.chatID,
          content: messagePayload.content,
          file: messagePayload.file || false,
          fileUrl: uploadedFileUrl,
          role: "user",
        }),
        generateVector(messagePayload.content),
      ]);

      socket.emit("user-message", {
        messageFromUser,
        tempID: messagePayload.tempID,
      });

      await createMemory({
        vectors: userVectors,
        messageID: messageFromUser._id,
        metadata: {
          chatID: messagePayload.chatID,
          userID: socket.user._id,
          text: messagePayload.content,
        },
      });

      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          queryVector: userVectors,
          limit: 5,
          metadata: {
            userID: socket.user._id,
          },
        }),
        (
          await messageModel
            .find({
              chatID: messagePayload.chatID,
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
        ).reverse(),
      ]);

      const shortTermMemory = await Promise.all(
        chatHistory.map(async (item) => {
          const parts = [];
          if (item.fileUrl) {
            const fileData = await fetch(item.fileUrl);
            const imageArrayBuffer = await fileData.arrayBuffer();
            const base64ImageData =
              Buffer.from(imageArrayBuffer).toString("base64");
            parts.push({
              inlineData: {
                mimeType: item.fileType || "image/png",
                data: base64ImageData,
              },
            });
          }
          if (item.content) {
            parts.push({ text: item.content });
          }
          return { role: item.role, parts };
        })
      );

      const longTermMemory = [
        {
          role: "user",
          parts: [
            {
              text: `
          These are some previous messages from the chat, use them to generate a response: 
          ${memory.map((item) => item.metadata.text).join("\n")}
          `,
            },
          ],
        },
      ];

      const aiResponse = await generateResponse([
        ...longTermMemory,
        ...shortTermMemory,
      ]);

      const [responseToUser, responseVectors] = await Promise.all([
        messageModel.create({
          userID: socket.user._id,
          chatID: messagePayload.chatID,
          content: aiResponse,
          file: false,
          role: "model",
        }),
        generateVector(aiResponse),
      ]);

      socket.emit("ai-response", {
        responseToUser,
      });

      await createMemory({
        vectors: responseVectors,
        messageID: responseToUser._id,
        metadata: {
          chatID: messagePayload.chatID,
          userID: socket.user._id,
          text: aiResponse,
        },
      });
    });

    socket.on("ai-image", async (payload) => {
      socket.emit("ai-image-start");
      try {
        const messageFromUser = await messageModel.create({
          userID: socket.user._id,
          chatID: payload.chatID,
          content: payload.prompt,
          file: false,
          role: "user",
        });

        socket.emit("user-message", {
          messageFromUser,
          tempID: payload.tempID,
        });

        const { text, imageUrl } = await generateImage(payload.prompt);

        // Save the imageUrl as fileUrl and remove imageUrl from content
        const responseToUser = await messageModel.create({
          userID: socket.user._id,
          chatID: payload.chatID,
          content: text,
          file: true,
          fileUrl: imageUrl,
          role: "model",
        });

        socket.emit("ai-image-response", {
          responseToUser: {
            ...responseToUser.toObject(),
            image: true,
          },
        });
      } catch (err) {
        console.error("❌ Error in ai-image:", err.message);
        socket.emit("ai-error", { error: "Failed to generate image" });
      }
    });
  });
}

module.exports = initSocketServer;
