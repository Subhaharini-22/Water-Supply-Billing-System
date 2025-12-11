const API_BASE_URL = 'http://localhost:8080/api';

let userEmail = '';

// Step 1: Request OTP
document.getElementById('requestOtpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('otpMessage');
    messageDiv.className = 'message';
    messageDiv.textContent = 'Sending OTP...';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/request-password-change`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = data.message || 'OTP sent successfully! Please check your email.';
            userEmail = email;
            
            // Move to step 2
            setTimeout(() => {
                document.getElementById('step1').classList.remove('active');
                document.getElementById('step2').classList.add('active');
            }, 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message || 'Failed to send OTP. Please try again.';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error connecting to server. Please try again.';
        console.error('Request OTP error:', error);
    }
});

// Step 2: Verify OTP and Change Password
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const otp = document.getElementById('otp').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('passwordMessage');
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Passwords do not match!';
        return;
    }

    // Validate password length
    if (newPassword.length < 6) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Password must be at least 6 characters long!';
        return;
    }

    messageDiv.className = 'message';
    messageDiv.textContent = 'Changing password...';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                otp: otp,
                newPassword: newPassword
            })
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = data.message || 'Password changed successfully!';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message || 'Failed to change password. Please try again.';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error connecting to server. Please try again.';
        console.error('Change password error:', error);
    }
});

// Auto-format OTP input
document.getElementById('otp').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
});

