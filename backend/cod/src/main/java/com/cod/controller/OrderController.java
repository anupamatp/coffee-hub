package com.cod.controller;

import com.cod.model.Order;
import com.cod.model.OrderItem;
import com.cod.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order placeOrder(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Integer tableNumber = (Integer) payload.get("tableNumber");

        List<Map<String, Object>> itemsData = (List<Map<String, Object>>) payload.get("items");

        List<OrderItem> items = itemsData.stream().map(data -> {
            OrderItem item = new OrderItem();
            item.setMenuItemId(Long.valueOf(data.get("menuItemId").toString()));
            item.setQuantity((Integer) data.get("quantity"));
            return item;
        }).toList();

        return orderService.placeOrder(userId, tableNumber, items);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{orderId}/status")
    public Order updateStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        return orderService.updateStatus(orderId, newStatus);
    }
}
