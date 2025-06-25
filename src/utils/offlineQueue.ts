const OFFLINE_QUEUE_KEY = 'stomp_offline_queue';

export const storeOfflineMessage = (msg: any) => {
  const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  queue.push(msg);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};

export const flushOfflineQueue = (client: any) => {
  const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  queue.forEach((msg: any) => client.publish(msg));
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
};