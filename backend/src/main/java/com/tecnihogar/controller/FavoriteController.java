package com.tecnihogar.controller;

import com.tecnihogar.dto.FavoriteDTO;
import com.tecnihogar.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{technicianId}")
    public ResponseEntity<FavoriteDTO> add(@PathVariable Long technicianId) {
        return ResponseEntity.ok(favoriteService.add(technicianId));
    }

    @DeleteMapping("/{technicianId}")
    public ResponseEntity<Void> remove(@PathVariable Long technicianId) {
        favoriteService.remove(technicianId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public List<FavoriteDTO> myFavorites() {
        return favoriteService.myFavorites();
    }
}
