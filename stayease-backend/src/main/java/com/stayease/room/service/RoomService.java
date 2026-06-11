package com.stayease.room.service;

import com.stayease.exception.*;
import com.stayease.hotel.entity.Hotel;
import com.stayease.hotel.service.HotelService;
import com.stayease.room.dto.*;
import com.stayease.room.entity.Room;
import com.stayease.room.repository.RoomRepository;
import com.stayease.user.entity.Role;
import com.stayease.user.entity.User;
import com.stayease.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final HotelService hotelService;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<RoomResponse> listByHotel(Long hotelId) {
        return roomRepository.findByHotelId(hotelId).stream().map(RoomResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> listByManager(Long managerId) {
        User manager = userService.getById(managerId);
        if (manager.getRole() != Role.MANAGER) {
            throw new BadRequestException("managerId must belong to a MANAGER user");
        }
        return roomRepository.findByManagerId(managerId).stream().map(RoomResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> listAvailable(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        validateDates(checkIn, checkOut);
        return roomRepository.findAvailable(hotelId, checkIn, checkOut).stream().map(RoomResponse::from).toList();
    }

    public Room getEntity(Long id) {
        return roomRepository.findById(id).orElseThrow(() -> new NotFoundException("Room not found"));
    }

    public Room getEntityForUpdate(Long id) {
        return roomRepository.findByIdForUpdate(id).orElseThrow(() -> new NotFoundException("Room not found"));
    }

    @Transactional
    public RoomResponse create(Long hotelId, RoomRequest req) {
        Hotel hotel = hotelService.getEntity(hotelId);
        ensureManagerOf(hotel, req.userId());
        Room r = Room.builder().hotel(hotel).roomNumber(req.roomNumber()).roomType(req.roomType())
                .pricePerNight(req.pricePerNight()).maxOccupancy(req.maxOccupancy())
                .description(req.description()).imageUrl(req.imageUrl())
                .isActive(req.isActive() == null || req.isActive()).build();
        return RoomResponse.from(roomRepository.save(r));
    }

    @Transactional
    public RoomResponse update(Long id, RoomRequest req) {
        Room r = getEntity(id);
        ensureManagerOf(r.getHotel(), req.userId());
        r.setRoomNumber(req.roomNumber());
        r.setRoomType(req.roomType());
        r.setPricePerNight(req.pricePerNight());
        r.setMaxOccupancy(req.maxOccupancy());
        r.setDescription(req.description());
        r.setImageUrl(req.imageUrl());
        if (req.isActive() != null) r.setActive(req.isActive());
        return RoomResponse.from(roomRepository.save(r));
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Room r = getEntity(id);
        ensureManagerOf(r.getHotel(), userId);
        roomRepository.delete(r);
    }

    @Transactional
    public RoomResponse toggleActive(Long id, RoomStatusRequest req) {
        Room r = getEntity(id);
        ensureManagerOf(r.getHotel(), req.userId());
        r.setActive(req.isActive());
        return RoomResponse.from(roomRepository.save(r));
    }

    private void ensureManagerOf(Hotel hotel, Long userId) {
        User user = userService.getById(userId);
        if (user.getRole() != Role.MANAGER || hotel.getManagerId() == null
                || !hotel.getManagerId().equals(user.getId()))
            throw new ForbiddenException("You are not the manager of this hotel");
    }

    private void validateDates(LocalDate ci, LocalDate co) {
        if (ci == null || co == null) throw new BadRequestException("checkIn and checkOut are required");
        if (!co.isAfter(ci)) throw new BadRequestException("checkOut must be after checkIn");
        if (ci.isBefore(LocalDate.now())) throw new BadRequestException("checkIn cannot be in the past");
    }
}
