package com.smartlibrary.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlibrary.dto.AiDtos.*;
import com.smartlibrary.exception.ApiException;
import com.smartlibrary.model.Book;
import com.smartlibrary.model.ChatMessage;
import com.smartlibrary.model.ReadingListItem;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.ChatMessageRepository;
import com.smartlibrary.repository.ReadingListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Talks to Groq Cloud's OpenAI-compatible Chat Completions API for all three AI
 * features. Swap this class (behind the AiService interface) if you switch
 * providers again - nothing outside this file/AiController needs to know which
 * provider is used.
 */
@Service
public class GroqService implements AiService {

    @Autowired private RestClient groqRestClient;
    @Autowired private BookRepository bookRepository;
    @Autowired private ReadingListRepository readingListRepository;
    @Autowired private ChatMessageRepository chatMessageRepository;

    // llama-3.3-70b-versatile is a solid default: free tier, good quality, large context.
    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String model;

    @Value("${groq.api.key:}")
    private String apiKey;

    private final ObjectMapper mapper = new ObjectMapper();

    // ---------------------------------------------------------------- recommend

    @Override
    public List<RecommendationResponse> recommendBooks(Long userId, int limit) {
        List<Book> catalog = bookRepository.findAll();
        if (catalog.isEmpty()) return List.of();

        List<Long> favoriteIds = readingListRepository.findByUserId(userId).stream()
                .map(ReadingListItem::getBookId)
                .collect(Collectors.toList());

        if (apiKey == null || apiKey.isBlank()) {
            // No key configured - fall back to "same category as what you've saved" so the
            // feature still works end-to-end during local dev without a paid API key.
            return fallbackRecommendations(catalog, favoriteIds, limit);
        }

        String catalogList = catalog.stream()
                .map(b -> "id=%d | %s by %s | category=%s".formatted(b.getId(), b.getTitle(), b.getAuthor(), b.getCategory()))
                .collect(Collectors.joining("\n"));

        String favoritesList = favoriteIds.isEmpty() ? "(none yet)" : favoriteIds.toString();

        String systemPrompt = """
                You are a book recommendation engine for a library app. You will be given the
                full catalog and the reader's saved books. Reply with ONLY a JSON array (no prose,
                no markdown fences) of up to %d objects shaped like:
                [{"bookId": 1, "reason": "short one-sentence reason"}]
                Only use bookId values that appear in the catalog. Do not recommend books already
                in the reader's saved list.
                """.formatted(limit);

        String userPrompt = "Catalog:\n" + catalogList + "\n\nReader's saved book ids: " + favoritesList;

        String raw = callChatCompletion(systemPrompt, List.of(new ChatTurn("user", userPrompt)));

        try {
            JsonNode arr = mapper.readTree(stripJsonFences(raw));
            List<RecommendationResponse> out = new ArrayList<>();
            for (JsonNode node : arr) {
                Long bookId = node.get("bookId").asLong();
                Book book = catalog.stream().filter(b -> b.getId().equals(bookId)).findFirst().orElse(null);
                if (book == null) continue;
                String reason = node.hasNonNull("reason") ? node.get("reason").asText() : "Recommended for you.";
                out.add(new RecommendationResponse(book.getId(), book.getTitle(), book.getAuthor(), reason));
            }
            return out.isEmpty() ? fallbackRecommendations(catalog, favoriteIds, limit) : out;
        } catch (Exception parseError) {
            // Model didn't return clean JSON - degrade gracefully instead of 500ing the page.
            return fallbackRecommendations(catalog, favoriteIds, limit);
        }
    }

    private List<RecommendationResponse> fallbackRecommendations(List<Book> catalog, List<Long> favoriteIds, int limit) {
        Set<String> favoriteCategories = catalog.stream()
                .filter(b -> favoriteIds.contains(b.getId()))
                .map(Book::getCategory)
                .collect(Collectors.toSet());

        return catalog.stream()
                .filter(b -> !favoriteIds.contains(b.getId()))
                .sorted((a, b) -> Boolean.compare(
                        !favoriteCategories.contains(b.getCategory()),
                        !favoriteCategories.contains(a.getCategory())))
                .limit(limit)
                .map(b -> new RecommendationResponse(b.getId(), b.getTitle(), b.getAuthor(),
                        favoriteCategories.contains(b.getCategory())
                                ? "More from " + b.getCategory() + ", a category you've saved before."
                                : "Popular pick you haven't added yet."))
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------- translate

    @Override
    public TranslateResponse translateSummary(TranslateRequest request) {
        String text = request.rawText;
        if ((text == null || text.isBlank()) && request.bookId != null) {
            text = bookRepository.findById(request.bookId)
                    .map(Book::getSummary)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found: " + request.bookId));
        }
        if (text == null || text.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Nothing to translate - provide bookId or rawText.");
        }
        if (request.targetLanguage == null || request.targetLanguage.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "targetLanguage is required.");
        }

        if (apiKey == null || apiKey.isBlank()) {
            TranslateResponse resp = new TranslateResponse();
            resp.targetLanguage = request.targetLanguage;
            resp.translatedText = "[AI translation unavailable - GROQ_API_KEY not configured] " + text;
            return resp;
        }

        String systemPrompt = "You are a precise literary translator. Translate the user's text into "
                + request.targetLanguage + ". Reply with ONLY the translated text, nothing else.";
        String translated = callChatCompletion(systemPrompt, List.of(new ChatTurn("user", text)));

        TranslateResponse resp = new TranslateResponse();
        resp.targetLanguage = request.targetLanguage;
        resp.translatedText = translated;
        return resp;
    }

    // ---------------------------------------------------------------- chat

    @Override
    public ChatResponse chat(ChatRequest request) {
        if (request.message == null || request.message.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "message is required.");
        }
        String conversationId = (request.conversationId == null || request.conversationId.isBlank())
                ? UUID.randomUUID().toString()
                : request.conversationId;

        chatMessageRepository.save(new ChatMessage(request.userId, conversationId, "user", request.message));

        List<ChatMessage> history = chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        List<ChatTurn> turns = history.stream()
                .map(m -> new ChatTurn(m.getRole(), m.getContent()))
                .collect(Collectors.toList());

        String reply;
        if (apiKey == null || apiKey.isBlank()) {
            reply = "AI chatbot is not configured yet (missing GROQ_API_KEY). "
                    + "Once it's set, I'll be able to answer questions about books in the catalog.";
        } else {
            List<Book> catalog = bookRepository.findAll();
            String catalogSummary = catalog.stream()
                    .limit(50)
                    .map(b -> "- %s by %s (%s)".formatted(b.getTitle(), b.getAuthor(), b.getCategory()))
                    .collect(Collectors.joining("\n"));
            String systemPrompt = """
                    You are the SmartLibrary assistant. Answer questions about books, authors,
                    categories, and how to use the library (borrowing, reading list, book exchange).
                    Here is a sample of the current catalog:
                    %s
                    Keep answers concise and friendly. If asked something unrelated to books or the
                    library, gently steer the conversation back.
                    """.formatted(catalogSummary);
            reply = callChatCompletion(systemPrompt, turns);
        }

        chatMessageRepository.save(new ChatMessage(request.userId, conversationId, "assistant", reply));

        ChatResponse response = new ChatResponse();
        response.conversationId = conversationId;
        response.reply = reply;
        response.history = new ArrayList<>(turns);
        response.history.add(new ChatTurn("assistant", reply));
        return response;
    }

    // ---------------------------------------------------------------- shared HTTP call

    private String callChatCompletion(String systemPrompt, List<ChatTurn> turns) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        for (ChatTurn t : turns) {
            messages.add(Map.of("role", t.role.equals("assistant") ? "assistant" : "user", "content", t.content));
        }

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", messages,
                "temperature", 0.4
        );

        try {
            JsonNode response = groqRestClient.post()
                    .uri("/chat/completions")
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);
            return response.path("choices").get(0).path("message").path("content").asText().trim();
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "AI provider call failed: " + e.getMessage());
        }
    }

    private String stripJsonFences(String raw) {
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("^```(json)?", "").trim();
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3).trim();
            }
        }
        return cleaned;
    }
}
