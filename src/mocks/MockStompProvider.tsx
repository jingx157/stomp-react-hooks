import React from 'react';
import { StompContext } from '../context/StompContext';

export const MockStompProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockClient = {
    connected: true,
    subscribe: () => ({ unsubscribe: () => {} }),
    publish: () => {},
  };

  const context = {
    client: mockClient,
    connected: true,
    subscribeTyped: () => {},
    send: () => {},
    reconnect: () => {},
    subscribe: () => ({ unsubscribe: () => {} }),
  } as any;

  return <StompContext.Provider value={context}>{children}</StompContext.Provider>;
};