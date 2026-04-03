package com.cod.controller;

import com.cod.model.TableEntity;
import com.cod.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:3000")
public class TableController {

    @Autowired
    private TableRepository tableRepo;

    @GetMapping("/all")
    public List<TableEntity> getAllTables() {
        return tableRepo.findAll();
    }

    // ✅ ADDED: Get available tables (CRITICAL for frontend)
    @GetMapping("/available")
    public List<TableEntity> getAvailableTables() {
        return tableRepo.findByAvailable(true);
    }

    @PostMapping("/add")
    public TableEntity addTable(@RequestBody TableEntity table) {
        return tableRepo.save(table);
    }

    @PutMapping("/{id}/status")
    public TableEntity updateTableStatus(@PathVariable Long id, @RequestParam boolean available) {
        TableEntity table = tableRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        table.setAvailable(available);
        return tableRepo.save(table);
    }

    @DeleteMapping("/{id}")
    public void deleteTable(@PathVariable Long id) {
        tableRepo.deleteById(id);
    }
}