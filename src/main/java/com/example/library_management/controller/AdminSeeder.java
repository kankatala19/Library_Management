package com.example.library_management.controller;

import com.example.library_management.entity.User;
import com.example.library_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@library.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@library.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // BCrypt hash
            admin.setRole("admin"); // lowercase
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("Admin user created!");
        }
    }
}
