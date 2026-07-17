// js/firestore.js


import { db } from "../firebase.js";


import {

collection,
getDocs,
getDoc,
doc,
addDoc,
updateDoc,
deleteDoc,
query,
where,
orderBy,
limit

}

from

"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";









// Get All Documents


export async function getCollection(collectionName){



try{


const snapshot =

await getDocs(

collection(
db,
collectionName
)

);



return snapshot.docs.map(doc=>({


id:doc.id,


...doc.data()


}));



}

catch(error){


console.log(
"Get Collection Error:",
error
);



return [];


}



}









// Get Single Document


export async function getDocument(collectionName,id){



try{


const ref =

doc(
db,
collectionName,
id
);



const snapshot =

await getDoc(ref);





if(snapshot.exists()){



return {


id:snapshot.id,


...snapshot.data()



};



}



return null;



}


catch(error){


console.log(
"Get Document Error:",
error
);



return null;



}



}









// Add Document


export async function addDocument(collectionName,data){



try{


const result =

await addDoc(

collection(
db,
collectionName
),

data

);



return result.id;



}


catch(error){


console.log(
"Add Document Error:",
error
);



return null;



}



}









// Update Document


export async function updateDocument(collectionName,id,data){



try{


await updateDoc(

doc(
db,
collectionName,
id
),

data

);



return true;



}


catch(error){


console.log(
"Update Document Error:",
error
);



return false;



}



}









// Delete Document


export async function deleteDocument(collectionName,id){



try{


await deleteDoc(

doc(
db,
collectionName,
id
)

);



return true;



}


catch(error){


console.log(
"Delete Document Error:",
error
);



return false;



}



}









// Search By Field


export async function searchByField(
collectionName,
field,
value
){



try{


const q = query(

collection(
db,
collectionName
),

where(
field,
"==",
value
)

);





const snapshot =

await getDocs(q);





return snapshot.docs.map(doc=>({


id:doc.id,


...doc.data()



}));



}

catch(error){


console.log(
"Search Error:",
error
);



return [];



}



}









// Get Ordered Data


export async function getOrderedData(
collectionName,
field,
direction="desc"
){



try{


const q = query(

collection(
db,
collectionName
),

orderBy(
field,
direction
)

);





const snapshot =

await getDocs(q);





return snapshot.docs.map(doc=>({


id:doc.id,


...doc.data()



}));



}



catch(error){


console.log(
"Order Error:",
error
);



return [];



}



}









// Limit Data


export async function getLimitedData(
collectionName,
number
){



try{


const q = query(

collection(
db,
collectionName
),

limit(number)

);





const snapshot =

await getDocs(q);





return snapshot.docs.map(doc=>({


id:doc.id,


...doc.data()



}));



}



catch(error){


console.log(
"Limit Error:",
error
);



return [];



}



}
