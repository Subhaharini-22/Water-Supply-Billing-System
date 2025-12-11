package com.waterbilling.controller;

import com.waterbilling.dto.*;
import com.waterbilling.entity.User;
import com.waterbilling.service.EmailService;
import com.waterbilling.service.OtpService;
import com.waterbilling.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail());
        
        if (user == null) {
            return ResponseEntity.ok(new LoginResponse(false, "User not found"));
        }

        if (!userService.validatePassword(request.getPassword(), user.getPassword())) {
            return ResponseEntity.ok(new LoginResponse(false, "Invalid password"));
        }

        LoginResponse response = new LoginResponse(true, "Login successful");
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/request-password-change")
    public ResponseEntity<Map<String, Object>> requestPasswordChange(@RequestBody OtpRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userService.findByEmail(request.getEmail());
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found with this email");
                return ResponseEntity.ok(response);
            }

            // Generate and send OTP
            String otp = otpService.generateOtp(request.getEmail());
            emailService.sendOtpEmail(request.getEmail(), user.getName(), otp);

            response.put("success", true);
            response.put("message", "OTP has been sent to your email. Please check your inbox.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send OTP: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody PasswordChangeRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verify OTP
            if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
                response.put("success", false);
                response.put("message", "Invalid or expired OTP");
                return ResponseEntity.ok(response);
            }

            // Validate new password
            if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
                response.put("success", false);
                response.put("message", "Password must be at least 6 characters long");
                return ResponseEntity.ok(response);
            }

            // Change password
            userService.changePassword(request.getEmail(), request.getNewPassword());

            response.put("success", true);
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to change password: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}

