package com.tecnihogar.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MessageCreateDTO(
        @NotBlank(message = "El mensaje no puede estar vacio")
        @Size(max = 1000, message = "El mensaje no puede superar los 1000 caracteres")
        String contenido
) {}
