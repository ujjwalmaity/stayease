package com.stayease.booking.dto;
import com.stayease.booking.entity.Booking;
import com.stayease.booking.entity.BookingStatus;
import com.stayease.room.entity.RoomType;
import java.math.BigDecimal;
import java.time.LocalDate;
public record BookingResponse(Long id, String bookingRef, Long userId, String userName,
                              Long roomId, String roomNumber, RoomType roomType,
                              Long hotelId, String hotelName,
                              LocalDate checkInDate, LocalDate checkOutDate,
                              BigDecimal totalPrice, BookingStatus status) {
    public static BookingResponse from(Booking b){
        return new BookingResponse(
            b.getId(), b.getBookingRef(), b.getUser().getId(), b.getUser().getName(),
            b.getRoom().getId(), b.getRoom().getRoomNumber(), b.getRoom().getRoomType(),
            b.getRoom().getHotel().getId(), b.getRoom().getHotel().getName(),
            b.getCheckInDate(), b.getCheckOutDate(), b.getTotalPrice(), b.getStatus());
    }
}
