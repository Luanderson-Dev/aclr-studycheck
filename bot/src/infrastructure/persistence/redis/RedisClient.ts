import Redis from 'ioredis';
import { injectable, singleton } from 'tsyringe';

@singleton()
@injectable()
export class RedisClient {
	public client: Redis;
	public subscriber: Redis;

	constructor() {
		const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
		this.client = new Redis(redisUrl);
		this.subscriber = new Redis(redisUrl);
		this.client.on('error', (err) => console.error('[Redis Client] Error:', err));
		this.subscriber.on('error', (err) => console.error('[Redis Sub] Error:', err));
	}
}
