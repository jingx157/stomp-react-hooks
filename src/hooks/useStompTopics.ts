import { useEffect, useState } from 'react';
import { useStomp } from '../context/StompContext';

export function useStompTopics<T extends Record<string, any>>(topics: string[]) {
  const { subscribeTyped } = useStomp();
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