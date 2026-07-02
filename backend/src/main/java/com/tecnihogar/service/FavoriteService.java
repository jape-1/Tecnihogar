package com.tecnihogar.service;

import com.tecnihogar.dto.FavoriteDTO;
import com.tecnihogar.exception.BadRequestException;
import com.tecnihogar.exception.ResourceNotFoundException;
import com.tecnihogar.model.Favorite;
import com.tecnihogar.model.TechnicianProfile;
import com.tecnihogar.model.User;
import com.tecnihogar.repository.FavoriteRepository;
import com.tecnihogar.repository.TechnicianProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final TechnicianProfileRepository technicianRepository;
    private final CurrentUserProvider currentUser;
    private final DtoMapper mapper;

    @Transactional
    public FavoriteDTO add(Long tecnicoId) {
        User cliente = currentUser.getCurrentUser();
        if (favoriteRepository.existsByClienteIdAndTecnicoId(cliente.getId(), tecnicoId)) {
            throw new BadRequestException("El tecnico ya esta en favoritos");
        }
        TechnicianProfile tecnico = technicianRepository.findById(tecnicoId)
                .orElseThrow(() -> new ResourceNotFoundException("Tecnico no encontrado: " + tecnicoId));
        Favorite fav = Favorite.builder().cliente(cliente).tecnico(tecnico).build();
        fav = favoriteRepository.save(fav);
        return mapper.toFavoriteDTO(fav);
    }

    @Transactional
    public void remove(Long tecnicoId) {
        User cliente = currentUser.getCurrentUser();
        Favorite fav = favoriteRepository.findByClienteIdAndTecnicoId(cliente.getId(), tecnicoId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorito no encontrado"));
        favoriteRepository.delete(fav);
    }

    @Transactional(readOnly = true)
    public List<FavoriteDTO> myFavorites() {
        User cliente = currentUser.getCurrentUser();
        return favoriteRepository.findByClienteId(cliente.getId()).stream()
                .map(mapper::toFavoriteDTO).toList();
    }
}
