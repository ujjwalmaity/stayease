package com.stayease.common;

import jakarta.validation.constraints.NotNull;

public record UserActionRequest(@NotNull Long userId) {
}
