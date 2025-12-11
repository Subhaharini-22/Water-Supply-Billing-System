const user = checkAuth();
if (!user || user.role !== 'CUSTOMER') {
    window.location.href = '/index.html';
}

document.getElementById('userName').textContent = user.name;

// Load daily usage
async function loadDailyUsage() {
    const chartDiv = document.getElementById('dailyUsageChart');
    const todayUsageEl = document.getElementById('todayUsage');
    const dailyLimitEl = document.getElementById('dailyLimit');
    const warningDiv = document.getElementById('limitWarning');
    const defaultLimit = user.dailyWaterLimit || 500;

    try {
        const response = await fetch(`${API_BASE_URL}/customer/${user.userId}/usage`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const usage = await response.json();
        
        if (usage.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            // Find today's usage - usageDate comes as string "yyyy-MM-dd"
            const todayUsage = usage.find(u => {
                const usageDateStr = typeof u.usageDate === 'string' ? u.usageDate : new Date(u.usageDate).toISOString().split('T')[0];
                return usageDateStr === today;
            });
            
            if (todayUsage) {
                todayUsageEl.textContent = todayUsage.litersUsed.toFixed(2);
                dailyLimitEl.textContent = defaultLimit.toString();
                
                if (todayUsage.litersUsed > defaultLimit && warningDiv) {
                    warningDiv.style.display = 'block';
                } else if (warningDiv) {
                    warningDiv.style.display = 'none';
                }
            } else {
                todayUsageEl.textContent = '-';
                dailyLimitEl.textContent = defaultLimit.toString();
                if (warningDiv) warningDiv.style.display = 'none';
            }
            
            // Show recent usage chart
            const recentUsage = usage.slice(0, 7).reverse();
            chartDiv.innerHTML = '<canvas id="usageChart"></canvas>';
            
            // Simple bar chart representation
            let chartHTML = '<div style="display: flex; align-items: flex-end; height: 150px; gap: 10px;">';
            recentUsage.forEach(u => {
                const height = (u.litersUsed / 900) * 100;
                const color = u.litersUsed > defaultLimit ? '#dc3545' : '#28a745';
                const dateStr = typeof u.usageDate === 'string' ? u.usageDate : new Date(u.usageDate).toISOString().split('T')[0];
                chartHTML += `<div style="flex: 1; background: ${color}; height: ${height}%; border-radius: 5px 5px 0 0;" title="${dateStr}: ${u.litersUsed}L"></div>`;
            });
            chartHTML += '</div>';
            chartDiv.innerHTML = chartHTML;
        } else {
            chartDiv.innerHTML = '<p>No usage data available yet.</p>';
            todayUsageEl.textContent = '-';
            dailyLimitEl.textContent = defaultLimit.toString();
            if (warningDiv) warningDiv.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading usage:', error);
        chartDiv.innerHTML = '<p>Error loading usage data.</p>';
        todayUsageEl.textContent = '-';
        dailyLimitEl.textContent = defaultLimit.toString();
        if (warningDiv) warningDiv.style.display = 'none';
    }
}

// Load bills summary
async function loadBillsSummary() {
    const summaryDiv = document.getElementById('billSummary');
    try {
        const response = await fetch(`${API_BASE_URL}/customer/${user.userId}/bills`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const bills = await response.json();
        
        if (bills.length > 0) {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const currentBill = bills.find(b => b.billMonth === currentMonth);
            
            if (currentBill) {
                summaryDiv.innerHTML = `
                    <p><strong>Current Month:</strong> ${currentBill.billMonth}</p>
                    <p><strong>Total Amount:</strong> ₹${currentBill.totalAmount.toFixed(2)}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${currentBill.isPaid ? 'status-paid' : 'status-unpaid'}">${currentBill.isPaid ? 'Paid' : 'Unpaid'}</span></p>
                `;
            } else {
                summaryDiv.innerHTML = '<p>No bill for current month</p>';
            }
        } else {
            summaryDiv.innerHTML = '<p>No bills available yet.</p>';
        }
    } catch (error) {
        console.error('Error loading bills:', error);
        summaryDiv.innerHTML = '<p>Error loading bill information.</p>';
    }
}

// Load unpaid bills
async function loadUnpaidBills() {
    const unpaidDiv = document.getElementById('unpaidBills');
    try {
        const response = await fetch(`${API_BASE_URL}/customer/${user.userId}/bills`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const bills = await response.json();
        const unpaid = bills.filter(b => !b.isPaid);
        
        if (unpaid.length > 0) {
            unpaidDiv.innerHTML = unpaid.map(bill => `
                <div style="margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                    <strong>${bill.billMonth}</strong> - ₹${bill.totalAmount.toFixed(2)}
                    ${new Date(bill.dueDate) < new Date() ? '<span class="status-badge status-overdue">Overdue</span>' : ''}
                </div>
            `).join('');
        } else {
            unpaidDiv.innerHTML = '<p>No unpaid bills</p>';
        }
    } catch (error) {
        console.error('Error loading unpaid bills:', error);
        unpaidDiv.innerHTML = '<p>Error loading unpaid bills.</p>';
    }
}

// Load all data
loadDailyUsage();
loadBillsSummary();
loadUnpaidBills();

