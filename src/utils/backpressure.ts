let lastProcessed = 0;
const MIN_INTERVAL = 100; // milliseconds

export function shouldProcessMessage(): boolean {
  const now = Date.now();
  if (now - lastProcessed > MIN_INTERVAL) {
    lastProcessed = now;
    return true;
  }
  return false;
}