import { Events } from 'discord.js';
import { ArgsOf, Client, Discord, On } from 'discordx';
import { injectable } from 'tsyringe';

@Discord()
@injectable()
export class InteractionHandler {
	@On({ event: Events.InteractionCreate })
	async onInteraction([interaction]: ArgsOf<Events.InteractionCreate>, client: Client) {
		try {
			await client.executeInteraction(interaction);
		} catch (error) {
			console.error('Error executing interaction:', error);
			if (interaction.isRepliable() && !interaction.replied) {
				interaction.reply({
					content: 'Erro interno ao processar o comando.',
					flags: ['Ephemeral'],
				});
			}
		}
	}
}
