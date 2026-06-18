package com.stayease.room.dto;

import com.stayease.room.entity.RoomType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record RoomRequest(
    @NotBlank String roomNumber,
    @NotNull RoomType roomType,
    @NotNull @DecimalMin(value = "0.0", inclusive = false) @Digits(integer = 8, fraction = 2) BigDecimal pricePerNight,
    @NotNull @Min(1) Integer maxOccupancy,
    String description,
    String imageUrl,
    Boolean isActive) {
}
