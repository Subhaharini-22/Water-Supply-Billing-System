const user = checkAuth();
if (!user || user.role !== 'ADMIN') {
    window.location.href = '/index.html';
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        const users = await response.json();
        
        const tbody = document.getElementById('usersTableBody');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No users found</td></tr>';
            return;
        }
        
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.aadhaarNumber}</td>
                <td>${u.houseFlatNumber}</td>
                <td>${u.aadhaarProofImagePath ? `<a href="/uploads/aadhaar/${u.aadhaarProofImagePath}" target="_blank">View</a>` : 'N/A'}</td>
                <td>${u.role}</td>
                <td>${u.dailyWaterLimit} L</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Show add user form
function showAddUserForm() {
    document.getElementById('addUserModal').style.display = 'block';
}

// Close add user form
function closeAddUserForm() {
    document.getElementById('addUserModal').style.display = 'none';
    document.getElementById('addUserForm').reset();
}

// Handle add user form
document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('User added successfully!');
            closeAddUserForm();
            loadUsers();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to add user');
        }
    } catch (error) {
        alert('Error adding user. Please try again.');
        console.error('Add user error:', error);
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addUserModal');
    if (event.target == modal) {
        closeAddUserForm();
    }
}

// Make functions available globally
window.showAddUserForm = showAddUserForm;
window.closeAddUserForm = closeAddUserForm;

loadUsers();

