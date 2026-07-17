// admin/departments.js


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

const departmentCollection =

collection(
db,
"departments"
);








// Add Department


window.addDepartment = async function(){



const data = {



name:

document.getElementById("name").value.trim(),



slug:

document.getElementById("slug").value.trim().toLowerCase(),



description:

document.getElementById("description").value.trim(),



createdAt:

new Date()



};






if(!data.name){


alert(
"Department Name দিন"
);


return;


}






try{


await addDoc(

departmentCollection,

data

);



alert(
"✅ Department Added Successfully"
);



loadDepartments();



}


catch(error){


console.log(error);


alert(
"Department Add Failed"
);


}



}









// Load Departments


async function loadDepartments(){



const list =

document.getElementById(
"departmentList"
);



if(!list) return;




list.innerHTML="";



const snapshot =

await getDocs(
departmentCollection
);





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `


<div class="department-card">


<h3>
🏥 ${data.name}
</h3>


<p>
${data.description || "-"}
</p>


<p>
Slug: ${data.slug || "-"}
</p>




<button

onclick="deleteDepartment('${item.id}')"

>

Delete

</button>



</div>


`;



});



}









// Search Department


window.searchDepartment = async function(){



const slug =

document.getElementById(
"searchSlug"
)
.value.trim().toLowerCase();






const q = query(

departmentCollection,

where(
"slug",
"==",
slug
)

);






const snapshot =

await getDocs(q);





const list =

document.getElementById(
"departmentList"
);



list.innerHTML="";





if(snapshot.empty){


list.innerHTML =

"<p>কোনো Department পাওয়া যায়নি</p>";

return;


}





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `



<div class="department-card">


<h3>
🏥 ${data.name}
</h3>


<p>
${data.description || ""}
</p>



<button

onclick="deleteDepartment('${item.id}')"

>

Delete

</button>



</div>


`;



});



}









// Delete Department


window.deleteDepartment = async function(id){



if(
!confirm("এই Department Delete করবেন?")
)

return;






try{


await deleteDoc(

doc(
db,
"departments",
id
)

);



alert(
"Deleted Successfully"
);



loadDepartments();



}


catch(error){


console.log(error);


}



}









// Update Department


window.updateDepartment = async function(id){



const ref =

doc(
db,
"departments",
id
);






await updateDoc(

ref,

{


name:

document.getElementById("name").value,



slug:

document.getElementById("slug").value,



description:

document.getElementById("description").value



}

);



alert(
"Updated Successfully"
);



loadDepartments();



}








// Start

loadDepartments();
