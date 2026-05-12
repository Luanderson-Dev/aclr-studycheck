import { Events } from 'discord.js';
import { Client, Discord, Once } from 'discordx';
import { injectable } from 'tsyringe';

@Discord()
@injectable()
export class InitEvents {
	@Once({ event: Events.ClientReady })
	async onReady([], client: Client) {
		await client.initApplicationCommands();
		console.log(`🚀 ${client.user?.username} started successfully!`);
	}
}
