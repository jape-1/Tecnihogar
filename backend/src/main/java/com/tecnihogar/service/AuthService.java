package com.tecnihogar.service;

import com.tecnihogar.dto.auth.AuthResponse;
import com.tecnihogar.dto.auth.LoginRequest;
import com.tecnihogar.dto.auth.RegisterRequest;
import com.tecnihogar.exception.BadRequestException;
import com.tecnihogar.exception.UnauthorizedException;
import com.tecnihogar.model.User;
import com.tecnihogar.repository.UserRepository;
import com.tecnihogar.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new BadRequestException("El email ya esta registrado");
        }
        User user = User.builder()
                .nombre(req.nombre())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .rol(req.rol())
                .activo(true)
                .build();
        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRol().name());
        return new AuthResponse(token, user.getRol(), user.getNombre(), user.getId());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new UnauthorizedException("Credenciales invalidas"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new UnauthorizedException("Credenciales invalidas");
        }
        if (Boolean.FALSE.equals(user.getActivo())) {
            throw new UnauthorizedException("La cuenta esta desactivada");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRol().name());
        return new AuthResponse(token, user.getRol(), user.getNombre(), user.getId());
    }
}
