package com.stayease.security;

import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory JWT blacklist used to invalidate tokens on logout.
 * Tokens self-expire; we also purge stale entries lazily.
 */
@Component
public class TokenUtils {
    private final Map<String, Long> revoked = new ConcurrentHashMap<>();

    public void revoke(String token, Claims claims) {
        long exp = claims.getExpiration() != null ? claims.getExpiration().getTime() : System.currentTimeMillis() + 3_600_000L;
        revoked.put(token, exp);
        purge();
    }

    public boolean isRevoked(String token) {
        Long exp = revoked.get(token);
        if (exp == null) return false;
        if (exp < System.currentTimeMillis()) { revoked.remove(token); return false; }
        return true;
    }

    private void purge() {
        long now = System.currentTimeMillis();
        revoked.entrySet().removeIf(e -> e.getValue() < now);
    }
}
