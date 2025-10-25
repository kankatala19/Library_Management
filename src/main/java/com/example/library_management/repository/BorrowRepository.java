package com.example.library_management.repository;

import com.example.library_management.entity.BorrowRecord;
import com.example.library_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUser(User user);
}
