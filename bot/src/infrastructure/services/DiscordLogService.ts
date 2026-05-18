import { Client } from 'discordx';
import { EmbedBuilder } from 'discord.js';
import { inject, singleton } from 'tsyringe';
import type {
	ILogService,
	VoiceLogPayload,
} from '../../application/interfaces/ILogService';
import { getLogChannelId } from '../../core/config/voiceConfig';
import { formatDuration } from '../../core/utils/formatDuration';

@singleton()
export class DiscordLogService implements ILogService {
	constructor(@inject(Client) private client: Client) {}

	async sendVoiceLog(payload: VoiceLogPayload): Promise<void> {
		const logChannelId = getLogChannelId();
		if (!logChannelId) return;

		const channel = await this.client.channels
			.fetch(logChannelId)
			.catch(() => null);

		if (!channel || !channel.isTextBased() || !('send' in channel)) {
			console.error(
				`[Log] Canal de log ${logChannelId} inválido ou não textual`,
			);
			return;
		}

		const isJoin = payload.action === 'join';
		const fields = [
			{ name: 'Usuário', value: `<@${payload.discordId}>`, inline: true },
		];
		if (!isJoin && payload.durationMs !== undefined) {
			fields.push({
				name: 'Tempo de estudo',
				value: `⏱️ ${formatDuration(payload.durationMs)}`,
				inline: true,
			});
		}

		const embed = new EmbedBuilder()
			.setColor(isJoin ? 0x2ecc71 : 0xe74c3c)
			.setAuthor({
				name: payload.displayName,
				iconURL: payload.avatarUrl,
			})
			.setDescription(
				isJoin
					? `📚 Iniciou os estudos!`
					: `👋 Terminou de estudar.`,
			)
			.addFields(fields)
			.setTimestamp(payload.timestamp);

		await channel.send({ embeds: [embed] }).catch((err) => {
			console.error('[Log] Falha ao enviar log de voz:', err);
		});
	}
}
