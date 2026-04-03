package com.cod.invoice;

import com.cod.model.OrderItem;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class InvoiceGenerator {

    /**
     * Generates a PDF invoice for a given order.
     *
     * @param orderId      ID of the order
     * @param customerName Name of the customer
     * @param items        List of OrderItem objects
     * @param total        Total amount of the order
     * @return PDF as byte array
     * @throws Exception if PDF generation fails
     */
    public static byte[] generateInvoice(Long orderId, String customerName, List<OrderItem> items, double total) throws Exception {
        // Output stream to hold PDF data
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Initialize PDF writer and document
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Title
        document.add(new Paragraph("☕ Coffee Bean Invoice")
                .setFont(PdfFontFactory.createFont())
                .setBold()
                .setFontSize(18));

        // Order and Customer Info
        document.add(new Paragraph("Order ID: " + orderId));
        document.add(new Paragraph("Customer: " + customerName));
        document.add(new Paragraph("\n"));

        // Table for order items
        Table table = new Table(new float[]{4, 1, 2});
        table.addHeaderCell("Item");
        table.addHeaderCell("Qty");
        table.addHeaderCell("Price (₹)");

        for (OrderItem item : items) {
            table.addCell(item.getMenuItemName());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell(String.format("₹%.2f", item.getMenuItemPrice() * item.getQuantity()));
        }

        document.add(table);

        // Total
        document.add(new Paragraph("\nTotal: ₹" + String.format("%.2f", total)).setBold());

        // Close document
        document.close();

        return baos.toByteArray();
    }
}
