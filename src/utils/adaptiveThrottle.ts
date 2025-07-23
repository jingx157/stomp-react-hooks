let lastProcess = 0;
let throttleInterval = 100; // start 100ms
export function adaptiveThrottle() {
  const now = Date.now();
  const connection =
    typeof navigator !== 'undefined' && (navigator as any).connection
      ? (navigator as any).connection
      : null;
  if (connection) {
    if (connection.downlink < 1) throttleInterval = 500;
    else if (connection.downlink < 3) throttleInterval = 250;
    else throttleInterval = 100;
  }
  if (now - lastProcess > throttleInterval) {
    lastProcess = now;
    return true;
  }
  return false;
}