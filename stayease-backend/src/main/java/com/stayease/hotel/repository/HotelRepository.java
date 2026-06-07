package com.stayease.hotel.repository;

import com.stayease.hotel.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityIgnoreCase(String city);

    List<Hotel> findByManagerId(Long managerId);
}
