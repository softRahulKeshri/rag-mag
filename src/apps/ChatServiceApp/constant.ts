import type { IChat } from "./types/types";

export const mockChats: IChat[] = [
  {
    id: 1,
    title: "PDF Document Analysis",
    timestamp: "2 minutes ago",
    messages: [
      {
        id: 1,
        content: "Hello! I'm your AI assistant. I can help you analyze PDF documents. Please upload a PDF or ask me a question!",
        role: "assistant",
        timestamp: "2 minutes ago",
      },
      {
        id: 2,
        content: "I need help analyzing this research paper about climate change.",
        role: "user",
        timestamp: "1 minute ago",
      },
      {
        id: 3,
        content: "I can help you with that! Please upload the PDF file and let me know what specific aspects you'd like me to analyze. I can summarize, extract key points, or answer questions about the content.",
        role: "assistant",
        timestamp: "1 minute ago",
      },
    ],
  },
  {
    id: 2,
    title: "Technical Documentation",
    timestamp: "5 minutes ago",
    messages: [
      {
        id: 1,
        content: "Welcome to the technical documentation chat! How can I assist you today?",
        role: "assistant",
        timestamp: "5 minutes ago",
      }
    ],
  },
  {
    id: 3,
    title: "Research Paper Discussion",
    timestamp: "10 minutes ago",
    messages: [
      {
        id: 1,
        content: "I'm here to help you with your research. What topic are you working on?",
        role: "assistant",
        timestamp: "10 minutes ago",
      }
    ],
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
