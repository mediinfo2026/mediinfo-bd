// ==============================
// MediInfo BD v1.0
// firebase.js
// ==============================

// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

// Firestore
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Authentication
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Storage
import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// ==============================
// Firebase Config
// ==============================

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain: "YOUR_PROJECT.firebaseapp.com",

  projectId: "YOUR_PROJECT_ID",

  storageBucket: "YOUR_PROJECT.firebasestorage.app",

  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  appId: "YOUR_APP_ID"

};

// ==============================
// Initialize Firebase
// ==============================

const app = initializeApp(firebaseConfig);

// ==============================
// Services
// ==============================

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

// ==============================
// Export
// ==============================

export {

  app,

  db,

  auth,

  storage

};
