package com.projeto.produtos.DTO;

import com.projeto.produtos.model.UserRole;

public record RegisterDTO(String username, String password, UserRole role) {
}