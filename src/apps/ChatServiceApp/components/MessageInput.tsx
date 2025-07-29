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
    <div className="relative bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-lg">
      {/* Enhanced File Attachment Preview */}
      {selectedFile && (
        <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-200/60 shadow-xl animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl border border-indigo-400/30">
                <DocumentIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1">
                  <span className="font-medium">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                  <span className="capitalize font-medium bg-slate-100 px-2 py-1 rounded-full text-xs">
                    {selectedFile.type.split("/")[1] || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white/80 transition-all duration-300 hover:scale-110 transform-gpu ml-3 shadow-lg"
              aria-label="Remove file"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Main Input Container */}
      <div className="p-6">
        <form
          onSubmit={handleSubmit}
          className={`relative bg-white rounded-2xl transition-all duration-500 ${
            isFocused
              ? "ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-500/20"
              : "shadow-lg hover:shadow-xl border border-slate-200/60 hover:border-indigo-300/60"
          }`}
        >
          {/* Enhanced Input Area */}
          <div className="flex items-end space-x-4 p-4">
            {/* Enhanced Attach Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 transform-gpu ${
                isSending
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-110 shadow-md"
              }`}
              aria-label="Attach file"
            >
              <PaperClipIcon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
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
                className={`w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none resize-none py-3 px-0 min-h-[48px] max-h-[120px] text-sm leading-relaxed font-medium transition-all duration-300 ${
                  isSending ? "text-slate-400 cursor-not-allowed" : ""
                } selection:bg-indigo-100`}
                rows={1}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgb(203 213 225) transparent",
                }}
              />

              {/* Enhanced Character Count */}
              {message.length > 1000 && (
                <div className="absolute -bottom-6 right-0 text-xs text-slate-400 font-medium">
                  {message.length}/2000
                </div>
              )}
            </div>

            {/* Enhanced Send Button */}
            <button
              type="submit"
              disabled={!hasContent || isSending}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-500 transform-gpu ${
                !hasContent || isSending
                  ? "text-slate-300 bg-slate-100 cursor-not-allowed"
                  : "text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-110 active:scale-95"
              }`}
              aria-label={isSending ? "Sending..." : "Send message"}
            >
              {isSending ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <div className="relative">
                  <PaperAirplaneIcon className="h-5 w-5" />
                  {hasContent && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping shadow-lg"></div>
                  )}
                </div>
              )}
            </button>
          </div>

          {/* Enhanced Focus Glow Effect */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-500 pointer-events-none ${
              isFocused ? "opacity-100" : ""
            }`}
          ></div>
        </form>

        {/* Enhanced Quick Actions */}
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="font-semibold">AI Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-3 w-3 text-indigo-500 animate-pulse" />
              <span className="font-semibold">Enhanced with AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftRightIcon className="h-3 w-3 text-purple-500" />
              <span className="font-semibold">Real-time Chat</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-xs shadow-sm">
              ⏎
            </kbd>{" "}
            to send
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Floating Send Button */}
      {hasContent && (
        <div className="fixed bottom-8 right-8 md:hidden z-50 animate-scale-in">
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="w-16 h-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center justify-center hover:scale-110 active:scale-95 transform-gpu"
            aria-label="Send message"
          >
            {isSending ? (
              <ArrowPathIcon className="h-8 w-8 animate-spin" />
            ) : (
              <div className="relative">
                <PaperAirplaneIcon className="h-8 w-8" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping shadow-lg"></div>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
