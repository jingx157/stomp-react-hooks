import { eventBus } from './eventBus';

const metrics = {
  errors: 0,
  retries: 0,
  latency: 0,
};

eventBus.on('error', () => metrics.errors++);
eventBus.on('connected', () => metrics.retries++);

export const startMonitoring = () => {
  setInterval(() => {
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics),
    });
  }, 15000);
};