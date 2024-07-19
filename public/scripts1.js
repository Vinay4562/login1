document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        alert('Token not found. Unable to reset password.');
        window.location.href = '/'; // Redirect to home or login page if token is missing
    } else {
        document.getElementById('reset-token').value = token;

        document.getElementById('reset-password-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const newPassword = document.getElementById('new-password').value;

            try {
                const response = await fetch(`/api/auth/reset/password/${token}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newPassword })
                });

                if (response.ok) {
                    alert('Password reset successful!');
                    window.location.href = '/services.html'; // Redirect to login page after successful reset
                } else {
                    const errorMessage = await response.json();
                    alert(errorMessage.message); // Display error message from server
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to reset password. Please try again later.');
            }
        });
    }
});
