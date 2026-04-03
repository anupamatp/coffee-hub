package com.cod.repository;

import com.cod.model.TableBooking;
import com.cod.model.TableEntity;
import com.cod.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TableBookingRepository extends JpaRepository<TableBooking, Long> {

    // Check for exact time conflict (you can extend this to a range if needed)
    boolean existsByTableAndBookingTime(TableEntity table, LocalDateTime bookingTime);

    List<TableBooking> findByUserId(Long userId);

    List<TableBooking> findByTable_TableNumber(int tableNumber);

    List<TableBooking> findByTable_Id(Long tableId);

    List<TableBooking> findByTable_IdAndStatus(Long tableId, BookingStatus status);

    List<TableBooking> findByStatus(BookingStatus status);
}
