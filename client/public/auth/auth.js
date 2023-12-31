const logregBox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
registerLink.addEventListener('click', () => logregBox.classList.add('active'));
loginLink.addEventListener('click', () => logregBox.classList.remove('active'));


const apiUrl = window.REACT_APP_API_URL || 'http://localhost:8100';

registerLink.addEventListener('click', () => {
    logregBox.classList.add('active');
});

loginLink.addEventListener('click', () => {
    logregBox.classList.remove('active');
});

document.querySelector('.navbar').addEventListener('click', function(event) {
    if(event.target.tagName === 'A') {
      event.preventDefault();
      const path = event.target.getAttribute('href');
      window.parent.postMessage({ type: 'NAVIGATE', path: path }, '*');
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var usernameOrEmail = document.querySelector('.login .input-box input[name="usernameOrEmail"]').value;
    var password = document.querySelector('.login .input-box input[type="password"]').value;

    fetch(`${apiUrl}/hanguru/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Login failed');
    })
    .then(data => {
        console.log('Login successful:', data);
        localStorage.setItem('loginStreak', data.streak);
        localStorage.setItem('loginDates', JSON.stringify(data.user.loginDates));

        window.parent.postMessage({ type: 'LOGIN_SUCCESS', userData: data }, '*');
    })
    .catch(error => console.error('Error:', error));
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
        } else {
            console.error('Registration failed:', data.message);
        }
    })
    .catch(error => console.error('Registration Error:', error));
});

