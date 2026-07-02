package com.tecnihogar.controller;

import com.tecnihogar.dto.report.ReportCreateDTO;
import com.tecnihogar.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<Map<String, Long>> create(@Valid @RequestBody ReportCreateDTO dto) {
        Long id = reportService.create(dto);
        return ResponseEntity.ok(Map.of("id", id));
    }
}
