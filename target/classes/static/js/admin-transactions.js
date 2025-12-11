const user = checkAuth();
if (!user || user.role !== 'ADMIN') {
    window.location.href = '/index.html';
}

// Load transactions
async function loadTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    try {
        const response = await fetch(`${API_BASE_URL}/admin/transactions`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const transactions = await response.json();
        
        if (!transactions || transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No transactions found</td></tr>';
            return;
        }
        
        tbody.innerHTML = transactions.map(t => {
            // Format payment date
            let dateStr = 'N/A';
            if (t.paymentDate) {
                const date = typeof t.paymentDate === 'string' 
                    ? new Date(t.paymentDate) 
                    : new Date(t.paymentDate);
                dateStr = date.toLocaleString();
            }
            
            return `
                <tr>
                    <td>${t.userName}</td>
                    <td>${t.billMonth}</td>
                    <td>₹${t.amount.toFixed(2)}</td>
                    <td>${dateStr}</td>
                    <td>${t.paymentMode}</td>
                    <td>${t.transactionId}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading transactions:', error);
        tbody.innerHTML = '<tr><td colspan="6">Error loading transactions. Please try again.</td></tr>';
    }
}

loadTransactions();

