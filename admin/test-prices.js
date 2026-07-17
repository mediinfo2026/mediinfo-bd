// admin/test-prices.js


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

const priceCollection =
collection(
db,
"diagnostic_prices"
);






// Add Price


window.addPrice = async function(){



const data = {



testSlug:

document.getElementById("testSlug").value
.trim()
.toLowerCase(),



center:

document.getElementById("center").value,



city:

document.getElementById("city").value,



price:

document.getElementById("price").value,



createdAt:

new Date()



};





if(
!data.testSlug ||
!data.center ||
!data.price
){

alert(
"সব তথ্য পূরণ করুন"
);

return;

}





try{


await addDoc(

priceCollection,

data

);



alert(
"✅ Price Added Successfully"
);



loadPrices();



}



catch(error){


console.log(error);


alert(
"Price Add Error"
);


}



}








// Load All Prices


async function loadPrices(){



const list =

document.getElementById(
"priceList"
);



if(!list) return;




list.innerHTML="";



const snapshot =

await getDocs(
priceCollection
);





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `


<div class="price-card">


<h3>
${data.testSlug}
</h3>


<p>
🏥 ${data.center}
</p>


<p>
📍 ${data.city || "-"}
</p>


<p>
💰 ৳ ${data.price}
</p>



<button

onclick="deletePrice('${item.id}')"

>

Delete

</button>



</div>


`;



});




}









// Load Price By Test


window.searchPrice = async function(){



const slug =

document.getElementById(
"searchSlug"
)
.value
.trim()
.toLowerCase();





const q = query(

priceCollection,

where(
"testSlug",
"==",
slug
)

);





const snapshot =

await getDocs(q);




const list =

document.getElementById(
"priceList"
);



list.innerHTML="";




if(snapshot.empty){


list.innerHTML =

"<p>কোনো মূল্য পাওয়া যায়নি</p>";

return;


}





snapshot.forEach(item=>{


const data =
item.data();



list.innerHTML += `


<div class="price-card">


<h3>
${data.testSlug}
</h3>


<p>
🏥 ${data.center}
</p>


<p>
📍 ${data.city}
</p>


<p>
💰 ৳ ${data.price}
</p>


<button

onclick="deletePrice('${item.id}')"

>

Delete

</button>


</div>


`;



});



}










// Delete Price


window.deletePrice = async function(id){



const confirmDelete =

confirm(
"এই মূল্যটি Delete করবেন?"
);




if(!confirmDelete)
return;




try{


await deleteDoc(

doc(
db,
"diagnostic_prices",
id

)

);



alert(
"Deleted Successfully"
);



loadPrices();



}

catch(error){

console.log(error);

}



}









// Update Price


window.updatePrice = async function(id){



const ref =

doc(
db,
"diagnostic_prices",
id
);





await updateDoc(

ref,

{


center:

document.getElementById("center").value,


city:

document.getElementById("city").value,


price:

document.getElementById("price").value



}

);



alert(
"Updated Successfully"
);



loadPrices();



}








// Start


loadPrices();
