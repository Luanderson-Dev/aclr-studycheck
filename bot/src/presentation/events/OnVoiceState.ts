import { Events } from 'discord.js';
import { ArgsOf, Client, Discord, On } from 'discordx';
import { inject, injectable } from 'tsyringe';
import type { IEventPublisher } from '../../application/interfaces/IEventPublisher';
import type { ILogService } from '../../application/interfaces/ILogService';
import { RegistrarSessaoVozUseCase } from '../../application/useCases/RegistrarSessaoVozUseCase';
import {
	getGuildId,
	isVoiceChannelAllowed,
} from '../../core/config/voiceConfig';

@Discord()
@injectable()
export class OnVoiceState {
	constructor(
		private registrarSessao: RegistrarSessaoVozUseCase,
		@inject('ILogService') private logService: ILogService,
		@inject('IEventPublisher') private eventPublisher: IEventPublisher,
	) {}

	@On({ event: Events.VoiceStateUpdate })
	async onVoiceStateUpdate(
		[oldState, newState]: ArgsOf<Events.VoiceStateUpdate>,
		_client: Client,
	) {
		try {
			const guildId = getGuildId();
			const eventGuildId = newState.guild?.id ?? oldState.guild?.id;
			if (guildId && eventGuildId !== guildId) return;

			const discordId = newState.member?.id ?? oldState.member?.id;
			if (!discordId) return;
			if (newState.member?.user.bot || oldState.member?.user.bot) return;

			const rawOldId = oldState.channelId ?? null;
			const rawNewId = newState.channelId ?? null;

			// Canais não monitorados são tratados como "fora de voz" (null),
			// reaproveitando a lógica start/stop/move do use case.
			const oldChannelId = isVoiceChannelAllowed(rawOldId) ? rawOldId : null;
			const newChannelId = isVoiceChannelAllowed(rawNewId) ? rawNewId : null;
			if (oldChannelId === newChannelId) return;

			const member = newState.member ?? oldState.member;
			const displayName =
				member?.displayName ??
				member?.user?.globalName ??
				member?.user?.username ??
				discordId;
			const avatarUrl = member?.user?.displayAvatarURL({ size: 256 });

			const result = await this.registrarSessao.execute(
				discordId,
				oldChannelId,
				newChannelId,
				displayName,
			);

			if (!result.isSuccess) {
				console.error(
					`[Session] Erro para ${displayName}: ${result.error}`,
				);
				return;
			}

			const { action, durationMs } = result.getValue();

			const eventGuild = eventGuildId ?? '';

			if (action === 'start' && newChannelId) {
				console.log(`[Session] ${displayName} — iniciada`);
				const now = Date.now();
				await Promise.all([
					this.logService.sendVoiceLog({
						action: 'join',
						discordId,
						displayName,
						channelId: newChannelId,
						channelName: newState.channel?.name ?? newChannelId,
						avatarUrl,
						timestamp: new Date(now),
					}),
					this.eventPublisher.voiceJoined({
						userId: discordId,
						channelId: newChannelId,
						guildId: eventGuild,
						displayName,
						timestampMs: now,
					}),
				]);
			} else if (action === 'stop' && oldChannelId) {
				console.log(
					`[Session] ${displayName} — encerrada (${durationMs ?? '?'}ms)`,
				);
				const endedAtMs = Date.now();
				const dur = durationMs ?? 0;
				const startedAtMs = endedAtMs - dur;
				await Promise.all([
					this.logService.sendVoiceLog({
						action: 'leave',
						discordId,
						displayName,
						channelId: oldChannelId,
						channelName: oldState.channel?.name ?? oldChannelId,
						avatarUrl,
						timestamp: new Date(endedAtMs),
						durationMs,
					}),
					this.eventPublisher.voiceLeft({
						userId: discordId,
						channelId: oldChannelId,
						guildId: eventGuild,
						displayName,
						timestampMs: endedAtMs,
						startedAtMs,
						endedAtMs,
						durationMs: dur,
					}),
				]);
			} else if (action === 'move') {
				console.log(
					`[Session] ${displayName} — mudou de canal monitorado`,
				);
			}
		} catch (error) {
			console.error(
				'[Session] Erro inesperado no VoiceStateUpdate:',
				error,
			);
		}
	}
}
