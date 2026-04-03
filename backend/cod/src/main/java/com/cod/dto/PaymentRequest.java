package com.cod.dto;

import java.util.List;

public class PaymentRequest {
    private Long userId;
    private String customerName;
    private String customerEmail; // new field
    private Double total;
    private String paymentId;
    private List<CartItem> cart;

    public static class CartItem {
        private Long menuItemId;
        private String menuItemName;
        private Double menuItemPrice;
        private Integer quantity;

        // Getters and Setters
        public Long getMenuItemId() { return menuItemId; }
        public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }

        public String getMenuItemName() { return menuItemName; }
        public void setMenuItemName(String menuItemName) { this.menuItemName = menuItemName; }

        public Double getMenuItemPrice() { return menuItemPrice; }
        public void setMenuItemPrice(Double menuItemPrice) { this.menuItemPrice = menuItemPrice; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public List<CartItem> getCart() { return cart; }
    public void setCart(List<CartItem> cart) { this.cart = cart; }
}
