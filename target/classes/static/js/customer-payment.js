const user = checkAuth();
if (!user || user.role !== 'CUSTOMER') {
    window.location.href = '/index.html';
}

let selectedBill = null;

// Get bill ID from URL
const urlParams = new URLSearchParams(window.location.search);
const billIdFromUrl = urlParams.get('billId');

// Load bills for dropdown
async function loadBills() {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/${user.userId}/bills`);
        const bills = await response.json();
        const unpaidBills = bills.filter(b => !b.isPaid);
        
        const select = document.getElementById('billSelect');
        
        if (unpaidBills.length === 0) {
            select.innerHTML = '<option value="">No unpaid bills</option>';
            return;
        }
        
        select.innerHTML = '<option value="">Select a bill...</option>' +
            unpaidBills.map(bill => 
                `<option value="${bill.id}" ${bill.id == billIdFromUrl ? 'selected' : ''}>${bill.billMonth} - ₹${bill.totalAmount.toFixed(2)}</option>`
            ).join('');
        
        // If bill ID from URL, select it
        if (billIdFromUrl) {
            select.value = billIdFromUrl;
            selectBill(billIdFromUrl);
        }
        
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                selectBill(e.target.value);
            } else {
                document.getElementById('billDetails').style.display = 'none';
                document.getElementById('paymentBtn').disabled = true;
            }
        });
    } catch (error) {
        console.error('Error loading bills:', error);
    }
}

// Select bill and show details
function selectBill(billId) {
    fetch(`${API_BASE_URL}/customer/${user.userId}/bills`)
        .then(res => res.json())
        .then(bills => {
            selectedBill = bills.find(b => b.id == billId);
            if (selectedBill) {
                document.getElementById('billMonth').textContent = selectedBill.billMonth;
                document.getElementById('baseAmount').textContent = selectedBill.baseAmount.toFixed(2);
                document.getElementById('extraCharge').textContent = selectedBill.extraCharge.toFixed(2);
                document.getElementById('lateFee').textContent = selectedBill.lateFee.toFixed(2);
                document.getElementById('totalAmount').textContent = selectedBill.totalAmount.toFixed(2);
                document.getElementById('billDetails').style.display = 'block';
                document.getElementById('paymentBtn').disabled = false;
            }
        });
}

// Complete payment
async function completePayment() {
    if (!selectedBill) {
        alert('Please select a bill');
        return;
    }
    
    const messageDiv = document.getElementById('paymentMessage');
    messageDiv.className = 'message';
    messageDiv.textContent = 'Processing payment...';
    
    try {
        const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        const response = await fetch(`${API_BASE_URL}/customer/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                billId: selectedBill.id,
                transactionId: transactionId
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Payment completed successfully! Transaction ID: ' + transactionId;
            document.getElementById('paymentBtn').disabled = true;
            
            setTimeout(() => {
                window.location.href = 'bills.html';
            }, 2000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.message || 'Payment failed';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error processing payment. Please try again.';
        console.error('Payment error:', error);
    }
}

// Make completePayment available globally
window.completePayment = completePayment;

loadBills();

