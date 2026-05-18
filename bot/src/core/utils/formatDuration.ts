/** Formata ms em "Xh Ymin" / "Ymin" / "menos de 1min". */
export function formatDuration(ms: number): string {
	if (!Number.isFinite(ms) || ms < 60_000) return 'menos de 1min';
	const totalMin = Math.floor(ms / 60_000);
	const hours = Math.floor(totalMin / 60);
	const minutes = totalMin % 60;
	if (hours === 0) return `${minutes}min`;
	if (minutes === 0) return `${hours}h`;
	return `${hours}h ${minutes}min`;
}
