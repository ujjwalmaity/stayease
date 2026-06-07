package com.stayease.common;

import java.time.LocalDateTime;

public record ApiError(LocalDateTime timestamp, String path, String error, String message) {
}
