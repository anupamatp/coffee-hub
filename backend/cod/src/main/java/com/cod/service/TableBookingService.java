package com.cod.service;

import com.cod.model.TableBooking;
import com.cod.model.TableEntity;
import com.cod.model.User;
import com.cod.model.BookingStatus;
import com.cod.repository.TableBookingRepository;
import com.cod.repository.TableRepository;
import com.cod.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TableBookingService {

    @Autowired
    private TableBookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public TableBooking bookTableByNumber(Long userId, int tableNumber, LocalDateTime bookingTime, int numberOfPeople) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for id: " + userId));

        TableEntity table = tableRepository.findByTableNumber(tableNumber)
                .orElseThrow(() -> new RuntimeException("Table not found for tableNumber: " + tableNumber));

        if (!table.isAvailable()) {
            throw new RuntimeException("Table " + tableNumber + " is currently not available");
        }

        if (table.getSeats() < numberOfPeople) {
            throw new RuntimeException("Table doesn't have enough seats (requested: " + numberOfPeople + ", seats: " + table.getSeats() + ")");
        }

        boolean exists = bookingRepository.existsByTableAndBookingTime(table, bookingTime);
        if (exists) {
            throw new RuntimeException("Table is already booked at this time");
        }

        TableBooking booking = new TableBooking();
        booking.setUser(user);
        booking.setTable(table);
        booking.setBookingTime(bookingTime);
        booking.setNumberOfPeople(numberOfPeople);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCreatedAt(LocalDateTime.now());

        TableBooking savedBooking = bookingRepository.save(booking);

        // set table occupied
        table.setAvailable(false);
        tableRepository.save(table);

        // send email (if emailService available)
        try {
            emailService.sendTableBookingEmail(
                    user.getEmail(),
                    user.getName(),
                    table.getTableNumber(),
                    bookingTime.toString(),
                    numberOfPeople
            );
        } catch (Exception ex) {
            // log but do not fail booking if email fails
            System.err.println("Failed to send booking email: " + ex.getMessage());
        }

        return savedBooking;
    }

    @Transactional
    public TableBooking bookTable(Long userId, Long tableId, LocalDateTime bookingTime, int numberOfPeople) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for id: " + userId));

        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found for id: " + tableId));

        if (!table.isAvailable()) {
            throw new RuntimeException("Table is currently not available");
        }

        boolean exists = bookingRepository.existsByTableAndBookingTime(table, bookingTime);
        if (exists) {
            throw new RuntimeException("Table is already booked at this time");
        }

        TableBooking booking = new TableBooking();
        booking.setUser(user);
        booking.setTable(table);
        booking.setBookingTime(bookingTime);
        booking.setNumberOfPeople(numberOfPeople);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCreatedAt(LocalDateTime.now());

        TableBooking savedBooking = bookingRepository.save(booking);

        table.setAvailable(false);
        tableRepository.save(table);

        try {
            emailService.sendTableBookingEmail(
                    user.getEmail(),
                    user.getName(),
                    table.getTableNumber(),
                    bookingTime.toString(),
                    numberOfPeople
            );
        } catch (Exception ex) {
            System.err.println("Failed to send booking email: " + ex.getMessage());
        }

        return savedBooking;
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        TableBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found for id: " + bookingId));

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        TableEntity table = booking.getTable();
        table.setAvailable(true);
        tableRepository.save(table);
    }

    public List<TableBooking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<TableBooking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<TableBooking> getBookingsByTableNumber(int tableNumber) {
        return bookingRepository.findByTable_TableNumber(tableNumber);
    }

    public List<TableEntity> getAllTables() {
        return tableRepository.findAll();
    }

    public List<TableEntity> getAvailableTables() {
        return tableRepository.findByAvailable(true);
    }

    public TableEntity addTable(int tableNumber, int seats) {
        TableEntity table = new TableEntity();
        table.setTableNumber(tableNumber);
        table.setSeats(seats);
        table.setAvailable(true);
        return tableRepository.save(table);
    }

    public void deleteTable(Long tableId) {
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        List<TableBooking> activeBookings = bookingRepository.findByTable_IdAndStatus(tableId, BookingStatus.CONFIRMED);
        if (!activeBookings.isEmpty()) {
            throw new RuntimeException("Cannot delete table with active bookings");
        }

        tableRepository.delete(table);
    }

    public TableEntity updateTableAvailability(Long tableId, boolean available) {
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        table.setAvailable(available);
        return tableRepository.save(table);
    }
}
