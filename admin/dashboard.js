import { db, auth } from "../firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const collections = {
  tests: "tests",
  categories: "categories",
  diseases: "diseases",
  departments: "departments",
  doctors: "doctor_guides",
  hospitals: "hospitals"
};

async function updateCount(id, collectionName) {

  const el = document.getElementById(id);

  try {

    const snapshot = await getDocs(collection(db, collectionName));

    el.textContent = snapshot.size;

  } catch (e) {

    el.textContent = "0";

    console.error(e);

  }

}

async function loadDashboard() {

  await updateCount("testsCount", collections.tests);

  await updateCount("categoriesCount", collections.categories);

  await updateCount("diseasesCount", collections.diseases);

  await updateCount("departmentsCount", collections.departments);

  await updateCount("doctorsCount", collections.doctors);

  await updateCount("hospitalsCount", collections.hospitals);

}

onAuthStateChanged(auth, (user) => {

  if (!user) {

    location.href = "login.html";

    return;

  }

  loadDashboard();

});

document.getElementById("logoutBtn").addEventListener("click", async () => {

  await signOut(auth);

  location.href = "login.html";

});
