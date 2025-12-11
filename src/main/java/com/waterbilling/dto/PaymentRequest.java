package com.waterbilling.dto;

public class PaymentRequest {
    private Long billId;
    private String transactionId;

    public PaymentRequest() {}

    public Long getBillId() {
        return billId;
    }

    public void setBillId(Long billId) {
        this.billId = billId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
}

