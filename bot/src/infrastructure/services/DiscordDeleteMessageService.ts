import { BaseGuildTextChannel } from 'discord.js';
import { singleton } from 'tsyringe';
import { IDeleteMessageService } from '../../application/interfaces/IDeleteMessageService';

@singleton()
export class DiscordDeleteMessageService implements IDeleteMessageService {
	async deleteMessage(
		channel: BaseGuildTextChannel,
		amount: number,
		filter?: string
	): Promise<string> {
		let deletedMessages = 0;

		try {
			while (deletedMessages < amount) {
				const remaining = amount - deletedMessages;

				const messages = await channel.messages.fetch({
					limit: Math.min(remaining, 100),
				});

				if (messages.size === 0) {
					return deletedMessages.toString();
				}

				const deletableMessages = messages.filter((message) => {
					const isRecent =
						new Date().getTime() - message.createdTimestamp <
						14 * 24 * 60 * 60 * 1000;

					const matchesFilter = filter
						? message.content.includes(filter)
						: true;

					return isRecent && matchesFilter;
				});

				if (deletableMessages.size === 0) {
					return deletedMessages.toString();
				}

				await channel.bulkDelete(deletableMessages, true);
				deletedMessages += deletableMessages.size;
			}

			return deletedMessages.toString();
		} catch (error) {
			console.error('Error deleting messages:', error);
			return 'An error occurred while trying to delete the messages. Please try again.';
		}
	}
}
