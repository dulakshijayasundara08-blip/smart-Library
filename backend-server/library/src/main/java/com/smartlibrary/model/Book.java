package com.smartlibrary.model;

import jakarta.persistence.*;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String category;

    @Column(length = 5000)
    private String coverImage;

    private boolean newRelease;

    @Column(length = 10000)
    private String pdfUrl;

    @Column(columnDefinition = "TEXT")
    private String summary;

    // 1. Default Constructor (JPA සඳහා අනිවාර්යයි)
    public Book() {
    }

    // 2. Parameterized Constructor (පොත් පහසුවෙන් නිර්මාණය කිරීමට)
    public Book(String title, String author, String category, String coverImage, boolean newRelease, String pdfUrl, String summary) {
        this.title = title;
        this.author = author;
        this.category = category;
        this.coverImage = coverImage;
        this.newRelease = newRelease;
        this.pdfUrl = pdfUrl;
        this.summary = summary;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public boolean isNewRelease() { return newRelease; }
    public void setNewRelease(boolean newRelease) { this.newRelease = newRelease; }

    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
}