package com.waterbilling.controller;

import com.waterbilling.dto.BillDTO;
import com.waterbilling.dto.DailyUsageDTO;
import com.waterbilling.dto.PaymentRequest;
import com.waterbilling.service.BillService;
import com.waterbilling.service.DailyUsageService;
import com.waterbilling.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {
    @Autowired
    private DailyUsageService dailyUsageService;

    @Autowired
    private BillService billService;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{userId}/usage")
    public ResponseEntity<List<DailyUsageDTO>> getDailyUsage(@PathVariable Long userId) {
        return ResponseEntity.ok(dailyUsageService.getUserDailyUsage(userId));
    }

    @GetMapping("/{userId}/bills")
    public ResponseEntity<List<BillDTO>> getBills(@PathVariable Long userId) {
        return ResponseEntity.ok(billService.getUserBills(userId));
    }

    @PostMapping("/payment")
    public ResponseEntity<?> makePayment(@RequestBody PaymentRequest request) {
        try {
            String transactionId = request.getTransactionId();
            if (transactionId == null || transactionId.isEmpty()) {
                transactionId = "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            }
            transactionService.createTransaction(request.getBillId(), transactionId);
            return ResponseEntity.ok().body("{\"message\": \"Payment successful\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }
}

