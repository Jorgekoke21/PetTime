package com.pettime.repository;

import com.pettime.model.entity.Paseador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaseadorRepository extends JpaRepository<Paseador, Long> {
    // En un MVP real aquí irían queries espaciales para lat/lng
}
