// js/departments.js


import {
    getCollection
} from "./firestore.js";


import {
    escapeHTML
} from "./helpers.js";


// ===============================
// State
// ===============================

let allDepartments = [];

let filteredDepartments = [];


// ===============================
// DOM Elements
// ===============================

const departmentList =
    document.getElementById(
        "departmentList"
    );


const searchInput =
    document.getElementById(
        "departmentSearchInput"
    );


const clearSearchButton =
    document.getElementById(
        "clearDepartmentSearchButton"
    );


const resultInfo =
    document.getElementById(
        "departmentResultInfo"
    );


// ===============================
// Load Departments
// ===============================

async function loadDepartments() {

    try {

        showLoading();


        allDepartments =
            await getCollection(
                "departments"
            );


        allDepartments =
            allDepartments
                .filter(
                    department =>
                        getTextValue(
                            department.name
                        )
                )
                .sort(
                    (a, b) =>
                        getTextValue(
                            a.name
                        ).localeCompare(
                            getTextValue(
                                b.name
                            ),
                            "bn"
                        )
                );


        filteredDepartments =
            [
                ...allDepartments
            ];


        renderDepartments();


    } catch (error) {

        console.error(
            "Departments Load Error:",
            error
        );


        showError(
            "বিভাগের তথ্য লোড করা যায়নি।"
        );

    }

}


// ===============================
// Filter Departments
// ===============================

function filterDepartments() {


    const searchText =
        searchInput
            ?.value
            .trim()
            .toLowerCase() || "";


    filteredDepartments =
        allDepartments.filter(
            department => {


                const searchableText = [

                    department.name,

                    department.slug,

                    department.description,

                    department.specialties,

                    department.services,

                    department.keywords

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


    renderDepartments();

}


// ===============================
// Render Departments
// ===============================

function renderDepartments() {


    if (
        !departmentList
    ) return;


    if (
        filteredDepartments.length ===
        0
    ) {

        departmentList.innerHTML = `

            <div
                class="empty-box"
            >

                📭 কোনো বিভাগের তথ্য পাওয়া যায়নি।

            </div>

        `;


        updateResultInfo();


        return;

    }


    departmentList.innerHTML =
        filteredDepartments
            .map(
                departmentCard
            )
            .join("");


    updateResultInfo();

}


// ===============================
// Department Card
// ===============================

function departmentCard(
    department
) {


    const name =
        escapeHTML(
            getTextValue(
                department.name
            ) ||
            "বিভাগের নাম নেই"
        );


    const description =
        escapeHTML(
            getShortText(
                department.description
            )
        );


    const specialties =
        escapeHTML(
            getShortText(
                department.specialties
            )
        );


    const services =
        escapeHTML(
            getShortText(
                department.services
            )
        );


    const slug =
        encodeURIComponent(
            getTextValue(
                department.slug
            ) ||
            createSimpleSlug(
                getTextValue(
                    department.name
                )
            )
        );


    return `

        <article
            class="department-card"
        >

            <div
                class="department-card-icon"
            >

                🏥

            </div>


            <div
                class="department-card-content"
            >

                <h2>

                    ${name}

                </h2>


                ${
                    description
                        ? `
                            <p>

                                ${description}

                            </p>
                        `
                        : ""
                }


                ${
                    specialties
                        ? `
                            <p>

                                <strong>
                                    বিশেষত্ব:
                                </strong>

                                ${specialties}

                            </p>
                        `
                        : ""
                }


                ${
                    services
                        ? `
                            <p>

                                <strong>
                                    সেবা:
                                </strong>

                                ${services}

                            </p>
                        `
                        : ""
                }


                <a
                    href="department.html?slug=${slug}"
                    class="details-button"
                >

                    বিস্তারিত পড়ুন →

                </a>

            </div>

        </article>

    `;

}


// ===============================
// Result Information
// ===============================

function updateResultInfo() {


    if (
        !resultInfo
    ) return;


    resultInfo.textContent =

        `মোট ${toBanglaNumber(
            filteredDepartments.length
        )}টি বিভাগের তথ্য পাওয়া গেছে`;

}


// ===============================
// Loading
// ===============================

function showLoading() {


    if (
        !departmentList
    ) return;


    departmentList.innerHTML = `

        <div
            class="loading-box"
        >

            ⏳ বিভাগের তথ্য লোড হচ্ছে...

        </div>

    `;

}


// ===============================
// Error
// ===============================

function showError(
    message
) {


    if (
        departmentList
    ) {

        departmentList.innerHTML = `

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
// Short Text
// ===============================

function getShortText(
    value
) {


    const text =
        getTextValue(
            value
        );


    if (
        text.length <= 180
    ) {

        return text;

    }


    return (

        text.substring(
            0,
            180
        ) + "..."

    );

}


// ===============================
// Create Slug
// ===============================

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


// ===============================
// Bangla Number
// ===============================

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


// ===============================
// Events
// ===============================

searchInput?.addEventListener(
    "input",
    filterDepartments
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


        filterDepartments();

    }
);


// ===============================
// Start
// ===============================

loadDepartments();
