package com.stayease.hotel.dto;

import jakarta.validation.constraints.*;

public record HotelRequest(
    @NotBlank String name,
    @NotBlank String city,
    @NotNull @Min(1) @Max(5) Integer starRating,
    String description,
    String coverImageUrl,
    @NotNull Long managerId) {
}
