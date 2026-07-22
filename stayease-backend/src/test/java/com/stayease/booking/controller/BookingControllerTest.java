package com.stayease.booking.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stayease.booking.dto.BookingRequest;
import com.stayease.booking.dto.BookingResponse;
import com.stayease.booking.entity.BookingStatus;
import com.stayease.booking.service.BookingService;
import com.stayease.room.entity.RoomType;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookingController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
    "app.cors.allowed-origins=http://localhost:3000"
})
class BookingControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private BookingService bookingService;

  @MockBean
  private JwtService jwtService;

  @MockBean
  private TokenUtils tokenUtils;

  @Test
  void create_shouldReturn403WhenUnauthenticated() throws Exception {
    BookingRequest req = new BookingRequest(1L, 1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(3));

    mockMvc.perform(post("/api/bookings")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isForbidden());

    verify(bookingService, never()).create(any(BookingRequest.class), any(Long.class));
  }

  @Test
  void create_shouldReturn201WhenAuthenticated() throws Exception {
    BookingRequest req = new BookingRequest(1L, 2L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(4));
    BookingResponse res = response(10L, 55L, BookingStatus.CONFIRMED);
    when(bookingService.create(any(BookingRequest.class), eq(55L))).thenReturn(res);

    mockMvc.perform(post("/api/bookings")
        .with(authentication(authUser(55L, "GUEST")))
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(10))
        .andExpect(jsonPath("$.userId").value(55))
        .andExpect(jsonPath("$.status").value("CONFIRMED"));
  }

  @Test
  void create_shouldReturn400ForInvalidPayload() throws Exception {
    BookingRequest invalid = new BookingRequest(null, null, LocalDate.now().minusDays(1), null);

    mockMvc.perform(post("/api/bookings")
        .with(authentication(authUser(55L, "GUEST")))
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(invalid)))
        .andExpect(status().isBadRequest());

    verify(bookingService, never()).create(any(BookingRequest.class), any(Long.class));
  }

  @Test
  void mine_shouldReturn403WhenUnauthenticated() throws Exception {
    mockMvc.perform(get("/api/bookings/mine"))
        .andExpect(status().isForbidden());

    verify(bookingService, never()).mine(any(Long.class));
  }

  @Test
  void mine_shouldReturn200WhenAuthenticated() throws Exception {
    BookingResponse r1 = response(11L, 77L, BookingStatus.CONFIRMED);
    BookingResponse r2 = response(12L, 77L, BookingStatus.CANCELLED);
    when(bookingService.mine(77L)).thenReturn(List.of(r1, r2));

    mockMvc.perform(get("/api/bookings/mine")
        .with(authentication(authUser(77L, "GUEST"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(11))
        .andExpect(jsonPath("$[1].status").value("CANCELLED"));
  }

  @Test
  void upcomingForManager_shouldReturn403ForNonManager() throws Exception {
    mockMvc.perform(get("/api/bookings/manager/upcoming")
        .with(authentication(authUser(88L, "GUEST"))))
        .andExpect(status().isForbidden());

    verify(bookingService, never()).upcomingForManager(any(Long.class));
  }

  @Test
  void upcomingForManager_shouldReturn200ForManager() throws Exception {
    BookingResponse r = response(21L, 88L, BookingStatus.CONFIRMED);
    when(bookingService.upcomingForManager(88L)).thenReturn(List.of(r));

    mockMvc.perform(get("/api/bookings/manager/upcoming")
        .with(authentication(authUser(88L, "MANAGER"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(21));
  }

  @Test
  void cancel_shouldReturn403WhenUnauthenticated() throws Exception {
    mockMvc.perform(put("/api/bookings/5/cancel"))
        .andExpect(status().isForbidden());

    verify(bookingService, never()).cancel(any(Long.class), any(Long.class));
  }

  @Test
  void cancel_shouldReturn200WhenAuthenticated() throws Exception {
    BookingResponse cancelled = response(5L, 55L, BookingStatus.CANCELLED);
    when(bookingService.cancel(5L, 55L)).thenReturn(cancelled);

    mockMvc.perform(put("/api/bookings/5/cancel")
        .with(authentication(authUser(55L, "GUEST"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(5))
        .andExpect(jsonPath("$.status").value("CANCELLED"));
  }

  private static Authentication authUser(Long id, String role) {
    AppUserPrincipal principal = new AppUserPrincipal(id, "user@stayease.com", role);
    return new UsernamePasswordAuthenticationToken(
        principal,
        "token",
        List.of(new SimpleGrantedAuthority("ROLE_" + role)));
  }

  private static BookingResponse response(Long id, Long userId, BookingStatus status) {
    return new BookingResponse(
        id,
        "BK-REF-001",
        userId,
        "Guest",
        2L,
        "101",
        RoomType.DOUBLE,
        1L,
        "Stay Prime",
        LocalDate.now().plusDays(1),
        LocalDate.now().plusDays(3),
        new BigDecimal("3000"),
        status);
  }
}
