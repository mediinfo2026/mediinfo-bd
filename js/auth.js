// js/auth.js


import { auth } from "../firebase.js";


import {

onAuthStateChanged,
signOut

}

from

"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";






// Current User Check


export function checkAuth(callback){



onAuthStateChanged(

auth,

(user)=>{


if(callback){


callback(user);


}



}


);



}









// Require Admin Login


export function requireAuth(){



onAuthStateChanged(

auth,

(user)=>{



if(!user){


window.location.href =
"../admin/login.html";


}



}


);



}









// Get Current User


export function getCurrentUser(){



return auth.currentUser;


}









// Logout Function


export async function logout(){



try{


await signOut(auth);



window.location.href =
"../admin/login.html";



}


catch(error){


console.log(
"Logout Error:",
error
);



}



}









// Show User Email


export function showUserEmail(elementId){



const user =

auth.currentUser;



const element =

document.getElementById(
elementId
);





if(
element &&
user
){


element.innerHTML =
user.email;


}



}
