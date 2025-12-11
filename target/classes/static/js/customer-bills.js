const user = checkAuth();
if (!user || user.role !== 'CUSTOMER') {
    window.location.href = '/index.html';
}

async function loadBills() {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/${user.userId}/bills`);
        const bills = await response.json();
        
        const billsDiv = document.getElementById('billsList');
        
        if (bills.length === 0) {
            billsDiv.innerHTML = '<p>No bills found</p>';
            return;
        }
        
        billsDiv.innerHTML = bills.map(bill => {
            const dueDateStr = typeof bill.dueDate === 'string'
                ? bill.dueDate
                : new Date(bill.dueDate).toISOString().split('T')[0];
            const dueDate = new Date(dueDateStr + 'T00:00:00');
            const isOverdue = !bill.isPaid && dueDate < new Date();
            
            return `
                <div class="bill-card">
                    <div class="bill-info">
                        <h3>Bill for ${bill.billMonth}</h3>
                        <p><strong>Base Amount:</strong> ₹${bill.baseAmount.toFixed(2)}</p>
                        <p><strong>Extra Charge:</strong> ₹${bill.extraCharge.toFixed(2)}</p>
                        <p><strong>Late Fee:</strong> ₹${bill.lateFee.toFixed(2)}</p>
                        <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
                        <span class="status-badge ${bill.isPaid ? 'status-paid' : (isOverdue ? 'status-overdue' : 'status-unpaid')}">
                            ${bill.isPaid ? 'Paid' : (isOverdue ? 'Overdue' : 'Unpaid')}
                        </span>
                    </div>
                    <div class="bill-amount">
                        <div class="amount">₹${bill.totalAmount.toFixed(2)}</div>
                        ${!bill.isPaid ? `<a href="payment.html?billId=${bill.id}" class="btn btn-primary" style="margin-top: 10px; display: inline-block; text-decoration: none;">Pay Now</a>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading bills:', error);
        document.getElementById('billsList').innerHTML = '<p>Error loading bills. Please try again.</p>';
    }
}

loadBills();

