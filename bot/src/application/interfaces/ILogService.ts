export type VoiceLogAction = 'join' | 'leave';

export interface VoiceLogPayload {
	action: VoiceLogAction;
	discordId: string;
	displayName: string;
	channelId: string;
	channelName: string;
	avatarUrl?: string;
	timestamp: Date;
	/** preenchido apenas em 'leave' — duração da sessão em ms */
	durationMs?: number;
}

export interface ILogService {
	sendVoiceLog(payload: VoiceLogPayload): Promise<void>;
}
