package com.tecnihogar.repository;

import com.tecnihogar.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByClienteId(Long clienteId);

    Optional<Favorite> findByClienteIdAndTecnicoId(Long clienteId, Long tecnicoId);

    boolean existsByClienteIdAndTecnicoId(Long clienteId, Long tecnicoId);

    long countByClienteId(Long clienteId);
}
