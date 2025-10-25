package com.example.library_management.service;

import com.example.library_management.entity.BorrowRecord;
import com.example.library_management.entity.Fine;
import com.example.library_management.repository.BorrowRepository;
import com.example.library_management.repository.FineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class FineService {

    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private BorrowRepository borrowRepository;

    private static final BigDecimal FINE_PER_DAY = new BigDecimal("1.00"); 

    public BigDecimal calculateFine(BorrowRecord record) {
        if (record.getReturnDate() == null) return BigDecimal.ZERO;

        long overdueDays = ChronoUnit.DAYS.between(record.getDueDate(), record.getReturnDate());
        return overdueDays > 0 ? FINE_PER_DAY.multiply(BigDecimal.valueOf(overdueDays)) : BigDecimal.ZERO;
    }

    public Fine createFine(Long borrowRecordId) {
        BorrowRecord record = borrowRepository.findById(borrowRecordId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        BigDecimal amount = calculateFine(record);
        if (amount.compareTo(BigDecimal.ZERO) <= 0) return null;

        Fine fine = new Fine();
        fine.setUser(record.getUser());
        fine.setBorrowRecord(record);
        fine.setAmount(amount.doubleValue());
        fine.setPaid(false);

        return fineRepository.save(fine);
    }
    public Fine markFineAsPaid(Long fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine not found"));
        fine.setPaid(true);
        return fineRepository.save(fine);
    }

    public List<Fine> getAllFines() {
        return fineRepository.findAll();
    }

    public List<Fine> getFinesByUser(Long userId) {
        return fineRepository.findByUserId(userId);
    }
}
