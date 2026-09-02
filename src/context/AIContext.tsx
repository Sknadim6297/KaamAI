import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { mockAIService, type AIService } from '../services/ai';
import type {
  AIAction,
  AIContextData,
  AIMessage,
} from '../types/ai';

interface AIContextValue {
  messages: AIMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string, context?: AIContextData) => Promise<void>;
  clearConversation: () => void;
  updateMessageAction: (messageId: string, action: AIAction) => void;
  appendSystemMessage: (content: string) => void;
}

const AIContext = createContext<AIContextValue | null>(null);

function createId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface AIProviderProps {
  children: React.ReactNode;
  service?: AIService;
}

export function AIProvider({ children, service = mockAIService }: AIProviderProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setLoading(false);
  }, []);

  const appendSystemMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: 'system',
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const updateMessageAction = useCallback((messageId: string, action: AIAction) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, action } : msg)),
    );
  }, []);

  const sendMessage = useCallback(
    async (content: string, context?: AIContextData) => {
      const trimmed = content.trim();
      if (!trimmed || loading) return;

      const userMessage: AIMessage = {
        id: createId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        const response = await service.sendMessage(trimmed, context);
        const assistantMessage: AIMessage = {
          id: createId(),
          role: 'assistant',
          content: response.message || 'Something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
          action: response.action,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        setError('Something went wrong. Please try again.');
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: 'assistant',
            content: 'Something went wrong. Please try again.',
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, service],
  );

  const value = useMemo<AIContextValue>(
    () => ({
      messages,
      loading,
      error,
      sendMessage,
      clearConversation,
      updateMessageAction,
      appendSystemMessage,
    }),
    [
      messages,
      loading,
      error,
      sendMessage,
      clearConversation,
      updateMessageAction,
      appendSystemMessage,
    ],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI(): AIContextValue {
  const ctx = useContext(AIContext);
  if (!ctx) {
    throw new Error('useAI must be used within AIProvider');
  }
  return ctx;
}
