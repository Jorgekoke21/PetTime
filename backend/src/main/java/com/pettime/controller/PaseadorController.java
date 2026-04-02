package com.pettime.controller;

import com.pettime.dto.PaseadorUpdateDTO;
import com.pettime.model.entity.Paseador;
import com.pettime.model.entity.Rol;
import com.pettime.model.entity.Usuario;
import com.pettime.repository.PaseadorRepository;
import com.pettime.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/paseadores")
public class PaseadorController {

    @Autowired
    PaseadorRepository paseadorRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Paseador> getAllPaseadores() {
        return paseadorRepository.findAll();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMiPerfil() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() != Rol.PASEADOR) {
            throw new AccessDeniedException("Acceso denegado");
        }

        Paseador paseador = paseadorRepository.findById(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Paseador no encontrado"));

        return ResponseEntity.ok(paseador);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMiPerfil(@Valid @RequestBody PaseadorUpdateDTO updateDTO) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() != Rol.PASEADOR) {
            throw new AccessDeniedException("Acceso denegado");
        }

        Paseador paseador = paseadorRepository.findById(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Paseador no encontrado"));

        if (updateDTO.getBiografia() != null) {
            paseador.setBiografia(updateDTO.getBiografia().trim());
        }
        if (updateDTO.getPrecioPorHora() != null) {
            paseador.setPrecioPorHora(updateDTO.getPrecioPorHora());
        }
        if (updateDTO.getLatitud() != null) {
            paseador.setLatitud(updateDTO.getLatitud());
        }
        if (updateDTO.getLongitud() != null) {
            paseador.setLongitud(updateDTO.getLongitud());
        }

        paseadorRepository.save(paseador);
        return ResponseEntity.ok(paseador);
    }
}
