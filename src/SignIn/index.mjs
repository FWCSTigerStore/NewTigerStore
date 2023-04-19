import { signInWithGoogle } from "../firebase.js";

const googleBtn = document.getElementById('signInGoogle');

googleBtn.addEventListener('click', () => {
    signInWithGoogle();
});