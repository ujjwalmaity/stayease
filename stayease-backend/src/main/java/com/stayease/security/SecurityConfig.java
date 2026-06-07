package com.stayease.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stayease.common.ApiError;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final ObjectMapper objectMapper;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${spring.h2.console.enabled:false}")
    private boolean h2ConsoleEnabled;

    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        List<String> publicEndpoints = new ArrayList<>(List.of(
                "/api/auth/login",
                "/api/auth/register",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/actuator/health"
        ));
        if (h2ConsoleEnabled) {
            publicEndpoints.add("/h2-console/**");
        }

        http
            .csrf(c -> c.disable())
            .cors(c -> c.configurationSource(corsSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a -> a
                .requestMatchers(publicEndpoints.toArray(String[]::new)).permitAll()
                // Every other endpoint (including all hotel, room, booking and logout)
                // requires a valid JWT. Role-based gating is done via @PreAuthorize.
                .anyRequest().authenticated())
            .exceptionHandling(e -> e
                .authenticationEntryPoint(forbiddenEntryPoint())
                .accessDeniedHandler(forbiddenAccessDeniedHandler()))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        if (h2ConsoleEnabled) {
            http.headers(h -> h.frameOptions(f -> f.disable()));
        }
        return http.build();
    }

    /** Missing / invalid JWT → 403 (per project requirement). */
    private AuthenticationEntryPoint forbiddenEntryPoint() {
        return (req, res, ex) -> writeError(req, res, HttpServletResponse.SC_FORBIDDEN,
                "Forbidden: missing or invalid authentication token");
    }

    /** Authenticated but wrong role → 403. */
    private AccessDeniedHandler forbiddenAccessDeniedHandler() {
        return (req, res, ex) -> writeError(req, res, HttpServletResponse.SC_FORBIDDEN,
                "Forbidden: insufficient role for this resource");
    }

    private void writeError(jakarta.servlet.http.HttpServletRequest req, HttpServletResponse res, int status, String message) throws java.io.IOException {
        res.setStatus(status);
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(res.getOutputStream(), new ApiError(LocalDateTime.now(), req.getRequestURI(), "Forbidden", message));
    }

    @Bean
    public CorsConfigurationSource corsSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }
}
