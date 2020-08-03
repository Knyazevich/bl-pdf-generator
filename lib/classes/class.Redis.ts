import redis from 'redis';
import { promisify } from 'util';

class Redis {
  private static instance: redis.RedisClient | null;

  public static createInstance() {
    const client = redis.createClient();
    Redis.instance = client;

    return client;
  }

  public static getInstance() {
    if (this.instance === null) {
      Redis.createInstance();
    }

    return Redis.instance;
  }

  public static getAsync() {
    return promisify(Redis.getInstance().get).bind(Redis.getInstance());
  }

  public static setAsync() {
    return promisify(Redis.getInstance().set).bind(Redis.getInstance());
  }
}

export default Redis;
