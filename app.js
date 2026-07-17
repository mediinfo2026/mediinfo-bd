// ======================================
// MediInfo BD v1.0
// app.js
// Part 1
// ======================================

import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ==============================
// Collections
// ==============================

const COLLECTIONS = {

tests: "tests",

categories: "categories",

departments: "departments",

diseases: "diseases",

doctorGuides: "doctor_guides",

hospitals: "hospitals",

diagnosticCenters: "diagnostic_centers",

settings: "settings"

};

// ==============================
// DOM Elements
// ==============================

const categoriesGrid =
document.getElementById("categoriesGrid");

const departmentsGrid =
document.getElementById("departmentsGrid");

const testsGrid =
document.getElementById("testsGrid");

const diseasesGrid =
document.getElementById("diseasesGrid");

const doctorGuideGrid =
document.getElementById("doctorGuideGrid");

const hospitalGrid =
document.getElementById("hospitalGrid");

const diagnosticGrid =
document.getElementById("diagnosticGrid");

const latestUpdates =
document.getElementById("latestUpdates");

const searchInput =
document.getElementById("searchInput");

const searchBtn =
document.getElementById("searchBtn");

// ==============================
// App Data
// ==============================

let tests = [];

let categories = [];

let departments = [];

let diseases = [];

let doctorGuides = [];

let hospitals = [];

let diagnosticCenters = [];

// ==============================
// Utility
// ==============================

function showLoading(element){

if(!element) return;

element.innerHTML = `
<div class="loading">
লোড হচ্ছে...
</div>
`;

}

function showEmpty(element,text){

if(!element) return;

element.innerHTML = `
<div class="card">
<p>${text}</p>
</div>
`;

}

function showError(element){

if(!element) return;

element.innerHTML = `
<div class="card">
<p>❌ তথ্য লোড করা যায়নি</p>
</div>
`;

}
// ======================================
// MediInfo BD v1.0
// app.js
// Part 2
// ======================================

// ==============================
// Generic Firestore Loader
// ==============================

async function loadCollection(collectionName){

try{

const snapshot = await getDocs(
collection(db, collectionName)
);

return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}catch(error){

console.error(
"Load Error:",
collectionName,
error
);

return [];

}

}

// ==============================
// Load All Collections
// ==============================

async function loadAllData(){

showLoading(categoriesGrid);

showLoading(departmentsGrid);

showLoading(testsGrid);

showLoading(diseasesGrid);

showLoading(doctorGuideGrid);

showLoading(hospitalGrid);

showLoading(diagnosticGrid);

showLoading(latestUpdates);

// ---------- Categories ----------

categories = await loadCollection(
COLLECTIONS.categories
);

// ---------- Departments ----------

departments = await loadCollection(
COLLECTIONS.departments
);

// ---------- Tests ----------

tests = await loadCollection(
COLLECTIONS.tests
);

// ---------- Diseases ----------

diseases = await loadCollection(
COLLECTIONS.diseases
);

// ---------- Doctor Guides ----------

doctorGuides = await loadCollection(
COLLECTIONS.doctorGuides
);

// ---------- Hospitals ----------

hospitals = await loadCollection(
COLLECTIONS.hospitals
);

// ---------- Diagnostic Centers ----------

diagnosticCenters = await loadCollection(
COLLECTIONS.diagnosticCenters
);

// ==============================
// Render All
// ==============================

renderCategories();

renderDepartments();

renderTests();

renderDiseases();

renderDoctorGuides();

renderHospitals();

renderDiagnosticCenters();

renderLatestUpdates();

console.log("All Data Loaded Successfully");

}

// ==============================
// Initialize App
// ==============================

window.addEventListener("load",()=>{

loadAllData();

});
// ======================================
// MediInfo BD v1.0
// app.js
// Part 3
// ======================================

// ==============================
// Create Card
// ==============================

function createCard(title, subtitle = "", link = "#") {

  return `
    <a href="${link}" class="card">
      <h3>${title}</h3>
      ${subtitle ? `<p>${subtitle}</p>` : ""}
    </a>
  `;

}

// ==============================
// Render Categories
// ==============================

function renderCategories() {

  if (!categoriesGrid) return;

  if (categories.length === 0) {

    showEmpty(categoriesGrid, "কোন Category পাওয়া যায়নি");

    return;

  }

  categoriesGrid.innerHTML = categories.map(item =>

    createCard(
      item.name || item.title || "নাম নেই",
      item.description || ""
    )

  ).join("");

}

// ==============================
// Render Departments
// ==============================

function renderDepartments() {

  if (!departmentsGrid) return;

  if (departments.length === 0) {

    showEmpty(departmentsGrid, "কোন Department পাওয়া যায়নি");

    return;

  }

  departmentsGrid.innerHTML = departments.map(item =>

    createCard(
      item.name || item.title || "নাম নেই",
      item.description || ""
    )

  ).join("");

}

// ==============================
// Render Tests
// ==============================

function renderTests() {

  if (!testsGrid) return;

  if (tests.length === 0) {

    showEmpty(testsGrid, "কোন Test পাওয়া যায়নি");

    return;

  }

  testsGrid.innerHTML = tests.map(item =>

    createCard(
      item.name || item.title || "Test",
      item.category || ""
    )

  ).join("");

}
// ======================================
// MediInfo BD v1.0
// app.js
// Part 4
// ======================================

// ==============================
// Render Diseases
// ==============================

function renderDiseases() {

  if (!diseasesGrid) return;

  if (diseases.length === 0) {

    showEmpty(diseasesGrid, "কোন Disease পাওয়া যায়নি");

    return;

  }

  diseasesGrid.innerHTML = diseases.map(item =>

    createCard(
      item.name || item.title || "Disease",
      item.department || ""
    )

  ).join("");

}

// ==============================
// Render Doctor Guides
// ==============================

function renderDoctorGuides() {

  if (!doctorGuideGrid) return;

  if (doctorGuides.length === 0) {

    showEmpty(doctorGuideGrid, "কোন Doctor Guide পাওয়া যায়নি");

    return;

  }

  doctorGuideGrid.innerHTML = doctorGuides.map(item =>

    createCard(
      item.disease || item.name || "Doctor Guide",
      item.department || item.specialist || ""
    )

  ).join("");

}

// ==============================
// Render Hospitals
// ==============================

function renderHospitals() {

  if (!hospitalGrid) return;

  if (hospitals.length === 0) {

    showEmpty(hospitalGrid, "কোন Hospital পাওয়া যায়নি");

    return;

  }

  hospitalGrid.innerHTML = hospitals.map(item =>

    createCard(
      item.name || "Hospital",
      item.city || item.address || ""
    )

  ).join("");

}

// ==============================
// Render Diagnostic Centers
// ==============================

function renderDiagnosticCenters() {

  if (!diagnosticGrid) return;

  if (diagnosticCenters.length === 0) {

    showEmpty(
      diagnosticGrid,
      "কোন Diagnostic Center পাওয়া যায়নি"
    );

    return;

  }

  diagnosticGrid.innerHTML = diagnosticCenters.map(item =>

    createCard(
      item.name || "Diagnostic Center",
      item.city || item.address || ""
    )

  ).join("");

}

// ==============================
// Render Latest Updates
// ==============================

function renderLatestUpdates() {

  if (!latestUpdates) return;

  let updates = [];

  tests.slice(0,3).forEach(item => {

    updates.push({

      title: item.name || "Test",

      subtitle: "নতুন মেডিকেল টেস্ট"

    });

  });

  diseases.slice(0,3).forEach(item => {

    updates.push({

      title: item.name || "Disease",

      subtitle: "নতুন রোগের তথ্য"

    });

  });

  if (updates.length === 0) {

    showEmpty(
      latestUpdates,
      "কোন আপডেট নেই"
    );

    return;

  }

  latestUpdates.innerHTML = updates.map(item =>

    createCard(
      item.title,
      item.subtitle
    )

  ).join("");

}
// ======================================
// MediInfo BD v1.0
// app.js
// Part 5
// ======================================

// ==============================
// Search
// ==============================

function searchAll(keyword){

keyword = keyword.trim().toLowerCase();

if(keyword===""){

renderCategories();

renderDepartments();

renderTests();

renderDiseases();

renderDoctorGuides();

renderHospitals();

renderDiagnosticCenters();

renderLatestUpdates();

return;

}

// ---------- Tests ----------

const testResult = tests.filter(item=>

(item.name||"").toLowerCase().includes(keyword) ||

(item.category||"").toLowerCase().includes(keyword)

);

testsGrid.innerHTML = testResult.length ?

testResult.map(item=>

createCard(

item.name,

item.category

)

).join("")

:

`<div class="card">

<p>কোন Test পাওয়া যায়নি</p>

</div>`;

// ---------- Diseases ----------

const diseaseResult = diseases.filter(item=>

(item.name||"").toLowerCase().includes(keyword) ||

(item.symptoms||"").toLowerCase().includes(keyword)

);

diseasesGrid.innerHTML = diseaseResult.length ?

diseaseResult.map(item=>

createCard(

item.name,

item.department||""

)

).join("")

:

`<div class="card">

<p>কোন Disease পাওয়া যায়নি</p>

</div>`;

// ---------- Doctor Guide ----------

const doctorResult = doctorGuides.filter(item=>

(item.disease||"").toLowerCase().includes(keyword) ||

(item.department||"").toLowerCase().includes(keyword)

);

doctorGuideGrid.innerHTML = doctorResult.length ?

doctorResult.map(item=>

createCard(

item.disease,

item.department

)

).join("")

:

`<div class="card">

<p>কোন Doctor Guide পাওয়া যায়নি</p>

</div>`;

// ---------- Hospitals ----------

const hospitalResult = hospitals.filter(item=>

(item.name||"").toLowerCase().includes(keyword) ||

(item.city||"").toLowerCase().includes(keyword)

);

hospitalGrid.innerHTML = hospitalResult.length ?

hospitalResult.map(item=>

createCard(

item.name,

item.city

)

).join("")

:

`<div class="card">

<p>কোন Hospital পাওয়া যায়নি</p>

</div>`;

// ---------- Diagnostic Centers ----------

const diagnosticResult = diagnosticCenters.filter(item=>

(item.name||"").toLowerCase().includes(keyword) ||

(item.city||"").toLowerCase().includes(keyword)

);

diagnosticGrid.innerHTML = diagnosticResult.length ?

diagnosticResult.map(item=>

createCard(

item.name,

item.city

)

).join("")

:

`<div class="card">

<p>কোন Diagnostic Center পাওয়া যায়নি</p>

</div>`;

}

// ==============================
// Events
// ==============================

if(searchBtn){

searchBtn.addEventListener("click",()=>{

searchAll(searchInput.value);

});

}

if(searchInput){

searchInput.addEventListener("keyup",(e)=>{

if(e.key==="Enter"){

searchAll(searchInput.value);

}

});

searchInput.addEventListener("input",()=>{

searchAll(searchInput.value);

});

}
// ======================================
// MediInfo BD v1.0
// app.js
// Part 6 (Final)
// ======================================

// ==============================
// Settings
// ==============================

async function loadSettings(){

try{

const data = await loadCollection(
COLLECTIONS.settings
);

if(data.length>0){

console.log("Settings Loaded");

}

}catch(err){

console.error(err);

}

}

// ==============================
// Firestore Connection
// ==============================

async function checkConnection(){

try{

await getDocs(collection(db,"settings"));

console.log("✅ Firestore Connected");

}catch(err){

console.error("❌ Firestore Error",err);

}

}

// ==============================
// Initialize
// ==============================

async function initializeApp(){

console.log("================================");

console.log("MediInfo BD Started");

console.log("Version : 1.0");

console.log("================================");

await checkConnection();

await loadSettings();

await loadAllData();

}

// ==============================
// Refresh
// ==============================

function autoRefresh(){

setInterval(()=>{

loadAllData();

},300000);

}

// ==============================
// App Start
// ==============================

window.addEventListener("DOMContentLoaded",async()=>{

await initializeApp();

autoRefresh();

});

// ==============================
// Global
// ==============================

window.MediInfoBD={

loadAllData,

searchAll,

tests,

categories,

departments,

diseases,

doctorGuides,

hospitals,

diagnosticCenters

};

console.log("✅ MediInfo BD Ready");
