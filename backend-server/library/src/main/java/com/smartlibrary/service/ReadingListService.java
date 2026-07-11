package com.smartlibrary.service;

import com.smartlibrary.model.Book;
import com.smartlibrary.model.ReadingListItem;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.ReadingListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReadingListService {

    @Autowired private ReadingListRepository readingListRepository;
    @Autowired private BookRepository bookRepository;

    /** Returns the user's reading-list books, with each book's status/note attached. */
    public List<Map<String, Object>> getForUser(Long userId) {
        List<ReadingListItem> items = readingListRepository.findByUserId(userId);
        return items.stream().map(item -> {
            Book book = bookRepository.findById(item.getBookId()).orElse(null);
            return Map.<String, Object>of(
                    "id", item.getBookId(),
                    "title", book != null ? book.getTitle() : "(book removed)",
                    "author", book != null ? book.getAuthor() : "",
                    "coverImage", book != null ? book.getCoverImage() : "",
                    "pdfUrl", book != null ? book.getPdfUrl() : "",
                    "status", item.getStatus(),
                    "note", item.getNote() == null ? "" : item.getNote()
            );
        }).collect(Collectors.toList());
    }

    public ReadingListItem addToList(Long userId, Long bookId) {
        return readingListRepository.findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> readingListRepository.save(new ReadingListItem(userId, bookId)));
    }

    @Transactional
    public void remove(Long userId, Long bookId) {
        readingListRepository.deleteByUserIdAndBookId(userId, bookId);
    }

    public ReadingListItem updateStatus(Long userId, Long bookId, String status, String note) {
        ReadingListItem item = readingListRepository.findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> new ReadingListItem(userId, bookId));
        if (status != null) item.setStatus(status);
        if (note != null) item.setNote(note);
        return readingListRepository.save(item);
    }
}
