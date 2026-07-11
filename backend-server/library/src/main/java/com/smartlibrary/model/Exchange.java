package com.smartlibrary.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * A book-exchange listing: "I have X, I want Y".
 * Fields were widened to match what the React BookExchangeContent form actually
 * submits (bookTitleHave / bookTitleWant), while keeping the older
 * location/bookPic fields for backward compatibility with existing data.
 */
@Entity
@Table(name = "exchanges")
public class Exchange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userName;

    private String bookTitleHave;
    private String bookTitleWant;

    @Column(length = 2000)
    private String message;

    private String contactEmail;

    // Legacy fields kept for compatibility with earlier listings.
    private String location;
    @Column(length = 5000)
    private String bookPic;

    // PENDING | APPROVED | COMPLETED | REJECTED
    private String status = "PENDING";

    private LocalDateTime createdAt = LocalDateTime.now();

    public Exchange() {}

    public Exchange(String bookTitleHave, String bookTitleWant, String message, String contactEmail) {
        this.bookTitleHave = bookTitleHave;
        this.bookTitleWant = bookTitleWant;
        this.message = message;
        this.contactEmail = contactEmail;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getBookTitleHave() { return bookTitleHave; }
    public void setBookTitleHave(String bookTitleHave) { this.bookTitleHave = bookTitleHave; }
    public String getBookTitleWant() { return bookTitleWant; }
    public void setBookTitleWant(String bookTitleWant) { this.bookTitleWant = bookTitleWant; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getBookPic() { return bookPic; }
    public void setBookPic(String bookPic) { this.bookPic = bookPic; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
