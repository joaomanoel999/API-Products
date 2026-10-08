package com.projeto.produtos.service;

import com.projeto.produtos.DTO.CategoryDTO;
import com.projeto.produtos.mapper.CategoryMapper;
import com.projeto.produtos.model.Category;
import com.projeto.produtos.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    public List<CategoryDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return categoryMapper.toDTO(category);
    }

    public CategoryDTO save(CategoryDTO categoryDTO) {
        Category category = categoryMapper.toEntity(categoryDTO);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDTO(saved);
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}