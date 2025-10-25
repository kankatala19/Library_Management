package com.example.library_management.controller;

import com.example.library_management.entity.Fine;
import com.example.library_management.service.FineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    @Autowired
    private FineService fineService;

    @GetMapping("/all")
    public List<Fine> getAllFines() {
        return fineService.getAllFines();
    }

    @GetMapping("/user/{userId}")
    public List<Fine> getFinesByUser(@PathVariable Long userId) {
        return fineService.getFinesByUser(userId);
    }

    @PutMapping("/pay/{fineId}")
    public Fine payFine(@PathVariable Long fineId) {
        return fineService.markFineAsPaid(fineId);
    }
}
