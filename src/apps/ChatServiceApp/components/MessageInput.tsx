import React, { useState } from 'react';

interface IFileState {
  name: string;
  size: number;
  type: string;
}

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<IFileState | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      if (selectedFile) {
        console.log('Sending file:', selectedFile);
      }
      setMessage('');
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border-t border-gray-700 space-y-4">
      <div className="flex space-x-2">
        <button
          type="button"
          className="flex items-center justify-center h-12 bg-gray-800 hover:bg-gray-700 text-white px-4 rounded-lg cursor-pointer transition-colors duration-200"
        >
          <span className="text-sm">🎤</span>
        </button>

        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything"
            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[48px]"
            rows={1}
            style={{
              height: 'auto',
              overflow: 'hidden'
            }}
            onInput={(e) => {
              const element = e.target as HTMLTextAreaElement;
              element.style.height = 'auto';
              element.style.height = `${element.scrollHeight}px`;
            }}
          />
        </div>

        <div className="relative">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center h-12 bg-gray-700 hover:bg-gray-600 text-white px-4 rounded-lg cursor-pointer transition-colors duration-200"
          >
            <span className="text-sm">{selectedFile ? selectedFile.name : 'Upload File'}</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!message.trim() && !selectedFile}
          className="flex items-center justify-center h-12 bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span className="text-sm">Send</span>
        </button>
      </div>

      {selectedFile && (
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <span className="text-sm">Selected file:</span>
            <span className="text-blue-400">{selectedFile.name}</span>
            <span className="text-sm text-gray-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default MessageInput;
