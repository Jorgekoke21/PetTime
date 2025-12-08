package com.pettime.security.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.Set;

@Data
public class SignupRequest {
    @NotBlank
    private String nombre;
 
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String password;

    // Cambiado a Set<String> para coincidir con el JSON ["rol"]
    // Sin validaciones @NotEmpty para evitar errores 400 si viene null (lo manejamos en controller)
    private Set<String> rol; 
    
    // Campos opcionales para Paseador
    private Double precioPorHora;
    private String biografia;

    // Coordenadas opcionales
    private Double latitud;
    private Double longitud;
}
