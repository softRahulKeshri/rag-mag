export interface IFileAttachment {
  name: string;
  size: number;
  type: string;
}

export interface IMessage {
  id: number | string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  file?: IFileAttachment;
  isStreaming?: boolean;
}

export interface IChat {
  id: number;
  title: string;
  timestamp: string;
  messages: IMessage[];
}
