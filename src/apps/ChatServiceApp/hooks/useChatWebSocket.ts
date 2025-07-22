import { useState, useRef, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import dayjs from 'dayjs';
import type { IMessage, IChat } from '../types/types';

const WS_URL = 'wss://echo.websocket.org';

export const useChatWebSocket = (selectedChatId: number | null, setChats: React.Dispatch<React.SetStateAction<IChat[]>>) => {
  const [isSending, setIsSending] = useState(false);
  const messageQueue = useRef<{content: string, file?: File}[]>([]);
  const isProcessing = useRef(false);

  const { lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => console.log('WebSocket connection established'),
    onClose: () => console.log('WebSocket connection closed'),
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  const processQueue = useCallback(() => {
    if (isProcessing.current || messageQueue.current.length === 0) return;
    
    isProcessing.current = true;
    const { content } = messageQueue.current.shift()!;
    
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: IMessage = {
      id: aiMessageId,
      content: '',
      role: 'assistant',
      timestamp: dayjs().toISOString(),
      isStreaming: true
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChatId 
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      )
    );

    const responseText = `This is a simulated AI response to: "${content}"`;
    let i = 0;
    const chunkSize = 2 + Math.floor(Math.random() * 3);
    
    const streamResponse = () => {
      if (i < responseText.length) {
        const chunk = responseText.slice(i, i + chunkSize);
        i += chunkSize;
        
        setChats(prevChats => 
          prevChats.map(chat => {
            if (chat.id === selectedChatId) {
              const messages = [...chat.messages];
              const aiMessageIndex = messages.findIndex(m => m.id === aiMessageId);
              
              if (aiMessageIndex !== -1) {
                messages[aiMessageIndex] = {
                  ...messages[aiMessageIndex],
                  content: (messages[aiMessageIndex].content || '') + chunk
                };
              }
              
              return { ...chat, messages };
            }
            return chat;
          })
        );
        
        setTimeout(streamResponse, 30 + Math.random() * 50);
      } else {
        setChats(prevChats => 
          prevChats.map(chat => ({
            ...chat,
            messages: chat.messages.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, isStreaming: false }
                : msg
            )
          }))
        );
        
        isProcessing.current = false;
        processQueue();
      }
    };
    
    setTimeout(streamResponse, 500);
  }, [selectedChatId, setChats]);

  useEffect(() => {
    if (lastMessage !== null) {
      console.log('Received message:', lastMessage.data);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      processQueue();
    }
  }, [messageQueue.current.length, readyState, processQueue]);

  const sendChatMessage = useCallback(async (content: string, file?: File) => {
    if (!selectedChatId || (!content.trim() && !file) || isSending) return;

    setIsSending(true);
    
    const userMessage: IMessage = {
      id: Date.now(),
      content: content || '📎 File attached',
      role: 'user',
      timestamp: dayjs().toISOString(),
      file: file ? {
        name: file.name,
        size: file.size,
        type: file.type
      } : undefined
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              timestamp: 'Just now',
              title: content.split('\n')[0].substring(0, 30) + 
                     (content.split('\n')[0].length > 30 ? '...' : '') || 
                     chat.title
            }
          : chat
      )
    );

    messageQueue.current.push({ content, file });
    
    if (!isProcessing.current) {
      processQueue();
    }
    
    setIsSending(false);
  }, [selectedChatId, isSending, setChats, processQueue]);

  return { sendChatMessage, isSending };
};
