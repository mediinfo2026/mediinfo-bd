import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// আপনার firebaseConfig এখানে বসান
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");

loginBtn.addEventListener("click", async () => {

  error.textContent = "";

  try {

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    window.location.href = "dashboard.html";

  } catch (err) {

    error.textContent = "ইমেইল অথবা পাসওয়ার্ড ভুল।";
    console.error(err);

  }

});
