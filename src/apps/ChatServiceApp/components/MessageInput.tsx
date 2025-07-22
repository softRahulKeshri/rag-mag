import { useRef, useState, type KeyboardEvent, type ChangeEvent, type FormEvent } from 'react';
import { PaperClipIcon, PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';
import type { IFileAttachment } from "../types/types";

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isSending: boolean;
}

export const MessageInput = ({ onSendMessage, isSending }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<IFileAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (trimmedMessage || selectedFile) {
      const file = fileInputRef.current?.files?.[0];
      onSendMessage(trimmedMessage, file);
      setMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px';
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm p-4">
      {selectedFile && (
        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg px-4 py-2.5 mb-3 mx-1">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-blue-500/10 rounded-md flex-shrink-0">
              <PaperClipIcon className="h-4 w-4 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-100 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-600/50 transition-colors -mr-1"
            aria-label="Remove file"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit} 
        className="flex items-end gap-2 bg-gray-700/50 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all"
      >
        <div className="flex-1 min-w-0">
          <div className="relative">
            <label htmlFor="message-input" className="sr-only">Type your message</label>
            <div className="relative">
              <textarea
                id="message-input"
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                className="w-full bg-transparent border-0 text-white placeholder-gray-500 focus:ring-0 focus:outline-none resize-none py-3 pl-10 pr-3 max-h-36 min-h-[48px] rounded-lg"
                rows={1}
                style={{ scrollbarWidth: 'thin' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-2 top-6 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-600/50 transition-colors cursor-pointer"
                aria-label="Attach file"
              >
                <PaperClipIcon className="h-5 w-5 cursor-pointer" />
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
        </div>
        
        <button
          type="submit"
          disabled={isSending || (!message.trim() && !selectedFile)}
          className={`p-2 rounded-full flex-shrink-0 ${(!message.trim() && !selectedFile) ? 'text-gray-500' : 'text-white bg-blue-600 hover:bg-blue-500'} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Send message"
        >
          {isSending ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin cursor-pointer" />
          ) : (
            <PaperAirplaneIcon className="h-5 w-5 cursor-pointer" />
          )}
        </button>
      </form>
    </div>
  );
};


