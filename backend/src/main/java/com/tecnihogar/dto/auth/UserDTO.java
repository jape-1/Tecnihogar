package com.tecnihogar.dto.auth;

import com.tecnihogar.model.Rol;

public record UserDTO(
        Long id,
        String nombre,
        String email,
        Rol rol
) {}
