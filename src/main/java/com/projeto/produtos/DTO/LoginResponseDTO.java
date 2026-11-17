package com.projeto.produtos.DTO;

import com.projeto.produtos.model.UserRole;

public record LoginResponseDTO(String token, UserRole role) { // ALTERADO
}