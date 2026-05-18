package br.com.aceleradev.studycheck.infrastructure.messaging.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicsConfig {
    public static final String SESSION_STARTED = "studycheck.session.started";
    public static final String SESSION_ENDED = "studycheck.session.ended";
    public static final String DISCORD_VOICE_JOINED = "studycheck.discord.voice-joined";
    public static final String DISCORD_VOICE_LEFT = "studycheck.discord.voice-left";

    @Bean
    NewTopic sessionStartedTopic() {
        return TopicBuilder.name(SESSION_STARTED).partitions(3).replicas(1).build();
    }

    @Bean
    NewTopic sessionEndedTopic() {
        return TopicBuilder.name(SESSION_ENDED).partitions(3).replicas(1).build();
    }

    @Bean
    NewTopic discordVoiceJoinedTopic() {
        return TopicBuilder.name(DISCORD_VOICE_JOINED).partitions(3).replicas(1).build();
    }

    @Bean
    NewTopic discordVoiceLeftTopic() {
        return TopicBuilder.name(DISCORD_VOICE_LEFT).partitions(3).replicas(1).build();
    }
}
