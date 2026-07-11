package com.smartlibrary.service;

import com.smartlibrary.exception.ApiException;
import com.smartlibrary.model.Exchange;
import com.smartlibrary.model.ExchangeMessage;
import com.smartlibrary.repository.ExchangeMessageRepository;
import com.smartlibrary.repository.ExchangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExchangeService {

    @Autowired private ExchangeRepository exchangeRepository;
    @Autowired private ExchangeMessageRepository exchangeMessageRepository;

    public List<Exchange> getAll() {
        return exchangeRepository.findAll();
    }

    public Exchange create(Exchange exchange) {
        exchange.setId(null);
        exchange.setStatus("PENDING");
        return exchangeRepository.save(exchange);
    }

    public Exchange approve(Long id) {
        Exchange exchange = exchangeRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Exchange request not found: " + id));
        exchange.setStatus("APPROVED");
        return exchangeRepository.save(exchange);
    }

    public List<ExchangeMessage> getMessages(Long exchangeId) {
        return exchangeMessageRepository.findByExchangeIdOrderBySentAtAsc(exchangeId);
    }

    public ExchangeMessage postMessage(Long exchangeId, Long senderId, String senderName, String content) {
        if (!exchangeRepository.existsById(exchangeId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Exchange listing not found: " + exchangeId);
        }
        ExchangeMessage msg = new ExchangeMessage(exchangeId, senderId, senderName, content);
        return exchangeMessageRepository.save(msg);
    }
}
