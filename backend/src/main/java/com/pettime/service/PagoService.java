package com.pettime.service;

import com.pettime.model.entity.EstadoReserva;
import com.pettime.model.entity.Pago;
import com.pettime.model.entity.Reserva;
import com.pettime.repository.PagoRepository;
import com.pettime.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PagoService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Transactional
    public Pago procesarPagoMock(Long reservaId, Double monto) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (reserva.getEstado() == EstadoReserva.CONFIRMADA) {
            throw new RuntimeException("La reserva ya está confirmada");
        }

        // Simular lógica de Stripe (siempre aprueba)
        Pago pago = new Pago();
        pago.setFechaPago(LocalDateTime.now());
        pago.setMonto(monto);
        pago.setMetodoPago("MOCK_STRIPE");
        pago.setReferenciaTransaccion(UUID.randomUUID().toString());

        pagoRepository.save(pago);

        // Actualizar reserva
        reserva.setPago(pago);
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reservaRepository.save(reserva);

        return pago;
    }
}
