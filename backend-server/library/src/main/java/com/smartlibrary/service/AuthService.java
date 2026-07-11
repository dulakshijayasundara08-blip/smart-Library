package com.smartlibrary.service;

import com.smartlibrary.dto.AuthDtos.*;
import com.smartlibrary.exception.ApiException;
import com.smartlibrary.model.User;
import com.smartlibrary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.email).isPresent()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already exists!");
        }
        User user = new User();
        user.setName(req.name);
        user.setEmail(req.email);
        // TODO: hash with BCryptPasswordEncoder before saving - stored as plain text for now.
        user.setPassword(req.password);
        user.setRole((req.role == null || req.role.isEmpty()) ? "USER" : req.role);
        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
        // TODO: compare hashed passwords once BCrypt is introduced.
        if (!user.getPassword().equals(req.password)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid Password");
        }
        return UserResponse.from(user);
    }
}
