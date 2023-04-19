const signUpBtn = document.getElementById('signUpBtn');
const loginBtn = document.getElementById('loginBtn');

signUpBtn.addEventListener('click', () => {
    window.location.href = 'signUp.html';
});

loginBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
});
