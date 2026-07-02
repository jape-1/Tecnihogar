package com.tecnihogar.controller;

import com.tecnihogar.dto.review.ReviewCreateDTO;
import com.tecnihogar.dto.review.ReviewDTO;
import com.tecnihogar.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDTO> create(@Valid @RequestBody ReviewCreateDTO dto) {
        return ResponseEntity.ok(reviewService.create(dto));
    }

    @GetMapping("/technician/{id}")
    public List<ReviewDTO> byTechnician(@PathVariable Long id) {
        return reviewService.byTechnician(id);
    }
}
