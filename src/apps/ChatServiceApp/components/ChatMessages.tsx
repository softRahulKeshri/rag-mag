import { useEffect, useRef } from 'react';
import { Square2StackIcon, DocumentDuplicateIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import type { IMessage } from "../types/types";
import { formatTimestamp } from '../utils/chatUtils';

export const ChatMessages = ({ messages }: { messages: IMessage[] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-900/90 p-4 md:px-6 md:py-8 space-y-6">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <LightBulbIcon className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">How can I help you today?</h3>
            <p className="text-gray-400">Ask me anything or start a new conversation</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              <div
                className={`relative max-w-[90%] md:max-w-[75%] rounded-2xl p-4 transition-all duration-200 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-sm shadow-lg hover:shadow-blue-500/20'
                    : 'bg-gray-800/80 text-gray-100 rounded-bl-sm backdrop-blur-sm hover:bg-gray-800/90 border border-gray-700/50'
                }`}
              >
                <div 
                  className={`prose prose-invert max-w-none text-sm leading-relaxed break-words ${
                    message.role === 'user' ? 'prose-blue' : 'prose-gray'
                  }`}
                >
                  {message.content}
                </div>
                <div 
                  className={`mt-2 text-xs flex items-center justify-end space-x-1 ${
                    message.role === 'user' ? 'text-blue-100/60' : 'text-gray-500'
                  }`}
                >
                  <span>{formatTimestamp(message.timestamp)}</span>
                  {message.role === 'assistant' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1"></span>
                  )}
                </div>
                
                {/* Message actions */}
                <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button 
                    className="p-1 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white cursor-pointer"
                    aria-label="Copy message"
                  >
                    <Square2StackIcon className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    className="p-1 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white cursor-pointer"
                    aria-label="Duplicate message"
                  >
                    <DocumentDuplicateIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};
