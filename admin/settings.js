// admin/setting.js


import { db } from "../firebase.js";


import {

doc,
getDoc,
setDoc

}

from

"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";




// Settings Document

const settingRef =

doc(
db,
"settings",
"site"
);






// Load Settings


async function loadSettings(){



try{


const snap =

await getDoc(
settingRef
);




if(snap.exists()){


const data =
snap.data();



document.getElementById("siteName").value =
data.siteName || "";



document.getElementById("description").value =
data.description || "";



document.getElementById("contact").value =
data.contact || "";



document.getElementById("footer").value =
data.footer || "";



}




}

catch(error){


console.log(
"Load Setting Error:",
error
);


}



}








// Save Settings


window.saveSettings = async function(){



const data = {


siteName:

document.getElementById("siteName").value,



description:

document.getElementById("description").value,



contact:

document.getElementById("contact").value,



footer:

document.getElementById("footer").value,



updatedAt:

new Date()



};






try{


await setDoc(

settingRef,

data

);



alert(
"✅ Settings Updated Successfully"
);



}



catch(error){


console.log(
"Save Setting Error:",
error
);



alert(
"Settings Save Failed"
);



}



}








// Reset Form


window.resetSettings = function(){



document.getElementById("siteName").value="";


document.getElementById("description").value="";


document.getElementById("contact").value="";


document.getElementById("footer").value="";



}







// Start

loadSettings();
