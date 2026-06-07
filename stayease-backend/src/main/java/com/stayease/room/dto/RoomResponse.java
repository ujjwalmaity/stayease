package com.stayease.room.dto;

import com.stayease.room.entity.Room;
import com.stayease.room.entity.RoomType;

import java.math.BigDecimal;

public record RoomResponse(Long id, Long hotelId, String roomNumber, RoomType roomType,
                           BigDecimal pricePerNight, Integer maxOccupancy, String description,
                           String imageUrl, boolean isActive) {
    public static RoomResponse from(Room r) {
        return new RoomResponse(r.getId(), r.getHotel().getId(), r.getRoomNumber(), r.getRoomType(),
            r.getPricePerNight(), r.getMaxOccupancy(), r.getDescription(), r.getImageUrl(), r.isActive());
    }
}
