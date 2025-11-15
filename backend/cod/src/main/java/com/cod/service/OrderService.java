package com.cod.service;

import com.cod.model.*;
import com.cod.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private MenuItemRepository menuRepo;

    @Autowired
    private UserRepository userRepository;

    public Order placeOrder(Long userId, Integer tableNumber, List<OrderItem> items) {

        // Fetch user from DB
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found with ID: " + userId)
        );

        Order order = new Order();
        order.setUser(user);  // ← Set user object, NOT userId
        order.setTableNumber(tableNumber);
        order.setStatus("Pending");

        double total = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItem reqItem : items) {
            MenuItem menu = menuRepo.findById(reqItem.getMenuItemId()).orElse(null);
            if (menu == null) continue;

            OrderItem item = new OrderItem();
            item.setMenuItemId(menu.getId());
            item.setMenuItemName(menu.getName());
            item.setMenuItemPrice(menu.getPrice());
            item.setQuantity(reqItem.getQuantity());

            double lineTotal = menu.getPrice() * reqItem.getQuantity();
            item.setLineTotal(lineTotal);
            total += lineTotal;

            item.setOrder(order);
            orderItems.add(item);
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        return orderRepo.save(order);
    }


    public List<Order> getOrdersByUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return orderRepo.findByUser(user);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order updateStatus(Long orderId, String newStatus) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        order.setStatus(newStatus);
        return orderRepo.save(order);
    }
}
