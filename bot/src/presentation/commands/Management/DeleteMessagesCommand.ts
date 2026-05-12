import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import { inject, injectable } from 'tsyringe';
import { DeleteMessagesUseCase } from '../../../application/useCases/DeleteMessagesUseCase';

@Discord()
@SlashGroup({ description: 'Management', name: 'management' })
@SlashGroup('management')
@injectable()
export class DeleteMessagesCommand {
	constructor(
		@inject(DeleteMessagesUseCase)
		private deleteMessages: DeleteMessagesUseCase
	) {}

	@Slash({
		description: 'Delete messages from a channel',
		defaultMemberPermissions: ['ManageMessages'],
	})
	async delete_messages(
		@SlashOption({
			description: 'Define the number of messages to be deleted.',
			name: 'amount',
			type: ApplicationCommandOptionType.Number,
			required: true,
		})
		amount: number,
		@SlashOption({
			description: 'Deletes messages with the specified value.',
			name: 'the_message_contains',
			type: ApplicationCommandOptionType.String,
		})
		the_message_contains: string,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({ flags: 'Ephemeral' });

		const result = await this.deleteMessages.execute(
			amount,
			the_message_contains,
			interaction
		);

		await interaction.editReply(
			`✅ ${result.getValue()} Messages successfully deleted.`
		);
	}
}
