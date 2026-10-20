package com.projeto.produtos.controller;

import com.projeto.produtos.DTO.AuthenticationDTO;
import com.projeto.produtos.DTO.LoginResponseDTO;
import com.projeto.produtos.DTO.RegisterDTO;
import com.projeto.produtos.model.User;
import com.projeto.produtos.model.UserRole;
import com.projeto.produtos.repository.UserRepository;
import com.projeto.produtos.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        // Autentica usando o username e password passados no DTO
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.username(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        // Gera o token JWT para o utilizador autenticado
        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
        if (this.userRepository.findByUsername(data.username()) != null) {
            return ResponseEntity.badRequest().build();
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());

        // Usa o role enviado ou assume USER por defeito
        UserRole userRole = data.role() != null ? data.role() : UserRole.USER;

        User newUser = new User(data.username(), encryptedPassword, userRole);

        this.userRepository.save(newUser);

        return ResponseEntity.ok().build();
    }
}