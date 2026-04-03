package com.cod.controller;

import com.cod.dto.BookingRequest;
import com.cod.model.TableBooking;
import com.cod.model.TableEntity;
import com.cod.service.TableBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class TableBookingController {

    @Autowired
    private TableBookingService tableBookingService;

    // -------------------- BOOKING --------------------

    // ✅ Book table by JSON body
    @PostMapping("/book")
    public ResponseEntity<?> bookTable(@RequestBody BookingRequest req) {
        try {
            // Basic validation
            if (req.getUserId() == null) {
                return ResponseEntity.badRequest().body("userId required");
            }
            if (req.getBookingTime() == null) {
                return ResponseEntity.badRequest().body("bookingTime required (ISO_LOCAL_DATE_TIME)");
            }

            TableBooking booking = tableBookingService.bookTableByNumber(
                    req.getUserId(),
                    req.getTableNumber(),
                    req.getBookingTime(),
                    req.getNumberOfPeople()
            );

            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Cancel a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            tableBookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Get all bookings
    @GetMapping("/all")
    public List<TableBooking> getAllBookings() {
        return tableBookingService.getAllBookings();
    }

    // ✅ Get bookings for a specific user
    @GetMapping("/user/{userId}")
    public List<TableBooking> getUserBookings(@PathVariable Long userId) {
        return tableBookingService.getUserBookings(userId);
    }

    // ✅ Get bookings for a specific table number
    @GetMapping("/table/{tableNumber}")
    public List<TableBooking> getTableBookings(@PathVariable int tableNumber) {
        return tableBookingService.getBookingsByTableNumber(tableNumber);
    }

    // -------------------- TABLE MANAGEMENT --------------------

    @GetMapping("/tables")
    public List<TableEntity> getAllTables() {
        return tableBookingService.getAllTables();
    }

    @GetMapping("/tables/available")
    public List<TableEntity> getAvailableTables() {
        return tableBookingService.getAvailableTables();
    }

    @PostMapping("/tables")
    public TableEntity addTable(@RequestParam int tableNumber, @RequestParam int seats) {
        return tableBookingService.addTable(tableNumber, seats);
    }

    @DeleteMapping("/tables/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        try {
            tableBookingService.deleteTable(id);
            return ResponseEntity.ok("Table deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/tables/{id}/availability")
    public TableEntity updateTableAvailability(@PathVariable Long id, @RequestParam boolean available) {
        return tableBookingService.updateTableAvailability(id, available);
    }
}
