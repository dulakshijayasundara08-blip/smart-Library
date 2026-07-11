package com.smartlibrary.controller;

import com.smartlibrary.model.Exchange;
import com.smartlibrary.model.ExchangeMessage;
import com.smartlibrary.service.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ExchangeController {

    @Autowired private ExchangeService exchangeService;

    @GetMapping("/exchanges")
    public List<Exchange> getAllExchanges() {
        return exchangeService.getAll();
    }

    @PostMapping("/exchanges")
    public Exchange createExchange(@RequestBody Exchange exchange) {
        return exchangeService.create(exchange);
    }

    /** Matches the admin RequestList component's existing call: PUT /api/requests/approve/{id}. */
    @PutMapping("/requests/approve/{id}")
    public Exchange approve(@PathVariable Long id) {
        return exchangeService.approve(id);
    }

    // --- Book Exchange messaging thread ---

    @GetMapping("/exchanges/{id}/messages")
    public List<ExchangeMessage> getMessages(@PathVariable("id") Long exchangeId) {
        return exchangeService.getMessages(exchangeId);
    }

    @PostMapping("/exchanges/{id}/messages")
    public ExchangeMessage postMessage(@PathVariable("id") Long exchangeId, @RequestBody Map<String, Object> body) {
        Long senderId = body.get("senderId") == null ? null : Long.valueOf(body.get("senderId").toString());
        String senderName = (String) body.get("senderName");
        String content = (String) body.get("content");
        return exchangeService.postMessage(exchangeId, senderId, senderName, content);
    }
}
