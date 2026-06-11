package com.stayease.hotel.repository;

import com.stayease.hotel.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityIgnoreCase(String city);

    List<Hotel> findByManagerId(Long managerId);

    /**
     * Returns hotels in the given city that have at least one active room
     * with no confirmed/pending booking overlapping [checkIn, checkOut).
     */
    @Query("""
            SELECT DISTINCT h FROM Hotel h
            WHERE LOWER(h.city) = LOWER(:city)
              AND EXISTS (
                SELECT r FROM Room r
                WHERE r.hotel = h
                  AND r.isActive = true
                  AND r.id NOT IN (
                    SELECT b.room.id FROM Booking b
                    WHERE b.status <> com.stayease.booking.entity.BookingStatus.CANCELLED
                      AND b.checkInDate < :checkOut
                      AND b.checkOutDate > :checkIn
                  )
              )
            """)
    List<Hotel> findAvailableByCity(@Param("city") String city,
                                    @Param("checkIn") LocalDate checkIn,
                                    @Param("checkOut") LocalDate checkOut);
}
