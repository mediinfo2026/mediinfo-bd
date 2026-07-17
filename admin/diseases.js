// admin/diseases.js


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

const diseaseCollection =

collection(
db,
"diseases"
);









// Add Disease


window.addDisease = async function(){



const data = {



name:

document.getElementById("name").value.trim(),



slug:

document.getElementById("slug").value.trim().toLowerCase(),



category:

document.getElementById("category").value.trim(),



symptoms:

document.getElementById("symptoms").value.trim(),



causes:

document.getElementById("causes").value.trim(),



prevention:

document.getElementById("prevention").value.trim(),



treatment:

document.getElementById("treatment").value.trim(),



createdAt:

new Date()


};






if(!data.name){


alert(
"রোগের নাম দিন"
);


return;


}






try{


await addDoc(

diseaseCollection,

data

);



alert(
"✅ Disease Added Successfully"
);



loadDiseases();



}



catch(error){


console.log(error);


alert(
"Disease Add Failed"
);



}



}









// Load Diseases


async function loadDiseases(){



const list =

document.getElementById(
"diseaseList"
);



if(!list) return;




list.innerHTML="";



const snapshot =

await getDocs(
diseaseCollection
);





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `


<div class="disease-card">


<h3>
🦠 ${data.name}
</h3>



<p>
Category:
${data.category || "-"}
</p>



<p>
Symptoms:
${data.symptoms || "-"}
</p>




<button

onclick="deleteDisease('${item.id}')"

>

Delete

</button>



</div>


`;



});



}









// Search Disease


window.searchDisease = async function(){



const category =

document.getElementById(
"searchCategory"
)
.value.trim();





const q = query(

diseaseCollection,

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
"diseaseList"
);



list.innerHTML="";





if(snapshot.empty){


list.innerHTML =

"<p>কোনো রোগ পাওয়া যায়নি</p>";

return;


}





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `



<div class="disease-card">


<h3>
🦠 ${data.name}
</h3>


<p>
${data.symptoms || ""}
</p>


<button

onclick="deleteDisease('${item.id}')"

>

Delete

</button>


</div>


`;



});



}









// Delete Disease


window.deleteDisease = async function(id){



if(
!confirm("এই রোগটি Delete করবেন?")
)

return;





try{


await deleteDoc(

doc(
db,
"diseases",
id
)

);



alert(
"Deleted Successfully"
);



loadDiseases();



}

catch(error){


console.log(error);


}



}









// Update Disease


window.updateDisease = async function(id){



const ref =

doc(
db,
"diseases",
id
);





await updateDoc(

ref,

{


name:

document.getElementById("name").value,



slug:

document.getElementById("slug").value,



category:

document.getElementById("category").value,



symptoms:

document.getElementById("symptoms").value,



causes:

document.getElementById("causes").value,



prevention:

document.getElementById("prevention").value,



treatment:

document.getElementById("treatment").value



}

);



alert(
"Updated Successfully"
);



loadDiseases();



}








// Start

loadDiseases();
