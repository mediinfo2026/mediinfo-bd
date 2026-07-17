import { db } from "../firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const stats = {
  tests: document.getElementById("testsCount"),
  categories: document.getElementById("categoriesCount"),
  diseases: document.getElementById("diseasesCount"),
  departments: document.getElementById("departmentsCount"),
  doctors: document.getElementById("doctorsCount"),
  hospitals: document.getElementById("hospitalsCount")
};

async function countCollection(name, element) {
  const snapshot = await getDocs(collection(db, name));
  element.textContent = snapshot.size;
}

async function loadDashboard() {
  try {
    await countCollection("tests", stats.tests);
    await countCollection("categories", stats.categories);
    await countCollection("diseases", stats.diseases);
    await countCollection("departments", stats.departments);
    await countCollection("doctor_guides", stats.doctors);
    await countCollection("hospitals", stats.hospitals);
  } catch (err) {
    console.error(err);
  }
}

loadDashboard();
