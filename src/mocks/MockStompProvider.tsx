import React from 'react';

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
  };

  return <>{children}</>;
};