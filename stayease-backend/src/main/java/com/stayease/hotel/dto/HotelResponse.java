package com.stayease.hotel.dto;

import com.stayease.hotel.entity.Hotel;

import java.math.BigDecimal;

public record HotelResponse(Long id, String name, String city, Integer starRating, String description,
                            String coverImageUrl, Long managerId, BigDecimal startingPrice) {

    public static HotelResponse from(Hotel h, BigDecimal startingPrice) {
        return new HotelResponse(h.getId(), h.getName(), h.getCity(), h.getStarRating(), h.getDescription(),
                h.getCoverImageUrl(), h.getManagerId(), startingPrice);
    }
}
