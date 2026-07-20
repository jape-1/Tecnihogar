package com.tecnihogar.controller;

import com.tecnihogar.dto.NotificationDTO;
import com.tecnihogar.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notificaciones", description = "Notificaciones del usuario autenticado")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    @Operation(summary = "Mis notificaciones")
    public List<NotificationDTO> myNotifications() {
        return notificationService.myNotifications();
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Marcar todas mis notificaciones como leidas")
    public Map<String, Integer> markAllRead() {
        return Map.of("actualizadas", notificationService.markAllRead());
    }
}
