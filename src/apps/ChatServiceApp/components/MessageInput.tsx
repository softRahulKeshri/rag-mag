import {
  useRef,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  PaperClipIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import type { IFileAttachment } from "../types/types";

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isSending: boolean;
}

export const MessageInput = ({
  onSendMessage,
  isSending,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<IFileAttachment | null>(
    null
  );
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        textareaRef.current.style.height = "44px";
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
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasContent = message.trim() || selectedFile;

  return (
    <div className="relative bg-white border-t border-[#EAEAEC]">
      {/* File Attachment Preview */}
      {selectedFile && (
        <div className="mx-4 mt-4 p-3 bg-[#F7F7F8] rounded-lg border border-[#EAEAEC]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 bg-[#3077F3] rounded-lg flex items-center justify-center">
                <DocumentIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2E3141] truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-[#6D6F7A] mt-1">
                  <span className="font-medium">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                  <div className="w-1 h-1 bg-[#6D6F7A] rounded-full"></div>
                  <span className="capitalize font-medium bg-white px-2 py-1 rounded text-xs border border-[#EAEAEC]">
                    {selectedFile.type.split("/")[1] || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 p-1.5 text-[#6D6F7A] hover:text-[#2E3141] rounded hover:bg-[#F5F5F5] transition-all duration-300 ml-2"
              aria-label="Remove file"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Input Container */}
      <div className="p-4">
        <form
          onSubmit={handleSubmit}
          className={`relative bg-white rounded-xl transition-all duration-300 shadow-sm border ${
            isFocused
              ? "ring-2 ring-[#3077F3]/20 shadow-lg border-[#3077F3]"
              : "border-[#EAEAEC] hover:border-[#D5D6D9] hover:shadow-md"
          }`}
        >
          {/* Input Area */}
          <div className="flex items-end space-x-2 p-3">
            {/* Attach Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                isSending
                  ? "text-[#C0C1C6] cursor-not-allowed"
                  : "text-[#6D6F7A] hover:text-[#3077F3] hover:bg-[#F7F7F8]"
              }`}
              aria-label="Attach file"
            >
              <PaperClipIcon className="h-4 w-4" />
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
                placeholder={
                  isSending ? "AI is thinking..." : "Message ChatAI..."
                }
                disabled={isSending}
                className={`w-full bg-transparent border-0 text-[#2E3141] placeholder-[#6D6F7A] focus:ring-0 focus:outline-none resize-none py-2 px-0 min-h-[44px] max-h-[120px] text-[15px] leading-relaxed font-normal transition-colors ${
                  isSending ? "text-[#6D6F7A] cursor-not-allowed" : ""
                }`}
                rows={1}
              />

              {/* Character Count */}
              {message.length > 1000 && (
                <div className="absolute -bottom-6 right-0 text-xs text-[#6D6F7A] font-medium">
                  {message.length}/2000
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!hasContent || isSending}
              className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                !hasContent || isSending
                  ? "text-[#C0C1C6] bg-[#F5F5F5] cursor-not-allowed"
                  : "text-white bg-[#3077F3] hover:bg-[#1E50A8] shadow-sm hover:shadow-md"
              }`}
              aria-label={isSending ? "Sending..." : "Send message"}
            >
              {isSending ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
