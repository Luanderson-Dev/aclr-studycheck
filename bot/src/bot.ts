import { importx } from '@discordx/importer';
import { IntentsBitField, Partials } from 'discord.js';
import { Client } from 'discordx';
import { container } from 'tsyringe';
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
				IntentsBitField.Flags.GuildVoiceStates,
				IntentsBitField.Flags.DirectMessages,
				IntentsBitField.Flags.MessageContent,
			],
			partials: [Partials.Channel, Partials.Message],
			silent: false,
		});

		container.registerInstance(Client, this._client);

		await importx(`${__dirname}/presentation/**/*.{ts,js}`);

		const token = process.env.DISCORD_BOT_TOKEN ?? process.env.BOT_TOKEN ?? '';
		await this._client.login(token);
	}
}
