import { db } from "../firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const categoryList = document.getElementById("categoryList");

let allCategories = [];

/* =========================
   Load Categories
========================= */

async function loadCategories() {
  try {
    const snapshot = await getDocs(
      collection(db, "categories")
    );

    allCategories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderCategories(allCategories);

  } catch (error) {
    console.error("Categories loading error:", error);

    if (categoryList) {
      categoryList.innerHTML = `
        <p class="no-data">
          ক্যাটাগরির তথ্য লোড করা যাচ্ছে না।
        </p>
      `;
    }
  }
}

/* =========================
   Render Categories
========================= */

function renderCategories(categories) {
  if (!categoryList) return;

  if (categories.length === 0) {
    categoryList.innerHTML = `
      <p class="no-data">
        কোনো ক্যাটাগরি পাওয়া যায়নি।
      </p>
    `;
    return;
  }

  categoryList.innerHTML = categories.map(category => `
    <div class="category-card">

      <h3>
        ${category.name || "ক্যাটাগরির নাম নেই"}
      </h3>

      ${
        category.description
          ? `
            <p>
              ${category.description}
            </p>
          `
          : ""
      }

      ${
        category.slug
          ? `
            <a
              href="index.html?category=${encodeURIComponent(category.slug)}"
              class="details-btn"
            >
              এই ক্যাটাগরির টেস্ট দেখুন
            </a>
          `
          : ""
      }

    </div>
  `).join("");
}

/* =========================
   Start
========================= */

loadCategories();
