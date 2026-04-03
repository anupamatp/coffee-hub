package com.cod.controller;

import com.cod.model.Report;
import com.cod.model.User;
import com.cod.repository.ReportRepository;
import com.cod.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    // ---- SUBMIT REPORT ----
    @PostMapping("/add")
    public Report submitReport(@RequestBody ReportRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = new Report();
        report.setUser(user);
        report.setType(request.getType());
        report.setMessage(request.getMessage());

        return reportRepository.save(report);
    }

    // ---- FETCH ALL REPORTS FOR ADMIN ----
    @GetMapping("/all")
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    // DTO for request
    public static class ReportRequest {
        private Long userId;
        private String type;
        private String message;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
