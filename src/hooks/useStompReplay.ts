import { useEffect, useState } from 'react';
import { useStompClient } from './useStompClient';
import { messageHistory } from '../utils/messageBuffer';

export function useStompReplay<T = any>(topic: string) {
  const [latest, setLatest] = useState<T | null>(null);
  const { subscribeTyped } = useStompClient({ brokerURL: '', namespace: 'app' });

  useEffect(() => {
    const hist = messageHistory.get().find((m) => m.topic === topic);
    if (hist) setLatest(hist.data);

    const sub = subscribeTyped<T>(topic, setLatest);
    return () => sub?.unsubscribe();
  }, [topic]);

  return latest;
}