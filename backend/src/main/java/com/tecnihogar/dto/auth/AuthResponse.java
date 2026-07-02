package com.tecnihogar.dto.auth;

import com.tecnihogar.model.Rol;

public record AuthResponse(
        String token,
        Rol rol,
        String nombre,
        Long id
) {}
