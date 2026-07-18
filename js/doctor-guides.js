// js/doctor-guides.js

import {
    getCollection
} from "./firestore.js";

import {
    escapeHTML
} from "./helpers.js";


// =====================================
// State
// =====================================

let allGuides = [];

let filteredGuides = [];


// =====================================
// DOM Elements
// =====================================

const guideList =
    document.getElementById(
        "doctorGuideList"
    );


const searchInput =
    document.getElementById(
        "doctorGuideSearchInput"
    );


const clearSearchButton =
    document.getElementById(
        "clearDoctorGuideSearchButton"
    );


const resultInfo =
    document.getElementById(
        "doctorGuideResultInfo"
    );


// =====================================
// Load Doctor Guides
// =====================================

async function loadDoctorGuides() {

    try {

        showLoading();


        allGuides =
            await getCollection(
                "doctor_guides"
            );


        allGuides =
            allGuides
                .filter(
                    guide =>
                        getTextValue(
                            guide.title ||
                            guide.name
                        )
                )
                .sort(
                    (a, b) =>

                        getTextValue(
                            a.title ||
                            a.name
                        ).localeCompare(
                            getTextValue(
                                b.title ||
                                b.name
                            ),
                            "bn"
                        )
                );


        filteredGuides =
            [
                ...allGuides
            ];


        renderGuides();


    } catch (error) {

        console.error(
            "Doctor Guides Load Error:",
            error
        );


        showError(
            "ডাক্তার গাইডের তথ্য লোড করা যায়নি।"
        );

    }

}


// =====================================
// Filter Guides
// =====================================

function filterGuides() {


    const searchText =
        searchInput
            ?.value
            .trim()
            .toLowerCase() || "";


    filteredGuides =
        allGuides.filter(
            guide => {


                const searchableText = [

                    guide.title,

                    guide.name,

                    guide.slug,

                    guide.description,

                    guide.content,

                    guide.disease,

                    guide.symptoms,

                    guide.tests,

                    guide.specialty,

                    guide.department,

                    guide.keywords

                ]

                    .map(
                        value =>
                            getTextValue(
                                value
                            )
                    )

                    .filter(
                        Boolean
                    )

                    .join(" ")

                    .toLowerCase();


                return (

                    !searchText ||

                    searchableText.includes(
                        searchText
                    )

                );

            }
        );


    renderGuides();

}


// =====================================
// Render Guides
// =====================================

function renderGuides() {


    if (
        !guideList
    ) return;


    if (
        filteredGuides.length ===
        0
    ) {

        guideList.innerHTML = `

            <div
                class="empty-box"
            >

                📭 কোনো ডাক্তার গাইড পাওয়া যায়নি।

            </div>

        `;


        updateResultInfo();


        return;

    }


    guideList.innerHTML =
        filteredGuides
            .map(
                guideCard
            )
            .join("");


    updateResultInfo();

}


// =====================================
// Guide Card
// =====================================

function guideCard(
    guide
) {


    const title =
        escapeHTML(
            getTextValue(
                guide.title ||
                guide.name
            ) ||
            "গাইডের নাম নেই"
        );


    const description =
        escapeHTML(
            getShortText(
                guide.description ||
                guide.summary ||
                guide.content
            )
        );


    const disease =
        escapeHTML(
            getTextValue(
                guide.disease
            )
        );


    const specialty =
        escapeHTML(
            getTextValue(
                guide.specialty ||
                guide.department
            )
        );


    const rawSlug =
        getTextValue(
            guide.slug
        );


    const slug =
        encodeURIComponent(
            rawSlug ||
            createSimpleSlug(
                getTextValue(
                    guide.title ||
                    guide.name
                )
            )
        );


    return `

        <article
            class="doctor-guide-card"
        >

            <div
                class="doctor-guide-icon"
            >

                👨‍⚕️

            </div>


            <div
                class="doctor-guide-content"
            >

                <h2>

                    ${title}

                </h2>


                ${
                    disease
                        ? `
                            <p>

                                🦠 <strong>
                                    রোগ:
                                </strong>

                                ${disease}

                            </p>
                        `
                        : ""
                }


                ${
                    specialty
                        ? `
                            <p>

                                🩺 <strong>
                                    বিভাগ:
                                </strong>

                                ${specialty}

                            </p>
                        `
                        : ""
                }


                ${
                    description
                        ? `
                            <p>

                                ${description}

                            </p>
                        `
                        : ""
                }


                <a
                    href="doctor-guide.html?slug=${slug}"
                    class="details-button"
                >

                    বিস্তারিত পড়ুন →

                </a>

            </div>

        </article>

    `;

}


// =====================================
// Result Information
// =====================================

function updateResultInfo() {


    if (
        !resultInfo
    ) return;


    resultInfo.textContent =

        `মোট ${toBanglaNumber(
            filteredGuides.length
        )}টি ডাক্তার গাইড পাওয়া গেছে`;

}


// =====================================
// Loading UI
// =====================================

function showLoading() {


    if (
        !guideList
    ) return;


    guideList.innerHTML = `

        <div
            class="loading-box"
        >

            ⏳ ডাক্তার গাইড লোড হচ্ছে...

        </div>

    `;

}


// =====================================
// Error UI
// =====================================

function showError(
    message
) {


    if (
        guideList
    ) {

        guideList.innerHTML = `

            <div
                class="error-box"
            >

                ❌ ${escapeHTML(
                    message
                )}

            </div>

        `;

    }


    if (
        resultInfo
    ) {

        resultInfo.textContent =
            "";

    }

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
// Short Text
// =====================================

function getShortText(
    value
) {


    const text =
        getTextValue(
            value
        );


    if (
        text.length <= 200
    ) {

        return text;

    }


    return (

        text.substring(
            0,
            200
        ) + "..."

    );

}


// =====================================
// Create Slug
// =====================================

function createSimpleSlug(
    text
) {


    return String(
        text || ""
    )

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
            /-+/g,
            "-"
        );

}


// =====================================
// Bangla Number
// =====================================

function toBanglaNumber(
    number
) {


    const digits = {

        0: "০",

        1: "১",

        2: "২",

        3: "৩",

        4: "৪",

        5: "৫",

        6: "৬",

        7: "৭",

        8: "৮",

        9: "৯"

    };


    return String(
        number
    ).replace(
        /\d/g,
        digit =>
            digits[
                digit
            ]
    );

}


// =====================================
// Events
// =====================================

searchInput?.addEventListener(
    "input",
    filterGuides
);


clearSearchButton?.addEventListener(
    "click",
    () => {


        if (
            searchInput
        ) {

            searchInput.value =
                "";

        }


        filterGuides();

    }
);


// =====================================
// Start
// =====================================

loadDoctorGuides();
