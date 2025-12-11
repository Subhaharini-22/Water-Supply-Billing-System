package com.waterbilling.config;

import com.waterbilling.entity.Bill;
import com.waterbilling.entity.DailyUsage;
import com.waterbilling.entity.Request;
import com.waterbilling.entity.Transaction;
import com.waterbilling.entity.User;
import com.waterbilling.repository.BillRepository;
import com.waterbilling.repository.DailyUsageRepository;
import com.waterbilling.repository.RequestRepository;
import com.waterbilling.repository.TransactionRepository;
import com.waterbilling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DailyUsageRepository dailyUsageRepository;
    
    @Autowired
    private BillRepository billRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private RequestRepository requestRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final Random random = new Random();

    @Override
    public void run(String... args) {
        // Initialize users if database is empty
        if (userRepository.count() == 0) {
            initializeData();
        } else {
            // If users exist but no usage data, generate usage data for existing customers
            if (dailyUsageRepository.count() == 0) {
                generateUsageDataForExistingUsers();
            }
            if (billRepository.count() == 0) {
                generateBillsForExistingUsers();
            }
            if (requestRepository.count() == 0) {
                generateRequestsForExistingUsers();
            }
        }
    }

    private void initializeData() {
        // Create Admin User
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@waterbilling.com");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setAadhaarNumber("123456789012");
        admin.setHouseFlatNumber("ADMIN-001");
        admin.setAadhaarProofImagePath("admin_proof.jpg");
        admin.setRole("ADMIN");
        admin.setDailyWaterLimit(0.0);
        // createdAt will be set by @PrePersist
        userRepository.save(admin);

        // Create Customer Users and store them for data generation
        List<User> customers = new ArrayList<>();
        customers.add(createCustomer("Rajesh Kumar", "rajesh.kumar@email.com", "234567890123", "A-101", 500.0));
        customers.add(createCustomer("Priya Sharma", "priya.sharma@email.com", "345678901234", "A-102", 500.0));
        customers.add(createCustomer("Amit Patel", "amit.patel@email.com", "456789012345", "A-201", 600.0));
        customers.add(createCustomer("Sneha Reddy", "sneha.reddy@email.com", "567890123456", "A-202", 500.0));
        customers.add(createCustomer("Vikram Singh", "vikram.singh@email.com", "678901234567", "B-101", 550.0));
        customers.add(createCustomer("Anjali Mehta", "anjali.mehta@email.com", "789012345678", "B-102", 500.0));
        customers.add(createCustomer("Rahul Verma", "rahul.verma@email.com", "890123456789", "B-201", 500.0));
        customers.add(createCustomer("Kavita Nair", "kavita.nair@email.com", "901234567890", "B-202", 500.0));
        customers.add(createCustomer("Mohit Agarwal", "mohit.agarwal@email.com", "012345678901", "C-101", 600.0));
        customers.add(createCustomer("Divya Iyer", "divya.iyer@email.com", "123450678901", "C-102", 500.0));
        customers.add(createCustomer("Suresh Menon", "suresh.menon@email.com", "234560789012", "C-201", 550.0));
        customers.add(createCustomer("Meera Joshi", "meera.joshi@email.com", "345670890123", "C-202", 500.0));
        customers.add(createCustomer("Arjun Desai", "arjun.desai@email.com", "456780901234", "D-101", 500.0));
        customers.add(createCustomer("Pooja Shah", "pooja.shah@email.com", "567891012345", "D-102", 600.0));
        customers.add(createCustomer("Nikhil Rao", "nikhil.rao@email.com", "678902123456", "D-201", 500.0));

        // Generate daily usage data and bills for all customers
        for (User customer : customers) {
            generateDailyUsageData(customer);
            generateBillsForUser(customer);
        }
        
        // Generate sample requests
        generateSampleRequests(customers);

        System.out.println("Database initialized with default users, usage data, bills, and requests!");
        System.out.println("Admin: admin@waterbilling.com / password123");
        System.out.println("Customer: rajesh.kumar@email.com / password123");
    }

    private User createCustomer(String name, String email, String aadhaar, String houseFlat, Double limit) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setAadhaarNumber(aadhaar);
        user.setHouseFlatNumber(houseFlat);
        user.setAadhaarProofImagePath(name.toLowerCase().replace(" ", "_") + "_proof.jpg");
        user.setRole("CUSTOMER");
        user.setDailyWaterLimit(limit);
        // createdAt will be set by @PrePersist
        return userRepository.save(user);
    }
    
    private void generateDailyUsageData(User user) {
        LocalDate today = LocalDate.now();
        double dailyLimit = user.getDailyWaterLimit();
        
        // Generate usage data for the last 30 days
        for (int i = 0; i < 30; i++) {
            LocalDate usageDate = today.minusDays(i);
            
            // Generate random usage between 300-900 liters
            double litersUsed = 300 + random.nextDouble() * 600;
            
            // Calculate extra charge if exceeds limit
            double extraCharge = 0.0;
            if (litersUsed > dailyLimit) {
                double excess = litersUsed - dailyLimit;
                extraCharge = excess * 2.0; // ₹2 per excess liter
            }
            
            DailyUsage usage = new DailyUsage();
            usage.setUser(user);
            usage.setUsageDate(usageDate);
            usage.setLitersUsed(Math.round(litersUsed * 100.0) / 100.0); // Round to 2 decimal places
            usage.setExtraCharge(Math.round(extraCharge * 100.0) / 100.0);
            
            dailyUsageRepository.save(usage);
        }
    }
    
    private void generateBillsForUser(User user) {
        for (int i = 0; i < 3; i++) {
            YearMonth yearMonth = YearMonth.now().minusMonths(i);
            String monthStr = yearMonth.toString();
            
            if (billRepository.findByUserAndBillMonth(user, monthStr).isPresent()) {
                continue;
            }
            
            LocalDate startDate = yearMonth.atDay(1);
            LocalDate endDate = yearMonth.atEndOfMonth();
            List<DailyUsage> usages = dailyUsageRepository.findByUserAndUsageDateBetween(user, startDate, endDate);
            
            double baseAmount = 500.0;
            double extraCharge = usages.stream()
                    .mapToDouble(DailyUsage::getExtraCharge)
                    .sum();
            
            boolean isPaid;
            if (i == 0) {
                isPaid = false; // current month unpaid
            } else if (i == 1) {
                isPaid = random.nextBoolean();
            } else {
                isPaid = true;
            }
            
            LocalDate dueDate = yearMonth.plusMonths(1).atDay(15);
            double lateFee = (!isPaid && dueDate.isBefore(LocalDate.now())) ? 50.0 : 0.0;
            double totalAmount = baseAmount + extraCharge + lateFee;
            
            Bill bill = new Bill();
            bill.setUser(user);
            bill.setBillMonth(monthStr);
            bill.setBaseAmount(baseAmount);
            bill.setExtraCharge(Math.round(extraCharge * 100.0) / 100.0);
            bill.setLateFee(Math.round(lateFee * 100.0) / 100.0);
            bill.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);
            bill.setDueDate(dueDate);
            bill.setIsPaid(isPaid);
            
            Bill savedBill = billRepository.save(bill);
            
            if (isPaid) {
                createTransactionForBill(savedBill);
            }
        }
    }
    
    private void createTransactionForBill(Bill bill) {
        Transaction transaction = new Transaction();
        transaction.setUser(bill.getUser());
        transaction.setBill(bill);
        transaction.setBillMonth(bill.getBillMonth());
        transaction.setAmount(bill.getTotalAmount());
        
        LocalDate paymentDate = bill.getDueDate().minusDays(Math.min(10, Math.max(1, random.nextInt(10) + 1)));
        LocalDateTime paymentDateTime = paymentDate.atTime(10 + random.nextInt(6), random.nextInt(60));
        transaction.setPaymentDate(paymentDateTime);
        transaction.setPaymentMode("UPI-QR");
        transaction.setTransactionId("TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        transactionRepository.save(transaction);
    }
    
    private void generateUsageDataForExistingUsers() {
        List<User> customers = userRepository.findByRole("CUSTOMER");
        for (User customer : customers) {
            generateDailyUsageData(customer);
        }
        System.out.println("Generated daily usage data for " + customers.size() + " existing customers!");
    }
    
    private void generateBillsForExistingUsers() {
        List<User> customers = userRepository.findByRole("CUSTOMER");
        for (User customer : customers) {
            generateBillsForUser(customer);
        }
        System.out.println("Generated bills for " + customers.size() + " existing customers!");
    }
    
    private void generateSampleRequests(List<User> customers) {
        String[] requestTypes = {"NEW_CONNECTION", "EXTRA_WATER", "INFO_UPDATE"};
        String[] statuses = {"PENDING", "ACCEPTED", "DECLINED"};
        String[] descriptions = {
            "Request for new water connection",
            "Need extra water supply for upcoming festival",
            "Update house number information",
            "Request for increased daily limit",
            "Temporary increase for construction work",
            "Need extra water for garden",
            "Update contact information",
            "Change email address",
            "Update Aadhaar number",
            "Request for water meter installation",
            "Complaint about water quality",
            "Request for water pressure increase"
        };
        
        // Generate 12-15 random requests
        for (int i = 0; i < 12; i++) {
            User randomUser = customers.get(random.nextInt(customers.size()));
            String requestType = requestTypes[random.nextInt(requestTypes.length)];
            String description = descriptions[random.nextInt(descriptions.length)];
            String status = statuses[random.nextInt(statuses.length)];
            
            Request request = new Request();
            request.setUser(randomUser);
            request.setRequestType(requestType);
            request.setDescription(description);
            request.setStatus(status);
            request.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(30)));
            
            requestRepository.save(request);
        }
    }
    
    private void generateRequestsForExistingUsers() {
        List<User> customers = userRepository.findByRole("CUSTOMER");
        generateSampleRequests(customers);
        System.out.println("Generated sample requests for " + customers.size() + " customers!");
    }
}

