package com.cod.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "table_bookings")
public class TableBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int tableNumber;

    private LocalDateTime bookingTime;

    @ManyToOne
    private User user;

    private boolean available = true; // default true

    @Column(nullable = false)
    private int numberOfPeople; // NEW: number of people
}
