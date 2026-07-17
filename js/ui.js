// js/ui.js


// ===============================
// Render Header
// ===============================

export function renderHeader(){


const header = document.getElementById("header");


if(!header) return;



header.innerHTML = `

<nav class="navbar">

<h2>
🩺 MediTest BD
</h2>


<div>

<a href="index.html">
Home
</a>


<a href="tests.html">
Tests
</a>


<a href="diseases.html">
Diseases
</a>


<a href="hospitals.html">
Hospitals
</a>


</div>


</nav>

`;



}









// ===============================
// Render Footer
// ===============================

export function renderFooter(){


const footer = document.getElementById("footer");


if(!footer) return;



footer.innerHTML = `

<div class="footer-content">

<p>
© 2026 MediTest BD
</p>


<p>
Medical Test Information Database
</p>


</div>

`;



}









// ===============================
// Loading UI
// ===============================

export function showLoading(id){


const element =

document.getElementById(id);



if(element){


element.innerHTML = `

<div class="loading">

⏳ Loading...

</div>

`;

}


}









// ===============================
// Empty Data
// ===============================

export function showEmpty(
id,
message="কোন তথ্য পাওয়া যায়নি"
){


const element =

document.getElementById(id);



if(element){


element.innerHTML = `

<div class="empty">

📭 ${message}

</div>

`;

}



}









// ===============================
// Error UI
// ===============================

export function showError(
id,
message
){


const element =

document.getElementById(id);



if(element){


element.innerHTML = `

<div class="error">

❌ ${message}

</div>

`;

}



}









// ===============================
// Test Card
// ===============================

export function testCard(test){



return `


<div class="test-card">


<h3>
🧪 ${test.name || ""}
</h3>



<p>

Category:
${test.category || "-"}

</p>



<p>

💰 Price:
৳ ${test.price || "-"}

</p>




<a href="test.html?slug=${test.slug}">

View Details

</a>


</div>



`;



}









// ===============================
// Disease Card
// ===============================

export function diseaseCard(data){



return `


<div class="disease-card">


<h3>
🦠 ${data.name || ""}
</h3>


<p>

${data.description || ""}

</p>



<a href="disease.html?slug=${data.slug}">

Read More

</a>



</div>


`;



}









// ===============================
// Diagnostic Center Card
// ===============================

export function centerCard(data){



return `


<div class="center-card">


<h3>
🏥 ${data.name || ""}
</h3>


<p>
📍 ${data.city || ""}
</p>


<p>
${data.address || ""}
</p>


<p>
☎ ${data.phone || ""}
</p>


</div>


`;



}









// ===============================
// Price Card
// ===============================

export function priceCard(data){



return `


<div class="price-card">


<h3>

${data.center || ""}

</h3>



<p>

📍 ${data.city || ""}

</p>



<p>

💰 ৳ ${data.price || ""}

</p>



</div>


`;



}









// ===============================
// Pagination
// ===============================

export function renderPagination(
containerId,
current,
total,
callback
){



const container =

document.getElementById(
containerId
);



if(!container) return;



container.innerHTML="";




for(
let i=1;
i<=total;
i++
){



const btn=document.createElement("button");



btn.innerText=i;



if(i===current){

btn.classList.add("active");

}



btn.onclick=()=>callback(i);



container.appendChild(btn);



}



}









// ===============================
// Toast Message
// ===============================

export function toast(message){



const div =

document.createElement("div");



div.className="toast";



div.innerHTML = message;



document.body.appendChild(div);




setTimeout(()=>{


div.remove();


},3000);



}
