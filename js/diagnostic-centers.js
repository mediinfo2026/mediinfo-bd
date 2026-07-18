
// js/diagnostic-centers.js


import {
    getCollection
} from "./firestore.js";


import {
    escapeHTML
} from "./helpers.js";


// ===============================
// State
// ===============================

let allCenters = [];

let filteredCenters = [];


// ===============================
// DOM Elements
// ===============================

const centerList =
    document.getElementById(
        "diagnosticCenterList"
    );


const searchInput =
    document.getElementById(
        "diagnosticCenterSearchInput"
    );


const cityFilter =
    document.getElementById(
        "diagnosticCenterCityFilter"
    );


const clearSearchButton =
    document.getElementById(
        "clearDiagnosticCenterSearchButton"
    );


const resultInfo =
    document.getElementById(
        "diagnosticCenterResultInfo"
    );


// ===============================
// Load Diagnostic Centers
// ===============================

async function loadDiagnosticCenters() {

    try {

        showLoading();


        allCenters =
            await getCollection(
                "diagnostic_centers"
            );


        allCenters =
            allCenters
                .filter(
                    center =>
                        getTextValue(
                            center.name
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


        filteredCenters =
            [
                ...allCenters
            ];


        loadCities();


        renderCenters();


    } catch (error) {

        console.error(
            "Diagnostic Centers Load Error:",
            error
        );


        showError(
            "ডায়াগনস্টিক সেন্টারের তথ্য লোড করা যায়নি।"
        );

    }

}


// ===============================
// Load Cities
// ===============================

function loadCities() {

    if (!cityFilter) return;


    const cities =
        new Set();


    allCenters.forEach(
        center => {

            const city =
                getTextValue(
                    center.city
                );


            if (city) {

                cities.add(
                    city
                );

            }

        }
    );


    cityFilter.innerHTML = `

        <option value="all">
            সকল শহর
        </option>

    `;


    [
        ...cities
    ]

        .sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "bn"
                )
        )

        .forEach(
            city => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    city;


                option.textContent =
                    city;


                cityFilter.appendChild(
                    option
                );

            }
        );

}


// ===============================
// Filter Centers
// ===============================

function filterCenters() {


    const searchText =
        searchInput
            ?.value
            .trim()
            .toLowerCase() || "";


    const selectedCity =
        cityFilter
            ?.value || "all";


    filteredCenters =
        allCenters.filter(
            center => {


                const searchableText = [

                    center.name,

                    center.city,

                    center.address,

                    center.phone,

                    center.email,

                    center.website,

                    center.description,

                    center.services,

                    center.keywords

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


                const matchesSearch =
                    !searchText ||
                    searchableText.includes(
                        searchText
                    );


                const centerCity =
                    getTextValue(
                        center.city
                    );


                const matchesCity =
                    selectedCity === "all" ||
                    centerCity ===
                    selectedCity;


                return (
                    matchesSearch &&
                    matchesCity
                );

            }
        );


    renderCenters();

}


// ===============================
// Render Centers
// ===============================

function renderCenters() {


    if (!centerList) return;


    if (
        filteredCenters.length ===
        0
    ) {

        centerList.innerHTML = `

            <div
                class="empty-box"
            >

                📭 কোনো ডায়াগনস্টিক সেন্টারের তথ্য পাওয়া যায়নি।

            </div>

        `;


        updateResultInfo();


        return;

    }


    centerList.innerHTML =
        filteredCenters
            .map(
                centerCard
            )
            .join("");


    updateResultInfo();

}


// ===============================
// Center Card
// ===============================

function centerCard(center) {


    const name =
        escapeHTML(
            getTextValue(
                center.name
            ) ||
            "সেন্টারের নাম নেই"
        );


    const city =
        escapeHTML(
            getTextValue(
                center.city
            )
        );


    const address =
        escapeHTML(
            getTextValue(
                center.address
            )
        );


    const phone =
        escapeHTML(
            getTextValue(
                center.phone
            )
        );


    const email =
        escapeHTML(
            getTextValue(
                center.email
            )
        );


    const description =
        escapeHTML(
            getShortText(
                center.description
            )
        );


    const services =
        escapeHTML(
            getShortText(
                center.services
            )
        );


    const website =
        getTextValue(
            center.website
        );


    const mapLink =
        getTextValue(
            center.mapLink ||
            center.googleMaps ||
            center.mapUrl
        );


    return `

        <article
            class="diagnostic-center-card"
        >

            <div
                class="diagnostic-center-icon"
            >

                🏥

            </div>


            <div
                class="diagnostic-center-content"
            >

                <h2>

                    ${name}

                </h2>


                ${
                    city
                        ? `
                            <p>

                                📍 ${city}

                            </p>
                        `
                        : ""
                }


                ${
                    address
                        ? `
                            <p>

                                🏠 ${address}

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


                <div
                    class="diagnostic-center-contact"
                >

                    ${
                        phone
                            ? `
                                <a
                                    href="tel:${encodeURIComponent(
                                        getTextValue(
                                            center.phone
                                        )
                                    )}"
                                >

                                    ☎ ${phone}

                                </a>
                            `
                            : ""
                    }


                    ${
                        email
                            ? `
                                <a
                                    href="mailto:${encodeURIComponent(
                                        getTextValue(
                                            center.email
                                        )
                                    )}"
                                >

                                    ✉ ${email}

                                </a>
                            `
                            : ""
                    }


                    ${
                        website &&
                        isSafeHttpUrl(
                            website
                        )
                            ? `
                                <a
                                    href="${escapeHTML(
                                        website
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >

                                    🌐 Website

                                </a>
                            `
                            : ""
                    }


                    ${
                        mapLink &&
                        isSafeHttpUrl(
                            mapLink
                        )
                            ? `
                                <a
                                    href="${escapeHTML(
                                        mapLink
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >

                                    🗺️ Map

                                </a>
                            `
                            : ""
                    }

                </div>

            </div>

        </article>

    `;

}


// ===============================
// Result Information
// ===============================

function updateResultInfo() {


    if (!resultInfo) return;


    resultInfo.textContent =

        `মোট ${toBanglaNumber(
            filteredCenters.length
        )}টি ডায়াগনস্টিক সেন্টারের তথ্য পাওয়া গেছে`;

}


// ===============================
// Loading
// ===============================

function showLoading() {


    if (!centerList) return;


    centerList.innerHTML = `

        <div
            class="loading-box"
        >

            ⏳ ডায়াগনস্টিক সেন্টারের তথ্য লোড হচ্ছে...

        </div>

    `;

}


// ===============================
// Error
// ===============================

function showError(message) {


    if (centerList) {

        centerList.innerHTML = `

            <div
                class="error-box"
            >

                ❌ ${escapeHTML(
                    message
                )}

            </div>

        `;

    }


    if (resultInfo) {

        resultInfo.textContent =
            "";

    }

}


// ===============================
// Get Text Value
// ===============================

function getTextValue(value) {


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

function getShortText(value) {


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
// Safe URL Check
// ===============================

function isSafeHttpUrl(value) {


    try {

        const url =
            new URL(
                value
            );


        return (

            url.protocol === "http:" ||
            url.protocol === "https:"

        );

    } catch {

        return false;

    }

}


// ===============================
// Bangla Number
// ===============================

function toBanglaNumber(number) {


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
            digits[digit]
    );

}


// ===============================
// Events
// ===============================

searchInput?.addEventListener(
    "input",
    filterCenters
);


cityFilter?.addEventListener(
    "change",
    filterCenters
);


clearSearchButton?.addEventListener(
    "click",
    () => {


        if (searchInput) {

            searchInput.value =
                "";

        }


        if (cityFilter) {

            cityFilter.value =
                "all";

        }


        filterCenters();

    }
);


// ===============================
// Start
// ===============================

loadDiagnosticCenters();
