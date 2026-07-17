// js/helpers.js



// ===============================
// Create Slug
// ===============================

export function createSlug(text){


return text

.toString()

.toLowerCase()

.trim()

.replace(
/[^\w\s-]/g,
""
)

.replace(
/\s+/g,
"-"
)

.replace(
/--+/g,
"-"
);


}







// ===============================
// Capital First Letter
// ===============================

export function capitalize(text){


if(!text) return "";


return text.charAt(0).toUpperCase()+text.slice(1);


}







// ===============================
// Format Date
// ===============================

export function formatDate(date){


if(!date) return "-";


const d = new Date(date);



return d.toLocaleDateString(
"bn-BD",
{

year:"numeric",

month:"long",

day:"numeric"

}

);


}







// ===============================
// Format Currency
// ===============================

export function formatPrice(price){


if(!price) return "৳ 0";


return "৳ " + 
Number(price).toLocaleString(
"bn-BD"
);


}







// ===============================
// HTML Security Escape
// ===============================

export function escapeHTML(text){


if(!text) return "";


return text

.replace(
/&/g,
"&amp;"
)

.replace(
/</g,
"&lt;"
)

.replace(
/>/g,
"&gt;"
)

.replace(
/"/g,
"&quot;"
)

.replace(
/'/g,
"&#039;"
);


}







// ===============================
// Check Empty
// ===============================

export function isEmpty(value){


return (

value === null ||

value === undefined ||

value.trim() === ""

);


}







// ===============================
// Show Loading
// ===============================

export function showLoading(elementId){


const el =

document.getElementById(
elementId
);



if(el){


el.innerHTML = `

<div class="loading">

⏳ Loading...

</div>

`;

}


}







// ===============================
// Show Error
// ===============================

export function showError(
elementId,
message
){


const el =

document.getElementById(
elementId
);



if(el){


el.innerHTML = `

<div class="error">

❌ ${message}

</div>

`;

}


}







// ===============================
// Show Success Message
// ===============================

export function showSuccess(
message
){


alert(
"✅ " + message
);


}







// ===============================
// Local Storage Save
// ===============================

export function saveLocal(
key,
data
){


localStorage.setItem(

key,

JSON.stringify(data)

);


}







// ===============================
// Local Storage Get
// ===============================

export function getLocal(key){


const data =

localStorage.getItem(key);



return data ?

JSON.parse(data)

:

null;


}







// ===============================
// Remove Local Storage
// ===============================

export function removeLocal(key){


localStorage.removeItem(key);


}







// ===============================
// Debounce Search
// ===============================

export function debounce(
func,
delay=500
){


let timer;



return function(...args){


clearTimeout(timer);



timer = setTimeout(()=>{


func.apply(
this,
args
);


},delay);



};


}







// ===============================
// Generate Random ID
// ===============================

export function generateID(){


return Date.now().toString(36)

+

Math.random()

.toString(36)

.substring(2);


}
