export const getStompConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const configs: Record<string, any> = {
    development: { brokerURL: 'ws://localhost:8080/ws', reconnectDelay: 5000 },
    staging: { brokerURL: 'wss://staging.example.com/ws', reconnectDelay: 10000 },
    production: { brokerURL: 'wss://live.example.com/ws', reconnectDelay: 10000 },
  };
  return configs[env] || configs.development;
};