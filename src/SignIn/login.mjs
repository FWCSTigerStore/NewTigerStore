import { signIn, signInWithGoogle } from "../firebase.js";

const loginBtn = document.getElementById('loginBtn');
const googleBtn = document.getElementById('signInGoogle');


loginBtn.addEventListener('click', () => {
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password'); 
    console.log(emailInput); 
    //Validate email and password
    if(!validate_email(emailInput.value)){
        alert("Please enter a valid email address.")
        return
    }
    if(!validate_password(passwordInput.value)){
        alert("Please enter a valid password. Password must be at least 6 characters long.")
        return
    }

    signIn(emailInput.value, passwordInput.value, onSignIn);
});

function onSignIn(){
    window.location.href = "/"
}

function validate_email(email){
    let expression = /^[^@]+@\w+(\.\w+)+\w$/
    if(expression.test(email) == true){
        return true
    } else{
        return false
    }
}

function validate_password(password){
    if(password < 6){
        return false
    } else{
        return true
    }
}

googleBtn.addEventListener('click', () => {
    signInWithGoogle();
});