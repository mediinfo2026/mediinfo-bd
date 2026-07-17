import { db } from "../firebase.js";


import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc
}
from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// Collection Name

const testCollection = collection(db,"tests");



// Add New Test

window.addTest = async function(){



const data = {


name:
document.getElementById("name").value,


slug:
document.getElementById("slug").value.toLowerCase(),


category:
document.getElementById("category").value,


price:
document.getElementById("price").value,


purpose:
document.getElementById("purpose").value,


description:
document.getElementById("description").value,


sample:
document.getElementById("sample").value,


preparation:
document.getElementById("preparation").value,


reportTime:
document.getElementById("reportTime").value,


normalRange:
document.getElementById("normalRange").value,


note:
document.getElementById("note").value,


createdAt:
new Date()

};




try{


await addDoc(
testCollection,
data
);



alert("✅ Test Added Successfully");



loadTests();



}

catch(error){

console.log(error);

alert("Error Adding Test");


}


}






// Show All Tests


async function loadTests(){


const list =
document.getElementById("testList");



if(!list) return;



list.innerHTML="";



const snapshot =
await getDocs(testCollection);



snapshot.forEach(docItem=>{


const data =
docItem.data();



list.innerHTML += `


<div class="test-card">


<h3>
${data.name}
</h3>


<p>
Category:
${data.category}
</p>


<p>
Price:
৳${data.price}
</p>



<button onclick="deleteTest('${docItem.id}')">

Delete

</button>



</div>


`;


});



}






// Delete Test


window.deleteTest = async function(id){


if(confirm("Delete this test?")){


await deleteDoc(
doc(db,"tests",id)
);



alert("Deleted");


loadTests();


}


}






// Update Test


window.updateTest = async function(id){


const ref =
doc(db,"tests",id);



await updateDoc(ref,{


name:
document.getElementById("name").value,


category:
document.getElementById("category").value,


price:
document.getElementById("price").value,


purpose:
document.getElementById("purpose").value,


description:
document.getElementById("description").value


});



alert("Updated");


loadTests();


}






// Load When Page Open


loadTests();
