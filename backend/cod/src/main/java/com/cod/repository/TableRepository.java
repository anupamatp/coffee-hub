package com.cod.repository;

import com.cod.model.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TableRepository extends JpaRepository<TableEntity, Long> {

    List<TableEntity> findByAvailable(boolean available);

    Optional<TableEntity> findByTableNumber(int tableNumber);
}
