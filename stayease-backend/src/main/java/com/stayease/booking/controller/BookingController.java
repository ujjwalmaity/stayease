package com.stayease.booking.controller;

import com.stayease.booking.dto.*;
import com.stayease.booking.service.BookingService;
import com.stayease.common.UserActionRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
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
    @PreAuthorize("isAuthenticated() and #req.userId() == authentication.principal.id")
    @Operation(summary = "Create a booking (any authenticated user). Requires Bearer JWT.")
    public ResponseEntity<BookingResponse> create(@P("req") @Valid @RequestBody BookingRequest req) {
        return ResponseEntity.status(201).body(bookingService.create(req));
    }

    @GetMapping("/mine/{userId}")
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.id")
    @Operation(summary = "List my bookings. Requires Bearer JWT.")
    public List<BookingResponse> mine(@PathVariable Long userId) {
        return bookingService.mine(userId);
    }

    @GetMapping("/hotel/{hotelId}/upcoming")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN') and #userId == authentication.principal.id")
    @Operation(summary = "Upcoming bookings for a hotel — MANAGER or ADMIN. Returns 403 otherwise.")
    public List<BookingResponse> upcoming(@PathVariable Long hotelId,
                                          @RequestParam Long userId) {
        return bookingService.upcomingForHotel(hotelId, userId);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated() and #req.userId() == authentication.principal.id")
    @Operation(summary = "Cancel one of my bookings. Requires Bearer JWT.")
    public BookingResponse cancel(@PathVariable Long id, @P("req") @Valid @RequestBody UserActionRequest req) {
        return bookingService.cancel(id, req.userId());
    }
}
