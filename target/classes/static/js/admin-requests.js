const user = checkAuth();
if (!user || user.role !== 'ADMIN') {
    window.location.href = '/index.html';
}

// Load requests
async function loadRequests() {
    const tbody = document.getElementById('requestsTableBody');
    try {
        const response = await fetch(`${API_BASE_URL}/admin/requests`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const requests = await response.json();
        
        if (!requests || requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No requests found</td></tr>';
            return;
        }
        
        tbody.innerHTML = requests.map(r => {
            // Format date
            let dateStr = 'N/A';
            if (r.createdAt) {
                const date = typeof r.createdAt === 'string' 
                    ? new Date(r.createdAt) 
                    : new Date(r.createdAt);
                dateStr = date.toLocaleString();
            }
            
            // Format request type
            const requestTypeDisplay = r.requestType
                .replace('_', ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            
            // Status badge
            let statusClass = 'status-pending';
            if (r.status === 'ACCEPTED') {
                statusClass = 'status-paid';
            } else if (r.status === 'DECLINED') {
                statusClass = 'status-overdue';
            }
            
            // Action buttons
            let actions = '';
            if (r.status === 'PENDING') {
                actions = `
                    <button onclick="updateRequestStatus(${r.id}, 'ACCEPTED')" class="btn btn-success" style="margin-right: 5px;">Accept</button>
                    <button onclick="updateRequestStatus(${r.id}, 'DECLINED')" class="btn btn-danger">Decline</button>
                `;
            } else {
                actions = `<span class="status-badge ${statusClass}">${r.status}</span>`;
            }
            
            return `
                <tr>
                    <td>${r.userName}</td>
                    <td>${r.userEmail}</td>
                    <td>${requestTypeDisplay}</td>
                    <td>${r.description}</td>
                    <td><span class="status-badge ${statusClass}">${r.status}</span></td>
                    <td>${dateStr}</td>
                    <td>${actions}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading requests:', error);
        tbody.innerHTML = '<tr><td colspan="7">Error loading requests. Please try again.</td></tr>';
    }
}

// Update request status
async function updateRequestStatus(requestId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/requests/${requestId}?status=${status}`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            alert(`Request ${status.toLowerCase()} successfully!`);
            loadRequests(); // Reload the table
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update request status');
        }
    } catch (error) {
        alert('Error updating request status. Please try again.');
        console.error('Update request error:', error);
    }
}

// Make function available globally
window.updateRequestStatus = updateRequestStatus;

loadRequests();

