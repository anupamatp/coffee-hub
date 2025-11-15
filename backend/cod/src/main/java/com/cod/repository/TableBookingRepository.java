package com.cod.repository;

import com.cod.model.TableBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TableBookingRepository extends JpaRepository<TableBooking, Long> {

    // Check if a table is already booked at a specific time
    boolean existsByTableNumberAndBookingTime(int tableNumber, LocalDateTime bookingTime);
}
