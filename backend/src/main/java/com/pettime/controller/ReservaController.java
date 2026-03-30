package com.pettime.controller;

import com.pettime.model.entity.*;
import com.pettime.repository.PaseadorRepository;
import com.pettime.repository.ReservaRepository;
import com.pettime.repository.UsuarioRepository;
import com.pettime.security.payload.PagoRequest;
import com.pettime.security.payload.ReservaRequest;
import com.pettime.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    ReservaRepository reservaRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PaseadorRepository paseadorRepository;

    @Autowired
    PagoService pagoService;

    @GetMapping
    public List<Reserva> getMisReservas() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername(); // email
        Usuario usuario = usuarioRepository.findByEmail(email).get();

        if (usuario.getRol() == Rol.PASEADOR) {
            return reservaRepository.findByPaseadorId(usuario.getId());
        } else {
            return reservaRepository.findByDuenoId(usuario.getId());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody ReservaRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usuario dueno = usuarioRepository.findByEmail(userDetails.getUsername()).get();

        Paseador paseador = paseadorRepository.findById(request.getPaseadorId())
                .orElseThrow(() -> new RuntimeException("Paseador no encontrado"));

        Reserva reserva = new Reserva();
        reserva.setDueno(dueno);
        reserva.setPaseador(paseador);
        reserva.setFechaHoraReserva(request.getFechaHora());
        reserva.setEstado(EstadoReserva.PENDIENTE);
        
        reservaRepository.save(reserva);

        return ResponseEntity.ok("Reserva creada exitosamente con ID: " + reserva.getId());
    }

    @PostMapping("/pagar")
    public ResponseEntity<?> pagarReserva(@RequestBody PagoRequest request) {
        // En un caso real, validar que la reserva pertenece al usuario
        // Obtenemos el precio del paseador para el monto (simplificado)
        Reserva reserva = reservaRepository.findById(request.getReservaId()).orElseThrow();
        Double monto = reserva.getPaseador().getPrecioPorHora(); 

        pagoService.procesarPagoMock(request.getReservaId(), monto);

        return ResponseEntity.ok("Pago procesado exitosamente");
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id,
                                              @RequestParam("estado") EstadoReserva estado) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Long usuarioId = usuario.getId();
        boolean esDueno = reserva.getDueno() != null && reserva.getDueno().getId().equals(usuarioId);
        boolean esPaseador = reserva.getPaseador() != null && reserva.getPaseador().getId().equals(usuarioId);

        if (!esDueno && !esPaseador) {
            throw new AccessDeniedException("Acceso Denegado");
        }

        reserva.setEstado(estado);
        reservaRepository.save(reserva);

        return ResponseEntity.ok("Estado actualizado");
    }
}
