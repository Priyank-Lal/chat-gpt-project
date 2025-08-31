const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");

const createChat = async (req, res) => {
  const { title } = req.body;
  const user = req.user;

  const chat = await chatModel.create({
    userID: user._id,
    title,
  });

  res.status(201).json({
    message: "Chat Created Successfully",
    chat: {
      _id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity,
    },
  });
};

const getChats = async (req, res) => {
  const user = req.user;

  try {
    const chats = await chatModel.find({ userID: user._id });

    if (!chats)
      return res.status(404).json({
        message: "No Chats Found",
      });

    return res.status(200).json({
      message: "Chats Fetched Successfully",
      chats,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An Error Has Occured",
      error,
    });
  }
};

const getMessages = async (req, res) => {
  const user = req.user;
  const { chatID } = req.params;

  try {
    const messages = await messageModel.find({
      userID: user._id,
      chatID: chatID,
    });

    if (!messages)
      return res.status(404).json({
        message: "No Messages Found",
      });

    return res.status(200).json({
      message: "Messages Fetched Successfully",
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An Error Has Occured",
      error,
    });
  }
};

const deleteChat = async (req, res) => {
  const user = req.user;
  const { chatID } = req.params;

  try {
    const deletedChat = await chatModel.findOneAndDelete({
      _id: chatID,
      userID: user._id,
    });

    if (!deletedChat) {
      return res.status(404).json({
        message: "No Chat Found to Delete",
      });
    }

    const deleteMessages = await messageModel.deleteMany({
      chatID: chatID,
      userID: user._id,
    });

    return res.status(200).json({
      message: "Deleted Chat and All Messages Successfully",
    });
  } catch (error) {
     return res.status(500).json({
       message: "An Error Has Occured",
       error,
     });
  }
};

module.exports = { createChat, getChats, getMessages, deleteChat };
