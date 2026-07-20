package com.tecnihogar.controller;

import com.tecnihogar.dto.auth.AuthResponse;
import com.tecnihogar.dto.auth.LoginRequest;
import com.tecnihogar.dto.auth.RegisterRequest;
import com.tecnihogar.dto.auth.UserDTO;
import com.tecnihogar.model.User;
import com.tecnihogar.service.AuthService;
import com.tecnihogar.service.CurrentUserProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticacion", description = "Registro, inicio de sesion y usuario actual")
public class AuthController {

    private final AuthService authService;
    private final CurrentUserProvider currentUser;

    @PostMapping("/register")
    @Operation(summary = "Registrar un nuevo usuario (cliente o tecnico)")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesion y obtener el token JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Datos del usuario autenticado")
    public UserDTO me() {
        User u = currentUser.getCurrentUser();
        return new UserDTO(u.getId(), u.getNombre(), u.getEmail(), u.getRol());
    }
}
