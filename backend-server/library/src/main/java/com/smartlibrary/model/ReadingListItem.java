package com.smartlibrary.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Links a user to a book they've added to their personal reading list ("wishlist"). */
@Entity
@Table(name = "reading_list", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "bookId"}))
public class ReadingListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long bookId;

    // "To Read" | "Currently Reading" | "Finished"
    private String status = "To Read";

    @Column(length = 1000)
    private String note;

    private LocalDateTime addedAt = LocalDateTime.now();

    public ReadingListItem() {}

    public ReadingListItem(Long userId, Long bookId) {
        this.userId = userId;
        this.bookId = bookId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
}
