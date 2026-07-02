package com.tecnihogar.dto;

import com.tecnihogar.dto.technician.TechnicianListDTO;

public record FavoriteDTO(
        Long id,
        TechnicianListDTO tecnico
) {}
