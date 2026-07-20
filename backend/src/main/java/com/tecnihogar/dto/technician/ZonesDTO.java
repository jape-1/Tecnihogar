package com.tecnihogar.dto.technician;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ZonesDTO(
        @NotNull(message = "La lista de zonas es obligatoria")
        List<String> zonas
) {}
