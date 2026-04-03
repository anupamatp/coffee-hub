package com.cod.controller;

import com.cod.dto.FeedbackResponse;
import com.cod.model.Feedback;
import com.cod.model.Order;
import com.cod.model.User;
import com.cod.repository.FeedbackRepository;
import com.cod.repository.OrderRepository;
import com.cod.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // ------------------ CUSTOMER ADDS FEEDBACK ------------------
    @PostMapping("/add")
    public Feedback addFeedback(@RequestBody Feedback feedback) {

        Feedback savedFeedback = feedbackRepository.save(feedback);

        // Mark order feedbackGiven = true
        Order order = orderRepository.findById(feedback.getOrderId()).orElse(null);
        if (order != null) {
            order.setFeedbackGiven(true);
            orderRepository.save(order);
        }

        return savedFeedback;
    }

    // ------------------ ADMIN: GET ALL FEEDBACK WITH USER NAME ------------------
    @GetMapping("/all")
    public List<FeedbackResponse> getAllFeedbacks() {

        List<Feedback> feedbacks = feedbackRepository.findAll();

        return feedbacks.stream().map(fb -> {
            FeedbackResponse dto = new FeedbackResponse();

            dto.setId(fb.getId());
            dto.setComment(fb.getComment());
            dto.setRating(fb.getRating());
            dto.setCreatedAt(fb.getCreatedAt().toString());

            // Fetching user's name
            User user = userRepository.findById(fb.getUserId()).orElse(null);
            dto.setCustomerName(user != null ? user.getName() : "Unknown");

            return dto;
        }).toList();
    }

    // ------------------ CUSTOMER: GET FEEDBACK BY USER ------------------
    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbackByUser(@PathVariable Long userId) {
        return feedbackRepository.findByUserId(userId);
    }

    // ------------------ GET FEEDBACK BY ORDER ------------------
    @GetMapping("/order/{orderId}")
    public List<Feedback> getFeedbackByOrder(@PathVariable Long orderId) {
        return feedbackRepository.findByOrderId(orderId);
    }
}
