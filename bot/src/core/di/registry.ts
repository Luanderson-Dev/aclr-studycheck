import { container } from 'tsyringe';
import { DiscordDeleteMessageService } from '../../infrastructure/services/DiscordDeleteMessageService';

export function registerDependencies() {
	// Infrastructure (Services, Database)
	container.register('IDeleteMessageService', {
		useClass: DiscordDeleteMessageService,
	});
}
