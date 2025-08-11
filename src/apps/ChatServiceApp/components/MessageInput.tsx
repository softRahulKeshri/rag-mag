import {
  useRef,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
  type FormEvent,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  PlusIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import type { IFileAttachment } from "../types/types";

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isSending: boolean;
}

export interface MessageInputRef {
  focus: () => void;
  clear: () => void;
}

export const MessageInput = forwardRef<MessageInputRef, MessageInputProps>(
  ({ onSendMessage, isSending }, ref) => {
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<IFileAttachment | null>(
      null
    );
    const [isFocused, setIsFocused] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Expose focus and clear methods to parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      clear: () => {
        setMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (textareaRef.current) {
          textareaRef.current.style.height = "36px";
        }
      },
    }));

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      const trimmedMessage = message.trim();

      if (trimmedMessage || selectedFile) {
        const file = fileInputRef.current?.files?.[0];
        onSendMessage(trimmedMessage, file);
        setMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (textareaRef.current) {
          textareaRef.current.style.height = "36px";
        }
      }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          alert("File size must be less than 10MB");
          return;
        }

        setSelectedFile({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = "auto";
      target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
    };

    const removeFile = () => {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const hasContent = message.trim() || selectedFile;

    return (
      <div className="relative bg-gradient-to-b from-white to-gray-50/30">
        {/* File Attachment Preview */}
        {selectedFile && (
          <div className="mx-2 mt-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/60 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center shadow-sm">
                  <DocumentIcon className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                    <span className="font-medium">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                    <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                    <span className="capitalize font-medium bg-gray-100 px-1.5 py-0.5 rounded text-xs border border-gray-200">
                      {selectedFile.type.split("/")[1] || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-all duration-200 ml-1"
                aria-label="Remove file"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Main Input Container - Enhanced with soft box-shadow */}
        <div className="p-2">
          <form
            onSubmit={handleSubmit}
            className={`relative bg-white rounded-xl transition-all duration-300 max-w-2xl mx-auto ${
              isFocused
                ? "ring-2 ring-blue-500/20 shadow-xl border border-blue-200"
                : "shadow-lg border border-gray-200/60 hover:shadow-xl hover:border-gray-300/60"
            }`}
            style={{
              boxShadow: isFocused
                ? "0 20px 40px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Input Area */}
            <div className="flex items-center space-x-2 p-2">
              {/* Attach Button - Changed to Plus Icon */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending}
                className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                  isSending
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
                aria-label="Attach file"
              >
                <PlusIcon className="h-4 w-4" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  disabled={isSending}
                />
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isSending ? "Generating..." : "Ask something..."}
                  disabled={isSending}
                  className={`w-full bg-transparent border-0 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none resize-none py-1.5 px-0 min-h-[32px] max-h-[80px] text-[14px] leading-relaxed font-normal transition-colors ${
                    isSending ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
                  rows={1}
                  style={{ transform: "none" }}
                />

                {/* Character Count */}
                {message.length > 1000 && (
                  <div className="absolute -bottom-6 right-0 text-xs text-gray-400 font-medium">
                    {message.length}/2000
                  </div>
                )}
              </div>

              {/* Send Button - Enhanced with more padding and better radius */}
              <button
                type="submit"
                disabled={!hasContent || isSending}
                className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all duration-200 ${
                  !hasContent || isSending
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : "text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
                aria-label={isSending ? "Sending..." : "Send message"}
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

MessageInput.displayName = "MessageInput";
