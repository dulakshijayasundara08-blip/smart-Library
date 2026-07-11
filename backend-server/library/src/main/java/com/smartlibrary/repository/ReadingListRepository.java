package com.smartlibrary.repository;

import com.smartlibrary.model.ReadingListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReadingListRepository extends JpaRepository<ReadingListItem, Long> {
    List<ReadingListItem> findByUserId(Long userId);
    Optional<ReadingListItem> findByUserIdAndBookId(Long userId, Long bookId);
    void deleteByUserIdAndBookId(Long userId, Long bookId);
}
