package com.stayease.user.dto;

public record AuthResponse(String token, Long userId, String email, String name, String role) {
}
