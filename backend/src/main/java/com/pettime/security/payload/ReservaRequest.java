package com.pettime.security.payload;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservaRequest {
    @NotNull(message = "El paseador es obligatorio")
    private Long paseadorId;

    @NotNull(message = "La fecha y hora son obligatorias")
    @Future(message = "La reserva debe ser para una fecha futura")
    private LocalDateTime fechaHora; // ISO-8601
}
