import type { IChat } from "./types/types";

export const mockChats: IChat[] = [
  {
    id: 1,
    title: "PDF Query",
    timestamp: "2 minutes ago",
    messages: [
      {
        id: 1,
        content: "Hello! How can I help you today?",
        role: "assistant",
        timestamp: "2 minutes ago",
      },
      {
        id: 2,
        content: "What is the capital of France?",
        role: "user",
        timestamp: "1 minute ago",
      },
      {
        id: 3,
        content: "The capital of France is Paris.",
        role: "assistant",
        timestamp: "1 minute ago",
      },
    ],
  },
  {
    id: 2,
    title: "Chat 2",
    timestamp: "5 minutes ago",
    messages: [],
  },
  {
    id: 3,
    title: "Chat 3",
    timestamp: "10 minutes ago",
    messages: [],
  },
  {
    id: 4,
    title: "Chat 4",
    timestamp: "1 hour ago",
    messages: [],
  },
];

export const models = [
    { id: 1, name: 'GPT-3.5', selected: true },
    { id: 2, name: 'GPT-4' },
    { id: 3, name: 'GPT-4o' },
    { id: 4, name: 'Claude 3' },
    { id: 5, name: 'Llama 3' },
    { id: 6, name: 'Custom' }
  ];
