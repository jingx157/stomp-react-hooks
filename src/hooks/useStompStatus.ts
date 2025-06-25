import { useEffect, useState } from 'react';
import { eventBus } from '../utils/eventBus';

export function useStompStatus() {
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    eventBus.on('connected', () => setStatus('connected'));
    eventBus.on('disconnected', () => setStatus('disconnected'));

    return () => {
      eventBus.off('connected');
      eventBus.off('disconnected');
    };
  }, []);

  return status;
}