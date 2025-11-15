package com.cod.controller;

import com.cod.model.User;
import com.cod.model.Role;
import com.cod.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Add Chef, Waiter, or Admin
    @PostMapping("/add-user")
    public ResponseEntity<?> addUser(@RequestBody User user) {

        // Check required fields
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        if (user.getRole() == null) {
            return ResponseEntity.badRequest().body("Role is required");
        }

        // Only allow specific roles
        if (!(user.getRole() == Role.CHEF || user.getRole() == Role.WAITER || user.getRole() == Role.ADMIN)) {
            return ResponseEntity.badRequest().body("Role must be CHEF, WAITER, or ADMIN");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // List all staff (CHEF or WAITER)
    @GetMapping("/staff")
    public ResponseEntity<List<User>> listStaff() {
        List<User> staff = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == Role.CHEF || u.getRole() == Role.WAITER)
                .toList();
        return ResponseEntity.ok(staff);
    }
}
