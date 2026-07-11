package com.smartlibrary.dto;

import java.util.List;

/** Request/response shapes for the /api/ai/** endpoints. */
public class AiDtos {

    // --- Recommendations ---
    public static class RecommendationResponse {
        public Long bookId;
        public String title;
        public String author;
        public String reason; // why the AI suggested it

        public RecommendationResponse() {}
        public RecommendationResponse(Long bookId, String title, String author, String reason) {
            this.bookId = bookId;
            this.title = title;
            this.author = author;
            this.reason = reason;
        }
    }

    // --- Translation ---
    public static class TranslateRequest {
        public Long bookId;          // optional if rawText is provided instead
        public String rawText;       // optional free text to translate
        public String targetLanguage; // e.g. "Sinhala", "French", "es"
    }

    public static class TranslateResponse {
        public String translatedText;
        public String targetLanguage;
    }

    // --- Chatbot ---
    public static class ChatRequest {
        public Long userId;
        public String conversationId; // client-generated UUID; groups a chat thread
        public String message;
    }

    public static class ChatResponse {
        public String conversationId;
        public String reply;
        public List<ChatTurn> history;
    }

    public static class ChatTurn {
        public String role; // "user" | "assistant"
        public String content;

        public ChatTurn() {}
        public ChatTurn(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }
}
