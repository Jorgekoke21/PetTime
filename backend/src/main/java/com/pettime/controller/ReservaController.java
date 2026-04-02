package com.pettime.controller;

import com.pettime.model.entity.*;
import com.pettime.repository.PaseadorRepository;
import com.pettime.repository.ReservaRepository;
import com.pettime.repository.UsuarioRepository;
import com.pettime.security.payload.PagoRequest;
import com.pettime.security.payload.ReservaRequest;
import com.pettime.service.PagoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
        String email = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() == Rol.PASEADOR) {
            return reservaRepository.findByPaseadorId(usuario.getId());
        }

        return reservaRepository.findByDuenoId(usuario.getId());
    }

    @PostMapping
    public ResponseEntity<?> crearReserva(@Valid @RequestBody ReservaRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usuario dueno = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (dueno.getRol() == Rol.PASEADOR) {
            return ResponseEntity.badRequest().body("Un paseador no puede reservar paseos como dueño");
        }

        Paseador paseador = paseadorRepository.findById(request.getPaseadorId())
                .orElseThrow(() -> new RuntimeException("Paseador no encontrado"));

        if (dueno.getId().equals(paseador.getId())) {
            return ResponseEntity.badRequest().body("No puedes reservarte a ti mismo");
        }

        if (request.getFechaHora().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("La fecha de la reserva debe ser futura");
        }

        Reserva reserva = new Reserva();
        reserva.setDueno(dueno);
        reserva.setPaseador(paseador);
        reserva.setFechaHoraReserva(request.getFechaHora());
        reserva.setEstado(EstadoReserva.PENDIENTE);

        reservaRepository.save(reserva);

        return ResponseEntity.ok("Reserva creada correctamente");
    }

    @PostMapping("/pagar")
    public ResponseEntity<?> pagarReserva(@Valid @RequestBody PagoRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Reserva reserva = reservaRepository.findById(request.getReservaId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (reserva.getDueno() == null || !reserva.getDueno().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("No puedes pagar una reserva que no es tuya");
        }

        Double monto = reserva.getPaseador().getPrecioPorHora();
        pagoService.procesarPagoMock(request.getReservaId(), monto);

        return ResponseEntity.ok("Pago procesado correctamente");
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
            throw new AccessDeniedException("Acceso denegado");
        }

        if (estado == EstadoReserva.PENDIENTE) {
            return ResponseEntity.badRequest().body("No se puede volver al estado pendiente");
        }

        if (esDueno && estado == EstadoReserva.COMPLETADA) {
            return ResponseEntity.badRequest().body("Solo el paseador puede completar una reserva");
        }

        if (esPaseador && estado == EstadoReserva.CONFIRMADA && reserva.getEstado() != EstadoReserva.PENDIENTE) {
            return ResponseEntity.badRequest().body("Solo se pueden confirmar reservas pendientes");
        }

        reserva.setEstado(estado);
        reservaRepository.save(reserva);

        return ResponseEntity.ok("Estado actualizado correctamente");
    }
}
