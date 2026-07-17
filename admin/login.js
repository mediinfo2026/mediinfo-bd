// admin/login.js


import { auth } from "../firebase.js";


import {

signInWithEmailAndPassword,
onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";





// Login Function


window.adminLogin = async function(){



const email =

document.getElementById("email").value.trim();



const password =

document.getElementById("password").value.trim();





if(!email || !password){


alert(
"Email এবং Password দিন"
);


return;


}




try{


await signInWithEmailAndPassword(

auth,

email,

password

);



alert(
"✅ Login Successful"
);



// Dashboard Redirect


window.location.href =
"dashboard.html";



}


catch(error){



console.log(
error
);



if(error.code === 
"auth/invalid-credential"){



alert(
"❌ Email অথবা Password ভুল"
);



}

else if(error.code === 
"auth/invalid-email"){



alert(
"❌ Email সঠিক নয়"
);



}

else{


alert(
"Login Failed"
);



}



}



}









// Check Existing Login


onAuthStateChanged(
auth,
(user)=>{


if(user){



const page =
window.location.pathname;



if(
page.includes("login.html")
){


window.location.href =
"dashboard.html";


}



}



}

);
