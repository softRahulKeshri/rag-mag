export interface IMessage {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface IChat {
  id: number;
  title: string;
  timestamp: string;
  messages: IMessage[];
}
