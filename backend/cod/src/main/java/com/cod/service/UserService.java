package com.cod.service;

import com.cod.model.User;
import com.cod.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.cod.model.Role;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register a new user
    public User register(User user) {

        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        // Load HTML template
        String htmlTemplate = loadEmailTemplate("templates/registration.html");

        // Replace placeholders
        htmlTemplate = htmlTemplate
                .replace("{{name}}", user.getName())
                .replace("{{ctaUrl}}", "http://localhost:3000"); // Replace with your frontend URL

        // Send HTML email asynchronously
        emailService.sendHtmlEmail(user.getEmail(), "Welcome to The Coffee Bean!", htmlTemplate);

        return savedUser;
    }
    // existing code...

    // Get ALL users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    // Login
    public Optional<User> login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Update user
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (updatedUser.getName() != null)
                        existingUser.setName(updatedUser.getName());
                    if (updatedUser.getEmail() != null)
                        existingUser.setEmail(updatedUser.getEmail());
                    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty())
                        existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));


                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // Load email template from resources/templates
    private String loadEmailTemplate(String path) {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (inputStream == null) {
                throw new RuntimeException("Email template not found at: " + path);
            }
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error reading email template: " + e.getMessage());
        }
    }
}
