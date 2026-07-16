import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAW6fOFxcKNtS7iB4XpGEHyoQKKbL_yXSA",
  authDomain: "mediinfo-bd.firebaseapp.com",
  projectId: "mediinfo-bd",
  storageBucket: "mediinfo-bd.firebasestorage.app",
  messagingSenderId: "903946041697",
  appId: "1:903946041697:web:4bc1fe6e053896a282ed20",
  measurementId: "G-RYBYTCY1V4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("✅ Login Successful");

    location.href = "dashboard.html";

  } catch (err) {

    alert(err.message);

  }

});
