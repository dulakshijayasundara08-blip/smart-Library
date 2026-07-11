package com.smartlibrary.controller;

import com.smartlibrary.dto.AuthDtos.*;
import com.smartlibrary.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/** Kept at the top-level /api/register and /api/login paths for compatibility with the existing frontend. */
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired private AuthService authService;

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
