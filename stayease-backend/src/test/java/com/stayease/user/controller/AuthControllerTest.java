package com.stayease.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stayease.security.JwtService;
import com.stayease.security.TokenUtils;
import com.stayease.user.dto.AuthResponse;
import com.stayease.user.dto.LoginRequest;
import com.stayease.user.dto.RegisterRequest;
import com.stayease.user.service.UserService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private UserService userService;

  @MockBean
  private JwtService jwtService;

  @MockBean
  private TokenUtils tokenUtils;

  @Test
  void register_shouldReturn201() throws Exception {
    RegisterRequest req = new RegisterRequest("guest@stayease.com", "secret123", "Guest User");
    AuthResponse res = new AuthResponse("jwt-token", 1L, "guest@stayease.com", "Guest User", "GUEST");
    when(userService.register(any(RegisterRequest.class))).thenReturn(res);

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.token").value("jwt-token"))
        .andExpect(jsonPath("$.userId").value(1))
        .andExpect(jsonPath("$.role").value("GUEST"));
  }

  @Test
  void register_shouldReturn400ForInvalidPayload() throws Exception {
    RegisterRequest invalid = new RegisterRequest("bad-email", "123", "");

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(invalid)))
        .andExpect(status().isBadRequest());

    verify(userService, never()).register(any(RegisterRequest.class));
  }

  @Test
  void login_shouldReturn200() throws Exception {
    LoginRequest req = new LoginRequest("guest@stayease.com", "secret123");
    AuthResponse res = new AuthResponse("jwt-token", 1L, "guest@stayease.com", "Guest User", "GUEST");
    when(userService.login(any(LoginRequest.class))).thenReturn(res);

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").value("jwt-token"))
        .andExpect(jsonPath("$.email").value("guest@stayease.com"));
  }

  @Test
  void login_shouldReturn400ForInvalidPayload() throws Exception {
    LoginRequest invalid = new LoginRequest("not-an-email", "");

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(invalid)))
        .andExpect(status().isBadRequest());

    verify(userService, never()).login(any(LoginRequest.class));
  }

  @Test
  void logout_shouldReturn403WhenMissingBearerToken() throws Exception {
    mockMvc.perform(post("/api/auth/logout"))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.message").value("Forbidden: missing bearer token"));

    verify(jwtService, never()).parse(any(String.class));
  }

  @Test
  void logout_shouldReturn403WhenTokenIsInvalid() throws Exception {
    when(jwtService.parse("bad-token")).thenThrow(new RuntimeException("invalid"));

    mockMvc.perform(post("/api/auth/logout")
        .header("Authorization", "Bearer bad-token"))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.message").value("Forbidden: invalid token"));

    verify(tokenUtils, never()).revoke(any(String.class), any(Claims.class));
  }

  @Test
  void logout_shouldReturn200WhenTokenIsValid() throws Exception {
    Claims claims = mock(Claims.class);
    when(jwtService.parse("good-token")).thenReturn(claims);

    mockMvc.perform(post("/api/auth/logout")
        .header("Authorization", "Bearer good-token"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("Logged out successfully"));

    verify(tokenUtils).revoke(eq("good-token"), eq(claims));
  }
}
