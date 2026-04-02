package com.pettime.security.payload;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PagoRequest {
    @NotNull(message = "La reserva es obligatoria")
    private Long reservaId;

    private String metodoPago; // "TARJETA"
}
