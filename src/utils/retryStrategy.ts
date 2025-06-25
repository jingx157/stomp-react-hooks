export type RetryStrategy = (attempt: number) => number;

export const exponentialBackoff: RetryStrategy = (attempt) => Math.min(30000, Math.pow(2, attempt) * 1000);