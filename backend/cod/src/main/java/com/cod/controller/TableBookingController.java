package com.cod.controller;

import com.cod.model.TableBooking;
import com.cod.service.TableBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class TableBookingController {

    @Autowired
    private TableBookingService tableBookingService;

    @PostMapping("/book")
    public ResponseEntity<?> bookTable(@RequestParam Long userId,
                                       @RequestParam int tableNumber,
                                       @RequestParam String bookingTime,
                                       @RequestParam int numberOfPeople) { // added
        try {
            LocalDateTime time = LocalDateTime.parse(bookingTime);
            TableBooking booking = tableBookingService.bookTable(userId, tableNumber, time, numberOfPeople);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<TableBooking> getAllBookings() {
        return tableBookingService.getAllBookings();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            tableBookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
