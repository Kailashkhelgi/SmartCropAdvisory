import IoRedis from 'ioredis';
import { config } from './config';

let _redis: any = null;

export function getRedisClient(): any {
  if (!_redis) {
    const store = new Map<string, string>();
    let isFallback = false;

    try {
      const client = new IoRedis(config.redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: true,
        retryStrategy: () => null, // don't retry, fail fast
      });
      
      client.on('error', (err: any) => {
        if (!isFallback) {
          console.warn('⚠️ Redis connection failed. Falling back to in-memory store for OTP/Token caching.', err.message);
          isFallback = true;
        }
      });

      _redis = {
        async get(key: string) {
          if (isFallback) return store.get(key) || null;
          try {
            return await client.get(key);
          } catch {
            isFallback = true;
            return store.get(key) || null;
          }
        },
        async set(key: string, value: string, ...args: any[]) {
          if (isFallback) {
            store.set(key, value);
            if (args[0] === 'EX') {
              const ttl = parseInt(args[1], 10);
              setTimeout(() => store.delete(key), ttl * 1000);
            }
            return 'OK';
          }
          try {
            await client.set(key, value, ...args);
            return 'OK';
          } catch {
            isFallback = true;
            store.set(key, value);
            return 'OK';
          }
        },
        async del(key: string) {
          if (isFallback) {
            const deleted = store.delete(key);
            return deleted ? 1 : 0;
          }
          try {
            return await client.del(key);
          } catch {
            isFallback = true;
            const deleted = store.delete(key);
            return deleted ? 1 : 0;
          }
        },
        on(event: string, listener: (...args: any[]) => void) {
          client.on(event, listener);
          return this;
        }
      };
      
      client.connect().catch((err) => {
        if (!isFallback) {
          console.warn('⚠️ Redis connection failed on connect. Falling back to in-memory store for OTP/Token caching.', err.message);
          isFallback = true;
        }
      });
    } catch (e: any) {
      console.warn('⚠️ Failed to initialize Redis. Falling back to in-memory store:', e.message);
      isFallback = true;
      _redis = {
        async get(key: string) { return store.get(key) || null; },
        async set(key: string, value: string, ...args: any[]) {
          store.set(key, value);
          if (args[0] === 'EX') {
            const ttl = parseInt(args[1], 10);
            setTimeout(() => store.delete(key), ttl * 1000);
          }
          return 'OK';
        },
        async del(key: string) { return store.delete(key) ? 1 : 0; },
        on() { return this; }
      };
    }
  }
  return _redis;
}
