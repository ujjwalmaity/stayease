package com.stayease;
import com.stayease.booking.dto.BookingRequest;
import com.stayease.booking.entity.*;
import com.stayease.booking.repository.BookingRepository;
import com.stayease.booking.service.BookingService;
import com.stayease.exception.BadRequestException;
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
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock BookingRepository bookingRepository;
    @Mock RoomService roomService;
    @Mock UserService userService;
    @InjectMocks BookingService bookingService;

    @Test void rejectsCheckOutBeforeCheckIn(){
        var req = new BookingRequest(1L, 1L, LocalDate.now().plusDays(3), LocalDate.now().plusDays(1));
        assertThatThrownBy(() -> bookingService.create(req, 10L)).isInstanceOf(BadRequestException.class);
    }

    @Test void createsBookingWithCorrectTotal(){
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
    }

    @Test void rejectsRoomFromDifferentHotel(){
        Hotel h = Hotel.builder().id(2L).name("Other").build();
        Room r = Room.builder().id(1L).hotel(h).pricePerNight(new BigDecimal("1000")).maxOccupancy(2)
                  .roomNumber("101").roomType(RoomType.DOUBLE).isActive(true).build();
        when(roomService.getEntityForUpdate(1L)).thenReturn(r);

        var req = new BookingRequest(1L, 1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(4));
        assertThatThrownBy(() -> bookingService.create(req, 10L)).isInstanceOf(BadRequestException.class);
    }
}
