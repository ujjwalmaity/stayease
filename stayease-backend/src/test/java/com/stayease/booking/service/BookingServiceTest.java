package com.stayease.booking.service;

import com.stayease.booking.dto.BookingRequest;
import com.stayease.booking.dto.BookingResponse;
import com.stayease.booking.entity.*;
import com.stayease.booking.repository.BookingRepository;
import com.stayease.exception.BadRequestException;
import com.stayease.exception.ForbiddenException;
import com.stayease.exception.NotFoundException;
import com.stayease.hotel.entity.Hotel;
import com.stayease.room.entity.*;
import com.stayease.room.service.RoomService;
import com.stayease.user.entity.*;
import com.stayease.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock
    BookingRepository bookingRepository;
    @Mock
    RoomService roomService;
    @Mock
    UserService userService;
    @InjectMocks
    BookingService bookingService;

    @Test
    void rejectsCheckOutBeforeCheckIn() {
        var req = new BookingRequest(1L, 1L, LocalDate.now().plusDays(3), LocalDate.now().plusDays(1));
        assertThatThrownBy(() -> bookingService.create(req, 10L)).isInstanceOf(BadRequestException.class)
                .hasMessageContaining("checkOut must be after checkIn");
    }

    @Test
    void rejectsPastCheckIn() {
        var req = new BookingRequest(1L, 1L, LocalDate.now().minusDays(1), LocalDate.now().plusDays(2));
        assertThatThrownBy(() -> bookingService.create(req, 10L)).isInstanceOf(BadRequestException.class)
                .hasMessageContaining("checkIn cannot be in the past");
    }

    @Test
    void createsBookingWithCorrectTotal() {
        Hotel h = Hotel.builder().id(1L).name("H").build();
        Room r = Room.builder().id(1L).hotel(h).pricePerNight(new BigDecimal("1000")).maxOccupancy(2)
                .roomNumber("101").roomType(RoomType.DOUBLE).isActive(true).build();
        User u = User.builder().id(10L).email("g@x.com").name("G").role(Role.GUEST).build();
        when(roomService.getEntityForUpdate(1L)).thenReturn(r);
        when(bookingRepository.countOverlapping(eq(1L), any(), any())).thenReturn(0L);
        when(userService.getById(10L)).thenReturn(u);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));

        var req = new BookingRequest(1L, 1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(4));
        var res = bookingService.create(req, 10L);
        assertThat(res.totalPrice()).isEqualByComparingTo("3000");
        assertThat(res.status()).isEqualTo(BookingStatus.CONFIRMED);
        assertThat(res.bookingRef()).startsWith("BK-");
    }

    @Test
    void rejectsRoomFromDifferentHotel() {
        Hotel h = Hotel.builder().id(2L).name("Other").build();
        Room r = Room.builder().id(1L).hotel(h).pricePerNight(new BigDecimal("1000")).maxOccupancy(2)
                .roomNumber("101").roomType(RoomType.DOUBLE).isActive(true).build();
        when(roomService.getEntityForUpdate(1L)).thenReturn(r);

        var req = new BookingRequest(1L, 1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(4));
        assertThatThrownBy(() -> bookingService.create(req, 10L)).isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Room does not belong to selected hotel");
    }

    @Test
    void rejectsInactiveRoom() {
        Hotel h = Hotel.builder().id(1L).name("H").build();
        Room r = Room.builder().id(1L).hotel(h).pricePerNight(new BigDecimal("1000")).maxOccupancy(2)
                .roomNumber("101").roomType(RoomType.DOUBLE).isActive(false).build();
        when(roomService.getEntityForUpdate(1L)).thenReturn(r);

        var req = new BookingRequest(1L, 1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(3));
        assertThatThrownBy(() -> bookingService.create(req, 10L)).isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Room is not active");
    }

    @Test
    void rejectsOverlappingBooking() {
        Hotel h = Hotel.builder().id(1L).name("H").build();
        Room r = Room.builder().id(1L).hotel(h).pricePerNight(new BigDecimal("1000")).maxOccupancy(2)
                .roomNumber("101").roomType(RoomType.DOUBLE).isActive(true).build();
        when(roomService.getEntityForUpdate(1L)).thenReturn(r);
        when(bookingRepository.countOverlapping(eq(1L), any(), any())).thenReturn(1L);

        var req = new BookingRequest(1L, 1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(3));
        assertThatThrownBy(() -> bookingService.create(req, 10L)).isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Room is not available for selected dates");
    }

    @Test
    void mineReturnsMappedBookings() {
        Booking b1 = booking(1L, 10L, Role.GUEST, 1L, 99L, BookingStatus.CONFIRMED);
        Booking b2 = booking(2L, 10L, Role.GUEST, 2L, 99L, BookingStatus.CANCELLED);
        when(bookingRepository.findByUserIdOrderByCheckInDateDesc(10L)).thenReturn(List.of(b1, b2));

        List<BookingResponse> mine = bookingService.mine(10L);

        assertThat(mine).hasSize(2);
        assertThat(mine.get(0).id()).isEqualTo(1L);
        assertThat(mine.get(1).status()).isEqualTo(BookingStatus.CANCELLED);
    }

    @Test
    void upcomingForManagerRejectsNonManagerRole() {
        when(userService.getById(77L)).thenReturn(user(77L, Role.GUEST));

        assertThatThrownBy(() -> bookingService.upcomingForManager(77L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("managerId must belong to a MANAGER user");
    }

    @Test
    void upcomingForManagerReturnsBookingsForManager() {
        when(userService.getById(88L)).thenReturn(user(88L, Role.MANAGER));
        Booking b = booking(5L, 55L, Role.GUEST, 3L, 88L, BookingStatus.CONFIRMED);
        when(bookingRepository.findUpcomingForManager(eq(88L), any(LocalDate.class))).thenReturn(List.of(b));

        List<BookingResponse> upcoming = bookingService.upcomingForManager(88L);

        assertThat(upcoming).hasSize(1);
        assertThat(upcoming.get(0).hotelId()).isEqualTo(3L);
    }

    @Test
    void cancelRejectsUnknownBooking() {
        when(userService.getById(10L)).thenReturn(user(10L, Role.GUEST));
        when(bookingRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.cancel(404L, 10L))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("Booking not found");
    }

    @Test
    void cancelRejectsOtherUsersBookingForGuest() {
        when(userService.getById(10L)).thenReturn(user(10L, Role.GUEST));
        Booking booking = booking(7L, 11L, Role.GUEST, 1L, 99L, BookingStatus.CONFIRMED);
        when(bookingRepository.findById(7L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.cancel(7L, 10L))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Not your booking");
    }

    @Test
    void cancelAllowsAdminToCancelAnyBooking() {
        when(userService.getById(1L)).thenReturn(user(1L, Role.ADMIN));
        Booking booking = booking(8L, 11L, Role.GUEST, 1L, 99L, BookingStatus.CONFIRMED);
        when(bookingRepository.findById(8L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));

        BookingResponse res = bookingService.cancel(8L, 1L);

        assertThat(res.status()).isEqualTo(BookingStatus.CANCELLED);
    }

    @Test
    void cancelRejectsAlreadyCancelled() {
        when(userService.getById(10L)).thenReturn(user(10L, Role.GUEST));
        Booking booking = booking(9L, 10L, Role.GUEST, 1L, 99L, BookingStatus.CANCELLED);
        when(bookingRepository.findById(9L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.cancel(9L, 10L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Already cancelled");
    }

    @Test
    void cancelAllowsOwnerToCancel() {
        when(userService.getById(10L)).thenReturn(user(10L, Role.GUEST));
        Booking booking = booking(10L, 10L, Role.GUEST, 1L, 99L, BookingStatus.CONFIRMED);
        when(bookingRepository.findById(10L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));

        BookingResponse res = bookingService.cancel(10L, 10L);

        assertThat(res.id()).isEqualTo(10L);
        assertThat(res.status()).isEqualTo(BookingStatus.CANCELLED);
        verify(bookingRepository).save(booking);
    }

    private static Booking booking(Long id, Long userId, Role userRole, Long hotelId, Long managerId,
            BookingStatus status) {
        Hotel hotel = Hotel.builder().id(hotelId).name("H").managerId(managerId).build();
        Room room = Room.builder().id(1L).hotel(hotel).roomNumber("101").roomType(RoomType.DOUBLE)
                .pricePerNight(new BigDecimal("1000")).maxOccupancy(2).isActive(true).build();
        User user = user(userId, userRole);
        return Booking.builder()
                .id(id)
                .bookingRef("BK-TEST")
                .user(user)
                .room(room)
                .checkInDate(LocalDate.now().plusDays(1))
                .checkOutDate(LocalDate.now().plusDays(3))
                .totalPrice(new BigDecimal("2000"))
                .status(status)
                .build();
    }

    private static User user(Long id, Role role) {
        return User.builder().id(id).email("u@x.com").name("U").passwordHash("h").role(role).build();
    }
}
