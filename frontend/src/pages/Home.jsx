import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Sidebar from "../components/layout/Sidebar";
import ChatArea from "../components/layout/ChatArea";
import { getUser } from "../store/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { createChat, getChats } from "../store/actions/chatActions";
import { appendMessage, replaceMessage } from "../store/features/chatSlice";
import { nanoid } from "@reduxjs/toolkit";
import NavBar from "../components/layout/NavBar";

const Home = () => {
  const chats = useSelector((state) => state.chat.chats);
  const [socket, setSocket] = useState(null);
  const [imageGen, setImageGen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

  const [chatID, setChatID] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  const messages = useSelector((state) => state.chat.messages[chatID]);

  async function getUserDetails() {
    await dispatch(getUser());
    await dispatch(getChats());
  }

  useEffect(() => {
    const tempSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    tempSocket.on("ai-response-start", () => {
      setLoadingMessage(true);
    });

    tempSocket.on("ai-response", ({ responseToUser }) => {
      setLoadingMessage(false);
      dispatch(
        appendMessage({
          chatID: responseToUser.chatID,
          message: responseToUser,
        })
      );
    });

    tempSocket.on("user-message", ({ messageFromUser, tempID }) => {
      dispatch(
        replaceMessage({
          chatID: messageFromUser.chatID,
          tempID,
          confirmedMessage: { ...messageFromUser, clientKey: tempID },
        })
      );
    });

    tempSocket.on("ai-image-start", () => {
      setLoadingImage(true);
    });

    tempSocket.on("ai-image-response", ({ responseToUser }) => {
      setLoadingImage(false);
      dispatch(
        appendMessage({
          chatID: responseToUser.chatID,
          message: responseToUser,
        })
      );
    });

    tempSocket.on("ai-error", (error) => {
      setLoadingMessage(false);
      setLoadingImage(false);

      // Add error message to chat
      const errorMessage = {
        _id: "error-" + nanoid(),
        chatID,
        content:
          "I apologize, but I encountered an error while processing your request. Please try again.",
        role: "error",
        createdAt: new Date().toISOString(),
      };

      if (chatID) {
        dispatch(appendMessage({ chatID, message: errorMessage }));
      }
    });
    setSocket(tempSocket);

    getUserDetails();
  }, []);

  const handleSendMessage = async (content) => {
    const tempID = "temp-" + nanoid();

    const tempMessage = {
      _id: tempID,
      clientKey: tempID,
      chatID,
      file: selectedFile ? true : false,
      fileType: selectedFile ? selectedFile.fileType : null,
      fileUrl,
      content,
      role: "user",
    };
    dispatch(appendMessage({ chatID, message: tempMessage }));

    socket.emit("ai-message", {
      chatID,
      content,
      file: selectedFile ? true : false,
      fileData: selectedFile ? selectedFile.buffer : null,
      fileType: selectedFile ? selectedFile.fileType : null,
      tempID,
    });

    setSelectedFile(null);
  };

  const handleImageGeneration = async (content) => {
    console.log("Running");

    socket.emit("ai-image", {
      chatID,
      prompt: content,
    });
  };

  const handlechatselect = (id) => {
    setChatID(id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNewChat = async () => {
    const response = await dispatch(createChat({ title }));
    if (response) {
      handlechatselect(response._id);
    }
  };

  return (
    <>
      <div className="flex h-screen bg-[#1a1a1a] overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          chats={chats}
          chatID={chatID}
          onchatselect={handlechatselect}
          onNewChat={handleNewChat}
        />

        <ChatArea
          messages={messages || []}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          onToggleSidebar={toggleSidebar}
          className={`transition-all duration-300 ${
            sidebarOpen ? "lg:ml-0" : "lg:ml-0"
          }`}
          chatID={chatID}
          chats={chats}
          handleNewChat={handleNewChat}
          handleImageGeneration={handleImageGeneration}
          imageGen={imageGen}
          setImageGen={setImageGen}
          loadingMessage={loadingMessage}
          loadingImage={loadingImage}
          setSelectedFile={setSelectedFile}
          setFileUrl={setFileUrl}
        />
      </div>
    </>
  );
};

export default Home;
