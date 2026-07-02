package com.tecnihogar.controller;

import com.tecnihogar.dto.technician.AvailabilityDTO;
import com.tecnihogar.dto.technician.TechnicianDetailDTO;
import com.tecnihogar.dto.technician.TechnicianListDTO;
import com.tecnihogar.dto.technician.TechnicianUpdateDTO;
import com.tecnihogar.dto.technician.WorkDTO;
import com.tecnihogar.service.TechnicianService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/technicians")
@RequiredArgsConstructor
public class TechnicianController {

    private final TechnicianService technicianService;

    @GetMapping
    public List<TechnicianListDTO> search(
            @RequestParam(required = false) String especialidad,
            @RequestParam(required = false) String distrito,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false, name = "rating") Double rating,
            @RequestParam(required = false) Boolean verificado,
            @RequestParam(required = false) Boolean disponible) {
        Double min = minRating != null ? minRating : rating;
        return technicianService.search(especialidad, distrito, min, verificado, disponible);
    }

    @GetMapping("/featured")
    public List<TechnicianListDTO> featured() {
        return technicianService.featured();
    }

    @GetMapping("/me")
    public TechnicianDetailDTO myProfile() {
        return technicianService.getMyProfile();
    }

    @PutMapping("/me")
    public TechnicianDetailDTO updateMyProfile(@Valid @RequestBody TechnicianUpdateDTO dto) {
        return technicianService.updateMyProfile(dto);
    }

    @PatchMapping("/me/availability")
    public Map<String, Boolean> updateAvailability(@Valid @RequestBody AvailabilityDTO dto) {
        boolean disponible = technicianService.updateAvailability(dto.disponible());
        return Map.of("disponible", disponible);
    }

    @PostMapping("/me/photo")
    public Map<String, String> uploadPhoto(@RequestParam("file") MultipartFile file) throws IOException {
        return Map.of("fotoUrl", technicianService.updatePhoto(file));
    }

    @PostMapping("/me/works")
    public ResponseEntity<WorkDTO> addWork(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "descripcion", required = false) String descripcion) throws IOException {
        return ResponseEntity.ok(technicianService.addWork(file, descripcion));
    }

    @DeleteMapping("/me/works/{id}")
    public ResponseEntity<Void> deleteWork(@PathVariable Long id) {
        technicianService.deleteWork(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public TechnicianDetailDTO getById(@PathVariable Long id) {
        return technicianService.getById(id);
    }
}
