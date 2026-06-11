package com.stayease.room.repository;

import com.stayease.room.entity.Room;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    @EntityGraph(attributePaths = "hotel")
    List<Room> findByHotelId(Long hotelId);

    @EntityGraph(attributePaths = "hotel")
    @Query("SELECT r FROM Room r WHERE r.hotel.managerId = :managerId")
    List<Room> findByManagerId(@Param("managerId") Long managerId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.id = :id")
    Optional<Room> findByIdForUpdate(@Param("id") Long id);

    @Query("SELECT MIN(r.pricePerNight) FROM Room r WHERE r.hotel.id = :hotelId AND r.isActive = true")
    BigDecimal findStartingPrice(@Param("hotelId") Long hotelId);

    @EntityGraph(attributePaths = "hotel")
    @Query("""
            SELECT r FROM Room r
            WHERE r.hotel.id = :hotelId AND r.isActive = true
              AND r.id NOT IN (
                SELECT b.room.id FROM Booking b
                WHERE b.status <> com.stayease.booking.entity.BookingStatus.CANCELLED
                  AND b.checkInDate < :checkOut
                  AND b.checkOutDate > :checkIn)
            """)
    List<Room> findAvailable(@Param("hotelId") Long hotelId,
                             @Param("checkIn") LocalDate checkIn,
                             @Param("checkOut") LocalDate checkOut);
}
