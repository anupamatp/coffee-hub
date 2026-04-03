package com.cod.dto;

import lombok.Data;

@Data
public class FeedbackResponse {
    private Long id;
    private String customerName;
    private String comment;
    private int rating;
    private String createdAt;
}
