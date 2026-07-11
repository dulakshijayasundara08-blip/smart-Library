package com.smartlibrary.repository;

import com.smartlibrary.model.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {
    // පොත් හුවමාරු දත්ත (Messages, Location, Base64 Images) ගබඩා කිරීමට සහ ලබාගැනීමට.
}