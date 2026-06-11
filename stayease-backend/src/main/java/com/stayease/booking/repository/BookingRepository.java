package com.stayease.booking.repository;

import com.stayease.booking.entity.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @EntityGraph(attributePaths = {"user", "room", "room.hotel"})
    List<Booking> findByUserIdOrderByCheckInDateDesc(Long userId);

    @EntityGraph(attributePaths = {"user", "room", "room.hotel"})
    @Query("""
            SELECT b FROM Booking b
            WHERE b.room.hotel.id = :hotelId AND b.status <> com.stayease.booking.entity.BookingStatus.CANCELLED
              AND b.checkOutDate >= :today
            ORDER BY b.checkInDate ASC
            """)
    List<Booking> findUpcomingForHotel(@Param("hotelId") Long hotelId, @Param("today") LocalDate today);

    @EntityGraph(attributePaths = {"user", "room", "room.hotel"})
    @Query("""
            SELECT b FROM Booking b
            WHERE b.room.hotel.managerId = :managerId AND b.status <> com.stayease.booking.entity.BookingStatus.CANCELLED
              AND b.checkOutDate >= :today
            ORDER BY b.checkInDate ASC
            """)
    List<Booking> findUpcomingForManager(@Param("managerId") Long managerId, @Param("today") LocalDate today);

    @Query("""
            SELECT COUNT(b) FROM Booking b
            WHERE b.room.id = :roomId AND b.status <> com.stayease.booking.entity.BookingStatus.CANCELLED
              AND b.checkInDate < :checkOut AND b.checkOutDate > :checkIn
            """)
    long countOverlapping(@Param("roomId") Long roomId,
                          @Param("checkIn") LocalDate checkIn,
                          @Param("checkOut") LocalDate checkOut);
}
