package com.cod.repository;

import com.cod.model.Role;
import com.cod.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used for login)
    Optional<User> findByEmail(String email);

    // Find users by role (for admin to list chefs/waiters/customers)
    List<User> findByRole(Role role);

    // Check if user exists by email (for registration)
    boolean existsByEmail(String email);
}
