import api from "../../api/api";
import {
  loadChats,
  loadMessages,
  setLoading,
  appendChat,
  setCreating,
  removeChat,
  removeMessages,
} from "../features/chatSlice";

export const createChat = (title) => async (dispatch) => {
  try {
    dispatch(setCreating(true));
    const { data } = await api.post("/api/chat", title);
    console.log(data.chat);
    
    dispatch(appendChat(data.chat));
    return data.chat;
  } catch (error) {
    alert("An error Occured");
    console.log(error);
  } finally {
    dispatch(setCreating(false));
  }
};

export const getChats = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/api/chat/get-chats");
    dispatch(loadChats(data.chats));
  } catch (error) {
    alert("An error Occured");
    console.log(error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const getMessages = (chatID) => async (dispatch, getState) => {
  const cachedMessages = getState().chat.messages[chatID];

  if (cachedMessages) {
    return;
  }

  try {
    const { data } = await api.get(`/api/chat/get-messages/${chatID}`);

    dispatch(loadMessages({ chatID, messages: data.messages }));
  } catch (error) {
    alert("An error Occured");
    console.log(error);
  }
};

export const deleteChat = (chatID) => async (dispatch) => {
  if (!chatID) return;

  try {
    const { data } = await api.delete(`/api/chat/delete-chat/${chatID}`);
    dispatch(removeChat({ chatID }));
    dispatch(removeMessages({ chatID }));
  } catch (error) {
    alert("An error Occured");
    console.log(error);
  }
};
