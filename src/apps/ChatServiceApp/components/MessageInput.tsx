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
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
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
        textareaRef.current.style.height = "40px";
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    <div className="bg-white px-6 py-4">
      {/* File Attachment Display */}
      {selectedFile && (
        <div className="flex items-center justify-between bg-[#EFF5FF] rounded-lg px-4 py-3 mb-4 border border-[#BFD6FF] animate-slide-up hover-lift">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 bg-[#3077F3]/10 rounded-lg flex-shrink-0 animate-pulse-gentle">
              <PaperClipIcon className="h-4 w-4 text-[#3077F3]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2E3141] truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-[#6D6F7A]">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1.5 text-[#82838D] hover:text-[#6D6F7A] rounded-lg hover:bg-[#F5F5F5] transition-all duration-300 hover:scale-110 transform-gpu focus-ring-brand flex-shrink-0 ml-3"
            aria-label="Remove file"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className={`flex items-end gap-3 bg-white rounded-2xl px-4 py-3 transition-all duration-300 border hover:shadow-md ${
          isFocused
            ? "ring-2 ring-[#3077F3]/20 border-[#3077F3] shadow-lg"
            : "border-[#D5D6D9] hover:border-[#C0C1C6]"
        }`}
      >
        {/* Input Container */}
        <div className="flex-1 min-w-0">
          <div className="relative group">
            <label htmlFor="message-input" className="sr-only">
              Type your message
            </label>

            {/* Attach File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-[#82838D] hover:text-[#3077F3] rounded-lg hover:bg-[#F5F5F5] transition-all duration-300 hover:scale-110 transform-gpu focus-ring-brand group z-10"
              aria-label="Attach file"
            >
              <PaperClipIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
            </button>

            {/* Textarea */}
            <textarea
              id="message-input"
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message..."
              className="w-full bg-transparent border-0 text-[#2E3141] placeholder-[#82838D] focus:ring-0 focus:outline-none resize-none py-2 pl-10 pr-4 max-h-30 min-h-[40px] rounded-lg text-sm leading-relaxed transition-all duration-300"
              rows={1}
              style={{ scrollbarWidth: "thin" }}
            />

            {/* Typing indicator glow */}
            <div
              className={`absolute inset-0 rounded-lg bg-gradient-to-r from-[#3077F3]/5 to-[#B96AF7]/5 opacity-0 transition-opacity duration-300 pointer-events-none ${
                isFocused ? "opacity-100" : ""
              }`}
            ></div>
          </div>
        </div>

        {/* Send Button */}
        <div className="flex-shrink-0">
          <button
            type="submit"
            disabled={!hasContent || isSending}
            className={`p-2.5 rounded-xl transition-all duration-300 transform-gpu focus-ring-brand ${
              !hasContent
                ? "text-[#C0C1C6] bg-[#F5F5F5] cursor-not-allowed"
                : "text-white bg-[#3077F3] hover:bg-[#1E50A8] shadow-sm hover:shadow-lg hover:scale-110 btn-primary hover-glow"
            }`}
            aria-label="Send message"
          >
            {isSending ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PaperAirplaneIcon
                className={`h-5 w-5 transition-transform duration-300 ${
                  hasContent
                    ? "group-hover:translate-x-1 group-hover:-translate-y-1"
                    : ""
                }`}
              />
            )}
          </button>
        </div>
      </form>

      {/* Floating send button for mobile */}
      {hasContent && (
        <div className="fixed bottom-6 right-6 md:hidden animate-scale-in z-50">
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="w-14 h-14 bg-[#3077F3] hover:bg-[#1E50A8] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 transform-gpu btn-primary hover-glow"
            aria-label="Send message"
          >
            {isSending ? (
              <ArrowPathIcon className="h-6 w-6 animate-spin" />
            ) : (
              <PaperAirplaneIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
