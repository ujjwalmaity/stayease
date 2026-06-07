package com.stayease.user.service;

import com.stayease.exception.BadRequestException;
import com.stayease.exception.NotFoundException;
import com.stayease.security.JwtService;
import com.stayease.user.dto.*;
import com.stayease.user.entity.*;
import com.stayease.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = normalizeEmail(req.email());
        if (userRepository.existsByEmail(email)) throw new BadRequestException("Email already registered");
        User u = User.builder()
                .email(email).name(req.name().trim())
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(Role.GUEST).build();
        u = userRepository.save(u);
        return toAuth(u, false);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User u = userRepository.findByEmail(normalizeEmail(req.email()))
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        if (!passwordEncoder.matches(req.password(), u.getPasswordHash()))
            throw new BadRequestException("Invalid credentials");
        return toAuth(u, true);
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found"));
    }

    private AuthResponse toAuth(User u, boolean isLogin) {
        if(isLogin) {
            String token = jwtService.generateToken(u.getEmail(), u.getRole().name(), u.getId());
            return new AuthResponse(token, u.getId(), u.getEmail(), u.getName(), u.getRole().name());
        } else {
            return new AuthResponse(null, u.getId(), u.getEmail(), u.getName(), u.getRole().name());
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
