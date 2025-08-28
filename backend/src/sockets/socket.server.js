const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const { generateResponse, generateVector } = require("../services/ai.service");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

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
      /*
      const messageFromUser = await messageModel.create({
        userID: socket.user._id,
        chatID: messagePayload.chatID,
        content: messagePayload.content,
        role: "user",
      });

      const userVectors = await generateVector(messagePayload.content);
      */

      const [messageFromUser, userVectors] = await Promise.all([
        messageModel.create({
          userID: socket.user._id,
          chatID: messagePayload.chatID,
          content: messagePayload.content,
          role: "user",
        }),
        generateVector(messagePayload.content),
      ]);

      /*

      const memory = await queryMemory({
        queryVector: userVectors,
        limit: 5,
        metadata: {},
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

      const chatHistory = (
        await messageModel
          .find({
            chatID: messagePayload.chatID,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();
      */

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

      const shortTermMemory = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });

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

      /*

      const responseToUser = await messageModel.create({
        userID: socket.user._id,
        chatID: messagePayload.chatID,
        content: aiResponse,
        role: "model",
      });

      const responseVectors = await generateVector(aiResponse);
*/
      socket.emit("ai-response", {
        response: aiResponse,
        chat: messagePayload.chatID,
      });

      const [responseToUser, responseVectors] = await Promise.all([
        messageModel.create({
          userID: socket.user._id,
          chatID: messagePayload.chatID,
          content: aiResponse,
          role: "model",
        }),
        generateVector(aiResponse),
      ]);

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
  });
}

module.exports = initSocketServer;
