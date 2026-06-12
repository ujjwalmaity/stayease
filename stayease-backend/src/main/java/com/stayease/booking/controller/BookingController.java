package com.stayease.booking.controller;

import com.stayease.booking.dto.*;
import com.stayease.booking.service.BookingService;
import com.stayease.security.AppUserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a booking — any authenticated user.")
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest req,
                                                  Authentication auth) {
        Long userId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        return ResponseEntity.status(201).body(bookingService.create(req, userId));
    }

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List my bookings.")
    public List<BookingResponse> mine(Authentication auth) {
        Long userId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        return bookingService.mine(userId);
    }

    @GetMapping("/manager/upcoming")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Upcoming bookings for all hotels of the logged-in manager — MANAGER only.")
    public List<BookingResponse> upcomingForManager(Authentication auth) {
        Long managerId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        return bookingService.upcomingForManager(managerId);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel one of my bookings.")
    public BookingResponse cancel(@PathVariable Long id, Authentication auth) {
        Long userId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        return bookingService.cancel(id, userId);
    }
}
