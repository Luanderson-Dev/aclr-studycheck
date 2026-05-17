import { Kafka, logLevel, type Producer } from 'kafkajs';
import { singleton } from 'tsyringe';
import type {
	IEventPublisher,
	VoiceJoinedEvent,
	VoiceLeftEvent,
} from '../../application/interfaces/IEventPublisher';

const TOPIC_VOICE_JOINED = 'studycheck.discord.voice-joined';
const TOPIC_VOICE_LEFT = 'studycheck.discord.voice-left';

@singleton()
export class KafkaEventPublisher implements IEventPublisher {
	private readonly producer: Producer;
	private connected = false;
	private connecting: Promise<void> | null = null;

	constructor() {
		const brokers = (
			process.env.KAFKA_BOOTSTRAP_SERVERS ?? 'localhost:9092'
		)
			.split(',')
			.map((b) => b.trim())
			.filter(Boolean);

		const kafka = new Kafka({
			clientId: 'studycheck-bot',
			brokers,
			logLevel: logLevel.ERROR,
		});
		this.producer = kafka.producer({ allowAutoTopicCreation: false });
	}

	private async ensureConnected(): Promise<void> {
		if (this.connected) return;
		if (!this.connecting) {
			this.connecting = this.producer
				.connect()
				.then(() => {
					this.connected = true;
				})
				.catch((err) => {
					this.connecting = null;
					throw err;
				});
		}
		await this.connecting;
	}

	private async publish(
		topic: string,
		key: string,
		payload: object,
	): Promise<void> {
		try {
			await this.ensureConnected();
			await this.producer.send({
				topic,
				messages: [{ key, value: JSON.stringify(payload) }],
			});
		} catch (err) {
			console.error(`[Kafka] Falha ao publicar em ${topic}:`, err);
		}
	}

	async voiceJoined(event: VoiceJoinedEvent): Promise<void> {
		await this.publish(TOPIC_VOICE_JOINED, event.userId, event);
	}

	async voiceLeft(event: VoiceLeftEvent): Promise<void> {
		await this.publish(TOPIC_VOICE_LEFT, event.userId, event);
	}
}
