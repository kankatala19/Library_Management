package com.example.library_management.service;

import com.example.library_management.entity.Book;
import com.example.library_management.entity.BorrowRecord;
import com.example.library_management.entity.User;
import com.example.library_management.repository.BookRepository;
import com.example.library_management.repository.BorrowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowService {

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private FineService fineService; // Add this

    // Borrow book
    public BorrowRecord borrowBook(User user, Book book) {
        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book not available");
        }

        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(book);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusWeeks(2));
        record.setStatus(BorrowRecord.Status.BORROWED);

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        return borrowRepository.save(record);
    }

    // Return book
    public BorrowRecord returnBook(Long recordId) {
        BorrowRecord record = borrowRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowRecord.Status.RETURNED);

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        BorrowRecord updatedRecord = borrowRepository.save(record);

        // Automatically create fine if overdue
        fineService.createFine(updatedRecord.getId());

        return updatedRecord;
    }

    // Get borrow history by user
    public List<BorrowRecord> getUserBorrowHistory(User user) {
        return borrowRepository.findByUser(user);
    }

    // Get all borrow records
    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowRepository.findAll();
    }
}
