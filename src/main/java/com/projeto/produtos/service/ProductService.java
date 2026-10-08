package com.projeto.produtos.service;

import com.projeto.produtos.DTO.ProductDTO;

import com.projeto.produtos.exception.ResourceNotFoundException;
import com.projeto.produtos.mapper.ProductMapper;
import com.projeto.produtos.model.Product;
import com.projeto.produtos.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import java.util.List;


@Service
public class ProductService {

    private final ProductRepository repository;
    private final ProductMapper mapper;


    public ProductService(ProductRepository repository, ProductMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }


    public List<ProductDTO> findAll() {
        List<Product> products = repository.findAll();

        return products.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO findById(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com o ID: " + id));
        return mapper.toDTO(product);
    }


    public ProductDTO create(ProductDTO productDTO) {

        Product product = mapper.toEntity(productDTO);

        // 2. Salva no banco usando o Repository
        Product savedProduct = repository.save(product);

        // 3. Transforma a entidade salva de volta em DTO e devolve
        return mapper.toDTO(savedProduct);
    }

    public ProductDTO update(Long id, ProductDTO productDTO) {

        repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado para atualizar com o ID: " + id));

        productDTO.setId(id);
        Product product = mapper.toEntity(productDTO);
        Product updatedProduct = repository.save(product);
        return mapper.toDTO(updatedProduct);
    }

    public void delete(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado para deletar com o ID: " + id));
        repository.delete(product);
    }
}