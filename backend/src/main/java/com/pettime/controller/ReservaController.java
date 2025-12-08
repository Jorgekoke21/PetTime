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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
}
