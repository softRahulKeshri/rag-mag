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
  SparklesIcon,
  XMarkIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
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
        textareaRef.current.style.height = "48px";
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
    <div className="relative bg-white border-t border-[#EAEAEC] shadow-2xl rounded-b-3xl">
      {/* Enhanced File Attachment Preview */}
      {selectedFile && (
        <div className="mx-8 mt-6 p-6 bg-gradient-to-r from-[#3077F3]/5 via-[#B96AF7]/5 to-[#3077F3]/5 rounded-2xl border border-[#3077F3]/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5 flex-1 min-w-0">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#3077F3] to-[#B96AF7] rounded-2xl flex items-center justify-center shadow-xl">
                <DocumentIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-[#2E3141] truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-3 text-sm text-[#6D6F7A] mt-2">
                  <span className="font-semibold">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                  <span className="w-1.5 h-1.5 bg-[#9698A0] rounded-full"></span>
                  <span className="capitalize font-semibold bg-white px-3 py-1.5 rounded-full text-xs shadow-sm border border-[#EAEAEC]">
                    {selectedFile.type.split("/")[1] || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 p-3 text-[#9698A0] hover:text-[#6D6F7A] rounded-2xl hover:bg-white transition-all duration-300 ml-4 hover:scale-110"
              aria-label="Remove file"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Main Input Container */}
      <div className="p-8">
        <form
          onSubmit={handleSubmit}
          className={`relative bg-white rounded-3xl transition-all duration-300 shadow-lg ${
            isFocused
              ? "ring-2 ring-[#3077F3]/20 shadow-2xl border-2 border-[#3077F3]/30"
              : "border-2 border-[#EAEAEC] hover:border-[#D5D6D9] hover:shadow-xl"
          }`}
        >
          {/* Enhanced Input Area */}
          <div className="flex items-end space-x-6 p-6">
            {/* Enhanced Attach Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className={`flex-shrink-0 p-4 rounded-2xl transition-all duration-300 ${
                isSending
                  ? "text-[#D5D6D9] cursor-not-allowed"
                  : "text-[#9698A0] hover:text-[#3077F3] hover:bg-[#3077F3]/10 hover:scale-110 shadow-md hover:shadow-lg"
              }`}
              aria-label="Attach file"
            >
              <PaperClipIcon className="h-6 w-6" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                disabled={isSending}
              />
            </button>

            {/* Enhanced Text Input */}
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
                  isSending ? "AI is thinking..." : "Type your message..."
                }
                disabled={isSending}
                className={`w-full bg-transparent border-0 text-[#2E3141] placeholder-[#9698A0] focus:ring-0 focus:outline-none resize-none py-4 px-0 min-h-[56px] max-h-[140px] text-base leading-relaxed font-medium transition-all duration-300 ${
                  isSending ? "text-[#9698A0] cursor-not-allowed" : ""
                }`}
                rows={1}
              />

              {/* Enhanced Character Count */}
              {message.length > 1000 && (
                <div className="absolute -bottom-8 right-0 text-sm text-[#9698A0] font-semibold">
                  {message.length}/2000
                </div>
              )}
            </div>

            {/* Enhanced Send Button */}
            <button
              type="submit"
              disabled={!hasContent || isSending}
              className={`flex-shrink-0 p-4 rounded-2xl transition-all duration-300 ${
                !hasContent || isSending
                  ? "text-[#D5D6D9] bg-[#F5F5F5] cursor-not-allowed shadow-inner"
                  : "text-white bg-gradient-to-r from-[#3077F3] to-[#B96AF7] hover:from-[#1E50A8] hover:to-[#9D58E5] shadow-xl hover:shadow-2xl hover:scale-110 transform"
              }`}
              aria-label={isSending ? "Sending..." : "Send message"}
            >
              {isSending ? (
                <ArrowPathIcon className="h-6 w-6 animate-spin" />
              ) : (
                <div className="relative">
                  <PaperAirplaneIcon className="h-6 w-6" />
                  {hasContent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FDA052] rounded-full animate-ping shadow-lg"></div>
                  )}
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Enhanced Quick Actions */}
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="flex items-center space-x-6 text-sm text-[#9698A0]">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#41E6F8] rounded-full animate-pulse"></div>
              <span className="font-semibold">AI Ready</span>
            </div>
            <div className="flex items-center space-x-3">
              <SparklesIcon className="h-4 w-4 text-[#B96AF7] animate-pulse" />
              <span className="font-semibold">Enhanced with AI</span>
            </div>
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-[#3077F3]" />
              <span className="font-semibold">Real-time Chat</span>
            </div>
          </div>

          <div className="text-sm text-[#9698A0] font-semibold">
            Press{" "}
            <kbd className="px-3 py-1.5 bg-[#F5F5F5] rounded-lg text-[#6D6F7A] font-mono text-sm shadow-md border border-[#EAEAEC]">
              ⏎
            </kbd>{" "}
            to send
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Floating Send Button */}
      {hasContent && (
        <div className="fixed bottom-10 right-10 md:hidden z-50">
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="w-20 h-20 bg-gradient-to-r from-[#3077F3] to-[#B96AF7] hover:from-[#1E50A8] hover:to-[#9D58E5] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center hover:scale-110 transform"
            aria-label="Send message"
          >
            {isSending ? (
              <ArrowPathIcon className="h-10 w-10 animate-spin" />
            ) : (
              <div className="relative">
                <PaperAirplaneIcon className="h-10 w-10" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FDA052] rounded-full animate-ping shadow-lg"></div>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
