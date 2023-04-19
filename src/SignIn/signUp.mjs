import { createUser } from "../firebase.js";

const signUpBtn = document.getElementById('signUpBtn');

signUpBtn.addEventListener('click', () => {
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    let confirmPasswordInput = document.getElementById('confirmPassword');

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
    if(passwordInput.value != confirmPasswordInput.value){
        alert("Passwords do not match.")
        return
    }

    createUser(emailInput.value, passwordInput.value, onSignUp);
});

function onSignUp(){
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