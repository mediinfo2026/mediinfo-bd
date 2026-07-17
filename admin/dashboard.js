// admin/dashboard.js


import { db, auth } from "../firebase.js";


import {

collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



import {

onAuthStateChanged,
signOut

}

from

"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";








// Check Admin Login


onAuthStateChanged(auth,(user)=>{



if(!user){


window.location.href="login.html";


}


});









// Count Collection


async function getCount(collectionName){



try{


const snapshot =

await getDocs(

collection(
db,
collectionName
)

);



return snapshot.size;



}


catch(error){


console.log(error);


return 0;


}



}









// Load Dashboard Statistics


async function loadDashboard(){



const tests =

await getCount(
"tests"
);



const prices =

await getCount(
"diagnostic_prices"
);



const hospitals =

await getCount(
"hospitals"
);



const centers =

await getCount(
"diagnostic_centers"
);



const diseases =

await getCount(
"diseases"
);



const guides =

await getCount(
"doctor_guides"
);



const departments =

await getCount(
"departments"
);







if(document.getElementById("totalTests"))

document.getElementById("totalTests").innerHTML =
tests;





if(document.getElementById("totalPrices"))

document.getElementById("totalPrices").innerHTML =
prices;





if(document.getElementById("totalHospitals"))

document.getElementById("totalHospitals").innerHTML =
hospitals;





if(document.getElementById("totalCenters"))

document.getElementById("totalCenters").innerHTML =
centers;





if(document.getElementById("totalDiseases"))

document.getElementById("totalDiseases").innerHTML =
diseases;





if(document.getElementById("totalGuides"))

document.getElementById("totalGuides").innerHTML =
guides;





if(document.getElementById("totalDepartments"))

document.getElementById("totalDepartments").innerHTML =
departments;



}









// Logout Function


window.adminLogout = async function(){



try{


await signOut(auth);



window.location.href =
"login.html";



}

catch(error){


console.log(error);


}



}









// Start Dashboard


loadDashboard();
