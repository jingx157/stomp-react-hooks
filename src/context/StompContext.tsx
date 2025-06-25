
import React, { createContext, useContext, ReactNode } from 'react';
import { useStompClient, UseStompClientOptions, UseStompClientReturn } from '../hooks/useStompClient';

const StompContext = createContext<UseStompClientReturn | null>(null);

interface StompProviderProps {
  children: ReactNode;
  config: UseStompClientOptions;
}

/**
 * Provides a global STOMP client context for your application.
 */
export function StompProvider({ children, config }: StompProviderProps) {
  const stomp = useStompClient(config);
  return <StompContext.Provider value={stomp}>{children}</StompContext.Provider>;
}

/**
 * Use the global STOMP client anywhere in your component tree.
 */
export function useStomp() {
  const context = useContext(StompContext);
  if (!context) {
    throw new Error('useStomp must be used within a StompProvider');
  }
  return context;
}
