package com.smartlibrary.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** A single message inside the conversation attached to a book-exchange listing. */
@Entity
@Table(name = "exchange_messages")
public class ExchangeMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long exchangeId;

    @Column(nullable = false)
    private Long senderId;

    private String senderName;

    @Column(length = 2000, nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    public ExchangeMessage() {}

    public ExchangeMessage(Long exchangeId, Long senderId, String senderName, String content) {
        this.exchangeId = exchangeId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getExchangeId() { return exchangeId; }
    public void setExchangeId(Long exchangeId) { this.exchangeId = exchangeId; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
