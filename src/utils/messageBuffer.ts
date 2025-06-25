export class MessageBuffer<T> {
  private buffer: T[] = [];
  constructor(private size: number = 50) {}

  push(item: T) {
    this.buffer.push(item);
    if (this.buffer.length > this.size) this.buffer.shift();
  }

  get() {
    return [...this.buffer];
  }
}

export const messageHistory = new MessageBuffer<any>(100);