package com.stayease.security;

import lombok.*;

@Getter
@AllArgsConstructor
public class AppUserPrincipal {
    private final Long id;
    private final String email;
    private final String role;
}
