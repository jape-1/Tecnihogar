package com.tecnihogar.controller;

import com.tecnihogar.dto.message.MessageCreateDTO;
import com.tecnihogar.dto.message.MessageDTO;
import com.tecnihogar.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests/{requestId}/messages")
@RequiredArgsConstructor
@Tag(name = "Mensajes", description = "Chat entre el cliente y el tecnico dentro de una solicitud")
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    @Operation(summary = "Listar los mensajes de la solicitud y marcarlos como leidos")
    public List<MessageDTO> list(@PathVariable Long requestId) {
        return messageService.getMessages(requestId);
    }

    @PostMapping
    @Operation(summary = "Enviar un mensaje en la conversacion de la solicitud")
    public MessageDTO send(@PathVariable Long requestId, @Valid @RequestBody MessageCreateDTO dto) {
        return messageService.send(requestId, dto);
    }
}
