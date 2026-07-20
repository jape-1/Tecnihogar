package com.tecnihogar.controller;

import com.tecnihogar.dto.review.ReviewCreateDTO;
import com.tecnihogar.dto.review.ReviewDTO;
import com.tecnihogar.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Resenas", description = "Calificaciones y comentarios de los servicios")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Crear una resena de un servicio finalizado (cliente)")
    public ResponseEntity<ReviewDTO> create(@Valid @RequestBody ReviewCreateDTO dto) {
        return ResponseEntity.ok(reviewService.create(dto));
    }

    @GetMapping("/technician/{id}")
    @Operation(summary = "Resenas de un tecnico")
    public List<ReviewDTO> byTechnician(@PathVariable Long id) {
        return reviewService.byTechnician(id);
    }

    @GetMapping("/request/{requestId}")
    @Operation(summary = "Resena asociada a una solicitud (204 si aun no existe)")
    public ResponseEntity<ReviewDTO> byRequest(@PathVariable Long requestId) {
        ReviewDTO review = reviewService.byRequest(requestId);
        return review == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(review);
    }
}
