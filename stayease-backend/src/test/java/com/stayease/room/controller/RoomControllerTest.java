package com.stayease.room.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stayease.hotel.dto.HotelResponse;
import com.stayease.room.dto.RoomRequest;
import com.stayease.room.dto.RoomResponse;
import com.stayease.room.service.RoomService;
import com.stayease.security.AppUserPrincipal;
import com.stayease.security.JwtService;
import com.stayease.security.SecurityConfig;
import com.stayease.security.TokenUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoomController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
    "app.cors.allowed-origins=http://localhost:3000"
})
class RoomControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private RoomService roomService;

  @MockBean
  private JwtService jwtService;

  @MockBean
  private TokenUtils tokenUtils;

  @Test
  void rooms_shouldReturnHotelRoomsWhenDatesMissing() throws Exception {
    RoomResponse r = new RoomResponse(1L, 10L, "Stay Prime", "101", com.stayease.room.entity.RoomType.DOUBLE,
        new BigDecimal("1500"), 2, "desc", "img", true);
    when(roomService.listByHotel(10L)).thenReturn(List.of(r));

    mockMvc.perform(get("/api/hotels/10/rooms"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].roomNumber").value("101"));

    verify(roomService).listByHotel(10L);
    verify(roomService, never()).listAvailable(any(Long.class), any(LocalDate.class), any(LocalDate.class));
  }

  @Test
  void rooms_shouldReturnAvailableRoomsWhenDatesProvided() throws Exception {
    LocalDate checkIn = LocalDate.now().plusDays(2);
    LocalDate checkOut = LocalDate.now().plusDays(4);
    RoomResponse r = new RoomResponse(2L, 10L, "Stay Prime", "102", com.stayease.room.entity.RoomType.SUITE,
        new BigDecimal("2500"), 3, "desc", "img", true);

    when(roomService.listAvailable(10L, checkIn, checkOut)).thenReturn(List.of(r));

    mockMvc.perform(get("/api/hotels/10/rooms")
        .param("checkIn", checkIn.toString())
        .param("checkOut", checkOut.toString()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(2))
        .andExpect(jsonPath("$[0].roomType").value("SUITE"));

    verify(roomService).listAvailable(10L, checkIn, checkOut);
  }

  @Test
  void roomsForManager_shouldReturn403WhenUnauthenticated() throws Exception {
    mockMvc.perform(get("/api/manager/rooms"))
        .andExpect(status().isForbidden());

    verify(roomService, never()).listByManager(any(Long.class));
  }

  @Test
  void roomsForManager_shouldReturn200ForManager() throws Exception {
    RoomResponse r = new RoomResponse(3L, 11L, "Lake Inn", "201", com.stayease.room.entity.RoomType.SINGLE,
        new BigDecimal("900"), 1, "desc", "img", true);
    when(roomService.listByManager(55L)).thenReturn(List.of(r));

    mockMvc.perform(get("/api/manager/rooms")
        .with(authentication(managerAuth(55L))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].hotelId").value(11));
  }

  @Test
  void hotelsForManager_shouldReturn200ForManager() throws Exception {
    HotelResponse h = new HotelResponse(7L, "Manager Hotel", "Goa", 5, "desc", "img", 55L, new BigDecimal("3000"));
    when(roomService.getHotelsByManager(55L)).thenReturn(List.of(h));

    mockMvc.perform(get("/api/manager/hotels")
        .with(authentication(managerAuth(55L))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(7))
        .andExpect(jsonPath("$[0].managerId").value(55));
  }

  @Test
  void create_shouldReturn201ForManager() throws Exception {
    RoomRequest req = new RoomRequest("301", com.stayease.room.entity.RoomType.DOUBLE,
        new BigDecimal("1800"), 2, "desc", "img", true);
    RoomResponse res = new RoomResponse(8L, 20L, "City Hotel", "301", com.stayease.room.entity.RoomType.DOUBLE,
        new BigDecimal("1800"), 2, "desc", "img", true);

    when(roomService.create(eq(20L), any(RoomRequest.class), eq(55L))).thenReturn(res);

    mockMvc.perform(post("/api/hotels/20/rooms")
        .with(authentication(managerAuth(55L)))
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(8))
        .andExpect(jsonPath("$.hotelId").value(20));
  }

  @Test
  void create_shouldReturn400ForInvalidPayload() throws Exception {
    RoomRequest invalid = new RoomRequest("", null, new BigDecimal("0"), 0, "desc", "img", true);

    mockMvc.perform(post("/api/hotels/20/rooms")
        .with(authentication(managerAuth(55L)))
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(invalid)))
        .andExpect(status().isBadRequest());

    verify(roomService, never()).create(any(Long.class), any(RoomRequest.class), any(Long.class));
  }

  @Test
  void update_shouldReturn200ForManager() throws Exception {
    RoomRequest req = new RoomRequest("401", com.stayease.room.entity.RoomType.SUITE,
        new BigDecimal("5000"), 4, "updated", "img", true);
    RoomResponse res = new RoomResponse(9L, 21L, "Grand", "401", com.stayease.room.entity.RoomType.SUITE,
        new BigDecimal("5000"), 4, "updated", "img", true);

    when(roomService.update(eq(9L), any(RoomRequest.class), eq(55L))).thenReturn(res);

    mockMvc.perform(put("/api/rooms/9")
        .with(authentication(managerAuth(55L)))
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.roomNumber").value("401"));
  }

  @Test
  void delete_shouldReturn204ForManager() throws Exception {
    mockMvc.perform(delete("/api/rooms/9")
        .with(authentication(managerAuth(55L))))
        .andExpect(status().isNoContent());

    verify(roomService).delete(9L, 55L);
  }

  @Test
  void toggle_shouldReturn200ForManager() throws Exception {
    RoomResponse res = new RoomResponse(10L, 30L, "Skyline", "501", com.stayease.room.entity.RoomType.DOUBLE,
        new BigDecimal("2200"), 2, "desc", "img", false);
    when(roomService.toggleActive(10L, false, 55L)).thenReturn(res);

    mockMvc.perform(patch("/api/rooms/10/status")
        .with(authentication(managerAuth(55L)))
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"isActive\":false}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(10))
        .andExpect(jsonPath("$.isActive").value(false));
  }

  private Authentication managerAuth(Long userId) {
    AppUserPrincipal principal = new AppUserPrincipal(userId, "manager@stayease.com", "MANAGER");
    return new UsernamePasswordAuthenticationToken(
        principal,
        "token",
        List.of(new SimpleGrantedAuthority("ROLE_MANAGER")));
  }
}
