package com.stayease.user.controller;

import com.stayease.security.JwtService;
import com.stayease.security.TokenUtils;
import com.stayease.user.dto.*;
import com.stayease.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;
    private final TokenUtils tokenUtils;

    @PostMapping("/register")
    @Operation(summary = "Register a new GUEST user")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(201).body(userService.register(req));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate and obtain a JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(userService.login(req));
    }

    @PostMapping("/logout")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Invalidate the supplied JWT token (logout)")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.status(403).body(Map.of("message", "Forbidden: missing bearer token"));
        }
        String token = header.substring(7);
        try {
            var claims = jwtService.parse(token);
            tokenUtils.revoke(token, claims);
            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("message", "Forbidden: invalid token"));
        }
    }
}
