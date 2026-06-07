package com.stayease.room.dto;

import jakarta.validation.constraints.NotNull;

public record RoomStatusRequest(@NotNull Long userId, @NotNull Boolean isActive) {
}
