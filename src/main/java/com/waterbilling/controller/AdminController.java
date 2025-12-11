package com.waterbilling.controller;

import com.waterbilling.dto.*;
import com.waterbilling.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private RequestService requestService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private RevenueService revenueService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("aadhaarNumber") String aadhaarNumber,
            @RequestParam("houseFlatNumber") String houseFlatNumber,
            @RequestParam(value = "role", defaultValue = "CUSTOMER") String role,
            @RequestParam(value = "dailyWaterLimit", defaultValue = "500") Double dailyWaterLimit,
            @RequestParam(value = "aadhaarFile", required = false) MultipartFile aadhaarFile) {
        try {
            UserDTO userDTO = new UserDTO();
            userDTO.setName(name);
            userDTO.setEmail(email);
            userDTO.setAadhaarNumber(aadhaarNumber);
            userDTO.setHouseFlatNumber(houseFlatNumber);
            userDTO.setRole(role);
            userDTO.setDailyWaterLimit(dailyWaterLimit);

            UserDTO created = userService.createUser(userDTO, aadhaarFile);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<List<RequestDTO>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @PutMapping("/requests/{requestId}")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam String status) {
        try {
            RequestDTO updated = requestService.updateRequestStatus(requestId, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueDTO>> getRevenue(@RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(revenueService.getMonthlyRevenue(months));
    }
}

