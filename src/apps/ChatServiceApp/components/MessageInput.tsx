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
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import type { IFileAttachment } from "../types/types";
import { ModelType } from "../types/types";

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isSending: boolean;
  selectedModel?: ModelType;
}

const modelNames = {
  [ModelType.OPENAI]: "OpenAI GPT",
  [ModelType.ANTHROPIC]: "Anthropic Claude",
  [ModelType.OLLAMA]: "Ollama",
};

export const MessageInput = ({
  onSendMessage,
  isSending,
  selectedModel = ModelType.OPENAI,
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
    <div className="relative bg-white border-t border-gray-200 rounded-b-2xl">
      {/* File Attachment Preview */}
      {selectedFile && (
        <div className="mx-6 mt-6 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0 w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <DocumentIcon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-3 text-xs text-gray-600 mt-2">
                  <span className="font-bold">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="capitalize font-bold bg-white px-3 py-1.5 rounded-xl text-xs border border-gray-200 shadow-sm">
                    {selectedFile.type.split("/")[1] || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-300 ml-4"
              aria-label="Remove file"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Input Container */}
      <div className="p-6">
        <form
          onSubmit={handleSubmit}
          className={`relative bg-white rounded-xl transition-all duration-300 shadow-lg border ${
            isFocused
              ? "ring-2 ring-blue-500/20 shadow-xl border-blue-300"
              : "border-gray-200 hover:border-gray-300 hover:shadow-xl"
          }`}
        >
          {/* Input Area */}
          <div className="flex items-end space-x-4 p-5">
            {/* Attach Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                isSending
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
              aria-label="Attach file"
            >
              <PaperClipIcon className="h-5 w-5" />
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
                  isSending
                    ? "AI is thinking..."
                    : `Type your message to ${modelNames[selectedModel]}...`
                }
                disabled={isSending}
                className={`w-full bg-transparent border-0 text-gray-800 placeholder-gray-400 focus:ring-0 focus:outline-none resize-none py-2 px-0 min-h-[44px] max-h-[120px] text-sm leading-relaxed font-semibold transition-colors ${
                  isSending ? "text-gray-400 cursor-not-allowed" : ""
                }`}
                rows={1}
              />

              {/* Character Count */}
              {message.length > 1000 && (
                <div className="absolute -bottom-8 right-0 text-xs text-gray-500 font-bold">
                  {message.length}/2000
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!hasContent || isSending}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                !hasContent || isSending
                  ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                  : "text-white bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
              }`}
              aria-label={isSending ? "Sending..." : "Send message"}
            >
              {isSending ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-6 px-3">
          <div className="flex items-center space-x-6 text-xs text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="font-bold">AI Ready</span>
            </div>
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-500" />
              <span className="font-bold text-blue-600">
                {modelNames[selectedModel]}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 font-bold">
            Press{" "}
            <kbd className="px-3 py-1.5 bg-gray-100 rounded-xl text-gray-600 font-mono text-xs border border-gray-200 shadow-sm">
              ⏎
            </kbd>{" "}
            to send
          </div>
        </div>
      </div>
    </div>
  );
};
