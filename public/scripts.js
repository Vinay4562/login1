document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const closeButton = document.getElementById('close-btn');

    if (signUpButton) {
        signUpButton.addEventListener('click', () => togglePanel('right-panel-active'));
    } else {
        console.error('Sign Up button not found');
    }

    if (signInButton) {
        signInButton.addEventListener('click', () => togglePanel('right-panel-active', false));
    } else {
        console.error('Sign In button not found');
    }

    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    } else {
        console.error('Register form not found');
    }

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    } else {
        console.error('Login form not found');
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            window.location.href = 'https://400kvssshankarpally.free.nf';
        });
    } else {
        console.error('Close button not found');
    }

    preventBack();
});

async function registerUser(event) {
    event.preventDefault();
    const { name, email, password } = getRegisterFormValues();

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            alert('Registration successful');
            clearRegisterForm();
            togglePanel('right-panel-active', false);
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register. Please try again later.');
    }
}

async function loginUser(event) {
    event.preventDefault();
    const { email, password } = getLoginFormValues();

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            alert('Login successful');
            window.location.href = 'services.html';
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to login. Please try again later.');
    }
}

function togglePanel(className, add = true) {
    const container = document.querySelector('.container');
    container.classList.toggle(className, add);
}

function getRegisterFormValues() {
    return {
        name: document.getElementById('register-name').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value
    };
}

function getLoginFormValues() {
    return {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };
}

function clearRegisterForm() {
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
}

// Disable back button
function preventBack() {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
}

window.onunload = function () { return null; };
