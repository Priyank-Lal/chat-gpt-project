const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gpt-users",
      required: true,
    },
    chatID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "model"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("messages", messageSchema);

module.exports = messageModel;
