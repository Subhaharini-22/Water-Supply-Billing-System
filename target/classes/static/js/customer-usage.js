const user = checkAuth();
if (!user || user.role !== 'CUSTOMER') {
    window.location.href = '/index.html';
}

async function loadUsage() {
    const tbody = document.getElementById('usageTableBody');
    try {
        const response = await fetch(`${API_BASE_URL}/customer/${user.userId}/usage`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const usage = await response.json();
        
        if (!usage || usage.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No usage data found</td></tr>';
            return;
        }
        
        tbody.innerHTML = usage.map(u => {
            // Parse date string (format: yyyy-MM-dd)
            let dateStr = u.usageDate;
            if (typeof dateStr === 'string') {
                const date = new Date(dateStr + 'T00:00:00'); // Add time to avoid timezone issues
                dateStr = date.toLocaleDateString();
            } else {
                dateStr = new Date(u.usageDate).toLocaleDateString();
            }
            const extraChargeDisplay = u.extraCharge > 0 ? `₹${u.extraCharge.toFixed(2)}` : '-';
            
            return `
                <tr>
                    <td>${dateStr}</td>
                    <td>${u.litersUsed.toFixed(2)} liters</td>
                    <td>${extraChargeDisplay}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading usage:', error);
        document.getElementById('usageTableBody').innerHTML = '<tr><td colspan="3">Error loading usage data</td></tr>';
    }
}

loadUsage();

