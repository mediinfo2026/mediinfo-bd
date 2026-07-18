// admin/dashboard.js



import {

    db,

    auth

}

from "../firebase.js";



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





// =====================================
// LOGIN PROTECTION
// =====================================


let currentUser = null;


onAuthStateChanged(

    auth,

    (user) => {


        if (!user) {


            // Login করা না থাকলে Login Page-এ পাঠাবে

            window.location.replace(

                "login.html"

            );


            return;

        }


        // Current User Save

        currentUser = user;


        // Email দেখানো

        const emailElement =

            document.getElementById(

                "adminEmail"

            );


        if (emailElement) {

            emailElement.textContent =

                user.email;

        }


        // Dashboard Data Load

        loadDashboard();

    }

);





// =====================================
// GET COLLECTION COUNT
// =====================================


async function getCollectionCount(

    collectionName

) {


    try {


        const snapshot =

            await getDocs(

                collection(

                    db,

                    collectionName

                )

            );


        return snapshot.size;


    }

    catch (error) {


        console.error(

            `Error loading ${collectionName}:`,

            error

        );


        return 0;

    }

}





// =====================================
// LOAD DASHBOARD STATISTICS
// =====================================


async function loadDashboard() {


    try {


        const [

            tests,

            prices,

            hospitals,

            centers,

            diseases,

            guides,

            departments,

            categories

        ] = await Promise.all([


            getCollectionCount(

                "tests"

            ),


            getCollectionCount(

                "diagnostic_prices"

            ),


            getCollectionCount(

                "hospitals"

            ),


            getCollectionCount(

                "diagnostic_centers"

            ),


            getCollectionCount(

                "diseases"

            ),


            getCollectionCount(

                "doctor_guides"

            ),


            getCollectionCount(

                "departments"

            ),


            getCollectionCount(

                "categories"

            )


        ]);



        // Update Statistics

        setNumber(

            "totalTests",

            tests

        );


        setNumber(

            "totalPrices",

            prices

        );


        setNumber(

            "totalHospitals",

            hospitals

        );


        setNumber(

            "totalCenters",

            centers

        );


        setNumber(

            "totalDiseases",

            diseases

        );


        setNumber(

            "totalGuides",

            guides

        );


        setNumber(

            "totalDepartments",

            departments

        );


        setNumber(

            "totalCategories",

            categories

        );


    }

    catch (error) {


        console.error(

            "Dashboard Loading Error:",

            error

        );


    }

}





// =====================================
// SET NUMBER
// =====================================


function setNumber(

    elementId,

    number

) {


    const element =

        document.getElementById(

            elementId

        );


    if (element) {


        element.textContent =

            Number(number).toLocaleString(

                "bn-BD"

            );

    }

}





// =====================================
// LOGOUT
// =====================================


async function logoutAdmin() {


    try {


        const confirmLogout =

            confirm(

                "আপনি কি Logout করতে চান?"

            );


        if (!confirmLogout) {


            return;

        }


        // Firebase থেকে সত্যিকারের Logout

        await signOut(auth);


        // Login Page-এ পাঠানো

        window.location.replace(

            "login.html"

        );


    }

    catch (error) {


        console.error(

            "Logout Error:",

            error

        );


        alert(

            "Logout করা যায়নি। আবার চেষ্টা করুন।"

        );

    }

}





// Logout Button-এর সাথে Function যুক্ত

const logoutButton =

    document.getElementById(

        "logoutBtn"

    );


if (logoutButton) {


    logoutButton.addEventListener(

        "click",

        logoutAdmin

    );

}
