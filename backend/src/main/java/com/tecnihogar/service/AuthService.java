package com.tecnihogar.service;

import com.tecnihogar.dto.auth.AuthResponse;
import com.tecnihogar.dto.auth.LoginRequest;
import com.tecnihogar.dto.auth.RegisterRequest;
import com.tecnihogar.dto.auth.TechnicianRegisterData;
import com.tecnihogar.exception.BadRequestException;
import com.tecnihogar.exception.UnauthorizedException;
import com.tecnihogar.model.Rol;
import com.tecnihogar.model.TechnicianProfile;
import com.tecnihogar.model.TechnicianZone;
import com.tecnihogar.model.User;
import com.tecnihogar.repository.TechnicianProfileRepository;
import com.tecnihogar.repository.UserRepository;
import com.tecnihogar.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TechnicianProfileRepository technicianRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
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

        if (req.rol() == Rol.TECNICO) {
            TechnicianRegisterData t = req.tecnico();
            if (t == null || t.especialidad() == null) {
                throw new BadRequestException("Faltan los datos del perfil de tecnico");
            }
            TechnicianProfile profile = TechnicianProfile.builder()
                    .user(user)
                    .especialidad(t.especialidad())
                    .experienciaAnios(t.experienciaAnios() != null ? t.experienciaAnios() : 0)
                    .bio(t.bio())
                    .tarifaDesde(t.tarifaDesde())
                    .tiempoRespuesta(t.tiempoRespuesta())
                    .garantiaDias(t.garantiaDias())
                    .telefono(t.telefono())
                    .disponible(true)
                    .verificado(false)
                    .ratingPromedio(BigDecimal.ZERO)
                    .totalResenas(0)
                    .perfilCompletitud(0)
                    .build();

            if (t.zonas() != null) {
                for (String distrito : t.zonas()) {
                    if (distrito != null && !distrito.isBlank()) {
                        profile.getZonas().add(TechnicianZone.builder()
                                .tecnico(profile).distrito(distrito).build());
                    }
                }
            }
            profile.setPerfilCompletitud(ProfileCompletion.calcular(profile));
            technicianRepository.save(profile);
        }

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
