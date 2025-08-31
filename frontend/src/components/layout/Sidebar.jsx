import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquareText,
  Settings,
  X,
  User,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../../store/actions/chatActions";
import { Skeleton } from "@/components/ui/skeleton";

// Framer Motion Variants for animations
const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "beforeChildren",
    },
  },
  closed: {
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const listVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { y: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: { y: { stiffness: 1000 } },
  },
};

const Sidebar = ({
  isOpen,
  onToggle,
  chatID,
  onchatselect,
  onNewChat,
  className,
}) => {
  const user = useSelector((state) => state.user.user);
  const chats = useSelector((state) => state.chat.chats);
  const isLoading = useSelector((state) => state.chat.loading);
  const isCreating = useSelector((state) => state.chat.creating);

  const dispatch = useDispatch();

  const handleChatSelect = (selectedChatId) => {
    onchatselect(selectedChatId);
    dispatch(getMessages(selectedChatId));

    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Container */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={cn(
          "fixed lg:relative top-0 left-0 h-full w-full max-w-[280px] bg-[#1a1a1a] border-r border-[#3a3a3a] flex flex-col z-50 text-white shadow-2xl",
          className
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-[#3a3a3a]">
          <div className="flex items-center justify-between mb-4">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-2"
            >
              <span className="text-lg font-semibold tracking-tight text-white">
                ChatGPT
              </span>
            </motion.h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-lg transition-all duration-200"
            >
              <X size={20} />
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={onNewChat}
              className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium transition-all duration-200 rounded-lg h-10 border border-[#3a3a3a] hover:border-[#4a4a4a]"
            >
              <Plus size={16} className="mr-2" />
              New chat
            </Button>
          </motion.div>
        </div>

        {/* Chat History */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-3">
            <motion.ul variants={listVariants} className="space-y-1 py-2">
              <AnimatePresence>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-white"></div>
                  </div>
                ) : (
                  <>
                    {chats?.map((chat) => (
                      <motion.li
                        key={chat._id}
                        variants={itemVariants}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => handleChatSelect(chat._id)}
                          className={cn(
                            "w-full justify-start p-3 h-auto text-left rounded-lg transition-all duration-200 group",
                            chat._id === chatID
                              ? "bg-[#2a2a2a] text-white"
                              : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                          )}
                        >
                          <MessageSquareText
                            size={16}
                            className={cn(
                              "flex-shrink-0 mr-3 transition-colors duration-200",
                              chat._id === chatID
                                ? "text-white"
                                : "text-gray-500 group-hover:text-gray-300"
                            )}
                          />
                          <span className="truncate flex-1 text-sm font-normal">
                            {chat.title || "New Conversation"}
                          </span>
                        </Button>
                      </motion.li>
                    ))}
                    {isCreating && (
                      <motion.li layout>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#2a2a2a]">
                          <Skeleton className="h-4 w-4 rounded bg-[#3a3a3a]" />
                          <Skeleton className="h-4 w-32 rounded bg-[#3a3a3a]" />
                        </div>
                      </motion.li>
                    )}
                  </>
                )}
              </AnimatePresence>
            </motion.ul>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-[#3a3a3a] space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-lg h-10 transition-all duration-200"
          >
            <Trash2 size={16} className="mr-3" /> Clear conversations
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-lg h-10 transition-all duration-200"
          >
            <Settings size={16} className="mr-3" /> Settings
          </Button>
          <div className="p-3 rounded-lg hover:bg-[#2a2a2a] transition-all duration-200 cursor-pointer flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={user?.avatarUrl || "https://github.com/shadcn.png"}
              />
              <AvatarFallback className="bg-[#3a3a3a] text-white font-semibold text-sm">
                <User size={14} />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-normal text-white truncate">
              {user?.fullName
                ? `${user.fullName.firstName} ${user.fullName.lastName}`
                : "Guest User"}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
