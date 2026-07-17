import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAW6fOFxcKNtS7iB4XpGEHyoQKKbL_yXSA",
  authDomain: "mediinfo-bd.firebaseapp.com",
  projectId: "mediinfo-bd",
  storageBucket: "mediinfo-bd.firebasestorage.app",
  messagingSenderId: "903946041697",
  appId: "1:903946041697:web:4bc1fe6e053896a282ed20"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
