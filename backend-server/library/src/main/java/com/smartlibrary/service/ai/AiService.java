package com.smartlibrary.service.ai;

import com.smartlibrary.dto.AiDtos.*;

import java.util.List;

/**
 * Abstraction over "whatever LLM provider we call for AI features".
 * Controllers depend on this interface, not on OpenAiService directly, so the
 * provider can be swapped (Anthropic, a local model, etc.) without touching
 * AiController.
 */
public interface AiService {

    List<RecommendationResponse> recommendBooks(Long userId, int limit);

    TranslateResponse translateSummary(TranslateRequest request);

    ChatResponse chat(ChatRequest request);
}
