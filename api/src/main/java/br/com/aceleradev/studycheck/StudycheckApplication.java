package br.com.aceleradev.studycheck;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudycheckApplication {

	public static void main(String[] args) {
		// Padrão único UTC: DB e serialização gravam/expõem UTC.
		// O fuso de exibição é responsabilidade do cliente (browser).
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		SpringApplication.run(StudycheckApplication.class, args);
	}

}
