package com.stayease.booking.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record BookingRequest(
        @NotNull Long userId,
        @NotNull Long hotelId,
        @NotNull Long roomId,
        @NotNull @FutureOrPresent LocalDate checkInDate,
        @NotNull LocalDate checkOutDate) {
}
