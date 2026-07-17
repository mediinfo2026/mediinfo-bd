// admin/doctor-guides.js


import { db } from "../firebase.js";


import {

collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
query,
where

}

from

"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";




// Collection

const guideCollection =

collection(
db,
"doctor_guides"
);








// Add Doctor Guide


window.addGuide = async function(){



const data = {


title:

document.getElementById("title").value.trim(),



category:

document.getElementById("category").value.trim(),



doctorName:

document.getElementById("doctorName").value.trim(),



description:

document.getElementById("description").value.trim(),



symptoms:

document.getElementById("symptoms").value.trim(),



advice:

document.getElementById("advice").value.trim(),



createdAt:

new Date()



};





if(!data.title){


alert(
"Guide Title দিন"
);


return;


}





try{


await addDoc(

guideCollection,

data

);



alert(
"✅ Doctor Guide Added Successfully"
);



loadGuides();



}


catch(error){


console.log(error);


alert(
"Guide Add Failed"
);


}



}









// Load All Guides


async function loadGuides(){



const list =

document.getElementById(
"guideList"
);



if(!list) return;




list.innerHTML="";



const snapshot =

await getDocs(
guideCollection
);





snapshot.forEach(item=>{


const data = item.data();



list.innerHTML += `


<div class="guide-card">


<h3>
🩺 ${data.title}
</h3>


<p>
Category:
${data.category || "-"}
</p>


<p>
Doctor:
${data.doctorName || "-"}
</p>


<p>
${data.description || ""}
</p>



<button

onclick="deleteGuide('${item.id}')"

>

Delete

</button>



</div>


`;



});



}









// Search Guide


window.searchGuide = async function(){



const category =

document.getElementById(
"searchCategory"
)
.value.trim();





const q = query(

guideCollection,

where(
"category",
"==",
category
)

);





const snapshot =

await getDocs(q);



const list =

document.getElementById(
"guideList"
);



list.innerHTML="";




if(snapshot.empty){


list.innerHTML =

"<p>কোনো গাইড পাওয়া যায়নি</p>";

return;


}





snapshot.forEach(item=>{


const data=item.data();



list.innerHTML += `


<div class="guide-card">


<h3>
🩺 ${data.title}
</h3>


<p>
${data.doctorName || "-"}
</p>


<p>
${data.description || ""}
</p>


<button

onclick="deleteGuide('${item.id}')"

>

Delete

</button>


</div>


`;



});



}









// Delete Guide


window.deleteGuide = async function(id){



if(!confirm("এই গাইড Delete করবেন?"))

return;




try{


await deleteDoc(

doc(
db,
"doctor_guides",
id
)

);



alert(
"Deleted Successfully"
);



loadGuides();



}


catch(error){


console.log(error);


}



}









// Update Guide


window.updateGuide = async function(id){



const ref =

doc(
db,
"doctor_guides",
id
);





await updateDoc(

ref,

{


title:

document.getElementById("title").value,



category:

document.getElementById("category").value,



doctorName:

document.getElementById("doctorName").value,



description:

document.getElementById("description").value,



symptoms:

document.getElementById("symptoms").value,



advice:

document.getElementById("advice").value



}

);



alert(
"Updated Successfully"
);



loadGuides();



}








// Start

loadGuides();
