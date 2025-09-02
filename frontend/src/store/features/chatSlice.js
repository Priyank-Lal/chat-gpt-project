import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  messages: {},
  loading: false,
  creating: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loadChats: (state, action) => {
      state.chats = action.payload;
    },
    loadMessages: (state, action) => {
      const { chatID, messages } = action.payload;
      state.messages[chatID] = messages;
    },
    appendMessage: (state, action) => {
      const { chatID, message } = action.payload;
      if (!state.messages[chatID]) {
        state.messages[chatID] = [];
      }
      state.messages[chatID].push(message);
    },
    replaceMessage: (state, action) => {
      const { chatID, tempID, confirmedMessage } = action.payload;
      if (!state.messages[chatID]) return;

      const idx = state.messages[chatID].findIndex(
        (msg) => msg._id === tempID || msg.content === confirmedMessage.content
      );

      if (idx !== -1) {
        state.messages[chatID][idx] = confirmedMessage;
      } else {
        state.messages[chatID].push(confirmedMessage);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCreating: (state, action) => {
      state.creating = action.payload;
    },
    appendChat: (state, action) => {
      state.chats.unshift(action.payload);
    },
    removeChat: (state, action) => {
      const { chatID } = action.payload;
      const filteredChats = state.chats.filter((chat) => {
        return chat._id !== chatID;
      });
      state.chats = filteredChats;
    },
    removeMessages: (state, action) => {
      const { chatID } = action.payload;
      delete state.messages[chatID];
    },
  },
});

export default chatSlice.reducer;
export const {
  loadChats,
  loadMessages,
  appendMessage,
  replaceMessage,
  setLoading,
  appendChat,
  setCreating,
  removeChat,
  removeMessages,
} = chatSlice.actions;
