const user = checkAuth();
if (!user || user.role !== 'ADMIN') {
    window.location.href = '/index.html';
}

// Load revenue data and create chart
async function loadRevenueChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/revenue?months=6`);
        const revenueData = await response.json();
        
        const labels = revenueData.map(r => {
            const [year, month] = r.month.split('-');
            const date = new Date(year, month - 1);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });
        
        const amounts = revenueData.map(r => r.revenue);
        
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Revenue (₹)',
                    data: amounts,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Revenue Trend (Last 6 Months)',
                        font: {
                            size: 18
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading revenue chart:', error);
        document.getElementById('revenueChart').parentElement.innerHTML = 
            '<p class="error">Error loading revenue data. Please try again later.</p>';
    }
}

loadRevenueChart();

