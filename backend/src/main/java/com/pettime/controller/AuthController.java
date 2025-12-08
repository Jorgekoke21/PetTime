package com.pettime.controller;

import com.pettime.model.entity.Paseador;
import com.pettime.model.entity.Rol;
import com.pettime.model.entity.Usuario;
import com.pettime.repository.PaseadorRepository;
import com.pettime.repository.UsuarioRepository;
import com.pettime.security.jwt.JwtUtils;
import com.pettime.security.services.UserDetailsImpl;
import com.pettime.security.payload.JwtResponse;
import com.pettime.security.payload.LoginRequest;
import com.pettime.security.payload.SignupRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PaseadorRepository paseadorRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (usuarioRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }

        // Determinar Rol desde el Set<String>
        Set<String> strRoles = signUpRequest.getRol();
        Rol rol = Rol.DUEÑO; // Default si es null o vacío

        if (strRoles != null) {
            if (strRoles.contains("paseador")) {
                rol = Rol.PASEADOR;
            } else if (strRoles.contains("admin")) {
                rol = Rol.ADMIN;
            }
        }

        // Crear Usuario o Paseador según el Rol final
        if (rol == Rol.PASEADOR) {
            Paseador paseador = new Paseador();
            paseador.setNombre(signUpRequest.getNombre());
            paseador.setEmail(signUpRequest.getEmail());
            paseador.setPassword(encoder.encode(signUpRequest.getPassword()));
            paseador.setRol(rol);
            paseador.setPrecioPorHora(signUpRequest.getPrecioPorHora() != null ? signUpRequest.getPrecioPorHora() : 15.0);
            paseador.setBiografia(signUpRequest.getBiografia() != null ? signUpRequest.getBiografia() : "Hola, soy un nuevo paseador!");
            
            // Usar coordenadas si vienen en el request, sino default
            if (signUpRequest.getLatitud() != null && signUpRequest.getLongitud() != null) {
                paseador.setLatitud(signUpRequest.getLatitud());
                paseador.setLongitud(signUpRequest.getLongitud());
            } else {
                paseador.setLatitud(40.416775); // Madrid Mock
                paseador.setLongitud(-3.703790);
            }
            
            paseadorRepository.save(paseador);
        } else {
            Usuario usuario = new Usuario();
            usuario.setNombre(signUpRequest.getNombre());
            usuario.setEmail(signUpRequest.getEmail());
            usuario.setPassword(encoder.encode(signUpRequest.getPassword()));
            usuario.setRol(rol);
            usuarioRepository.save(usuario);
        }

        return ResponseEntity.ok("User registered successfully!");
    }
}
