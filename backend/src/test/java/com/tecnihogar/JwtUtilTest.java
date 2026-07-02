package com.tecnihogar;

import com.tecnihogar.security.JwtUtil;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private final JwtUtil jwtUtil =
            new JwtUtil("local_dev_secret_32chars_minimum_x_extra", 86400000L);

    @Test
    void generaYValidaToken() {
        String token = jwtUtil.generateToken("carlos@tecnihogar.pe", "TECNICO");

        assertNotNull(token);
        assertEquals("carlos@tecnihogar.pe", jwtUtil.extractEmail(token));
        assertEquals("TECNICO", jwtUtil.extractRol(token));
        assertTrue(jwtUtil.validateToken(token, "carlos@tecnihogar.pe"));
        assertFalse(jwtUtil.validateToken(token, "otro@tecnihogar.pe"));
    }

    @Test
    void rechazaTokenInvalido() {
        assertFalse(jwtUtil.isValid("token.no.valido"));
    }
}
