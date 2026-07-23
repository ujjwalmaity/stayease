package com.stayease.room.service;

import com.stayease.exception.BadRequestException;
import com.stayease.exception.ForbiddenException;
import com.stayease.exception.NotFoundException;
import com.stayease.hotel.dto.HotelResponse;
import com.stayease.hotel.entity.Hotel;
import com.stayease.hotel.service.HotelService;
import com.stayease.room.dto.RoomRequest;
import com.stayease.room.entity.Room;
import com.stayease.room.entity.RoomType;
import com.stayease.room.repository.RoomRepository;
import com.stayease.user.entity.Role;
import com.stayease.user.entity.User;
import com.stayease.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

  @Mock
  private RoomRepository roomRepository;

  @Mock
  private HotelService hotelService;

  @Mock
  private UserService userService;

  @InjectMocks
  private RoomService roomService;

  @Test
  void getHotelsByManager_shouldDelegateToHotelService() {
    HotelResponse h = new HotelResponse(1L, "Manager Hotel", "Goa", 5, "desc", "img", 7L, new BigDecimal("2500"));
    when(hotelService.listByManager(7L)).thenReturn(List.of(h));

    var res = roomService.getHotelsByManager(7L);

    assertThat(res).hasSize(1);
    assertThat(res.get(0).id()).isEqualTo(1L);
    verify(hotelService).listByManager(7L);
  }

  @Test
  void listByHotel_shouldMapRooms() {
    Hotel hotel = hotel(10L, 99L, "Stay Prime");
    Room room = room(1L, hotel, "101", RoomType.DOUBLE, "1500", 2, true);
    when(roomRepository.findByHotelId(10L)).thenReturn(List.of(room));

    var res = roomService.listByHotel(10L);

    assertThat(res).hasSize(1);
    assertThat(res.get(0).hotelId()).isEqualTo(10L);
    assertThat(res.get(0).roomNumber()).isEqualTo("101");
  }

  @Test
  void listByManager_shouldRejectNonManagerUser() {
    when(userService.getById(44L)).thenReturn(user(44L, Role.GUEST));

    assertThatThrownBy(() -> roomService.listByManager(44L))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("managerId must belong to a MANAGER user");
  }

  @Test
  void listByManager_shouldReturnRoomsForManager() {
    Hotel hotel = hotel(12L, 55L, "Lake Inn");
    Room room = room(2L, hotel, "201", RoomType.SINGLE, "900", 1, true);
    when(userService.getById(55L)).thenReturn(user(55L, Role.MANAGER));
    when(roomRepository.findByManagerId(55L)).thenReturn(List.of(room));

    var res = roomService.listByManager(55L);

    assertThat(res).hasSize(1);
    assertThat(res.get(0).id()).isEqualTo(2L);
    assertThat(res.get(0).hotelName()).isEqualTo("Lake Inn");
  }

  @Test
  void listAvailable_shouldRejectWhenCheckOutNotAfterCheckIn() {
    LocalDate checkIn = LocalDate.now().plusDays(3);
    LocalDate checkOut = LocalDate.now().plusDays(3);

    assertThatThrownBy(() -> roomService.listAvailable(10L, checkIn, checkOut))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("checkOut must be after checkIn");
  }

  @Test
  void listAvailable_shouldRejectPastCheckIn() {
    assertThatThrownBy(() -> roomService.listAvailable(10L, LocalDate.now().minusDays(1), LocalDate.now().plusDays(1)))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("checkIn cannot be in the past");
  }

  @Test
  void listAvailable_shouldReturnRoomsForValidDates() {
    LocalDate checkIn = LocalDate.now().plusDays(2);
    LocalDate checkOut = LocalDate.now().plusDays(5);
    Hotel hotel = hotel(10L, 55L, "Stay Prime");
    Room room = room(3L, hotel, "301", RoomType.SUITE, "3500", 3, true);
    when(roomRepository.findAvailable(10L, checkIn, checkOut)).thenReturn(List.of(room));

    var res = roomService.listAvailable(10L, checkIn, checkOut);

    assertThat(res).hasSize(1);
    assertThat(res.get(0).roomType()).isEqualTo(RoomType.SUITE);
  }

  @Test
  void getEntity_shouldThrowWhenMissing() {
    when(roomRepository.findById(404L)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> roomService.getEntity(404L))
        .isInstanceOf(NotFoundException.class)
        .hasMessageContaining("Room not found");
  }

  @Test
  void getEntityForUpdate_shouldThrowWhenMissing() {
    when(roomRepository.findByIdForUpdate(404L)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> roomService.getEntityForUpdate(404L))
        .isInstanceOf(NotFoundException.class)
        .hasMessageContaining("Room not found");
  }

  @Test
  void create_shouldDefaultIsActiveTrueWhenNull() {
    Hotel hotel = hotel(21L, 55L, "City Hotel");
    RoomRequest req = new RoomRequest("401", RoomType.DOUBLE, new BigDecimal("1800"), 2, "desc", "img", null);

    when(hotelService.getEntity(21L)).thenReturn(hotel);
    when(userService.getById(55L)).thenReturn(user(55L, Role.MANAGER));
    when(roomRepository.save(any(Room.class))).thenAnswer(i -> {
      Room saved = i.getArgument(0);
      saved.setId(11L);
      return saved;
    });

    var res = roomService.create(21L, req, 55L);

    assertThat(res.id()).isEqualTo(11L);
    assertThat(res.isActive()).isTrue();
  }

  @Test
  void create_shouldThrowForbiddenWhenUserNotHotelManager() {
    Hotel hotel = hotel(21L, 99L, "City Hotel");
    RoomRequest req = new RoomRequest("401", RoomType.DOUBLE, new BigDecimal("1800"), 2, "desc", "img", true);

    when(hotelService.getEntity(21L)).thenReturn(hotel);
    when(userService.getById(55L)).thenReturn(user(55L, Role.MANAGER));

    assertThatThrownBy(() -> roomService.create(21L, req, 55L))
        .isInstanceOf(ForbiddenException.class)
        .hasMessageContaining("You are not the manager of this hotel");

    verify(roomRepository, never()).save(any(Room.class));
  }

  @Test
  void update_shouldChangeFieldsAndPreserveActiveWhenNull() {
    Hotel hotel = hotel(30L, 55L, "Grand");
    Room existing = room(5L, hotel, "501", RoomType.SINGLE, "1100", 1, true);
    RoomRequest req = new RoomRequest("502", RoomType.SUITE, new BigDecimal("5000"), 4, "new", "new-img", null);

    when(roomRepository.findById(5L)).thenReturn(Optional.of(existing));
    when(userService.getById(55L)).thenReturn(user(55L, Role.MANAGER));
    when(roomRepository.save(any(Room.class))).thenAnswer(i -> i.getArgument(0));

    var res = roomService.update(5L, req, 55L);

    assertThat(res.roomNumber()).isEqualTo("502");
    assertThat(res.roomType()).isEqualTo(RoomType.SUITE);
    assertThat(res.isActive()).isTrue();
  }

  @Test
  void delete_shouldRemoveWhenManagerOwnsHotel() {
    Hotel hotel = hotel(40L, 55L, "Delete Hotel");
    Room existing = room(9L, hotel, "601", RoomType.DOUBLE, "1700", 2, true);

    when(roomRepository.findById(9L)).thenReturn(Optional.of(existing));
    when(userService.getById(55L)).thenReturn(user(55L, Role.MANAGER));

    roomService.delete(9L, 55L);

    verify(roomRepository).delete(existing);
  }

  @Test
  void toggleActive_shouldUpdateAndReturnRoom() {
    Hotel hotel = hotel(50L, 55L, "Skyline");
    Room existing = room(10L, hotel, "701", RoomType.DOUBLE, "2200", 2, true);

    when(roomRepository.findById(10L)).thenReturn(Optional.of(existing));
    when(userService.getById(55L)).thenReturn(user(55L, Role.MANAGER));
    when(roomRepository.save(any(Room.class))).thenAnswer(i -> i.getArgument(0));

    var res = roomService.toggleActive(10L, false, 55L);

    assertThat(res.id()).isEqualTo(10L);
    assertThat(res.isActive()).isFalse();
  }

  private static Hotel hotel(Long id, Long managerId, String name) {
    return Hotel.builder()
        .id(id)
        .name(name)
        .city("City")
        .starRating(4)
        .managerId(managerId)
        .build();
  }

  private static Room room(Long id, Hotel hotel, String roomNumber, RoomType type, String price, Integer occupancy,
      boolean active) {
    return Room.builder()
        .id(id)
        .hotel(hotel)
        .roomNumber(roomNumber)
        .roomType(type)
        .pricePerNight(new BigDecimal(price))
        .maxOccupancy(occupancy)
        .description("desc")
        .imageUrl("img")
        .isActive(active)
        .build();
  }

  private static User user(Long id, Role role) {
    return User.builder()
        .id(id)
        .email("u@stayease.com")
        .name("User")
        .passwordHash("hash")
        .role(role)
        .build();
  }
}
