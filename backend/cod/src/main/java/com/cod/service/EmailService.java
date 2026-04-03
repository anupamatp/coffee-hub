package com.cod.service;

import com.cod.invoice.InvoiceGenerator;
import com.cod.model.OrderItem;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // --------------------------
    // CACHE TEMPLATES (FAST)
    // --------------------------
    private final Map<String, String> templateCache = new HashMap<>();

    @PostConstruct
    public void loadTemplates() throws IOException {
        loadTemplateToCache("order_placed.html");
        loadTemplateToCache("table-booking.html");
        loadTemplateToCache("order_status.html");
        loadTemplateToCache("staff_welcome.html");
        loadTemplateToCache("registration.html");
    }

    private void loadTemplateToCache(String fileName) throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/" + fileName);
        String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        templateCache.put(fileName, content);
    }

    public String loadTemplate(String fileName) {
        return templateCache.get(fileName); // super fast
    }

    // --------------------------
    // SEND HTML EMAIL (Async)
    // --------------------------
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Email sending failed: " + e.getMessage());
        }
    }

    // --------------------------
    // SEND ORDER EMAIL WITH INVOICE PDF
    // --------------------------
    @Async
    public void sendOrderInvoiceEmail(String to, String customerName, Long orderId, List<OrderItem> items, double totalAmount) {
        try {
            // Generate PDF
            byte[] pdfBytes = InvoiceGenerator.generateInvoice(orderId, customerName, items, totalAmount);

            // Prepare MimeMessage
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("☕ Payment Confirmation & Invoice – Order #" + orderId);

            // Build items table HTML
            StringBuilder itemsTable = new StringBuilder();
            itemsTable.append("<table style='width:100%; border-collapse:collapse; margin-top:15px;'>")
                    .append("<thead><tr>")
                    .append("<th style='text-align:left; padding:8px; border-bottom:2px solid #ddd;'>Item</th>")
                    .append("<th style='text-align:center; padding:8px; border-bottom:2px solid #ddd;'>Qty</th>")
                    .append("<th style='text-align:right; padding:8px; border-bottom:2px solid #ddd;'>Price</th>")
                    .append("</tr></thead><tbody>");
            for (OrderItem item : items) {
                itemsTable.append("<tr>")
                        .append("<td style='padding:8px; border-bottom:1px solid #ddd;'>").append(item.getMenuItemName()).append("</td>")
                        .append("<td style='padding:8px; text-align:center; border-bottom:1px solid #ddd;'>").append(item.getQuantity()).append("</td>")
                        .append("<td style='padding:8px; text-align:right; border-bottom:1px solid #ddd;'>₹").append(item.getLineTotal()).append("</td>")
                        .append("</tr>");
            }
            itemsTable.append("</tbody></table>");

            // HTML content with styled sections
            String htmlContent = "<!DOCTYPE html>"
                    + "<html><body style='margin:0; padding:0; background:#f7f3ef; font-family:Arial,sans-serif;'>"
                    + "<div style='max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);'>"

                    + "<div style='background:#6F4E37; padding:20px; text-align:center; color:#fff;'>"
                    + "<h1 style='margin:0; font-size:26px;'>☕ The Coffee Bean</h1>"
                    + "<p style='margin:5px 0 0;'>Payment Confirmation</p>"
                    + "</div>"

                    + "<div style='padding:25px;'>"
                    + "<p style='font-size:16px;'>Hello <strong>" + customerName + "</strong>,</p>"
                    + "<p style='font-size:15px; line-height:22px;'>"
                    + "Your payment for order <strong>#" + orderId + "</strong> has been successfully processed! 🎉"
                    + "</p>"

                    + "<h3 style='margin-top:20px;'>Order Details</h3>"
                    + itemsTable.toString()
                    + "<p style='text-align:right; font-size:16px;'><strong>Total: ₹" + totalAmount + "</strong></p>"

                    + "<p style='font-size:15px; margin-top:20px;'>You can download your invoice attached as a PDF.</p>"

                    + "<a href='http://localhost:3000' style='display:inline-block; margin-top:20px; padding:12px 20px;"
                    + "background:#6F4E37; color:#fff; text-decoration:none; border-radius:6px; font-size:15px;'>Visit Website</a>"

                    + "<p style='margin-top:20px;'>Cheers,<br/>The Coffee Bean Team</p>"
                    + "</div>"

                    + "<div style='background:#f0e8e2; padding:15px; text-align:center; font-size:12px; color:#6b6b6b;'>"
                    + "© 2025 The Coffee Bean. All rights reserved."
                    + "</div>"

                    + "</div></body></html>";

            helper.setText(htmlContent, true);

            // Attach PDF
            helper.addAttachment("Invoice_" + orderId + ".pdf", new ByteArrayResource(pdfBytes));

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send invoice email: " + e.getMessage());
        }
    }


    // --------------------------
    // OTHER EMAIL METHODS
    // --------------------------
    @Async
    public void sendOrderEmail(String to, String name, Long orderId, double totalAmount, String itemsHtml) {
        String html = loadTemplate("order_placed.html")
                .replace("{{name}}", name)
                .replace("{{totalAmount}}", String.valueOf(totalAmount))
                .replace("{{items}}", itemsHtml);

        sendHtmlEmail(to, "Your Coffee Order Confirmation", html);
    }

    @Async
    public void sendTableBookingEmail(String to, String name, int tableNo, String dateTime, int people) {
        String html = loadTemplate("table-booking.html")
                .replace("{{name}}", name)
                .replace("{{tableNumber}}", String.valueOf(tableNo))
                .replace("{{bookingTime}}", dateTime)
                .replace("{{people}}", String.valueOf(people));

        sendHtmlEmail(to, "Table Booking Confirmation", html);
    }

    @Async
    public void sendOrderStatusEmail(String to, String name, String status, String itemsHtml) {
        String html = loadTemplate("order_status.html")
                .replace("{{name}}", name)
                .replace("{{status}}", status)
                .replace("{{items}}", itemsHtml);

        sendHtmlEmail(to, "Your Order Status Updated", html);
    }

    @Async
    public void sendStaffWelcomeEmail(String to, String name, String role, String password) {
        String html = loadTemplate("staff_welcome.html")
                .replace("{{name}}", name)
                .replace("{{role}}", role)
                .replace("{{email}}", to)
                .replace("{{password}}", password);

        sendHtmlEmail(to, "Your Account Access – " + role, html);
    }

    @Async
    public void sendRegisterEmail(String to, String name) {
        String html = loadTemplate("registration.html")
                .replace("{{name}}", name);

        sendHtmlEmail(to, "Welcome to Cod Coffee!", html);
    }
}
