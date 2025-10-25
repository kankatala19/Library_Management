package com.example.library_management.security;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET;
    private final long EXPIRATION;
    private final Key key;

    public JwtUtil() {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        String secretFromEnv = dotenv.get("JWT_SECRET");
        if (secretFromEnv == null || secretFromEnv.length() < 32) {
            throw new IllegalStateException("JWT_SECRET missing or too short. Set a 32+ byte value in .env");
        }
        this.SECRET = secretFromEnv;
        String exp = dotenv.get("JWT_EXPIRATION");
        this.EXPIRATION = exp != null ? Long.parseLong(exp) : 86400000L;
        this.key = Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ✅ Generate JWT
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Extract username
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    // ✅ Extract role
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    // ✅ Validate token
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
