// admin/diagnostic-centers.js


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

const centerCollection =

collection(
db,
"diagnostic_centers"
);








// Add Diagnostic Center


window.addCenter = async function(){



const data = {



name:

document.getElementById("name").value.trim(),



city:

document.getElementById("city").value.trim(),



address:

document.getElementById("address").value.trim(),



phone:

document.getElementById("phone").value.trim(),



website:

document.getElementById("website").value.trim(),



services:

document.getElementById("services").value.trim(),



createdAt:

new Date()



};






if(!data.name){


alert(
"Diagnostic Center Name দিন"
);


return;


}







try{


await addDoc(

centerCollection,

data

);



alert(
"✅ Diagnostic Center Added Successfully"
);



loadCenters();



}


catch(error){


console.log(error);


alert(
"Center Add Failed"
);


}



}









// Load All Centers


async function loadCenters(){



const list =

document.getElementById(
"centerList"
);



if(!list) return;




list.innerHTML="";



const snapshot =

await getDocs(
centerCollection
);





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `



<div class="center-card">


<h3>
🏥 ${data.name}
</h3>


<p>
📍 ${data.city || "-"}
</p>


<p>
🏠 ${data.address || "-"}
</p>


<p>
☎ ${data.phone || "-"}
</p>


<p>
🧪 ${data.services || "-"}
</p>



<button

onclick="deleteCenter('${item.id}')"

>

Delete

</button>



</div>


`;



});



}









// Search Center By City


window.searchCenter = async function(){



const city =

document.getElementById(
"searchCity"
)
.value.trim();





const q = query(

centerCollection,

where(
"city",
"==",
city
)

);





const snapshot =

await getDocs(q);





const list =

document.getElementById(
"centerList"
);



list.innerHTML="";





if(snapshot.empty){


list.innerHTML =

"<p>কোনো Diagnostic Center পাওয়া যায়নি</p>";

return;


}





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `



<div class="center-card">


<h3>
🏥 ${data.name}
</h3>


<p>
📍 ${data.city}
</p>


<p>
${data.address}
</p>


<p>
☎ ${data.phone}
</p>



<button

onclick="deleteCenter('${item.id}')"

>

Delete

</button>



</div>


`;



});



}









// Delete Center


window.deleteCenter = async function(id){



if(
!confirm("এই Diagnostic Center Delete করবেন?")
)

return;





try{


await deleteDoc(

doc(
db,
"diagnostic_centers",
id
)

);



alert(
"Deleted Successfully"
);



loadCenters();



}


catch(error){


console.log(error);


}



}









// Update Center


window.updateCenter = async function(id){



const ref =

doc(
db,
"diagnostic_centers",
id
);






await updateDoc(

ref,

{


name:

document.getElementById("name").value,



city:

document.getElementById("city").value,



address:

document.getElementById("address").value,



phone:

document.getElementById("phone").value,



website:

document.getElementById("website").value,



services:

document.getElementById("services").value



}

);



alert(
"Updated Successfully"
);



loadCenters();



}









// Start


loadCenters();
