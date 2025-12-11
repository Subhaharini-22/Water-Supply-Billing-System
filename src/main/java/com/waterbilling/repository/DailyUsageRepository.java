package com.waterbilling.repository;

import com.waterbilling.entity.DailyUsage;
import com.waterbilling.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyUsageRepository extends JpaRepository<DailyUsage, Long> {
    List<DailyUsage> findByUserOrderByUsageDateDesc(User user);
    List<DailyUsage> findByUserAndUsageDateBetween(User user, LocalDate startDate, LocalDate endDate);
    DailyUsage findByUserAndUsageDate(User user, LocalDate date);
}

