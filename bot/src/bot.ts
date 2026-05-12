import { importx } from '@discordx/importer';
import { IntentsBitField } from 'discord.js';
import { Client } from 'discordx';
import { registerDependencies } from './core/di/registry';

export class Bot {
	private static _client: Client;

	static async start() {
		registerDependencies();

		this._client = new Client({
			intents: [
				IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMessages,
				IntentsBitField.Flags.GuildMembers,
			],
			silent: false,
		});

		await importx(`${__dirname}/presentation/**/*.{ts,js}`);

		const token = process.env.BOT_TOKEN ?? '';
		await this._client.login(token);
	}
}
