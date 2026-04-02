package com.pettime.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

public class PaseadorUpdateDTO {
    @Size(max = 500, message = "La biografía no puede superar los 500 caracteres")
    private String biografia;

    @DecimalMin(value = "0.0", message = "El precio no puede ser negativo")
    private Double precioPorHora;

    @DecimalMin(value = "-90.0", message = "Latitud no válida")
    @DecimalMax(value = "90.0", message = "Latitud no válida")
    private Double latitud;

    @DecimalMin(value = "-180.0", message = "Longitud no válida")
    @DecimalMax(value = "180.0", message = "Longitud no válida")
    private Double longitud;

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public Double getPrecioPorHora() {
        return precioPorHora;
    }

    public void setPrecioPorHora(Double precioPorHora) {
        this.precioPorHora = precioPorHora;
    }

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }
}
