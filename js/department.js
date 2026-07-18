// js/department.js


import {
    getCollection
} from "./firestore.js";


import {
    escapeHTML
} from "./helpers.js";


// ===============================
// URL থেকে Slug নেওয়া
// ===============================

const params =
    new URLSearchParams(
        window.location.search
    );


const slug =
    params.get("slug");


// ===============================
// DOM Elements
// ===============================

const departmentDetails =
    document.getElementById(
        "departmentDetails"
    );


const breadcrumbDepartmentName =
    document.getElementById(
        "breadcrumbDepartmentName"
    );


// ===============================
// Load Department Details
// ===============================

async function loadDepartmentDetails() {


    if (
        !slug
    ) {

        showError(
            "বিভাগের তথ্য পাওয়া যায়নি।"
        );

        return;

    }


    try {


        const departments =
            await getCollection(
                "departments"
            );


        const department =
            departments.find(
                item =>

                    String(
                        item.slug ||
                        ""
                    ).toLowerCase() ===

                    String(
                        slug
                    ).toLowerCase()
            );


        if (
            !department
        ) {

            showError(
                "এই বিভাগের তথ্য পাওয়া যায়নি।"
            );

            return;

        }


        renderDepartment(
            department
        );


    } catch (
        error
    ) {


        console.error(
            "Department Details Error:",
            error
        );


        showError(
            "বিভাগের তথ্য লোড করতে সমস্যা হয়েছে।"
        );

    }

}


// ===============================
// Render Department
// ===============================

function renderDepartment(
    department
) {


    const name =
        getTextValue(
            department.name
        );


    document.title =
        `${name || "বিভাগ"} | MediTest BD`;


    if (
        breadcrumbDepartmentName
    ) {

        breadcrumbDepartmentName.textContent =
            name ||
            "বিস্তারিত";

    }


    const description =
        getTextValue(
            department.description
        );


    const specialties =
        getTextValue(
            department.specialties
        );


    const services =
        getTextValue(
            department.services
        );


    const diseases =
        getTextValue(
            department.diseases
        );


    const tests =
        getTextValue(
            department.tests
        );


    const doctors =
        getTextValue(
            department.doctors
        );


    const note =
        getTextValue(
            department.note
        );


    departmentDetails.innerHTML = `

        <article
            class="department-details-card"
        >

            <header
                class="department-details-header"
            >

                <div
                    class="department-details-icon"
                >

                    🏥

                </div>


                <h1>

                    ${escapeHTML(
                        name ||
                        "বিভাগের নাম নেই"
                    )}

                </h1>

            </header>


            ${createSection(
                "📖 বিভাগ সম্পর্কে",
                description
            )}


            ${createSection(
                "🎯 প্রধান বিশেষত্ব",
                specialties
            )}


            ${createSection(
                "🩺 প্রধান সেবা",
                services
            )}


            ${createSection(
                "🦠 সংশ্লিষ্ট রোগসমূহ",
                diseases
            )}


            ${createSection(
                "🧪 সংশ্লিষ্ট টেস্টসমূহ",
                tests
            )}


            ${createSection(
                "👨‍⚕️ চিকিৎসা সংক্রান্ত তথ্য",
                doctors
            )}


            ${createSection(
                "📝 বিশেষ নোট",
                note
            )}


            <div
                class="medical-disclaimer"
            >

                ⚕️ এই তথ্য সাধারণ জ্ঞান ও শিক্ষামূলক উদ্দেশ্যে দেওয়া হয়েছে।
                নির্দিষ্ট রোগ বা চিকিৎসার জন্য অবশ্যই যোগ্য চিকিৎসকের পরামর্শ নিন।

            </div>

        </article>

    `;

}


// ===============================
// Create Section
// ===============================

function createSection(
    title,
    content
) {


    if (
        !content ||
        content.trim() === ""
    ) {

        return "";

    }


    return `

        <section
            class="info-section"
        >

            <h2>

                ${title}

            </h2>


            <div>

                ${formatContent(
                    content
                )}

            </div>

        </section>

    `;

}


// ===============================
// Format Content
// ===============================

function formatContent(
    content
) {


    return escapeHTML(
        content
    )

        .replace(
            /\n/g,
            "<br>"
        );

}


// ===============================
// Get Text Value
// ===============================

function getTextValue(
    value
) {


    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    if (
        Array.isArray(
            value
        )
    ) {

        return value

            .map(
                item =>
                    getTextValue(
                        item
                    )
            )

            .filter(
                Boolean
            )

            .join(
                ", "
            );

    }


    if (
        typeof value ===
        "object"
    ) {

        return (

            value.name ||

            value.title ||

            value.value ||

            ""

        );

    }


    return String(
        value
    ).trim();

}


// ===============================
// Error UI
// ===============================

function showError(
    message
) {


    if (
        !departmentDetails
    ) return;


    departmentDetails.innerHTML = `

        <div
            class="error-box"
        >

            ❌ ${escapeHTML(
                message
            )}

            <br><br>

            <a
                href="departments.html"
                class="details-button"
            >

                ← সকল বিভাগে ফিরে যান

            </a>

        </div>

    `;

}


// ===============================
// Start
// ===============================

loadDepartment
