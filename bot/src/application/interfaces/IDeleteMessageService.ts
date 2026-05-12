import { BaseGuildTextChannel } from 'discord.js';

export interface IDeleteMessageService {
	deleteMessage(
		channel: BaseGuildTextChannel,
		amount: number,
		filter?: string
	): Promise<string>;
}
