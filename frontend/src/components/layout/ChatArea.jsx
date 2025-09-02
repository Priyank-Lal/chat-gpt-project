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
  Check,
  AlertCircleIcon,
} from "lucide-react";
import AiInput from "../ui/ai-input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as farThumbsUp,
  faThumbsDown as farThumbsDown,
  faCopy,
} from "@fortawesome/free-regular-svg-icons";

import {
  faCheck,
  faArrowsRotate,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EmptyState = ({ onNewChat }) => (
  <div className="mt-50">
    <div className="flex flex-col items-center justify-center h-full text-center p-8 max-w-2xl mx-auto ">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-6">
          <img src="../../../icons8-ai.svg" className="w-12 h-12" alt="" />{" "}
        </div>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="text-2xl font-normal text-white mb-4"
      >
        Welcome to Nebula!
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <p className="text-white text-xl opacity-80 mb-2">
          Nebula is your intelligent AI assistant, ready to help with your
          questions, ideas, and projects. Just type your message below to get
          started.
        </p>
      </motion.div>
    </div>
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
  setSelectedFile,
  setFileUrl,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isCopyIcon, setIsCopyIcon] = useState(true);
  const [reactions, setReactions] = useState({});

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
              <AnimatePresence initial={false}>
                {displayMessages.map((message) => (
                  <motion.div
                    key={message.clientKey || message._id}
                    initial={
                      message._id.startsWith("temp")
                        ? { opacity: 0, y: 20 }
                        : { opacity: 1, y: 0 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    layout
                    className="group"
                  >
                    {message.role === "user" ? (
                      // User message with small avatar + separate bubble
                      <div className="flex justify-end mb-4">
                        <div className="flex flex-col items-end gap-2 max-w-[80%]">
                          {/* Small user image/avatar */}
                          {message.file === true && (
                            <img
                              src={message.fileUrl}
                              alt="User uploaded"
                              className="max-w-100 max-h-100 rounded-lg object-cover border border-[#3a3a3a] shadow"
                            />
                          )}

                          {/* Message bubble */}
                          <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-white">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // AI message with flat design
                      <div className="flex items-start gap-3 mb-6">
                        {/* <BotAvatar /> */}
                        <img
                          src="../../../icons8-ai.svg"
                          className="w-6 h-6"
                          alt=""
                        />{" "}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap text-white">
                            {/* Error message display */}
                            {message.role === "error" ? (
                              <Alert
                                variant="destructive"
                                className="px-4 py-2 rounded-2xl shadow text-sm max-w-xl"
                              >
                                <AlertCircleIcon />
                                <AlertTitle>Error Occured</AlertTitle>
                                <AlertDescription>
                                  {message.content}
                                </AlertDescription>
                              </Alert>
                            ) : message.file ? (
                              <>
                                <img
                                  src={message.fileUrl}
                                  alt="AI Generated"
                                  className="rounded-lg max-w-xs md:max-w-sm lg:max-w-md border border-[#3a3a3a] shadow"
                                />
                              </>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="prose prose-invert max-w-none">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      ul: ({ node, ...props }) => (
                                        <ul
                                          className="list-disc pl-6 space-y-0.5"
                                          {...props}
                                        />
                                      ),
                                      ol: ({ node, ...props }) => (
                                        <ol
                                          className="list-decimal pl-6 space-y-0.5"
                                          {...props}
                                        />
                                      ),
                                      li: ({ node, ...props }) => (
                                        <li className="mb-1" {...props} />
                                      ),
                                      code({
                                        inline,
                                        className,
                                        children,
                                        ...props
                                      }) {
                                        const match = /language-(\w+)/.exec(
                                          className || ""
                                        );
                                        return !inline && match ? (
                                          <SyntaxHighlighter
                                            style={oneDark}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                          >
                                            {String(children).replace(
                                              /\n$/,
                                              ""
                                            )}
                                          </SyntaxHighlighter>
                                        ) : (
                                          <code className="bg-[#2a2a2a] px-1 py-0.5 text-pink-400">
                                            {children}
                                          </code>
                                        );
                                      },
                                    }}
                                  >
                                    {message.content}
                                  </ReactMarkdown>
                                </div>
                              </motion.div>
                            )}
                          </div>
                          {/* Action buttons */}
                          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              className="p-1 px-2 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition-all duration-200"
                              onClick={() => {
                                if (message.file) {
                                  navigator.clipboard.writeText(
                                    message.fileUrl
                                  );
                                } else {
                                  navigator.clipboard.writeText(
                                    message.content
                                  );
                                }
                                setIsCopyIcon(false);
                                setTimeout(() => {
                                  setIsCopyIcon(true);
                                }, 4000);
                              }}
                            >
                              {isCopyIcon ? (
                                <FontAwesomeIcon
                                  icon={faCopy}
                                  className="text-gray-400"
                                  size="sm"
                                />
                              ) : (
                                // <Check size={14} />
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className="text-gray-400"
                                  size="sm"
                                />
                              )}
                            </button>
                            <button
                              className="p-1 px-2 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition-all duration-200"
                              onClick={() => {
                                setReactions((prev) => {
                                  // If thumbs up is active, clear it; else set to up and clear down if present
                                  if (prev[message._id] === "up") {
                                    return { ...prev, [message._id]: null };
                                  } else {
                                    return { ...prev, [message._id]: "up" };
                                  }
                                });
                              }}
                            >
                              <FontAwesomeIcon
                                icon={
                                  reactions[message._id] === "up"
                                    ? faThumbsUp
                                    : farThumbsUp
                                }
                                className="text-gray-400"
                                size="sm"
                              />
                            </button>

                            <button
                              className="p-1 px-2 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition-all duration-200"
                              onClick={() => {
                                setReactions((prev) => {
                                  // If thumbs down is active, clear it; else set to down and clear up if present
                                  if (prev[message._id] === "down") {
                                    return { ...prev, [message._id]: null };
                                  } else {
                                    return { ...prev, [message._id]: "down" };
                                  }
                                });
                              }}
                            >
                              <FontAwesomeIcon
                                icon={
                                  reactions[message._id] === "down"
                                    ? faThumbsDown
                                    : farThumbsDown
                                }
                                className="text-gray-400"
                                size="sm"
                              />
                            </button>
                            <button className="p-1 px-2 hover:bg-[#2a2a2a] rounded-lg text-gray-400  transition-all duration-200">
                              <FontAwesomeIcon
                                icon={faArrowsRotate}
                                size="xs"
                              />
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
                  <img
                    src="../../../icons8-ai.svg"
                    className="w-6 h-6"
                    alt=""
                  />

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

              {loadingImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <img
                    src="../../../icons8-ai.svg"
                    className="w-6 h-6"
                    alt=""
                  />

                  <div className="h-110 w-110 rounded-lg bg-[#2a2a2a] animate-pulse border border-[#3a3a3a]" />
                </motion.div>
              )}
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <img
                    src="../../../icons8-ai.svg"
                    className="w-6 h-6"
                    alt=""
                  />

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
              setSelectedFile={setSelectedFile}
              setFileUrl={setFileUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
