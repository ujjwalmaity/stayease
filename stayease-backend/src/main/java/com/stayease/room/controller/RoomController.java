package com.stayease.room.controller;

import com.stayease.room.dto.*;
import com.stayease.room.service.RoomService;
import com.stayease.security.AppUserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Rooms")
@SecurityRequirement(name = "bearerAuth")
public class RoomController {
    private final RoomService roomService;

    @GetMapping("/api/hotels/{hotelId}/rooms")
    @Operation(summary = "List rooms for a hotel. Pass checkIn & checkOut for availability filter.")
    public List<RoomResponse> rooms(@PathVariable Long hotelId,
                                    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
                                    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        if (checkIn != null && checkOut != null) return roomService.listAvailable(hotelId, checkIn, checkOut);
        return roomService.listByHotel(hotelId);
    }

    @GetMapping("/api/manager/rooms")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "List all rooms for the logged-in manager — MANAGER only.")
    public List<RoomResponse> roomsForManager(Authentication auth) {
        Long managerId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        return roomService.listByManager(managerId);
    }

    @GetMapping("/api/manager/hotels")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "List hotels belonging to the logged-in manager — MANAGER only.")
    public List<com.stayease.hotel.dto.HotelResponse> hotelsForManager(Authentication auth) {
        Long managerId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        return roomService.getHotelsByManager(managerId);
    }

    @PostMapping("/api/hotels/{hotelId}/rooms")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Create a room for a hotel — MANAGER only.")
    public ResponseEntity<RoomResponse> create(@PathVariable Long hotelId,
                                               @Valid @RequestBody RoomRequest req,
                                               Authentication auth) {
        Long managerId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        return ResponseEntity.status(201).body(roomService.create(hotelId, req, managerId));
    }

    @PutMapping("/api/rooms/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Update a room — MANAGER only.")
    public RoomResponse update(@PathVariable Long id,
                               @Valid @RequestBody RoomRequest req,
                               Authentication auth) {
        Long managerId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        return roomService.update(id, req, managerId);
    }

    @DeleteMapping("/api/rooms/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Delete a room — MANAGER only.")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        Long managerId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        roomService.delete(id, managerId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/rooms/{id}/status")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Toggle room isActive — MANAGER only.")
    public RoomResponse toggle(@PathVariable Long id,
                               @Valid @RequestBody RoomStatusRequest req,
                               Authentication auth) {
        Long managerId = ((AppUserPrincipal) auth.getPrincipal()).getId();
        return roomService.toggleActive(id, req.isActive(), managerId);
    }
}
