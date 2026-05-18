export interface VoiceSession {
	channelId: string;
	/** epoch ms do início da sessão */
	startedAt: number;
}

export interface IVoiceStateRepository {
	get(discordId: string): Promise<VoiceSession | null>;
	set(discordId: string, session: VoiceSession): Promise<void>;
	remove(discordId: string): Promise<void>;
}
