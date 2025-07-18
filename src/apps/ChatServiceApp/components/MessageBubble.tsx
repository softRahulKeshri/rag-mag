import React from 'react';
import type { IMessage } from '../types/types';

interface IMessageBubbleProps {
  message: IMessage;
}

const MessageBubble: React.FC<IMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser ? 'bg-blue-500' : 'bg-gray-700'
        }`}
      >
        <div className="text-sm">{message.content}</div>
        <div className="text-xs text-gray-400 mt-1">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
