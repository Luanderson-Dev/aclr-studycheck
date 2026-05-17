function parseCsvIds(raw: string | undefined): Set<string> {
	if (!raw) return new Set();
	return new Set(
		raw
			.split(',')
			.map((id) => id.trim())
			.filter((id) => id.length > 0),
	);
}

/** IDs dos canais de voz monitorados. Set vazio = todos os canais valem. */
export function getAllowedVoiceChannelIds(): Set<string> {
	return parseCsvIds(process.env.DISCORD_ALLOWED_VOICE_CHANNEL_IDS);
}

export function isVoiceChannelAllowed(channelId: string | null): boolean {
	if (!channelId) return false;
	const allowed = getAllowedVoiceChannelIds();
	return allowed.size === 0 || allowed.has(channelId);
}

/** Canal de texto onde os logs de voz são postados. */
export function getLogChannelId(): string | null {
	return process.env.DISCORD_LOG_CHANNEL_ID?.trim() || null;
}

/** Guild alvo. Vazio = sem filtro de guild. */
export function getGuildId(): string | null {
	return process.env.DISCORD_GUILD_ID?.trim() || null;
}
