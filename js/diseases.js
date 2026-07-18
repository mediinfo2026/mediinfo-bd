import { db } from "../firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const diseaseList = document.getElementById("diseaseList");
const diseaseSearch = document.getElementById("diseaseSearch");

let allDiseases = [];

/* =========================
   Load Diseases
========================= */

async function loadDiseases() {
  try {
    const snapshot = await getDocs(
      collection(db, "diseases")
    );

    allDiseases = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderDiseases(allDiseases);

  } catch (error) {
    console.error("Diseases loading error:", error);

    if (diseaseList) {
      diseaseList.innerHTML = `
        <p class="no-data">
          রোগের তথ্য লোড করা যাচ্ছে না।
        </p>
      `;
    }
  }
}

/* =========================
   Render Diseases
========================= */

function renderDiseases(diseases) {
  if (!diseaseList) return;

  if (diseases.length === 0) {
    diseaseList.innerHTML = `
      <p class="no-data">
        কোনো রোগের তথ্য পাওয়া যায়নি।
      </p>
    `;
    return;
  }

  diseaseList.innerHTML = diseases.map(disease => `
    <div class="disease-card">

      <h3>
        ${disease.name || "রোগের নাম নেই"}
      </h3>

      ${
        disease.description
          ? `
            <p>
              ${disease.description}
            </p>
          `
          : ""
      }

      ${
        disease.symptoms
          ? `
            <p>
              <strong>সাধারণ উপসর্গ:</strong>
              ${disease.symptoms}
            </p>
          `
          : ""
      }

      ${
        disease.slug
          ? `
            <a
              href="disease.html?slug=${encodeURIComponent(disease.slug)}"
              class="details-btn"
            >
              বিস্তারিত দেখুন
            </a>
          `
          : ""
      }

    </div>
  `).join("");
}

/* =========================
   Search Diseases
========================= */

if (diseaseSearch) {
  diseaseSearch.addEventListener("input", function () {

    const searchText = this.value
      .trim()
      .toLowerCase();

    if (!searchText) {
      renderDiseases(allDiseases);
      return;
    }

    const filteredDiseases = allDiseases.filter(disease => {

      const name = String(
        disease.name || ""
      ).toLowerCase();

      const description = String(
        disease.description || ""
      ).toLowerCase();

      const symptoms = String(
        disease.symptoms || ""
      ).toLowerCase();

      return (
        name.includes(searchText) ||
        description.includes(searchText) ||
        symptoms.includes(searchText)
      );
    });

    renderDiseases(filteredDiseases);
  });
}

/* =========================
   Start
========================= */

loadDiseases();
