package com.waterbilling.dto;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String aadhaarNumber;
    private String houseFlatNumber;
    private String aadhaarProofImagePath;
    private String role;
    private Double dailyWaterLimit;

    public UserDTO() {}

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
}

