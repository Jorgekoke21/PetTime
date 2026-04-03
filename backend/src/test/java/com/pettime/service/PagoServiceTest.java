package com.pettime.service;

import com.pettime.model.entity.EstadoReserva;
import com.pettime.model.entity.Pago;
import com.pettime.model.entity.Reserva;
import com.pettime.repository.PagoRepository;
import com.pettime.repository.ReservaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PagoServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private PagoRepository pagoRepository;

    @InjectMocks
    private PagoService pagoService;

    @Test
    void procesarPagoMock_lanzaErrorCuandoReservaYaConfirmada() {
        Reserva reserva = new Reserva();
        reserva.setId(7L);
        reserva.setEstado(EstadoReserva.CONFIRMADA);

        when(reservaRepository.findById(7L)).thenReturn(Optional.of(reserva));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> pagoService.procesarPagoMock(7L, 20.0));

        assertEquals("La reserva ya está confirmada", ex.getMessage());
    }

    @Test
    void procesarPagoMock_confirmaReservaYAsociaPago() {
        Reserva reserva = new Reserva();
        reserva.setId(10L);
        reserva.setEstado(EstadoReserva.PENDIENTE);

        when(reservaRepository.findById(10L)).thenReturn(Optional.of(reserva));

        Pago pagoGuardado = new Pago();
        pagoGuardado.setId(99L);
        when(pagoRepository.save(org.mockito.ArgumentMatchers.any(Pago.class))).thenReturn(pagoGuardado);
        when(reservaRepository.save(org.mockito.ArgumentMatchers.any(Reserva.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Pago resultado = pagoService.procesarPagoMock(10L, 18.5);

        ArgumentCaptor<Pago> pagoCaptor = ArgumentCaptor.forClass(Pago.class);
        verify(pagoRepository).save(pagoCaptor.capture());
        Pago pagoCreado = pagoCaptor.getValue();
        assertEquals(18.5, pagoCreado.getMonto());
        assertEquals("MOCK_STRIPE", pagoCreado.getMetodoPago());
        assertNotNull(pagoCreado.getFechaPago());
        assertNotNull(pagoCreado.getReferenciaTransaccion());

        ArgumentCaptor<Reserva> reservaCaptor = ArgumentCaptor.forClass(Reserva.class);
        verify(reservaRepository).save(reservaCaptor.capture());
        Reserva reservaActualizada = reservaCaptor.getValue();
        assertEquals(EstadoReserva.CONFIRMADA, reservaActualizada.getEstado());
        assertSame(pagoCreado, reservaActualizada.getPago());
        assertSame(pagoCreado, resultado);
    }
}
