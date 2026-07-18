import { db } from "../firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const testList = document.getElementById("testList");
const searchInput = document.getElementById("searchInput");

let allTests = [];

/* =========================
   Load Tests
========================= */

async function loadTests() {
  try {
    const snapshot = await getDocs(collection(db, "tests"));

    allTests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderTests(allTests);

  } catch (error) {
    console.error("Tests loading error:", error);

    if (testList) {
      testList.innerHTML = `
        <p class="no-data">
          তথ্য লোড করা যাচ্ছে না।
        </p>
      `;
    }
  }
}

/* =========================
   Render Tests
========================= */

function renderTests(tests) {
  if (!testList) return;

  if (tests.length === 0) {
    testList.innerHTML = `
      <p class="no-data">
        কোনো টেস্ট পাওয়া যায়নি।
      </p>
    `;
    return;
  }

  testList.innerHTML = tests.map(test => `
    <div class="test-card">

      <h3>
        ${test.name || "নাম নেই"}
      </h3>

      <p>
        <strong>ক্যাটাগরি:</strong>
        ${test.category || "তথ্য নেই"}
      </p>

      ${
        test.price
          ? `
            <p>
              <strong>আনুমানিক মূল্য:</strong>
              ${test.price}
            </p>
          `
          : ""
      }

      ${
        test.description
          ? `
            <p>
              ${test.description}
            </p>
          `
          : ""
      }

      ${
        test.slug
          ? `
            <a
              href="test.html?slug=${encodeURIComponent(test.slug)}"
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
   Search
========================= */

if (searchInput) {
  searchInput.addEventListener("input", function () {

    const searchText = this.value
      .trim()
      .toLowerCase();

    if (!searchText) {
      renderTests(allTests);
      return;
    }

    const filteredTests = allTests.filter(test => {

      const name = String(test.name || "").toLowerCase();
      const category = String(test.category || "").toLowerCase();
      const description = String(test.description || "").toLowerCase();
      const purpose = String(test.purpose || "").toLowerCase();
      const symptoms = String(test.symptoms || "").toLowerCase();

      return (
        name.includes(searchText) ||
        category.includes(searchText) ||
        description.includes(searchText) ||
        purpose.includes(searchText) ||
        symptoms.includes(searchText)
      );
    });

    renderTests(filteredTests);
  });
}

/* =========================
   Start
========================= */

loadTests();
