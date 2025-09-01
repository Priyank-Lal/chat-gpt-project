import React, { useState, useEffect, useRef } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  MoreHorizontal,
  Menu,
  User,
  Bot,
} from "lucide-react";
import AiInput from "../ui/ai-input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Bot avatar component
const BotAvatar = () => (
  <div className="w-8 h-8 flex-shrink-0 bg-[#10a37f] rounded-full flex items-center justify-center shadow-sm">
    <span className="text-white font-bold text-sm">G</span>
  </div>
);

// User avatar component
const UserAvatar = ({ user }) => (
  <div className="w-8 h-8 flex-shrink-0 bg-[#ab68ff] rounded-full flex items-center justify-center shadow-sm">
    <User size={16} className="text-white" />
  </div>
);

// Empty state component
const EmptyState = ({ onNewChat }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 max-w-2xl mx-auto">
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-8"
    >
      <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-6">
        <Bot size={32} className="text-white" />
      </div>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="text-2xl font-normal text-white mb-4"
    >
      How can I help you today?
    </motion.h2>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg"
    >
      {[
        "Create a workout plan",
        "Write a Python script",
        "Plan a trip to Japan",
        "Explain quantum computing",
      ].map((suggestion, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl text-sm text-white border border-[#3a3a3a] hover:border-[#4a4a4a] transition-all duration-200 text-left"
          onClick={() => onNewChat && onNewChat()}
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  </div>
);

const ChatArea = ({
  messages,
  onSendMessage = () => {},
  isTyping = false,
  onToggleSidebar = () => {},
  className = "",
  chatID,
  handleNewChat,
  handleImageGeneration = () => {},
  imageGen,
  setImageGen,
  loadingMessage,
  loadingImage,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (imageGen) {
      handleImageGeneration(inputMessage);
    } else {
      await onSendMessage(inputMessage);
    }
    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const displayMessages = messages?.length ? messages : [];

  return (
    <div
      className={cn(
        "flex-1 flex flex-col bg-[#1a1a1a] text-white overflow-hidden",
        className
      )}
    >
      {/* Header for mobile */}
      <div className="lg:hidden bg-[#1a1a1a] border-b border-[#3a3a3a] p-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-all duration-200"
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-white truncate">ChatGPT</h1>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {displayMessages.length === 0 && !isTyping ? (
            <EmptyState onNewChat={handleNewChat} />
          ) : (
            <div className="space-y-6 p-4">
              <AnimatePresence>
                {displayMessages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    layout
                    className="group"
                  >
                    {message.role === "user" ? (
                      // User message with bubble
                      <div className="flex justify-end mb-4">
                        <div className="flex items-start gap-3 max-w-[80%]">
                          <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-white">
                              {message.content}
                            </div>
                          </div>
                          <UserAvatar />
                        </div>
                      </div>
                    ) : (
                      // AI message with flat design
                      <div className="flex items-start gap-3 mb-6">
                        <BotAvatar />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap text-white">
                            {message.image ? (
                              <>
                                <p>{message.content.text}</p>
                                <img
                                  src={message.content.imageUrl}
                                  alt="AI Generated"
                                  className="rounded-lg max-w-xs md:max-w-sm lg:max-w-md border border-[#3a3a3a] shadow"
                                />
                              </>
                            ) : (
                              <>{message.content}</>
                            )}
                          </div>
                          {/* Action buttons */}
                          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button className="p-2 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition-all duration-200">
                              <Copy size={14} />
                            </button>
                            <button className="p-2 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition-all duration-200">
                              <ThumbsUp size={14} />
                            </button>
                            <button className="p-2 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition-all duration-200">
                              <ThumbsDown size={14} />
                            </button>
                            <button className="p-2 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition-all duration-200">
                              <RotateCcw size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Show typing dots loader */}
              {(isTyping || loadingMessage) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <BotAvatar />
                  <div className="flex items-center space-x-2 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Show skeleton for image loader */}
              {loadingImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <BotAvatar />
                  <div className="rounded-lg max-w-xs md:max-w-sm lg:max-w-md bg-[#2a2a2a] animate-pulse border border-[#3a3a3a]" />
                </motion.div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <BotAvatar />
                  <div className="flex items-center space-x-2 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      {chatID && (
        <div className="">
          <div className="max-w-4xl mx-auto">
            <AiInput
              value={inputMessage}
              setValue={setInputMessage}
              handleKeyPress={handleKeyPress}
              onSend={handleSendMessage}
              imageGen={imageGen}
              setImageGen={setImageGen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
