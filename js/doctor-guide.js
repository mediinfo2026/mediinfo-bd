// js/doctor-guide.js

import {
    getCollection
} from "./firestore.js";

import {
    escapeHTML
} from "./helpers.js";


// =====================================
// URL থেকে Slug নেওয়া
// =====================================

const params =
    new URLSearchParams(
        window.location.search
    );

const slug =
    params.get("slug");


// =====================================
// DOM Elements
// =====================================

const guideDetails =
    document.getElementById(
        "doctorGuideDetails"
    );

const breadcrumbGuideName =
    document.getElementById(
        "breadcrumbGuideName"
    );


// =====================================
// Load Guide Details
// =====================================

async function loadGuideDetails() {

    if (!slug) {

        showError(
            "ডাক্তার গাইডের তথ্য পাওয়া যায়নি।"
        );

        return;

    }


    try {

        const guides =
            await getCollection(
                "doctor_guides"
            );


        const guide =
            guides.find(
                item =>

                    String(
                        item.slug ||
                        ""
                    ).toLowerCase() ===

                    String(
                        slug
                    ).toLowerCase()
            );


        if (!guide) {

            showError(
                "এই ডাক্তার গাইডের তথ্য পাওয়া যায়নি।"
            );

            return;

        }


        renderGuide(
            guide
        );


    } catch (error) {

        console.error(
            "Doctor Guide Details Error:",
            error
        );


        showError(
            "ডাক্তার গাইডের তথ্য লোড করতে সমস্যা হয়েছে।"
        );

    }

}


// =====================================
// Render Guide
// =====================================

function renderGuide(
    guide
) {


    const title =
        getTextValue(
            guide.title ||
            guide.name
        );


    document.title =
        `${title || "ডাক্তার গাইড"} | MediTest BD`;


    if (
        breadcrumbGuideName
    ) {

        breadcrumbGuideName.textContent =
            title ||
            "বিস্তারিত";

    }


    const description =
        getTextValue(
            guide.description ||
            guide.summary
        );


    const disease =
        getTextValue(
            guide.disease
        );


    const specialty =
        getTextValue(
            guide.specialty ||
            guide.department
        );


    const symptoms =
        getTextValue(
            guide.symptoms
        );


    const causes =
        getTextValue(
            guide.causes
        );


    const diagnosis =
        getTextValue(
            guide.diagnosis
        );


    const tests =
        getTextValue(
            guide.tests
        );


    const treatment =
        getTextValue(
            guide.treatment
        );


    const prevention =
        getTextValue(
            guide.prevention
        );


    const warningSigns =
        getTextValue(
            guide.warningSigns ||
            guide.whenToSeeDoctor
        );


    const content =
        getTextValue(
            guide.content
        );


    const note =
        getTextValue(
            guide.note
        );


    guideDetails.innerHTML = `

        <article
            class="doctor-guide-details-card"
        >

            <header
                class="doctor-guide-details-header"
            >

                <div
                    class="doctor-guide-details-icon"
                >

                    👨‍⚕️

                </div>


                <h1>

                    ${escapeHTML(
                        title ||
                        "ডাক্তার গাইড"
                    )}

                </h1>

            </header>


            ${createSection(
                "📖 সংক্ষিপ্ত বিবরণ",
                description
            )}


            ${createSection(
                "🦠 সংশ্লিষ্ট রোগ",
                disease
            )}


            ${createSection(
                "🩺 সংশ্লিষ্ট বিভাগ",
                specialty
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
                "🧪 রোগ নির্ণয়",
                diagnosis
            )}


            ${createSection(
                "🧫 প্রয়োজনীয় টেস্ট",
                tests
            )}


            ${createSection(
                "💊 চিকিৎসা সংক্রান্ত তথ্য",
                treatment
            )}


            ${createSection(
                "🛡️ প্রতিরোধ",
                prevention
            )}


            ${createSection(
                "🚨 কখন চিকিৎসকের পরামর্শ নেবেন",
                warningSigns
            )}


            ${createSection(
                "📚 বিস্তারিত তথ্য",
                content
            )}


            ${createSection(
                "📝 বিশেষ নোট",
                note
            )}


            <div
                class="medical-disclaimer"
            >

                ⚕️ এই তথ্য সাধারণ জ্ঞান ও শিক্ষামূলক উদ্দেশ্যে দেওয়া হয়েছে।
                এটি কোনো ব্যক্তিগত চিকিৎসা পরামর্শ বা রোগ নির্ণয়ের বিকল্প নয়।
                প্রয়োজন হলে অবশ্যই যোগ্য চিকিৎসকের পরামর্শ নিন।

            </div>

        </article>

    `;

}


// =====================================
// Create Section
// =====================================

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


// =====================================
// Format Content
// =====================================

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


// =====================================
// Get Text Value
// =====================================

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


// =====================================
// Error UI
// =====================================

function showError(
    message
) {


    if (
        !guideDetails
    ) return;


    guideDetails.innerHTML = `

        <div
            class="error-box"
        >

            ❌ ${escapeHTML(
                message
            )}

            <br><br>

            <a
                href="doctor-guides.html"
                class="details-button"
            >

                ← ডাক্তার গাইডে ফিরে যান

            </a>

        </div>

    `;

}


// =====================================
// Start
// =====================================

loadGuideDetails();
