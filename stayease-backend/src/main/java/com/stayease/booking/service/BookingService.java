package com.stayease.booking.service;

import com.stayease.booking.dto.*;
import com.stayease.booking.entity.*;
import com.stayease.booking.repository.BookingRepository;
import com.stayease.exception.*;
import com.stayease.room.entity.Room;
import com.stayease.room.service.RoomService;
import com.stayease.user.entity.Role;
import com.stayease.user.entity.User;
import com.stayease.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final RoomService roomService;
    private final UserService userService;

    @Transactional
    public BookingResponse create(BookingRequest req, Long userId) {
        LocalDate ci = req.checkInDate(), co = req.checkOutDate();
        if (ci == null || co == null) throw new BadRequestException("Dates required");
        if (!co.isAfter(ci)) throw new BadRequestException("checkOut must be after checkIn");
        if (ci.isBefore(LocalDate.now())) throw new BadRequestException("checkIn cannot be in the past");

        Room room = roomService.getEntityForUpdate(req.roomId());
        if (!room.getHotel().getId().equals(req.hotelId()))
            throw new BadRequestException("Room does not belong to selected hotel");
        if (!room.isActive()) throw new BadRequestException("Room is not active");
        if (bookingRepository.countOverlapping(room.getId(), ci, co) > 0)
            throw new BadRequestException("Room is not available for selected dates");

        long nights = ChronoUnit.DAYS.between(ci, co);
        BigDecimal total = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        User u = userService.getById(userId);
        Booking b = Booking.builder()
                .user(u).room(room).checkInDate(ci).checkOutDate(co)
                .totalPrice(total).status(BookingStatus.CONFIRMED)
                .bookingRef("BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();
        return BookingResponse.from(bookingRepository.save(b));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> mine(Long userId) {
        return bookingRepository.findByUserIdOrderByCheckInDateDesc(userId)
                .stream().map(BookingResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> upcomingForManager(Long managerId) {
        User manager = userService.getById(managerId);
        if (manager.getRole() != Role.MANAGER) {
            throw new BadRequestException("managerId must belong to a MANAGER user");
        }
        return bookingRepository.findUpcomingForManager(managerId, LocalDate.now())
                .stream().map(BookingResponse::from).toList();
    }

    @Transactional
    public BookingResponse cancel(Long id, Long userId) {
        User user = userService.getById(userId);
        Booking b = bookingRepository.findById(id).orElseThrow(() -> new NotFoundException("Booking not found"));
        if (user.getRole() != Role.ADMIN && !b.getUser().getId().equals(user.getId()))
            throw new ForbiddenException("Not your booking");
        if (b.getStatus() == BookingStatus.CANCELLED) throw new BadRequestException("Already cancelled");
        b.setStatus(BookingStatus.CANCELLED);
        return BookingResponse.from(bookingRepository.save(b));
    }
}
