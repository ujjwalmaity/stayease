package com.stayease.room.controller;

import com.stayease.common.UserActionRequest;
import com.stayease.room.dto.*;
import com.stayease.room.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
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
    @Operation(summary = "List rooms for a hotel (any authenticated user). Requires Bearer JWT.")
    public List<RoomResponse> rooms(@PathVariable Long hotelId,
                                    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
                                    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        if (checkIn != null && checkOut != null) return roomService.listAvailable(hotelId, checkIn, checkOut);
        return roomService.listByHotel(hotelId);
    }

    @PostMapping("/api/hotels/{hotelId}/rooms")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN') and #req.userId() == authentication.principal.id")
    @Operation(summary = "Create room — MANAGER or ADMIN. Returns 403 if token missing/invalid or role is insufficient.")
    public ResponseEntity<RoomResponse> create(@PathVariable Long hotelId,
                                               @P("req") @Valid @RequestBody RoomRequest req) {
        return ResponseEntity.status(201).body(roomService.create(hotelId, req));
    }

    @PutMapping("/api/rooms/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN') and #req.userId() == authentication.principal.id")
    @Operation(summary = "Update room — MANAGER or ADMIN. Returns 403 if token missing/invalid or role is insufficient.")
    public RoomResponse update(@PathVariable Long id,
                               @P("req") @Valid @RequestBody RoomRequest req) {
        return roomService.update(id, req);
    }

    @DeleteMapping("/api/rooms/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN') and #req.userId() == authentication.principal.id")
    @Operation(summary = "Delete room — MANAGER or ADMIN. Returns 403 if token missing/invalid or role is insufficient.")
    public ResponseEntity<Void> delete(@PathVariable Long id, @P("req") @Valid @RequestBody UserActionRequest req) {
        roomService.delete(id, req.userId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/rooms/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN') and #req.userId() == authentication.principal.id")
    @Operation(summary = "Toggle room isActive — MANAGER or ADMIN. Returns 403 if token missing/invalid or role is insufficient.")
    public RoomResponse toggle(@PathVariable Long id,
                               @P("req") @Valid @RequestBody RoomStatusRequest req) {
        return roomService.toggleActive(id, req);
    }
}
