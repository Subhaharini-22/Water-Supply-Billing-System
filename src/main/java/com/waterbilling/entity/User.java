package com.waterbilling.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Hashed password

    @Column(nullable = false, unique = true)
    private String aadhaarNumber;

    @Column(nullable = false)
    private String houseFlatNumber;

    @Column(nullable = true)
    private String aadhaarProofImagePath;

    @Column(nullable = false)
    private String role; // "CUSTOMER" or "ADMIN"

    @Column(nullable = false)
    private Double dailyWaterLimit = 500.0; // Default 500 liters

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getHouseFlatNumber() {
        return houseFlatNumber;
    }

    public void setHouseFlatNumber(String houseFlatNumber) {
        this.houseFlatNumber = houseFlatNumber;
    }

    public String getAadhaarProofImagePath() {
        return aadhaarProofImagePath;
    }

    public void setAadhaarProofImagePath(String aadhaarProofImagePath) {
        this.aadhaarProofImagePath = aadhaarProofImagePath;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Double getDailyWaterLimit() {
        return dailyWaterLimit;
    }

    public void setDailyWaterLimit(Double dailyWaterLimit) {
        this.dailyWaterLimit = dailyWaterLimit;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

