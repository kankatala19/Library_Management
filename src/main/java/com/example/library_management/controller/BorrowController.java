package com.example.library_management.controller;

import com.example.library_management.entity.Book;
import com.example.library_management.entity.BorrowRecord;
import com.example.library_management.entity.Fine;
import com.example.library_management.entity.User;
import com.example.library_management.repository.BookRepository;
import com.example.library_management.repository.UserRepository;
import com.example.library_management.service.BorrowService;
import com.example.library_management.service.FineService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private FineService fineService;

    // Borrow a book
    @PostMapping("/{userId}/{bookId}")
    public BorrowRecord borrowBook(@PathVariable Long userId, @PathVariable Long bookId) {
        User user = userRepository.findById(userId).orElseThrow();
        Book book = bookRepository.findById(bookId).orElseThrow();
        return borrowService.borrowBook(user, book);
    }

    // Return a book
    @PutMapping("/return/{recordId}")
    public BorrowRecord returnBook(@PathVariable Long recordId) {
        return borrowService.returnBook(recordId);
    }

    // Get all borrow records (admin/librarian)
    @GetMapping
    public List<BorrowRecord> getAll() {
        return borrowService.getAllBorrowRecords();
    }

    // Get borrow records for a specific user
    @GetMapping("/user/{userId}")
    public List<BorrowRecord> getUserBorrowRecords(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return borrowService.getUserBorrowHistory(user);
    }

    // Get fines for a specific user
    @GetMapping("/user/{userId}/fines")
    public List<Fine> getUserFines(@PathVariable Long userId) {
        return fineService.getFinesByUser(userId);
    }
}
