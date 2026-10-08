package com.projeto.produtos.service;

import com.projeto.produtos.DTO.OrderDTO;
import com.projeto.produtos.mapper.OrderMapper;
import com.projeto.produtos.model.Client;
import com.projeto.produtos.model.Order;
import com.projeto.produtos.repository.ClientRepository;
import com.projeto.produtos.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private OrderMapper orderMapper;

    public List<OrderDTO> findAll() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO findById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderMapper.toDTO(order);
    }

    public OrderDTO save(OrderDTO orderDTO) {
        Client client = clientRepository.findById(orderDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Order order = orderMapper.toEntity(orderDTO, client);
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }

        Order saved = orderRepository.save(order);
        return orderMapper.toDTO(saved);
    }

    public void delete(Long id) {
        orderRepository.deleteById(id);
    }
}