package com.stayease.hotel.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stayease.hotel.dto.HotelRequest;
import com.stayease.hotel.dto.HotelResponse;
import com.stayease.hotel.service.HotelService;
import com.stayease.security.JwtService;
import com.stayease.security.SecurityConfig;
import com.stayease.security.TokenUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
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
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HotelController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
    "app.cors.allowed-origins=http://localhost:3000"
})
class HotelControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private HotelService hotelService;

  @MockBean
  private JwtService jwtService;

  @MockBean
  private TokenUtils tokenUtils;

  @Test
  void list_shouldReturn200ForPublicEndpoint() throws Exception {
    HotelResponse h1 = new HotelResponse(1L, "Stay Prime", "Kolkata", 4, "desc", "img", 10L, new BigDecimal("1200"));
    HotelResponse h2 = new HotelResponse(2L, "River View", "Kolkata", 5, "desc2", "img2", 11L, new BigDecimal("2500"));

    when(hotelService.listByCity(eq("Kolkata"), eq(LocalDate.of(2026, 7, 25)), eq(LocalDate.of(2026, 7, 28))))
        .thenReturn(List.of(h1, h2));

    mockMvc.perform(get("/api/hotels")
        .param("city", "Kolkata")
        .param("checkIn", "2026-07-25")
        .param("checkOut", "2026-07-28"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Stay Prime"))
        .andExpect(jsonPath("$[1].id").value(2));
  }

  @Test
  void get_shouldReturn200ForPublicEndpoint() throws Exception {
    HotelResponse h = new HotelResponse(7L, "Lake Inn", "Pune", 3, "budget", "img", 20L, new BigDecimal("999"));
    when(hotelService.get(7L)).thenReturn(h);

    mockMvc.perform(get("/api/hotels/7"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(7))
        .andExpect(jsonPath("$.city").value("Pune"));
  }

  @Test
  void listAll_shouldReturn403WhenUnauthenticated() throws Exception {
    mockMvc.perform(get("/api/hotels/all"))
        .andExpect(status().isForbidden());

    verify(hotelService, never()).listAll();
  }

  @Test
  void listAll_shouldReturn200ForAdmin() throws Exception {
    HotelResponse h = new HotelResponse(3L, "Metro Suites", "Delhi", 4, "desc", "img", 30L, new BigDecimal("1800"));
    when(hotelService.listAll()).thenReturn(List.of(h));

    mockMvc.perform(get("/api/hotels/all")
        .with(user("admin@stayease.com").roles("ADMIN")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(3));
  }

  @Test
  void create_shouldReturn403ForNonAdmin() throws Exception {
    HotelRequest req = new HotelRequest("Skyline", "Mumbai", 5, "desc", "img", 100L);

    mockMvc.perform(post("/api/hotels")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req))
        .with(user("guest@stayease.com").roles("GUEST")))
        .andExpect(status().isForbidden());

    verify(hotelService, never()).create(any(HotelRequest.class));
  }

  @Test
  void create_shouldReturn201ForAdmin() throws Exception {
    HotelRequest req = new HotelRequest("Skyline", "Mumbai", 5, "desc", "img", 100L);
    HotelResponse res = new HotelResponse(15L, "Skyline", "Mumbai", 5, "desc", "img", 100L, new BigDecimal("4000"));
    when(hotelService.create(any(HotelRequest.class))).thenReturn(res);

    mockMvc.perform(post("/api/hotels")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req))
        .with(user("admin@stayease.com").roles("ADMIN")))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(15))
        .andExpect(jsonPath("$.name").value("Skyline"));
  }

  @Test
  void create_shouldReturn400ForInvalidPayload() throws Exception {
    HotelRequest invalid = new HotelRequest("", "", 9, "desc", "img", null);

    mockMvc.perform(post("/api/hotels")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(invalid))
        .with(user("admin@stayease.com").roles("ADMIN")))
        .andExpect(status().isBadRequest());

    verify(hotelService, never()).create(any(HotelRequest.class));
  }

  @Test
  void update_shouldReturn200ForAdmin() throws Exception {
    HotelRequest req = new HotelRequest("Updated", "Bengaluru", 4, "desc", "img", 90L);
    HotelResponse res = new HotelResponse(21L, "Updated", "Bengaluru", 4, "desc", "img", 90L, new BigDecimal("3200"));
    when(hotelService.update(eq(21L), any(HotelRequest.class))).thenReturn(res);

    mockMvc.perform(put("/api/hotels/21")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req))
        .with(user("admin@stayease.com").roles("ADMIN")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(21))
        .andExpect(jsonPath("$.city").value("Bengaluru"));
  }

  @Test
  void delete_shouldReturn204ForAdmin() throws Exception {
    mockMvc.perform(delete("/api/hotels/31")
        .with(user("admin@stayease.com").roles("ADMIN")))
        .andExpect(status().isNoContent());

    verify(hotelService).delete(31L);
  }
}
