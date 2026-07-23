package com.stayease.user.service;

import com.stayease.exception.BadRequestException;
import com.stayease.exception.NotFoundException;
import com.stayease.security.JwtService;
import com.stayease.user.dto.LoginRequest;
import com.stayease.user.dto.RegisterRequest;
import com.stayease.user.entity.Role;
import com.stayease.user.entity.User;
import com.stayease.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private JwtService jwtService;

  @InjectMocks
  private UserService userService;

  @Test
  void register_shouldCreateGuestWithNormalizedEmailAndTrimmedName() {
    RegisterRequest req = new RegisterRequest("  Guest@Example.COM  ", "secret123", "  Guest User  ");

    when(userRepository.existsByEmail("guest@example.com")).thenReturn(false);
    when(passwordEncoder.encode("secret123")).thenReturn("encoded-pass");
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
      User saved = invocation.getArgument(0);
      saved.setId(11L);
      return saved;
    });

    var res = userService.register(req);

    assertThat(res.userId()).isEqualTo(11L);
    assertThat(res.email()).isEqualTo("guest@example.com");
    assertThat(res.name()).isEqualTo("Guest User");
    assertThat(res.role()).isEqualTo("GUEST");
    assertThat(res.token()).isNull();

    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    verify(userRepository).save(userCaptor.capture());
    User toSave = userCaptor.getValue();
    assertThat(toSave.getEmail()).isEqualTo("guest@example.com");
    assertThat(toSave.getName()).isEqualTo("Guest User");
    assertThat(toSave.getPasswordHash()).isEqualTo("encoded-pass");
    assertThat(toSave.getRole()).isEqualTo(Role.GUEST);
  }

  @Test
  void register_shouldRejectAlreadyRegisteredEmail() {
    RegisterRequest req = new RegisterRequest("guest@example.com", "secret123", "Guest");
    when(userRepository.existsByEmail("guest@example.com")).thenReturn(true);

    assertThatThrownBy(() -> userService.register(req))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("Email already registered");

    verify(userRepository, never()).save(any(User.class));
  }

  @Test
  void login_shouldRejectWhenEmailNotFound() {
    LoginRequest req = new LoginRequest("missing@example.com", "pw");
    when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

    assertThatThrownBy(() -> userService.login(req))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("Invalid credentials");
  }

  @Test
  void login_shouldRejectWhenPasswordDoesNotMatch() {
    User u = user(21L, "guest@example.com", "Guest", Role.GUEST, "encoded");
    LoginRequest req = new LoginRequest("guest@example.com", "wrong");

    when(userRepository.findByEmail("guest@example.com")).thenReturn(Optional.of(u));
    when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

    assertThatThrownBy(() -> userService.login(req))
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("Invalid credentials");
  }

  @Test
  void login_shouldReturnAuthResponseWithTokenOnSuccess() {
    User u = user(31L, "guest@example.com", "Guest", Role.GUEST, "encoded");
    LoginRequest req = new LoginRequest("  Guest@Example.COM ", "secret123");

    when(userRepository.findByEmail("guest@example.com")).thenReturn(Optional.of(u));
    when(passwordEncoder.matches("secret123", "encoded")).thenReturn(true);
    when(jwtService.generateToken("guest@example.com", "GUEST", 31L)).thenReturn("jwt-token");

    var res = userService.login(req);

    assertThat(res.userId()).isEqualTo(31L);
    assertThat(res.email()).isEqualTo("guest@example.com");
    assertThat(res.role()).isEqualTo("GUEST");
    assertThat(res.token()).isEqualTo("jwt-token");

    verify(jwtService).generateToken(eq("guest@example.com"), eq("GUEST"), eq(31L));
  }

  @Test
  void getById_shouldReturnUserWhenFound() {
    User u = user(41L, "u@example.com", "User", Role.MANAGER, "encoded");
    when(userRepository.findById(41L)).thenReturn(Optional.of(u));

    User res = userService.getById(41L);

    assertThat(res.getId()).isEqualTo(41L);
    assertThat(res.getRole()).isEqualTo(Role.MANAGER);
  }

  @Test
  void getById_shouldThrowWhenMissing() {
    when(userRepository.findById(404L)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> userService.getById(404L))
        .isInstanceOf(NotFoundException.class)
        .hasMessageContaining("User not found");
  }

  @Test
  void getByEmail_shouldReturnUserWhenFound() {
    User u = user(51L, "admin@example.com", "Admin", Role.ADMIN, "encoded");
    when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(u));

    User res = userService.getByEmail("admin@example.com");

    assertThat(res.getId()).isEqualTo(51L);
    assertThat(res.getRole()).isEqualTo(Role.ADMIN);
  }

  @Test
  void getByEmail_shouldThrowWhenMissing() {
    when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

    assertThatThrownBy(() -> userService.getByEmail("missing@example.com"))
        .isInstanceOf(NotFoundException.class)
        .hasMessageContaining("User not found");
  }

  private static User user(Long id, String email, String name, Role role, String passwordHash) {
    return User.builder()
        .id(id)
        .email(email)
        .name(name)
        .role(role)
        .passwordHash(passwordHash)
        .build();
  }
}
