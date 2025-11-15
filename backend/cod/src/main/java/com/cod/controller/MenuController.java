// src/main/java/com/cod/controller/MenuController.java
package com.cod.controller;

import com.cod.model.MenuItem;
import com.cod.repository.MenuItemRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:3000")
public class MenuController {

    @Autowired
    private MenuItemRepository menuRepo;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    // Fetch all menu items
    @GetMapping("/all")
    public List<MenuItem> getAllMenuItems() {
        return menuRepo.findAll();
    }

    // Add new menu item with image
    @PostMapping(value = "/add", consumes = { "multipart/form-data" })
    public ResponseEntity<?> addMenuItem(
            @RequestPart("menuItem") MenuItem item,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + Paths.get(imageFile.getOriginalFilename()).getFileName().toString();
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Save image URL for frontend access
                item.setImageUrl("http://localhost:8080/uploads/" + fileName);
            }
            MenuItem saved = menuRepo.save(item);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }

    // Update existing menu item
    @PutMapping(value = "/update/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<?> updateMenuItem(
            @PathVariable Long id,
            @RequestPart("menuItem") MenuItem updatedItem,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return menuRepo.findById(id).map(item -> {
            try {
                item.setName(updatedItem.getName());
                item.setCategory(updatedItem.getCategory());
                item.setPrice(updatedItem.getPrice());
                item.setDescription(updatedItem.getDescription());

                // If new image uploaded, replace old one (and delete the old file if exists)
                if (imageFile != null && !imageFile.isEmpty()) {
                    // delete old file if available
                    if (item.getImageUrl() != null && item.getImageUrl().contains("/uploads/")) {
                        String oldFileName = item.getImageUrl().substring(item.getImageUrl().lastIndexOf("/uploads/") + 9);
                        try {
                            Files.deleteIfExists(Paths.get(UPLOAD_DIR).resolve(oldFileName));
                        } catch (IOException ex) {
                            // log but don't fail update
                            ex.printStackTrace();
                        }
                    }

                    String fileName = UUID.randomUUID() + "_" + Paths.get(imageFile.getOriginalFilename()).getFileName().toString();
                    Path uploadPath = Paths.get(UPLOAD_DIR);
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    item.setImageUrl("http://localhost:8080/uploads/" + fileName);
                }

                MenuItem savedItem = menuRepo.save(item);
                return ResponseEntity.ok(savedItem);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image update failed");
            }
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Menu item not found"));
    }

    // Delete a menu item and its image file if exists
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        return menuRepo.findById(id).map(item -> {
            // delete image file if available
            if (item.getImageUrl() != null && item.getImageUrl().contains("/uploads/")) {
                String fileName = item.getImageUrl().substring(item.getImageUrl().lastIndexOf("/uploads/") + 9);
                try {
                    Files.deleteIfExists(Paths.get(UPLOAD_DIR).resolve(fileName));
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
            menuRepo.deleteById(id);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Menu item not found"));
    }
}
