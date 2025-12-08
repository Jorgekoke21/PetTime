package com.pettime.controller;

import com.pettime.model.entity.Paseador;
import com.pettime.repository.PaseadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/paseadores")
public class PaseadorController {

    @Autowired
    PaseadorRepository paseadorRepository;

    @GetMapping
    public List<Paseador> getAllPaseadores() {
        return paseadorRepository.findAll();
    }
}
