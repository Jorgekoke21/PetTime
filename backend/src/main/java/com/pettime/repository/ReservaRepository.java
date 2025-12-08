package com.pettime.repository;

import com.pettime.model.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByDuenoId(Long duenoId);
    List<Reserva> findByPaseadorId(Long paseadorId);
}
