// /backend/src/utils/redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  // password: 'your_password_if_needed',
});