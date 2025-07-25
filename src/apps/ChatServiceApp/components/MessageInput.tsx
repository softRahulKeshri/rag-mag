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
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      {selectedFile && (
        <div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3 mb-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-blue-500/10 rounded-md flex-shrink-0">
              <PaperClipIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-600">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Remove file"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3 bg-white rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all border border-gray-300 shadow-sm"
      >
        <div className="flex-1 min-w-0">
          <div className="relative">
            <label htmlFor="message-input" className="sr-only">
              Type your message
            </label>
            <textarea
              id="message-input"
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-transparent border-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none resize-none py-2 pl-12 pr-4 max-h-36 min-h-[48px] rounded-lg text-sm leading-relaxed"
              rows={1}
              style={{ scrollbarWidth: "thin" }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Attach file"
            >
              <PaperClipIcon className="h-4 w-4" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSending || (!message.trim() && !selectedFile)}
          className={`p-2.5 rounded-full flex-shrink-0 transition-all duration-200 ${
            !message.trim() && !selectedFile
              ? "text-gray-400 bg-gray-100"
              : "text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Send message"
        >
          {isSending ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <PaperAirplaneIcon className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};
