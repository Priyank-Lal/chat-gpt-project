import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Paperclip, Plus, Send, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as farThumbsUp,
  faThumbsDown as farThumbsDown,
  faCopy,
  faImage,
} from "@fortawesome/free-regular-svg-icons";

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

const MIN_HEIGHT = 48;
const MAX_HEIGHT = 164;

const AnimatedPlaceholder = ({ imageGen }) => (
  <AnimatePresence mode="wait">
    <motion.p
      key={imageGen ? "search" : "ask"}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.1 }}
      className="pointer-events-none w-[150px] text-sm absolute text-white/70 dark:text-white/70"
    >
      {imageGen ? "Generate Images..." : "Ask Nebula AI..."}
    </motion.p>
  </AnimatePresence>
);

export default function AiInput({
  value,
  setValue,
  handleKeyPress,
  onSend,
  imageGen,
  setImageGen,
  setSelectedFile,
  setFileUrl,
}) {
  // const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const clearFileState = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(null);
    setSelectedFile(null);
    setFileUrl(null);
  };

  const handleClosePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 1) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImagePreview(null);
      setSelectedFile(null);
      setFileUrl(null);
      return;
    }

    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setImagePreview(null);
        setSelectedFile(null);
        setFileUrl(null);
        return;
      }
      // Validate file size (max 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setImagePreview(null);
        setSelectedFile(null);
        setFileUrl(null);
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      setImagePreview(previewUrl);
      setFileUrl(previewUrl);
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        setSelectedFile({
          fileName: file.name,
          fileType: file.type,
          buffer: arrayBuffer,
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      setImagePreview(null);
    }
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() && !imagePreview) return;

    console.log("rummimg");

    clearFileState();

    // Send message with tempPreview
    onSend();

    // Clear input value
    setValue("");
    adjustHeight(true);
  };
  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="w-full rounded-2xl border border-[#4a4a4a] shadow-lg overflow-hidden flex flex-col  transition-all duration-200 my-4 mx-2">
        {/* <div className="relative max-w-xl border rounded-[22px] border-black/5 p-1 w-full mx-auto"> */}

        <div className="relative rounded-2xl border border-black/5 bg-[#2f2f2f] flex flex-col">
          <AnimatePresence>
            {imagePreview != null && (
              <motion.div
                key={imagePreview} // << add this
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
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          >
            <div className="relative">
              <Textarea
                id="ai-input-04"
                value={value}
                placeholder=""
                className="w-full rounded-2xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white resize-none focus-visible:ring-0 leading-[1.2]"
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleKeyPress(e);
                    clearFileState();
                  }
                }}
                onChange={(e) => setValue(e.target.value)}
                style={{ height: `${MIN_HEIGHT}px` }}
                rows={1}
              />
              {!value && (
                <div className="absolute left-4 top-3">
                  <AnimatedPlaceholder imageGen={imageGen} />
                </div>
              )}
            </div>
          </div>

          <div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl">
            <div className="absolute left-3 bottom-3 flex items-center gap-2">
              <label
                className={cn(
                  "cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-[#3a3a3a] flex-shrink-0 w-9 h-9 flex items-center justify-center",
                  imagePreview
                    ? "text-orange-400"
                    : "text-gray-400 hover:text-white"
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
              <button
                type="button"
                onClick={() => {
                  setImageGen(!imageGen);
                }}
                className={cn(
                  "rounded-full transition-all flex items-center gap-2 px-1.5 py-1 border h-8",
                  imageGen
                    ? "bg-blue-500/15 border-blue-500 text-blue-500"
                    : "bg-black/5 dark:bg-white/5 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                )}
              >
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <motion.div
                    animate={{
                      rotate: imageGen ? [15] : 0,
                      scale: imageGen ? 1.1 : 1,
                    }}
                    whileHover={{
                      rotate: imageGen ? 15 : 15,
                      scale: 1.1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                    }}
                  >
                    {/* <Globe
                      className={cn(
                        "w-4 h-4",
                        imageGen ? "text-[#ff3f17]" : "text-inherit"
                      )}
                    /> */}
                    <FontAwesomeIcon
                      className={cn(
                        "w-4 h-4",
                        imageGen ? "text-blue-500" : "text-inherit"
                      )}
                      icon={faImage}
                    />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {imageGen && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{
                        width: "auto",
                        opacity: 1,
                      }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm overflow-hidden whitespace-nowrap text-blue-500 flex-shrink-0"
                    >
                      Generate Image
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            <div className="absolute right-3 bottom-3">
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
          </div>
        </div>
        {/* </div> */}
      </div>
    </form>
  );
}
