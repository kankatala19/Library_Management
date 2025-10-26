package com.example.library_management.controller;

import com.example.library_management.entity.User;
import com.example.library_management.repository.UserRepository;
import com.example.library_management.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register new student
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if(userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists!";
        }
        if(userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists!";
        }

        // Assign STUDENT role
        user.setRole("student");

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save user
        userRepository.save(user);

        return "User registered successfully!";
    }

    // Login
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        User dbUser = userRepository.findByUsername(user.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(dbUser.getUsername(), dbUser.getRole());

        return Map.of("token", token);
    }

    // Get current authenticated user
    @GetMapping("/me")
    public Map<String, Object> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User dbUser = userRepository.findByUsername(username).orElseThrow();

        Map<String, Object> result = new HashMap<>();
        result.put("id", dbUser.getId());
        result.put("username", dbUser.getUsername());
        result.put("email", dbUser.getEmail());
        result.put("role", dbUser.getRole());
        return result;
    }
}
