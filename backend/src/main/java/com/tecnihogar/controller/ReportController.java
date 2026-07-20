package com.tecnihogar.controller;

import com.tecnihogar.dto.report.ReportCreateDTO;
import com.tecnihogar.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Reportes de incidencias sobre un servicio")
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @Operation(summary = "Reportar un problema en una solicitud (cliente)")
    public ResponseEntity<Map<String, Long>> create(@Valid @RequestBody ReportCreateDTO dto) {
        Long id = reportService.create(dto);
        return ResponseEntity.ok(Map.of("id", id));
    }
}
