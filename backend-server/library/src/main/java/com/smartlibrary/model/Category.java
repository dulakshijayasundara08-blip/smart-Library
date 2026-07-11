package com.smartlibrary.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) // Category නම අනිවාර්ය සහ අද්විතීය විය යුතුය
    private String name;

    // 1. Default Constructor (JPA සඳහා අනිවාර්යයි)
    public Category() {
    }

    // 2. Parameterized Constructor
    public Category(String name) {
        this.name = name;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}