import { BaseGuildTextChannel, CommandInteraction } from 'discord.js';
import { inject, injectable } from 'tsyringe';
import { Result } from '../../core/logic/Result';
import { IDeleteMessageService } from '../interfaces/IDeleteMessageService';

@injectable()
export class DeleteMessagesUseCase {
	constructor(
		@inject('IDeleteMessageService')
		private deleteMessageService: IDeleteMessageService
	) {}

	async execute(
		amount: number,
		the_message_contains: string,
		interaction: CommandInteraction
	): Promise<Result<string>> {
		const channel = interaction.channel as BaseGuildTextChannel;
		const user = interaction.user;

		if (!channel || (!channel.isTextBased() && !channel.isThread())) {
			return Result.fail(
				'This command can only be use in text based channel.'
			);
		}

		try {
			const channel = interaction.channel as BaseGuildTextChannel;
			const messagesDeleted: string =
				(await this.deleteMessageService.deleteMessage(
					channel,
					amount,
					the_message_contains
				)) || '';

			return Result.ok<string>(messagesDeleted);
		} catch (error) {
			console.error('Error deleting message:', error);
			return Result.fail('(Internal Error).');
		}
	}
}
