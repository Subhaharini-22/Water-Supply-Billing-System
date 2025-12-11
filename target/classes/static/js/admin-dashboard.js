const user = checkAuth();
if (!user || user.role !== 'ADMIN') {
    window.location.href = '/index.html';
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        // Load users
        const usersResponse = await fetch(`${API_BASE_URL}/admin/users`);
        const users = await usersResponse.json();
        document.getElementById('totalUsers').textContent = users.length;
        
        // Load requests
        const requestsResponse = await fetch(`${API_BASE_URL}/admin/requests`);
        const requests = await requestsResponse.json();
        const pendingRequests = requests.filter(r => r.status === 'PENDING');
        document.getElementById('pendingRequests').textContent = pendingRequests.length;
        
        // Load transactions for current month
        const transactionsResponse = await fetch(`${API_BASE_URL}/admin/transactions`);
        const transactions = await transactionsResponse.json();
        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyTransactions = transactions.filter(t => t.billMonth === currentMonth);
        const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
        document.getElementById('monthlyRevenue').textContent = monthlyRevenue.toFixed(2);
        
        // Load unpaid bills (approximate - would need a separate endpoint)
        document.getElementById('unpaidBills').textContent = '-';
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

loadDashboardStats();

