// ==============================
// MediInfo BD v1.0
// firebase.js
// ==============================


// ==============================
// Firebase App
// ==============================

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


// ==============================
// Firestore
// ==============================

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ==============================
// Authentication
// ==============================

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// ==============================
// Storage
// ==============================

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";


// ==============================
// Firebase Config
// ==============================

const firebaseConfig = {

  apiKey: "AIzaSyAW6fOFxcKNtS7iB4XpGEHyoQKKbL_yXSA",

  authDomain: "mediinfo-bd.firebaseapp.com",

  projectId: "mediinfo-bd",

  storageBucket: "mediinfo-bd.firebasestorage.app",

  messagingSenderId: "903946041697",

  appId: "1:903946041697:web:4bc1fe6e053896a282ed20"

};


// ==============================
// Initialize Firebase
// ==============================

const app = initializeApp(firebaseConfig);


// ==============================
// Firebase Services
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
