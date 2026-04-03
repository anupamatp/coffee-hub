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

    /**
     * Place an order.
     * If paymentId is present in payload, attach it to the order but DO NOT change order.status.
     */
    @PostMapping
    public Order placeOrder(@RequestBody Map<String, Object> payload) {

        Long userId = Long.valueOf(payload.get("userId").toString());

        // Parse tableNumber safely (frontend may send as number or string or null)
        Integer tableNumber = null;
        if (payload.get("tableNumber") != null) {
            tableNumber = Integer.valueOf(payload.get("tableNumber").toString());
        }

        String paymentId = payload.get("paymentId") != null
                ? payload.get("paymentId").toString()
                : null;

        // Convert items payload to OrderItem list
        List<Map<String, Object>> itemsData = (List<Map<String, Object>>) payload.get("items");

        List<OrderItem> items = new java.util.ArrayList<>();
        if (itemsData != null) {
            items = itemsData.stream().map(data -> {
                OrderItem item = new OrderItem();
                item.setMenuItemId(Long.valueOf(data.get("menuItemId").toString()));
                // quantity may be Integer (from JSON) or something else; parse defensively
                Object qtyObj = data.get("quantity");
                Integer qty = qtyObj instanceof Integer ? (Integer) qtyObj : Integer.valueOf(qtyObj.toString());
                item.setQuantity(qty);
                return item;
            }).toList();
        }

        // Create and save order with tableNumber (if any)
        Order order = orderService.placeOrder(userId, tableNumber, items);

        // If paymentId present: attach to order and persist, but DO NOT modify order.status
        if (paymentId != null) {
            order.setPaymentId(paymentId);
            orderService.updateOrder(order);

            // send invoice email (does not change status)
            try {
                orderService.sendPaymentSuccessEmail(order);
            } catch (Exception e) {
                System.err.println("Failed to send payment-success email: " + e.getMessage());
            }
        }

        return order;
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // update order status used by chef/waiter flow: "Pending", "In Preparation", "Ready to Serve", "Served"
    @PutMapping("/{orderId}/status")
    public Order updateStatus(@PathVariable Long orderId,
                              @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        return orderService.updateStatus(orderId, newStatus);
    }
}
