import mitt from 'mitt';

type Events = {
  connected: void;
  disconnected: void;
  message: { destination: string; payload: any };
  error: Error;
  debug: string;
};

export const eventBus = mitt<Events>();