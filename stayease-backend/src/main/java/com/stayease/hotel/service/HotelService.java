package com.stayease.hotel.service;

import com.stayease.exception.BadRequestException;
import com.stayease.exception.NotFoundException;
import com.stayease.hotel.dto.*;
import com.stayease.hotel.entity.Hotel;
import com.stayease.hotel.repository.HotelRepository;
import com.stayease.room.repository.RoomRepository;
import com.stayease.user.entity.Role;
import com.stayease.user.entity.User;
import com.stayease.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<HotelResponse> listByCity(String city) {
        List<Hotel> hotels = (city == null || city.isBlank())
                ? hotelRepository.findAll()
                : hotelRepository.findByCityIgnoreCase(city);
        return hotels.stream().map(h -> HotelResponse.from(h, minPrice(h.getId()))).toList();
    }

    @Transactional(readOnly = true)
    public HotelResponse get(Long id) {
        Hotel h = hotelRepository.findById(id).orElseThrow(() -> new NotFoundException("Hotel not found"));
        return HotelResponse.from(h, minPrice(id));
    }

    public Hotel getEntity(Long id) {
        return hotelRepository.findById(id).orElseThrow(() -> new NotFoundException("Hotel not found"));
    }

    @Transactional
    public HotelResponse create(HotelRequest req) {
        validateManager(req.managerId());
        Hotel h = Hotel.builder().name(req.name()).city(req.city()).starRating(req.starRating())
                .description(req.description()).coverImageUrl(req.coverImageUrl()).managerId(req.managerId()).build();
        return HotelResponse.from(hotelRepository.save(h), null);
    }

    @Transactional
    public HotelResponse update(Long id, HotelRequest req) {
        validateManager(req.managerId());
        Hotel h = getEntity(id);
        h.setName(req.name());
        h.setCity(req.city());
        h.setStarRating(req.starRating());
        h.setDescription(req.description());
        h.setCoverImageUrl(req.coverImageUrl());
        h.setManagerId(req.managerId());
        return HotelResponse.from(hotelRepository.save(h), minPrice(id));
    }

    @Transactional
    public void delete(Long id) {
        Hotel h = getEntity(id);
        hotelRepository.delete(h);
    }

    private BigDecimal minPrice(Long hotelId) {
        return roomRepository.findStartingPrice(hotelId);
    }

    private void validateManager(Long managerId) {
        User manager = userService.getById(managerId);
        if (manager.getRole() != Role.MANAGER) {
            throw new BadRequestException("managerId must belong to a MANAGER user");
        }
    }
}
