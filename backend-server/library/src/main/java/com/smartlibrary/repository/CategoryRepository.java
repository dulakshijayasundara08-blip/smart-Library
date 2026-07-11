package com.smartlibrary.repository;

import com.smartlibrary.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Categories කළමනාකරණය සඳහා අවශ්‍ය ක්‍රමවේද මෙයට ඇතුළත් වේ.
}