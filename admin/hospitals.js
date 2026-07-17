// admin/hospitals.js


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

const hospitalCollection =

collection(
db,
"hospitals"
);






// Add Hospital


window.addHospital = async function(){



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



createdAt:

new Date()


};






if(!data.name){


alert(
"Hospital Name দিন"
);


return;


}





try{


await addDoc(

hospitalCollection,

data

);



alert(
"✅ Hospital Added Successfully"
);



loadHospitals();



}


catch(error){


console.log(
error
);


alert(
"Hospital Add Failed"
);


}



}









// Load Hospitals


async function loadHospitals(){



const list =

document.getElementById(
"hospitalList"
);



if(!list) return;




list.innerHTML="";



const snapshot =

await getDocs(
hospitalCollection
);




snapshot.forEach(item=>{



const data =

item.data();




list.innerHTML += `



<div class="hospital-card">


<h3>
🏥 ${data.name}
</h3>


<p>
📍 ${data.city || "-"}
</p>


<p>
${data.address || "-"}
</p>


<p>
☎ ${data.phone || "-"}
</p>


<p>
🌐 ${data.website || "-"}
</p>




<button

onclick="deleteHospital('${item.id}')"

>

Delete

</button>



</div>


`;



});



}









// Search Hospital


window.searchHospital = async function(){



const city =

document.getElementById(
"searchCity"
)
.value.trim();





const q = query(

hospitalCollection,

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
"hospitalList"
);



list.innerHTML="";




if(snapshot.empty){


list.innerHTML =
"<p>কোনো হাসপাতাল পাওয়া যায়নি</p>";


return;


}





snapshot.forEach(item=>{


const data = item.data();



list.innerHTML += `


<div class="hospital-card">


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

onclick="deleteHospital('${item.id}')"

>

Delete

</button>



</div>



`;



});



}









// Delete Hospital


window.deleteHospital = async function(id){



const confirmDelete =

confirm(
"এই হাসপাতালটি Delete করবেন?"
);




if(!confirmDelete)
return;




try{


await deleteDoc(

doc(
db,
"hospitals",
id
)

);



alert(
"Deleted Successfully"
);



loadHospitals();



}


catch(error){


console.log(error);


}



}









// Update Hospital


window.updateHospital = async function(id){



const ref =

doc(
db,
"hospitals",
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

document.getElementById("website").value



}

);



alert(
"Updated Successfully"
);



loadHospitals();



}









// Start

loadHospitals();
