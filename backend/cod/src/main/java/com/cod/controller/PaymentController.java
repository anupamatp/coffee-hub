package com.cod.controller;

import com.cod.dto.PaymentRequest;
import com.cod.model.OrderItem;
import com.cod.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private EmailService emailService;

    /**
     * Handles successful payment from frontend (Razorpay)
     *
     * @param request PaymentRequest DTO from frontend
     * @return ResponseEntity with success/failure message
     */
    @PostMapping("/success")
    public ResponseEntity<?> handlePaymentSuccess(@RequestBody PaymentRequest request) {
        try {
            // Convert cart items from DTO to OrderItem list
            List<OrderItem> orderItems = request.getCart().stream().map(cartItem -> {
                OrderItem item = new OrderItem();
                item.setMenuItemId(cartItem.getMenuItemId());
                item.setMenuItemName(cartItem.getMenuItemName());
                item.setMenuItemPrice(cartItem.getMenuItemPrice());
                item.setQuantity(cartItem.getQuantity());
                item.setLineTotal(cartItem.getMenuItemPrice() * cartItem.getQuantity());
                return item;
            }).collect(Collectors.toList());

            // Send email with attached invoice PDF
            emailService.sendOrderInvoiceEmail(
                    request.getCustomerEmail(), // email from frontend
                    request.getCustomerName(),
                    request.getUserId(),        // Use actual orderId if available
                    orderItems,
                    request.getTotal()
            );

            return ResponseEntity.ok("Payment successful & invoice email sent!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Payment processed but failed to send invoice: " + e.getMessage());
        }
    }
}
