package com.stayease.room.entity;

import com.stayease.hotel.entity.Hotel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;
    @Column(name = "room_number", nullable = false)
    private String roomNumber;
    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;
    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;
    @Column(name = "max_occupancy", nullable = false)
    private Integer maxOccupancy;
    @Column(length = 1000)
    private String description;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "is_active", nullable = false)
    private boolean isActive;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void pre() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
