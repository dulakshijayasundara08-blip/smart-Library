package com.smartlibrary.controller;

import com.smartlibrary.dto.AiDtos.*;
import com.smartlibrary.service.ai.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * All AI-powered endpoints in one place. Depends only on the AiService interface
 * (currently backed by OpenAiService) so the provider can change without touching
 * this controller.
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired private AiService aiService;

    @GetMapping("/recommendations")
    public List<RecommendationResponse> recommendations(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        return aiService.recommendBooks(userId, limit);
    }

    @PostMapping("/translate")
    public TranslateResponse translate(@RequestBody TranslateRequest request) {
        return aiService.translateSummary(request);
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return aiService.chat(request);
    }
}
