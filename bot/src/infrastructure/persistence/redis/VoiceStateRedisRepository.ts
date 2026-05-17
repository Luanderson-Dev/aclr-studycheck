import { inject, singleton } from 'tsyringe';
import type {
	IVoiceStateRepository,
	VoiceSession,
} from '../../../application/interfaces/IVoiceStateRepository';
import { RedisClient } from './RedisClient';

@singleton()
export class VoiceStateRedisRepository implements IVoiceStateRepository {
	private readonly PREFIX = 'voice:state:';

	constructor(@inject(RedisClient) private redis: RedisClient) {}

	async get(discordId: string): Promise<VoiceSession | null> {
		const raw = await this.redis.client.get(`${this.PREFIX}${discordId}`);
		if (!raw) return null;
		try {
			const parsed = JSON.parse(raw) as VoiceSession;
			if (typeof parsed?.channelId === 'string') return parsed;
			return null;
		} catch {
			// Valor legado (apenas channelId, sem JSON) — sem startedAt confiável.
			return { channelId: raw, startedAt: Date.now() };
		}
	}

	async set(discordId: string, session: VoiceSession): Promise<void> {
		await this.redis.client.set(
			`${this.PREFIX}${discordId}`,
			JSON.stringify(session),
		);
	}

	async remove(discordId: string): Promise<void> {
		await this.redis.client.del(`${this.PREFIX}${discordId}`);
	}
}
