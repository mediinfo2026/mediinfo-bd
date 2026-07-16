import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const name = document.getElementById("name");
const slug = document.getElementById("slug");
const category = document.getElementById("category");
const price = document.getElementById("price");
const description = document.getElementById("description");
const saveBtn = document.getElementById("saveBtn");
const list = document.getElementById("list");

saveBtn.onclick = async () => {

  await addDoc(collection(db, "tests"), {
    name: name.value,
    slug: slug.value,
    category: category.value,
    price: price.value,
    description: description.value
  });

  alert("✅ Test Saved");

  location.reload();

};

async function loadTests() {

  const snap = await getDocs(collection(db, "tests"));

  list.innerHTML = "";

  snap.forEach(doc => {

    const t = doc.data();

    list.innerHTML += `
      <div style="padding:10px;border:1px solid #ddd;margin:10px 0">
        <b>${t.name}</b><br>
        ${t.category}<br>
        ৳ ${t.price}
      </div>
    `;

  });

}

loadTests();
