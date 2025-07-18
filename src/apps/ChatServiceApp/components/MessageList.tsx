import React from 'react';
import MessageBubble from './MessageBubble';
import type { IMessage } from '../types/types';

interface IMessageListProps {
  messages: IMessage[];
}

const MessageList: React.FC<IMessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
