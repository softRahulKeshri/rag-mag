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
        textareaRef.current.style.height = "56px";
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
    target.style.height = `${Math.min(target.scrollHeight, 140)}px`;
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasContent = message.trim() || selectedFile;

  return (
    <div className="relative bg-white border-t border-white/20 shadow-2xl rounded-b-3xl">
      {/* Premium File Attachment Preview */}
      {selectedFile && (
        <div className="mx-8 mt-8 p-8 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-blue-50/50 rounded-3xl border border-blue-200/50 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 flex-1 min-w-0">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
                <DocumentIcon className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-slate-800 truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-4 text-base text-slate-600 mt-3">
                  <span className="font-bold">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                  <span className="capitalize font-bold bg-white px-4 py-2 rounded-full text-sm shadow-lg border border-slate-200">
                    {selectedFile.type.split("/")[1] || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 p-4 text-slate-400 hover:text-slate-600 rounded-2xl hover:bg-slate-50 transition-all duration-300 ml-6 hover:scale-110"
              aria-label="Remove file"
            >
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
        </div>
      )}

      {/* Premium Main Input Container */}
      <div className="p-8">
        <form
          onSubmit={handleSubmit}
          className={`relative bg-white rounded-3xl transition-all duration-300 shadow-xl ${
            isFocused
              ? "ring-2 ring-blue-500/20 shadow-2xl border-2 border-blue-500/30"
              : "border-2 border-slate-200 hover:border-slate-300 hover:shadow-2xl"
          }`}
        >
          {/* Premium Input Area */}
          <div className="flex items-end space-x-8 p-8">
            {/* Premium Attach Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className={`flex-shrink-0 p-5 rounded-2xl transition-all duration-300 ${
                isSending
                  ? "text-slate-200 cursor-not-allowed"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-110 shadow-lg hover:shadow-xl"
              }`}
              aria-label="Attach file"
            >
              <PaperClipIcon className="h-7 w-7" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                disabled={isSending}
              />
            </button>

            {/* Premium Text Input */}
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
                className={`w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none resize-none py-5 px-0 min-h-[56px] max-h-[140px] text-base lg:text-lg leading-relaxed font-medium transition-all duration-300 ${
                  isSending ? "text-slate-400 cursor-not-allowed" : ""
                }`}
                rows={1}
              />

              {/* Premium Character Count */}
              {message.length > 1000 && (
                <div className="absolute -bottom-10 right-0 text-sm text-slate-500 font-bold">
                  {message.length}/2000
                </div>
              )}
            </div>

            {/* Premium Send Button */}
            <button
              type="submit"
              disabled={!hasContent || isSending}
              className={`flex-shrink-0 p-5 rounded-2xl transition-all duration-300 ${
                !hasContent || isSending
                  ? "text-slate-300 bg-slate-100 cursor-not-allowed shadow-inner"
                  : "text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl hover:scale-110 transform"
              }`}
              aria-label={isSending ? "Sending..." : "Send message"}
            >
              {isSending ? (
                <ArrowPathIcon className="h-7 w-7 animate-spin" />
              ) : (
                <div className="relative">
                  <PaperAirplaneIcon className="h-7 w-7" />
                  {hasContent && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping shadow-lg"></div>
                  )}
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Premium Quick Actions */}
        <div className="flex items-center justify-between mt-8 px-6">
          <div className="flex items-center space-x-8 text-base text-slate-500">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              <span className="font-bold">AI Ready</span>
            </div>
            <div className="flex items-center space-x-4">
              <SparklesIcon className="h-5 w-5 text-indigo-500 animate-pulse" />
              <span className="font-bold">Enhanced with AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
              <span className="font-bold">Real-time Chat</span>
            </div>
          </div>

          <div className="text-base text-slate-500 font-bold">
            Press{" "}
            <kbd className="px-4 py-2 bg-slate-100 rounded-xl text-slate-600 font-mono text-sm shadow-lg border border-slate-200">
              ⏎
            </kbd>{" "}
            to send
          </div>
        </div>
      </div>

      {/* Premium Mobile Floating Send Button */}
      {hasContent && (
        <div className="fixed bottom-12 right-12 md:hidden z-50">
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center hover:scale-110 transform"
            aria-label="Send message"
          >
            {isSending ? (
              <ArrowPathIcon className="h-12 w-12 animate-spin" />
            ) : (
              <div className="relative">
                <PaperAirplaneIcon className="h-12 w-12" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping shadow-lg"></div>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
