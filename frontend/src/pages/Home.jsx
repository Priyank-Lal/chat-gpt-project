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
  const dispatch = useDispatch();

  const [chatID, setChatID] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messages = useSelector((state) => state.chat.messages[chatID]);

  async function getUserDetails() {
    await dispatch(getUser());
    await dispatch(getChats());
  }

  useEffect(() => {
    const tempSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    tempSocket.on("ai-response", ({ responseToUser }) => {
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
          confirmedMessage: messageFromUser,
        })
      );
    });

    tempSocket.on("ai-image-response", ({ responseToUser }) => {
      console.log(responseToUser);
      
    });
    setSocket(tempSocket);

    getUserDetails();
  }, []);

  const handleSendMessage = async (content) => {
    const tempID = "temp-" + nanoid();

    const tempMessage = {
      _id: tempID,
      chatID,
      content,
      role: "user",
    };
    dispatch(appendMessage({ chatID, message: tempMessage }));

    socket.emit("ai-message", { chatID, content, tempID });
  };

  const handleImageGeneration = async (content) => {
    console.log("Running");
    
    socket.emit("ai-image", {
      chatID,
      prompt: "An image of an Astronaut",
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
    const title = prompt("Enter the title of your chat");

    const response = await dispatch(createChat({ title }));

    handlechatselect(response.chatID);
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
        />
      </div>
    </>
  );
};

export default Home;
