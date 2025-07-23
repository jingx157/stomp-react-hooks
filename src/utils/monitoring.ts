import { eventBus } from './eventBus';

const metrics = {
  errors: 0,
  retries: 0,
  latency: 0,
};

eventBus.on('error', () => metrics.errors++);
eventBus.on('connected', () => metrics.retries++);

export interface MonitoringOptions {
  endpoint?: string;
  interval?: number;
}

export const startMonitoring = (options: MonitoringOptions = {}) => {
  const { endpoint = '/api/metrics', interval = 15000 } = options;
  return setInterval(() => {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics),
    });
  }, interval);
};