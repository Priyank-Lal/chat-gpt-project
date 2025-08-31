import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, Send, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

// This custom hook automatically adjusts the height of a textarea as the user types.
function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(
    (reset = false) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset to minimum height
      textarea.style.height = `${minHeight}px`;

      if (reset) {
        return;
      }

      // Calculate new height based on content, constrained by min/max
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const MIN_HEIGHT = 24;
const MAX_HEIGHT = 200;

export default function AiInput({ value, setValue, handleKeyPress, onSend }) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Handle removing the attached file preview
  const handleClosePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    setImagePreview(null);
  };

  // Handle file selection and create a preview URL
  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if ((value.trim() || imagePreview) && onSend) {
      onSend();
    }
    // Clear image preview on submit
    if (imagePreview) {
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    // Reset textarea height after sending
    adjustHeight(true);
  };

  // Clean up the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Adjust textarea height when value changes
  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#2f2f2f] rounded-2xl border border-[#4a4a4a] shadow-lg overflow-hidden flex flex-col focus-within:border-[#5a5a5a] transition-all duration-200 my-4 mx-2"
    >
      {/* File Preview Section */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 border-b border-[#4a4a4a] overflow-hidden"
          >
            <div className="relative inline-block align-top">
              <img
                src={imagePreview}
                alt="Attachment preview"
                className="object-cover w-20 h-20 rounded-lg"
              />
              <button
                onClick={handleClosePreview}
                aria-label="Remove attachment"
                className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar Section */}
      <div className="flex items-start gap-3 p-3">
        {/* Attachment Button */}
        <label
          className={cn(
            "cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-[#3a3a3a] flex-shrink-0 w-9 h-9 flex items-center justify-center",
            imagePreview ? "text-orange-400" : "text-gray-400 hover:text-white"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <Paperclip className="w-5 h-5" />
        </label>

        {/* Textarea */}
        <Textarea
          value={value}
          placeholder="Message..."
          // className="flex-1 bg-transparent border-none text-white placeholder:text-gray-400 resize-none focus-visible:ring-0 focus-visible:border-none shadow-none p-0 text-base leading-6"
          className="w-full rounded-2xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white resize-none focus-visible:ring-0 leading-[1.2]"
          ref={textareaRef}
          onKeyDown={handleKeyPress}
          onChange={(e) => setValue(e.target.value)}
          style={{ height: `${MIN_HEIGHT}px` }}
          rows={1}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!value.trim() && !imagePreview}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0",
            value.trim() || imagePreview
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-[#3a3a3a] text-gray-500 cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
