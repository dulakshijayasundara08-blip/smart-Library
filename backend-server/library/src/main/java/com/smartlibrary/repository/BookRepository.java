package com.smartlibrary.repository;

import com.smartlibrary.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // පොත් සෙවීම සහ අනෙකුත් මූලික වැඩ සියල්ල JpaRepository මඟින් ස්වයංක්‍රීයව ලබාදේ.
}