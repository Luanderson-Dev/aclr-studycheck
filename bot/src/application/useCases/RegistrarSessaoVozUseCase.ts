import { inject, injectable } from 'tsyringe';
import { Result } from '../../core/logic/Result';
import type { IVoiceStateRepository } from '../interfaces/IVoiceStateRepository';

export type SessaoAction =
	| 'start'
	| 'stop'
	| 'move'
	| 'already-tracked'
	| 'noop';

export interface SessaoResult {
	action: SessaoAction;
	/** preenchido apenas em 'stop' — duração da sessão em ms */
	durationMs?: number;
}

@injectable()
export class RegistrarSessaoVozUseCase {
	constructor(
		@inject('IVoiceStateRepository')
		private voiceStateRepo: IVoiceStateRepository,
	) {}

	async execute(
		discordId: string,
		oldChannelId: string | null,
		newChannelId: string | null,
		_nomeUsuario: string,
	): Promise<Result<SessaoResult>> {
		const saved = await this.voiceStateRepo.get(discordId);

		// Entrou em canal de voz
		if (!oldChannelId && newChannelId) {
			if (saved) {
				await this.voiceStateRepo.set(discordId, {
					channelId: newChannelId,
					startedAt: saved.startedAt,
				});
				return Result.ok({ action: 'already-tracked' });
			}
			await this.voiceStateRepo.set(discordId, {
				channelId: newChannelId,
				startedAt: Date.now(),
			});
			return Result.ok({ action: 'start' });
		}

		// Saiu de canal de voz
		if (oldChannelId && !newChannelId) {
			const durationMs = saved
				? Math.max(0, Date.now() - saved.startedAt)
				: undefined;
			await this.voiceStateRepo.remove(discordId);
			return Result.ok({ action: 'stop', durationMs });
		}

		// Move entre canais (mantém startedAt original)
		if (oldChannelId && newChannelId && oldChannelId !== newChannelId) {
			await this.voiceStateRepo.set(discordId, {
				channelId: newChannelId,
				startedAt: saved?.startedAt ?? Date.now(),
			});
			return Result.ok({ action: 'move' });
		}

		return Result.ok({ action: 'noop' });
	}
}
