package com.smartlibrary.dto;

/**
 * Request/response shapes for authentication.
 * NOTE (TODO - security): passwords are currently stored and compared in plain text
 * and login returns no session token. Before going to production, replace with
 * BCrypt password hashing (Spring Security PasswordEncoder) and issue a JWT
 * from POST /api/login instead of returning the raw User entity.
 */
public class AuthDtos {

    public static class RegisterRequest {
        public String name;
        public String email;
        public String password;
        public String role; // optional, defaults to USER
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    /** Safe user shape returned to the client - never includes the password. */
    public static class UserResponse {
        public Long id;
        public String name;
        public String email;
        public String role;
        public String preferredCategory;
        public String profilePic;

        public static UserResponse from(com.smartlibrary.model.User u) {
            UserResponse r = new UserResponse();
            r.id = u.getId();
            r.name = u.getName();
            r.email = u.getEmail();
            r.role = u.getRole();
            r.preferredCategory = u.getPreferredCategory();
            r.profilePic = u.getProfilePic();
            return r;
        }
    }
}
