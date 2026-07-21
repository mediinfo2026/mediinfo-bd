import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ===============================
// Firestore Collection
// ===============================

const testsCollection = collection(db, "tests");


// ===============================
// DOM Elements
// ===============================

const tableBody = document.getElementById("tableBody");
const loading = document.getElementById("loading");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const addTestBtn = document.getElementById("addTestBtn");

const testModal = document.getElementById("testModal");
const modalTitle = document.getElementById("modalTitle");

const testForm = document.getElementById("testForm");
const cancelBtn = document.getElementById("cancelBtn");


// ===============================
// Form Fields
// ===============================

const docId = document.getElementById("docId");
const nameInput = document.getElementById("name");
const slugInput = document.getElementById("slug");
const categoryInput = document.getElementById("category");
const departmentInput = document.getElementById("department");
const sampleInput = document.getElementById("sample");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");
const preparationInput = document.getElementById("preparation");
const reportTimeInput = document.getElementById("reportTime");
const normalRangeInput = document.getElementById("normalRange");
const purposeInput = document.getElementById("purpose");
const noteInput = document.getElementById("note");


// ===============================
// Local Test Data
// ===============================

let allTests = [];


// ===============================
// Load Tests
// ===============================

async function loadTests() {

    try {

        loading.classList.remove("hidden");
        emptyMessage.classList.add("hidden");

        tableBody.innerHTML = "";

        const snapshot = await getDocs(testsCollection);

        allTests = snapshot.docs.map((document) => {

            return {
                id: document.id,
                ...document.data()
            };

        });

        renderTests(allTests);

    } catch (error) {

        console.error("Load Tests Error:", error);

        tableBody.innerHTML = "";

        emptyMessage.textContent =
            "❌ টেস্ট লোড করা যায়নি। Firebase Permission অথবা Connection চেক করুন।";

        emptyMessage.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");

    }

}


// ===============================
// Render Tests
// ===============================

function renderTests(tests) {

    tableBody.innerHTML = "";

    if (tests.length === 0) {

        emptyMessage.textContent =
            "কোনো টেস্ট পাওয়া যায়নি।";

        emptyMessage.classList.remove("hidden");

        return;

    }

    emptyMessage.classList.add("hidden");


    tests.forEach((test, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${escapeHTML(test.name || "-")}</td>

            <td>${escapeHTML(test.category || "-")}</td>

            <td>${escapeHTML(test.department || "-")}</td>

            <td>${escapeHTML(test.sample || "-")}</td>

            <td>৳ ${escapeHTML(String(test.price ?? "-"))}</td>

            <td>

                <button
                    class="action-btn edit-btn"
                    data-action="edit"
                    data-id="${test.id}"
                >
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    data-action="delete"
                    data-id="${test.id}"
                >
                    Delete
                </button>

            </td>

        `;

        tableBody.appendChild(row);

    });

}


// ===============================
// Search
// ===============================

searchInput.addEventListener(
    "input",
    function () {

        const searchText =
            this.value.trim().toLowerCase();

        const filteredTests =
            allTests.filter((test) => {

                const name =
                    String(test.name || "").toLowerCase();

                const category =
                    String(test.category || "").toLowerCase();

                const department =
                    String(test.department || "").toLowerCase();

                const slug =
                    String(test.slug || "").toLowerCase();

                return (

                    name.includes(searchText) ||
                    category.includes(searchText) ||
                    department.includes(searchText) ||
                    slug.includes(searchText)

                );

            });

        renderTests(filteredTests);

    }
);


// ===============================
// Open Add Modal
// ===============================

addTestBtn.addEventListener(
    "click",
    function () {

        resetForm();

        modalTitle.textContent =
            "Add New Test";

        testModal.classList.add("active");

    }
);


// ===============================
// Close Modal
// ===============================

cancelBtn.addEventListener(
    "click",
    closeModal
);


testModal.addEventListener(
    "click",
    function (event) {

        if (event.target === testModal) {

            closeModal();

        }

    }
);


function closeModal() {

    testModal.classList.remove("active");

}


// ===============================
// Submit Form
// ===============================

testForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const id =
            docId.value.trim();

        const testData = {

            name: nameInput.value.trim(),

            slug: slugInput.value.trim().toLowerCase(),

            category: categoryInput.value.trim(),

            department: departmentInput.value.trim(),

            sample: sampleInput.value.trim(),

            price: Number(priceInput.value) || 0,

            description: descriptionInput.value.trim(),

            preparation: preparationInput.value.trim(),

            reportTime: reportTimeInput.value.trim(),

            normalRange: normalRangeInput.value.trim(),

            purpose: purposeInput.value.trim(),

            note: noteInput.value.trim()

        };


        try {

            const saveButton =
                testForm.querySelector(
                    'button[type="submit"]'
                );

            saveButton.disabled = true;

            saveButton.textContent =
                "Saving...";


            if (id) {

                await updateDoc(

                    doc(db, "tests", id),

                    {

                        ...testData,

                        updatedAt: serverTimestamp()

                    }

                );

                alert("✅ Test updated successfully!");

            } else {

                await addDoc(

                    testsCollection,

                    {

                        ...testData,

                        createdAt: serverTimestamp()

                    }

                );

                alert("✅ Test added successfully!");

            }


            closeModal();

            resetForm();

            await loadTests();


        } catch (error) {

            console.error("Save Test Error:", error);

            alert(
                "❌ Test save করা যায়নি। Firebase Permission অথবা Connection চেক করুন।"
            );

        } finally {

            const saveButton =
                testForm.querySelector(
                    'button[type="submit"]'
                );

            saveButton.disabled = false;

            saveButton.textContent =
                "Save Test";

        }

    }
);


// ===============================
// Table Actions
// ===============================

tableBody.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest("button");

        if (!button) return;

        const id =
            button.dataset.id;

        const action =
            button.dataset.action;


        const selectedTest =
            allTests.find(
                (test) => test.id === id
            );

        if (!selectedTest) return;


        if (action === "edit") {

            openEditModal(selectedTest);

        }


        if (action === "delete") {

            await deleteTest(id);

        }

    }
);


// ===============================
// Open Edit Modal
// ===============================

function openEditModal(test) {

    docId.value =
        test.id || "";

    nameInput.value =
        test.name || "";

    slugInput.value =
        test.slug || "";

    categoryInput.value =
        test.category || "";

    departmentInput.value =
        test.department || "";

    sampleInput.value =
        test.sample || "";

    priceInput.value =
        test.price ?? "";

    descriptionInput.value =
        test.description || "";

    preparationInput.value =
        test.preparation || "";

    reportTimeInput.value =
        test.reportTime || "";

    normalRangeInput.value =
        test.normalRange || "";

    purposeInput.value =
        test.purpose || "";

    noteInput.value =
        test.note || "";


    modalTitle.textContent =
        "Edit Test";

    testModal.classList.add("active");

}


// ===============================
// Delete Test
// ===============================

async function deleteTest(id) {

    const confirmed =
        confirm(
            "আপনি কি এই টেস্টটি মুছে ফেলতে চান?"
        );

    if (!confirmed) return;


    try {

        await deleteDoc(
            doc(db, "tests", id)
        );

        alert(
            "✅ Test deleted successfully!"
        );

        await loadTests();

    } catch (error) {

        console.error(
            "Delete Test Error:",
            error
        );

        alert(
            "❌ Test delete করা যায়নি।"
        );

    }

}


// ===============================
// Reset Form
// ===============================

function resetForm() {

    testForm.reset();

    docId.value = "";

    modalTitle.textContent =
        "Add New Test";

}


// ===============================
// Escape HTML
// ===============================

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ===============================
// Start
// ===============================

loadTests();
