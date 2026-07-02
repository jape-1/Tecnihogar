package com.tecnihogar.controller;

import com.tecnihogar.dto.NotificationDTO;
import com.tecnihogar.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    public List<NotificationDTO> myNotifications() {
        return notificationService.myNotifications();
    }

    @PatchMapping("/read-all")
    public Map<String, Integer> markAllRead() {
        return Map.of("actualizadas", notificationService.markAllRead());
    }
}
