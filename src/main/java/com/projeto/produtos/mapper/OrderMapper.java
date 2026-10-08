package com.projeto.produtos.mapper;

import com.projeto.produtos.DTO.OrderDTO;
import com.projeto.produtos.model.Client;
import com.projeto.produtos.model.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class OrderMapper {

    public OrderDTO toDTO(Order order) {
        if (order == null) return null;
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        if (order.getClient() != null) {
            dto.setClientId(order.getClient().getId());
        }
        return dto;
    }

    public Order toEntity(OrderDTO dto, Client client) {
        if (dto == null) return null;
        Order order = new Order();
        order.setId(dto.getId());
        order.setOrderDate(dto.getOrderDate() != null ? dto.getOrderDate() : LocalDateTime.now());
        order.setTotalAmount(dto.getTotalAmount());
        order.setClient(client);
        return order;
    }
}