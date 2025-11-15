package com.cod.service;

import com.cod.model.TableBooking;
import com.cod.model.User;
import com.cod.repository.TableBookingRepository;
import com.cod.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TableBookingService {

    @Autowired
    private TableBookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // Book table
    public TableBooking bookTable(Long userId, int tableNumber, LocalDateTime bookingTime, int numberOfPeople) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if table is available
        boolean exists = bookingRepository.existsByTableNumberAndBookingTime(tableNumber, bookingTime);
        if (exists) {
            throw new RuntimeException("Table not available at this time");
        }

        TableBooking booking = new TableBooking();
        booking.setUser(user);
        booking.setTableNumber(tableNumber);
        booking.setBookingTime(bookingTime);
        booking.setAvailable(true);
        booking.setNumberOfPeople(numberOfPeople); // NEW
        return bookingRepository.save(booking);
    }

    public List<TableBooking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public void cancelBooking(Long id) {
        TableBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        bookingRepository.delete(booking);
    }
}
