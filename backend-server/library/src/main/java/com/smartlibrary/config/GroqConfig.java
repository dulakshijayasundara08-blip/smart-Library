package com.smartlibrary.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/**
 * Wires up a RestClient pre-configured for Groq Cloud's Chat Completions API.
 * Groq exposes an OpenAI-compatible surface at /openai/v1, so the request/response
 * shapes match OpenAI's chat completions format exactly - only the base URL, auth
 * header, and model names differ. Reads GROQ_API_KEY from the environment (see
 * application.properties) - never commit the real key.
 */
@Configuration
public class GroqConfig {

    @Value("${groq.base-url:https://api.groq.com/openai/v1}")
    private String baseUrl;

    @Value("${groq.api.key:}")
    private String apiKey;

    @Bean
    public RestClient groqRestClient() {
        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
