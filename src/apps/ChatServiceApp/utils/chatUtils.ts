import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { IMessage, IChat } from '../types/types';

dayjs.extend(relativeTime);

export const formatTimestamp = (timestamp: string | undefined): string => {
  if (!timestamp) return 'Just now';
  
  const date = dayjs(timestamp);
  
  // Check if the date is valid
  if (!date.isValid()) {
    console.warn('Invalid date:', timestamp);
    return 'Just now';
  }
  
  const now = dayjs();
  
  // For today's messages, show time
  if (date.isSame(now, 'day')) {
    return date.format('h:mm A'); // e.g., "2:30 PM"
  }
  
  // For yesterday's messages
  if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return `Yesterday at ${date.format('h:mm A')}`;
  }
  
  // For messages within the last 7 days
  if (now.diff(date, 'day') < 7) {
    return date.format('ddd h:mm A'); // e.g., "Mon 2:30 PM"
  }
  
  // For older messages, show date and time
  return date.format('MMM D, YYYY h:mm A'); // e.g., "Jan 1, 2023 2:30 PM"
};

export const createNewChat = (): IChat => ({
  id: Date.now(),
  title: 'New Chat',
  timestamp: dayjs().toISOString(),
  messages: []
});

export const createUserMessage = (content: string, file?: File): IMessage => ({
  id: Date.now(),
  content: content || '📎 File attached',
  role: 'user',
  timestamp: dayjs().toISOString(),
  file: file ? {
    name: file.name,
    size: file.size,
    type: file.type
  } : undefined
});

export const getChatTitle = (content: string, currentTitle: string): string => {
  const firstLine = content.split('\n')[0];
  return firstLine.substring(0, 30) + (firstLine.length > 30 ? '...' : '') || currentTitle;
};
