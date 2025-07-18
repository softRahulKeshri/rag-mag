const mockMessages = [
  {
    id: 1,
    role: 'assistant',
    content: "Hello! I'm your AI assistant. How can I help you today?",
    timestamp: '2 minutes ago'
  },
  {
    id: 2,
    role: 'user',
    content: "Can you help me with my project?",
    timestamp: '2 minutes ago'
  },
  {
    id: 3,
    role: 'assistant',
    content: "Of course! I'd be happy to help. What's your project about?",
    timestamp: '2 minutes ago'
  },
  {
    id: 4,
    role: 'user',
    content: "I need help with analyzing PDF documents.",
    timestamp: '1 minute ago'
  },
  {
    id: 5,
    role: 'assistant',
    content: "I can definitely help with that! Please upload your PDF file and I'll assist you with the analysis.",
    timestamp: '1 minute ago'
  }
];

const ChatMessages = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {mockMessages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-white'
            }`}
          >
            <div className="text-sm">{message.content}</div>
            <div className="text-xs mt-2 text-gray-400">
              {message.timestamp}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
