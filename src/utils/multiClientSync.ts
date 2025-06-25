export const createBroadcastChannel = () => {
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('stomp-sync');
    return channel;
  }
  return null;
};