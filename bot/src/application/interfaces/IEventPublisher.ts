export interface VoiceJoinedEvent {
	userId: string;
	channelId: string;
	guildId: string;
	displayName: string;
	timestampMs: number;
}

export interface VoiceLeftEvent {
	userId: string;
	channelId: string;
	guildId: string;
	displayName: string;
	timestampMs: number;
	startedAtMs: number;
	endedAtMs: number;
	durationMs: number;
}

export interface IEventPublisher {
	voiceJoined(event: VoiceJoinedEvent): Promise<void>;
	voiceLeft(event: VoiceLeftEvent): Promise<void>;
}
