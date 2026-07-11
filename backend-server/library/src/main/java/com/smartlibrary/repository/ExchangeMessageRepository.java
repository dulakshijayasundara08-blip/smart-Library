package com.smartlibrary.repository;

import com.smartlibrary.model.ExchangeMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExchangeMessageRepository extends JpaRepository<ExchangeMessage, Long> {
    List<ExchangeMessage> findByExchangeIdOrderBySentAtAsc(Long exchangeId);
}
