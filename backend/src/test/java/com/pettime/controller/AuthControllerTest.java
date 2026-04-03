package com.pettime.controller;

import com.pettime.model.entity.Paseador;
import com.pettime.repository.PaseadorRepository;
import com.pettime.repository.UsuarioRepository;
import com.pettime.security.payload.SignupRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PaseadorRepository paseadorRepository;

    @Mock
    private PasswordEncoder encoder;

    @InjectMocks
    private AuthController authController;

    @Test
    void registerUser_devuelveBadRequestSiEmailYaExiste() {
        SignupRequest request = new SignupRequest();
        request.setEmail("repetido@test.com");
        request.setNombre("Laura");
        request.setPassword("123456");

        when(usuarioRepository.existsByEmail("repetido@test.com")).thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Error: Email is already in use!", response.getBody());
        verify(usuarioRepository, never()).save(any());
        verify(paseadorRepository, never()).save(any());
    }

    @Test
    void registerUser_guardaPaseadorConDefaultsCuandoFaltanCamposOpcionales() {
        SignupRequest request = new SignupRequest();
        request.setNombre("Paseador Test");
        request.setEmail("paseador@test.com");
        request.setPassword("123456");
        request.setRol(Set.of("paseador"));

        when(usuarioRepository.existsByEmail("paseador@test.com")).thenReturn(false);
        when(encoder.encode("123456")).thenReturn("HASHED");

        ResponseEntity<?> response = authController.registerUser(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully!", response.getBody());

        ArgumentCaptor<Paseador> captor = ArgumentCaptor.forClass(Paseador.class);
        verify(paseadorRepository).save(captor.capture());
        Paseador guardado = captor.getValue();

        assertEquals("Paseador Test", guardado.getNombre());
        assertEquals("paseador@test.com", guardado.getEmail());
        assertEquals("HASHED", guardado.getPassword());
        assertEquals(15.0, guardado.getPrecioPorHora());
        assertTrue(guardado.getBiografia().contains("nuevo paseador"));
        assertEquals(40.416775, guardado.getLatitud());
        assertEquals(-3.703790, guardado.getLongitud());
    }
}
