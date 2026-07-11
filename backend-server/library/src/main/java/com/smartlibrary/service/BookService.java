package com.smartlibrary.service;

import com.smartlibrary.exception.ApiException;
import com.smartlibrary.model.Book;
import com.smartlibrary.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Value("${app.upload-dir:uploads/}")
    private String uploadDir;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found: " + id));
    }

    public Book addBook(String title, String author, String category, String coverImage,
                         String summary, MultipartFile pdfFile) {
        String fileName = storeFile(pdfFile);

        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setCategory(category);
        book.setCoverImage(coverImage);
        book.setSummary(summary);
        book.setPdfUrl(fileName);
        book.setNewRelease(true);
        return bookRepository.save(book);
    }

    /** Lets the "Discover" page add a book by URL only (no file upload), matching the current UI. */
    public Book addBookFromLinks(Book incoming) {
        incoming.setId(null);
        return bookRepository.save(incoming);
    }

    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Book not found: " + id);
        }
        bookRepository.deleteById(id);
    }

    public String storeFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName));
            return fileName;
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "There was an error uploading the file.");
        }
    }
}
