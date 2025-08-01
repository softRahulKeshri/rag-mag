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
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { ModelSelectorDropdown } from "./ModelSelectorDropdown";
import type { IFileAttachment } from "../types/types";
import { ModelType } from "../types/types";

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isSending: boolean;
  selectedModel?: ModelType;
  onModelChange?: (model: ModelType) => void;
}

export const MessageInput = ({
  onSendMessage,
  isSending,
  selectedModel = ModelType.OPENAI,
  onModelChange,
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
        <div className="mx-4 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <DocumentIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                  <span className="font-bold">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="capitalize font-bold bg-white px-2 py-1 rounded-lg text-xs border border-gray-200 shadow-sm">
                    {selectedFile.type.split("/")[1] || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-300 ml-3"
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
          className={`relative bg-white rounded-lg transition-all duration-300 shadow-lg border ${
            isFocused
              ? "ring-2 ring-blue-500/20 shadow-xl border-blue-300"
              : "border-gray-200 hover:border-gray-300 hover:shadow-xl"
          }`}
        >
          {/* Input Area */}
          <div className="flex items-end space-x-3 p-4">
            {/* Model Selector */}
            {onModelChange && (
              <ModelSelectorDropdown
                selectedModel={selectedModel}
                onModelChange={onModelChange}
                className="flex-shrink-0"
              />
            )}

            {/* Attach Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-300 ${
                isSending
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
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
                  isSending ? "AI is thinking..." : "Type your message..."
                }
                disabled={isSending}
                className={`w-full bg-transparent border-0 text-gray-800 placeholder-gray-400 focus:ring-0 focus:outline-none resize-none py-2 px-0 min-h-[40px] max-h-[120px] text-sm leading-relaxed font-semibold transition-colors ${
                  isSending ? "text-gray-400 cursor-not-allowed" : ""
                }`}
                rows={1}
              />

              {/* Character Count */}
              {message.length > 1000 && (
                <div className="absolute -bottom-6 right-0 text-xs text-gray-500 font-bold">
                  {message.length}/2000
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!hasContent || isSending}
              className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-300 ${
                !hasContent || isSending
                  ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                  : "text-white bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
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

        {/* Subtle Status Indicator with Tooltip */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="font-medium">AI Ready</span>
          </div>

          {/* Help Tooltip */}
          <div className="flex items-center space-x-2">
            <div className="group relative">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Keyboard shortcuts help"
              >
                <QuestionMarkCircleIcon className="h-3 w-3" />
              </button>

              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="flex items-center space-x-2">
                  <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-white font-mono text-xs">
                    ⏎
                  </kbd>
                  <span>Send message</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-white font-mono text-xs">
                    ⇧
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-white font-mono text-xs">
                    ⏎
                  </kbd>
                  <span>New line</span>
                </div>

                {/* Tooltip Arrow */}
                <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
