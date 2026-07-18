// js/disease.js


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

const diseaseDetails =
    document.getElementById(
        "diseaseDetails"
    );


const breadcrumbDiseaseName =
    document.getElementById(
        "breadcrumbDiseaseName"
    );


// ===============================
// Disease Load
// ===============================

async function loadDiseaseDetails() {


    if (!slug) {

        showError(
            "রোগের তথ্য পাওয়া যায়নি।"
        );

        return;

    }


    try {


        const diseases =
            await getCollection(
                "diseases"
            );


        const disease =
            diseases.find(
                item =>

                    String(
                        item.slug ||
                        ""
                    ).toLowerCase() ===

                    String(
                        slug
                    ).toLowerCase()
            );


        if (!disease) {

            showError(
                "এই রোগের তথ্য পাওয়া যায়নি।"
            );

            return;

        }


        renderDisease(
            disease
        );


    } catch (error) {


        console.error(
            "Disease Details Error:",
            error
        );


        showError(
            "রোগের তথ্য লোড করতে সমস্যা হয়েছে।"
        );

    }

}


// ===============================
// Render Disease
// ===============================

function renderDisease(
    disease
) {


    const name =
        cleanText(
            disease.name
        );


    document.title =
        `${name} | MediTest BD`;


    if (
        breadcrumbDiseaseName
    ) {

        breadcrumbDiseaseName.textContent =
            name ||
            "বিস্তারিত";

    }


    const description =
        cleanText(
            disease.description
        );


    const symptoms =
        cleanText(
            disease.symptoms
        );


    const causes =
        cleanText(
            disease.causes
        );


    const riskFactors =
        cleanText(
            disease.riskFactors
        );


    const diagnosis =
        cleanText(
            disease.diagnosis
        );


    const treatment =
        cleanText(
            disease.treatment
        );


    const prevention =
        cleanText(
            disease.prevention
        );


    const complications =
        cleanText(
            disease.complications
        );


    const whenToSeeDoctor =
        cleanText(
            disease.whenToSeeDoctor
        );


    const note =
        cleanText(
            disease.note
        );


    diseaseDetails.innerHTML = `

        <article
            class="disease-details-card"
        >

            <header
                class="disease-details-header"
            >

                <div
                    class="disease-details-icon"
                >

                    🦠

                </div>


                <h1>

                    ${escapeHTML(
                        name ||
                        "রোগের নাম নেই"
                    )}

                </h1>

            </header>


            ${createSection(
                "📖 রোগ সম্পর্কে",
                description
            )}


            ${createSection(
                "⚠️ সাধারণ লক্ষণ",
                symptoms
            )}


            ${createSection(
                "🔍 সম্ভাব্য কারণ",
                causes
            )}


            ${createSection(
                "👥 ঝুঁকির কারণ",
                riskFactors
            )}


            ${createSection(
                "🧪 কীভাবে নির্ণয় করা হয়",
                diagnosis
            )}


            ${createSection(
                "💊 চিকিৎসা",
                treatment
            )}


            ${createSection(
                "🛡️ প্রতিরোধ",
                prevention
            )}


            ${createSection(
                "⚠️ সম্ভাব্য জটিলতা",
                complications
            )}


            ${createSection(
                "👨‍⚕️ কখন চিকিৎসকের পরামর্শ নেবেন",
                whenToSeeDoctor
            )}


            ${createSection(
                "📝 বিশেষ নোট",
                note
            )}


            <div
                class="medical-disclaimer"
            >

                ⚕️ এই তথ্য সাধারণ জ্ঞান ও শিক্ষামূলক উদ্দেশ্যে দেওয়া হয়েছে।
                রোগ নির্ণয় বা চিকিৎসার জন্য অবশ্যই যোগ্য চিকিৎসকের পরামর্শ নিন।

            </div>

        </article>

    `;

}


// ===============================
// Create Info Section
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
// Content Formatting
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
// Clean Text
// ===============================

function cleanText(
    value
) {


    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    if (
        typeof value ===
        "object"
    ) {

        return (

            value.name ||

            value.title ||

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
        !diseaseDetails
    ) return;


    diseaseDetails.innerHTML = `

        <div
            class="error-box"
        >

            ❌ ${escapeHTML(
                message
            )}

            <br><br>

            <a
                href="diseases.html"
                class="details-button"
            >

                ← সকল রোগে ফিরে যান

            </a>

        </div>

    `;

}


// ===============================
// Start
// ===============================

loadDiseaseDetails();
