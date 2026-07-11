package com.smartlibrary.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true) // Email අද්විතීය විය යුතුය
    private String email;

    private String password;
    private String role; // USER, ADMIN
    private String preferredCategory;

    @Column(length = 5000)
    private String profilePic;

    @ElementCollection
    private Set<Long> favoriteBookIds = new HashSet<>(); // HashSet එකක් ලෙස Initialize කිරීම හොඳයි

    // 1. Default Constructor
    public User() {
    }

    // 2. Parameterized Constructor
    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPreferredCategory() { return preferredCategory; }
    public void setPreferredCategory(String preferredCategory) { this.preferredCategory = preferredCategory; }

    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }

    public Set<Long> getFavoriteBookIds() { return favoriteBookIds; }
    public void setFavoriteBookIds(Set<Long> favoriteBookIds) { this.favoriteBookIds = favoriteBookIds; }
}