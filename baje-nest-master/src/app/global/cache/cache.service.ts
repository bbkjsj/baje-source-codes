import { Injectable, Logger } from '@nestjs/common';
import RedisClient from '@redis/client/dist/lib/client';
import * as redis from 'redis';


@Injectable()
export class CacheService {

  private logger: Logger = new Logger(CacheService.name);

  private redisServer;

  constructor() {
    this.redisServer = redis.createClient({
      socket: {
        port: 6379,
        host: 'localhost'
      }
    });

    this.redisServer.on('ready', () => this.ready());
    this.redisServer.on('connect', () => this.connect());
    this.redisServer.on('error', (err) => {
      this.error(err);
    });
    this.redisServer.on('end', () => this.end());

    this.redisServer.connect();
  }

  private ready() {
    this.logger.debug('Redis client is ready');
  }

  private connect() {
    this.logger.debug('Redis client is connecting');
  }

  private error(error: Error) {
    this.logger.error(`Error occured: ${error}`);
  }

  private async end() {
    await this.redisServer.connect();
  }

  async set(args: {
    key: string;
    value: unknown;
  }): Promise<void> {
    this.logger.warn(
      `Setting ${args.key} to Redis`
    );
    await this.redisServer.set(args.key, JSON.stringify(args.value));
  }

  async get(key: string): Promise<unknown> {
    this.logger.verbose(
      `Getting ${key} from Redis`
    );
    const value: string = await this.redisServer.get(key);

    return JSON.parse(value) ?? null;
  }

  async removePersonnelPayload(personnelId: number): Promise<void> {
    await this.del(`person-${personnelId}`);
  }

  private async del(key: string) {
    this.logger.verbose(
      `Deleting ${key} from Redis`
    );
    await this.redisServer.del(key);
  }
}