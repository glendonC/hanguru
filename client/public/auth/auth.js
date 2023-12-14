const logregBox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const apiUrl = 'http://localhost:8100';

registerLink.addEventListener('click', () => {
    logregBox.classList.add('active');
});

loginLink.addEventListener('click', () => {
    logregBox.classList.remove('active');
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var usernameOrEmail = document.querySelector('.login .input-box input[name="usernameOrEmail"]').value;
    var password = document.querySelector('.login .input-box input[type="password"]').value;

    fetch(`${apiUrl}/hanguru/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: usernameOrEmail, password: password }),
        credentials: 'include' // Add this line if needed
    })    
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            // Login successful, handle accordingly
            console.log('Login successful:', data);
            localStorage.setItem('loginStreak', data.streak);
            localStorage.setItem('loginDates', JSON.stringify(data.user.loginDates));
            // In your login success handling code
            const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            const redirectUrl = isLocalhost ? "http://localhost:3001/" : "https://www.hanguru.me/#/";

            // Use this URL to redirect after successful login
            window.location.href = redirectUrl;

        } else {
            // Login failed, handle errors
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.querySelector('.register .input-box input[name="username"]').value;
    var email = document.querySelector('.register .input-box input[name="email"]').value;
    var password = document.querySelector('.register .input-box input[name="password"]').value;

    fetch(`${apiUrl}/hanguru/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User created') {
            console.log('Registration successful:', data);
            // Additional actions like redirecting to login page
        } else {
            console.error('Registration failed:', data.message);
            // Show error message to the user
        }
    })
    .catch(error => console.error('Registration Error:', error));
});

