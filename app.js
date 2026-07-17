import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const testsList = document.getElementById("testsList");
const hospitalList = document.getElementById("hospitalList");
const doctorGuideList = document.getElementById("doctorGuideList");

async function loadData() {

try {

const testsSnapshot = await getDocs(collection(db, "tests"));

testsList.innerHTML = "";

testsSnapshot.forEach(doc => {

const data = doc.data();

testsList.innerHTML += `
<div>
<b>${data.name || "নাম নেই"}</b>
</div>
`;

});

const hospitalsSnapshot = await getDocs(collection(db, "hospitals"));

hospitalList.innerHTML = "";

hospitalsSnapshot.forEach(doc => {

const data = doc.data();

hospitalList.innerHTML += `
<div>
🏥 ${data.name || "নাম নেই"}
</div>
`;

});

const doctorsSnapshot = await getDocs(collection(db, "doctor_guides"));

doctorGuideList.innerHTML = "";

doctorsSnapshot.forEach(doc => {

const data = doc.data();

doctorGuideList.innerHTML += `
<div>
👨‍⚕️ ${data.disease || "তথ্য নেই"}
</div>
`;

});

}
catch(error){

console.error(error);

testsList.innerHTML = "❌ Firestore Error";
}

}

loadData();
