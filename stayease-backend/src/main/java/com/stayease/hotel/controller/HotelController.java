package com.stayease.hotel.controller;

import com.stayease.hotel.dto.*;
import com.stayease.hotel.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@Tag(name = "Hotels")
@SecurityRequirement(name = "bearerAuth")
public class HotelController {
    private final HotelService hotelService;

    @GetMapping
    @Operation(summary = "List hotels (any authenticated user). Requires Bearer JWT.")
    public List<HotelResponse> list(@RequestParam(required = false) String city) {
        return hotelService.listByCity(city);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hotel by id (any authenticated user). Requires Bearer JWT.")
    public HotelResponse get(@PathVariable Long id) {
        return hotelService.get(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create hotel — ADMIN only. Returns 403 if token missing/invalid or role is not ADMIN.")
    public ResponseEntity<HotelResponse> create(@Valid @RequestBody HotelRequest req) {
        return ResponseEntity.status(201).body(hotelService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update hotel — ADMIN only. Returns 403 if token missing/invalid or role is not ADMIN.")
    public HotelResponse update(@PathVariable Long id, @Valid @RequestBody HotelRequest req) {
        return hotelService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete hotel — ADMIN only. Returns 403 if token missing/invalid or role is not ADMIN.")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        hotelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
