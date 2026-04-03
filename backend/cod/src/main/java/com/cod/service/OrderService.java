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

    @Autowired
    private EmailService emailService;

    // --------------------------
    // PLACE ORDER
    // --------------------------
    public Order placeOrder(Long userId, Integer tableNumber, List<OrderItem> items) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setTableNumber(tableNumber);          // ensure table number is stored
        order.setStatus("Pending");                 // initial workflow status

        double total = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        if (items != null) {
            for (OrderItem reqItem : items) {
                // Find menu item details
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
                item.setOrder(order); // set back-reference so cascade persists
                orderItems.add(item);
            }
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        // Save order first (cascades items)
        Order savedOrder = orderRepo.save(order);

        // Build items HTML for order confirmation email (simple)
        StringBuilder itemsHtml = new StringBuilder();
        for (OrderItem item : orderItems) {
            itemsHtml.append("<li>")
                    .append(item.getMenuItemName())
                    .append(" (x").append(item.getQuantity()).append(")")
                    .append(" - ₹").append(item.getLineTotal())
                    .append("</li>");
        }

        // Send order confirmation email asynchronously
        new Thread(() -> emailService.sendOrderEmail(
                user.getEmail(),
                user.getName(),
                savedOrder.getId(),
                savedOrder.getTotalAmount(),
                itemsHtml.toString()
        )).start();

        return savedOrder;
    }

    // --------------------------
    // PAYMENT SUCCESS EMAIL (does NOT change order status)
    // --------------------------
    public void sendPaymentSuccessEmail(Order order) {
        // Async send invoice email (leave order.status untouched)
        new Thread(() -> emailService.sendOrderInvoiceEmail(
                order.getUser().getEmail(),
                order.getUser().getName(),
                order.getId(),
                order.getItems(),
                order.getTotalAmount()
        )).start();
    }

    // --------------------------
    // UPDATE ORDER (persist changes like paymentId or other fields)
    // --------------------------
    public void updateOrder(Order order) {
        orderRepo.save(order);
    }

    // --------------------------
    // GET ORDERS
    // --------------------------
    public List<Order> getOrdersByUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return orderRepo.findByUser(user);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    // --------------------------
    // UPDATE ORDER STATUS
    // --------------------------
    public Order updateStatus(Long orderId, String newStatus) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        Order updatedOrder = orderRepo.save(order);

        // Build items HTML table rows for status-update email
        StringBuilder itemsHtml = new StringBuilder();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                itemsHtml.append(
                        "<tr>" +
                                "<td style='padding:8px; border-bottom:1px solid #ddd;'>" + item.getMenuItemName() + "</td>" +
                                "<td style='padding:8px; text-align:center; border-bottom:1px solid #ddd;'>" + item.getQuantity() + "</td>" +
                                "<td style='padding:8px; text-align:right; border-bottom:1px solid #ddd;'>₹" + item.getLineTotal() + "</td>" +
                                "</tr>"
                );
            }
        }

        // Send status-update email asynchronously
        new Thread(() -> emailService.sendOrderStatusEmail(
                order.getUser().getEmail(),
                order.getUser().getName(),
                newStatus,
                itemsHtml.toString()
        )).start();

        return updatedOrder;
    }
}
