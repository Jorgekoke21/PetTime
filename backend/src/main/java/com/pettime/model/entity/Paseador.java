package com.pettime.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "paseadores")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Paseador extends Usuario {

    private String biografia;
    
    private Double precioPorHora;

    // Coordenadas geográficas para el mapa
    private Double latitud;
    private Double longitud;
    
    // Calificación promedio simulada
    private Double calificacion = 5.0;
}
