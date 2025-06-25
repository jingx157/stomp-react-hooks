import { useEffect, useState } from 'react';
import { useStompClient } from './useStompClient';

export function useStompTopics<T extends Record<string, any>>(topics: string[]) {
  const { subscribeTyped } = useStompClient({ brokerURL: '', namespace: 'app' });
  const [messages, setMessages] = useState<Partial<T>>({});

  useEffect(() => {
    const subs = topics.map((topic) =>
      subscribeTyped(topic, (data: any) => {
        setMessages((prev) => ({ ...prev, [topic]: data }));
      })
    );
    return () => subs.forEach((s) => s?.unsubscribe());
  }, [topics.join(',')]);

  return messages;
}