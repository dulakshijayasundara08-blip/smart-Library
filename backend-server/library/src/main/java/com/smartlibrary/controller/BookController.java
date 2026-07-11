package com.smartlibrary.controller;

import com.smartlibrary.model.Book;
import com.smartlibrary.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired private BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) {
        return bookService.getBook(id);
    }

    /** Admin "Add Book" form with a real PDF upload (multipart/form-data). */
    @PostMapping(consumes = "multipart/form-data")
    public Book addBook(
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("category") String category,
            @RequestParam("coverImage") String coverImage,
            @RequestParam("summary") String summary,
            @RequestParam("pdfFile") MultipartFile pdfFile) {
        return bookService.addBook(title, author, category, coverImage, summary, pdfFile);
    }

    /** Discover page's quick "add by link" form (title/author/summary/coverImage/pdfUrl as JSON, no file). */
    @PostMapping(consumes = "application/json")
    public Book addBookFromLinks(@RequestBody Book book) {
        return bookService.addBookFromLinks(book);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadBookPdf(@RequestParam("pdfFile") MultipartFile file) {
        String fileName = bookService.storeFile(file);
        return ResponseEntity.ok("The file was uploaded successfully: " + fileName);
    }
}
