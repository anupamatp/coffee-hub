package com.cod.controller;

import com.cod.dto.PromptRequest;
import com.cod.service.GeminiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;  // <-- ADD THIS

@RestController
@RequestMapping("/api")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody PromptRequest request) throws Exception {
        String result = geminiService.generateResponse(request.getPrompt());
        return Map.of("response", result);
    }
}
