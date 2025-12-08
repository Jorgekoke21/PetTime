package com.pettime.security.payload;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReservaRequest {
    private Long paseadorId;
    private LocalDateTime fechaHora; // ISO-8601
}
