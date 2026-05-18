import { container } from 'tsyringe';
import { RedisClient } from '../../infrastructure/persistence/redis/RedisClient';
import { VoiceStateRedisRepository } from '../../infrastructure/persistence/redis/VoiceStateRedisRepository';
import { KafkaEventPublisher } from '../../infrastructure/messaging/KafkaEventPublisher';
import { DiscordLogService } from '../../infrastructure/services/DiscordLogService';

export function registerDependencies() {
	container.registerSingleton(RedisClient);
	container.register('IVoiceStateRepository', {
		useClass: VoiceStateRedisRepository,
	});
	container.register('ILogService', {
		useClass: DiscordLogService,
	});
	container.registerSingleton('IEventPublisher', KafkaEventPublisher);
}
