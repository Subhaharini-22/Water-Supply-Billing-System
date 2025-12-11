package com.waterbilling.repository;

import com.waterbilling.entity.Bill;
import com.waterbilling.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByUserOrderByBillMonthDesc(User user);
    Optional<Bill> findByUserAndBillMonth(User user, String billMonth);
    List<Bill> findByIsPaidFalseAndDueDateBefore(LocalDate date);
    List<Bill> findByIsPaidFalse();
}

