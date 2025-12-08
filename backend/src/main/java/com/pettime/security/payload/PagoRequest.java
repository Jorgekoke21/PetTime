package com.pettime.security.payload;

import lombok.Data;

@Data
public class PagoRequest {
    private Long reservaId;
    private String metodoPago; // "TARJETA"
}
