package com.stayease.hotel.service;

import com.stayease.exception.BadRequestException;
import com.stayease.exception.NotFoundException;
import com.stayease.hotel.dto.HotelRequest;
import com.stayease.hotel.entity.Hotel;
import com.stayease.hotel.repository.HotelRepository;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

  @Mock
  private HotelRepository hotelRepository;

  @Mock
  private RoomRepository roomRepository;

  @Mock
  private UserService userService;

  @InjectMocks
  private HotelService hotelService;

  @Test
  void listAll_shouldMapStartingPrice() {
    Hotel h = Hotel.builder()
        .id(1L)
        .name("Stay Prime")
        .city("Kolkata")
        .starRating(4)
        .managerId(11L)
        .build();

    when(hotelRepository.findAll()).thenReturn(List.of(h));
    when(roomRepository.findStartingPrice(1L)).thenReturn(new BigDecimal("1200"));

    var res = hotelService.listAll();

    assertThat(res).hasSize(1);
    assertThat(res.get(0).id()).isEqualTo(1L);
    assertThat(res.get(0).startingPrice()).isEqualByComparingTo("1200");
  }

  @Test
  void listByCity_shouldRejectBlankCity() {
    assertThatThrownBy(() -> hotelService.listByCity(" ", LocalDate.now().plusDays(1), LocalDate.now().plusDays(2)))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("city is required");
  }

  @Test
  void listByCity_shouldRejectCheckOutNotAfterCheckIn() {
    LocalDate d = LocalDate.now().plusDays(3);

    assertThatThrownBy(() -> hotelService.listByCity("Pune", d, d))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("checkOut must be after checkIn");
  }

  @Test
  void listByCity_shouldRejectPastCheckIn() {
    assertThatThrownBy(() -> hotelService.listByCity("Pune", LocalDate.now().minusDays(1), LocalDate.now().plusDays(1)))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("checkIn cannot be in the past");
  }

  @Test
  void listByCity_shouldReturnAvailableHotelsWithMinPrice() {
    LocalDate checkIn = LocalDate.now().plusDays(2);
    LocalDate checkOut = LocalDate.now().plusDays(4);

    Hotel h = Hotel.builder()
        .id(5L)
        .name("Lake Inn")
        .city("Pune")
        .starRating(3)
        .managerId(12L)
        .build();

    when(hotelRepository.findAvailableByCity("Pune", checkIn, checkOut)).thenReturn(List.of(h));
    when(roomRepository.findStartingPrice(5L)).thenReturn(new BigDecimal("999"));

    var res = hotelService.listByCity("Pune", checkIn, checkOut);

    assertThat(res).hasSize(1);
    assertThat(res.get(0).name()).isEqualTo("Lake Inn");
    assertThat(res.get(0).startingPrice()).isEqualByComparingTo("999");
  }

  @Test
  void get_shouldThrowWhenHotelMissing() {
    when(hotelRepository.findById(404L)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> hotelService.get(404L))
        .isInstanceOf(NotFoundException.class)
        .hasMessageContaining("Hotel not found");
  }

  @Test
  void create_shouldPersistWhenManagerRoleIsManager() {
    User manager = User.builder().id(100L).role(Role.MANAGER).email("m@x.com").name("M").passwordHash("x").build();
    HotelRequest req = new HotelRequest("Skyline", "Mumbai", 5, "desc", "img", 100L);

    when(userService.getById(100L)).thenReturn(manager);
    when(hotelRepository.save(any(Hotel.class))).thenAnswer(i -> {
      Hotel saved = i.getArgument(0);
      saved.setId(10L);
      return saved;
    });

    var res = hotelService.create(req);

    assertThat(res.id()).isEqualTo(10L);
    assertThat(res.name()).isEqualTo("Skyline");
    assertThat(res.startingPrice()).isNull();
  }

  @Test
  void create_shouldRejectWhenManagerRoleIsNotManager() {
    User guest = User.builder().id(101L).role(Role.GUEST).email("g@x.com").name("G").passwordHash("x").build();
    HotelRequest req = new HotelRequest("Skyline", "Mumbai", 5, "desc", "img", 101L);

    when(userService.getById(101L)).thenReturn(guest);

    assertThatThrownBy(() -> hotelService.create(req))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("managerId must belong to a MANAGER user");

    verify(hotelRepository, never()).save(any(Hotel.class));
  }

  @Test
  void update_shouldModifyHotelAndReturnMinPrice() {
    User manager = User.builder().id(200L).role(Role.MANAGER).email("m2@x.com").name("M2").passwordHash("x").build();
    Hotel existing = Hotel.builder()
        .id(21L)
        .name("Old")
        .city("OldCity")
        .starRating(2)
        .description("old")
        .coverImageUrl("old-img")
        .managerId(300L)
        .build();
    HotelRequest req = new HotelRequest("Updated", "Bengaluru", 4, "new", "new-img", 200L);

    when(userService.getById(200L)).thenReturn(manager);
    when(hotelRepository.findById(21L)).thenReturn(Optional.of(existing));
    when(hotelRepository.save(any(Hotel.class))).thenAnswer(i -> i.getArgument(0));
    when(roomRepository.findStartingPrice(21L)).thenReturn(new BigDecimal("3200"));

    var res = hotelService.update(21L, req);

    assertThat(res.id()).isEqualTo(21L);
    assertThat(res.name()).isEqualTo("Updated");
    assertThat(res.city()).isEqualTo("Bengaluru");
    assertThat(res.starRating()).isEqualTo(4);
    assertThat(res.startingPrice()).isEqualByComparingTo("3200");
  }

  @Test
  void delete_shouldRemoveExistingHotel() {
    Hotel existing = Hotel.builder().id(31L).name("ToDelete").city("Delhi").starRating(3).build();
    when(hotelRepository.findById(31L)).thenReturn(Optional.of(existing));

    hotelService.delete(31L);

    verify(hotelRepository).delete(existing);
  }

  @Test
  void delete_shouldThrowWhenHotelNotFound() {
    when(hotelRepository.findById(99L)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> hotelService.delete(99L))
        .isInstanceOf(NotFoundException.class)
        .hasMessageContaining("Hotel not found");

    verify(hotelRepository, never()).delete(any(Hotel.class));
  }

  @Test
  void listByManager_shouldReturnManagedHotelsWithMinPrice() {
    Hotel h = Hotel.builder().id(41L).name("Manager Hotel").city("Goa").starRating(5).managerId(501L).build();

    when(hotelRepository.findByManagerId(501L)).thenReturn(List.of(h));
    when(roomRepository.findStartingPrice(41L)).thenReturn(new BigDecimal("4500"));

    var res = hotelService.listByManager(501L);

    assertThat(res).hasSize(1);
    assertThat(res.get(0).managerId()).isEqualTo(501L);
    assertThat(res.get(0).startingPrice()).isEqualByComparingTo("4500");
    verify(roomRepository).findStartingPrice(eq(41L));
  }
}
