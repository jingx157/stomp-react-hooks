import { IMessage } from '@stomp/stompjs';

export function parseMessage<T = any>(message: IMessage): T {
  try {
    return JSON.parse(message.body);
  } catch {
    return message.body as unknown as T;
  }
}