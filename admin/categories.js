// admin/categories.js


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

const categoryCollection =

collection(
db,
"categories"
);








// Add Category


window.addCategory = async function(){



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
"Category Name দিন"
);


return;


}






try{


await addDoc(

categoryCollection,

data

);



alert(
"✅ Category Added Successfully"
);



loadCategories();



}



catch(error){


console.log(error);


alert(
"Category Add Failed"
);



}



}









// Load All Categories


async function loadCategories(){



const list =

document.getElementById(
"categoryList"
);



if(!list) return;




list.innerHTML="";



const snapshot =

await getDocs(
categoryCollection
);





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `



<div class="category-card">


<h3>
📂 ${data.name}
</h3>



<p>
Slug:
${data.slug || "-"}
</p>



<p>
${data.description || ""}
</p>




<button

onclick="deleteCategory('${item.id}')"

>

Delete

</button>



</div>


`;



});



}









// Search Category


window.searchCategory = async function(){



const slug =

document.getElementById(
"searchSlug"
)
.value.trim().toLowerCase();





const q = query(

categoryCollection,

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
"categoryList"
);



list.innerHTML="";





if(snapshot.empty){


list.innerHTML =

"<p>কোনো Category পাওয়া যায়নি</p>";

return;


}





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `


<div class="category-card">


<h3>
📂 ${data.name}
</h3>


<p>
${data.description || ""}
</p>



<button

onclick="deleteCategory('${item.id}')"

>

Delete

</button>



</div>


`;



});



}









// Delete Category


window.deleteCategory = async function(id){



if(
!confirm("এই Category Delete করবেন?")
)

return;





try{


await deleteDoc(

doc(
db,
"categories",
id
)

);



alert(
"Deleted Successfully"
);



loadCategories();



}



catch(error){


console.log(error);


}



}









// Update Category


window.updateCategory = async function(id){



const ref =

doc(
db,
"categories",
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



loadCategories();



}









// Start

loadCategories();
