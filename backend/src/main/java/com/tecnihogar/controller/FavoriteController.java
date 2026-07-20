package com.tecnihogar.controller;

import com.tecnihogar.dto.FavoriteDTO;
import com.tecnihogar.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favoritos", description = "Tecnicos favoritos del cliente")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{technicianId}")
    @Operation(summary = "Agregar un tecnico a favoritos")
    public ResponseEntity<FavoriteDTO> add(@PathVariable Long technicianId) {
        return ResponseEntity.ok(favoriteService.add(technicianId));
    }

    @DeleteMapping("/{technicianId}")
    @Operation(summary = "Quitar un tecnico de favoritos")
    public ResponseEntity<Void> remove(@PathVariable Long technicianId) {
        favoriteService.remove(technicianId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    @Operation(summary = "Mis tecnicos favoritos")
    public List<FavoriteDTO> myFavorites() {
        return favoriteService.myFavorites();
    }
}
