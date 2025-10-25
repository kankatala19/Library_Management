package com.example.library_management.controller;

import com.example.library_management.entity.Reservation;
import com.example.library_management.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // Reserve a book
    @PostMapping("/reserve")
    public Reservation reserveBook(@RequestParam Long userId, @RequestParam Long bookId) {
        return reservationService.reserveBook(userId, bookId);
    }

    // Complete reservation
    @PutMapping("/complete/{id}")
    public Reservation completeReservation(@PathVariable Long id) {
        return reservationService.completeReservation(id);
    }

    // Cancel reservation
    @PutMapping("/cancel/{id}")
    public Reservation cancelReservation(@PathVariable Long id) {
        return reservationService.cancelReservation(id);
    }

    // Get all reservations
    @GetMapping("/all")
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    // Get reservations by user
    @GetMapping("/user/{userId}")
    public List<Reservation> getReservationsByUser(@PathVariable Long userId) {
        return reservationService.getReservationsByUser(userId);
    }
}
