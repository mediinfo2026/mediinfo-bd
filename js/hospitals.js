// js/hospitals.js


import {
    getCollection
} from "./firestore.js";


import {
    escapeHTML
} from "./helpers.js";


// ===============================
// State
// ===============================

let allHospitals = [];

let filteredHospitals = [];


// ===============================
// DOM Elements
// ===============================

const hospitalList =
    document.getElementById(
        "hospitalList"
    );


const searchInput =
    document.getElementById(
        "hospitalSearchInput"
    );


const cityFilter =
    document.getElementById(
        "hospitalCityFilter"
    );


const clearSearchButton =
    document.getElementById(
        "clearHospitalSearchButton"
    );


const resultInfo =
    document.getElementById(
        "hospitalResultInfo"
    );


// ===============================
// Load Hospitals
// ===============================

async function loadHospitals() {


    try {


        showLoading();


        allHospitals =
            await getCollection(
                "hospitals"
            );


        allHospitals =
            allHospitals
                .filter(
                    hospital =>
                        hospital.name
                )
                .sort(
                    (a, b) =>
                        String(
                            a.name
                        ).localeCompare(
                            String(
                                b.name
                            ),
                            "bn"
                        )
                );


        filteredHospitals =
            [
                ...allHospitals
            ];


        loadCities();


        renderHospitals();


    } catch (error) {


        console.error(
            "Hospitals Load Error:",
            error
        );


        showError(
            "হাসপাতালের তথ্য লোড করা যায়নি।"
        );

    }

}


// ===============================
// Load Cities
// ===============================

function loadCities() {


    if (
        !cityFilter
    ) return;


    const cities =
        new Set();


    allHospitals.forEach(
        hospital => {


            const city =
                getTextValue(
                    hospital.city
                );


            if (
                city
            ) {

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
// Filter Hospitals
// ===============================

function filterHospitals() {


    const searchText =
        searchInput
            ?.value
            .trim()
            .toLowerCase() || "";


    const selectedCity =
        cityFilter
            ?.value || "all";


    filteredHospitals =
        allHospitals.filter(
            hospital => {


                const searchableText = [

                    hospital.name,

                    hospital.city,

                    hospital.address,

                    hospital.phone,

                    hospital.email,

                    hospital.website,

                    hospital.description,

                    hospital.departments,

                    hospital.specialties,

                    hospital.keywords

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


                const hospitalCity =
                    getTextValue(
                        hospital.city
                    );


                const matchesCity =
                    selectedCity === "all" ||
                    hospitalCity ===
                    selectedCity;


                return (

                    matchesSearch &&
                    matchesCity

                );

            }
        );


    renderHospitals();

}


// ===============================
// Render Hospitals
// ===============================

function renderHospitals() {


    if (
        !hospitalList
    ) return;


    if (
        filteredHospitals.length ===
        0
    ) {


        hospitalList.innerHTML = `

            <div
                class="empty-box"
            >

                📭 কোনো হাসপাতালের তথ্য পাওয়া যায়নি।

            </div>

        `;


        updateResultInfo();


        return;

    }


    hospitalList.innerHTML =
        filteredHospitals
            .map(
                hospitalCard
            )
            .join("");


    updateResultInfo();

}


// ===============================
// Hospital Card
// ===============================

function hospitalCard(
    hospital
) {


    const name =
        escapeHTML(
            getTextValue(
                hospital.name
            ) ||
            "হাসপাতালের নাম নেই"
        );


    const city =
        escapeHTML(
            getTextValue(
                hospital.city
            )
        );


    const address =
        escapeHTML(
            getTextValue(
                hospital.address
            )
        );


    const phone =
        escapeHTML(
            getTextValue(
                hospital.phone
            )
        );


    const email =
        escapeHTML(
            getTextValue(
                hospital.email
            )
        );


    const website =
        getTextValue(
            hospital.website
        );


    const description =
        escapeHTML(
            getShortText(
                hospital.description
            )
        );


    const departments =
        escapeHTML(
            getShortText(
                hospital.departments
            )
        );


    const mapLink =
        getTextValue(
            hospital.mapLink ||
            hospital.googleMaps ||
            hospital.mapUrl
        );


    return `

        <article
            class="hospital-card"
        >

            <div
                class="hospital-card-icon"
            >

                🏥

            </div>


            <div
                class="hospital-card-content"
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
                    departments
                        ? `
                            <p>

                                <strong>
                                    বিভাগ:
                                </strong>

                                ${departments}

                            </p>
                        `
                        : ""
                }


                <div
                    class="hospital-contact"
                >

                    ${
                        phone
                            ? `
                                <a
                                    href="tel:${encodeURIComponent(
                                        getTextValue(
                                            hospital.phone
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
                                            hospital.email
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


    if (
        !resultInfo
    ) return;


    resultInfo.textContent =

        `মোট ${toBanglaNumber(
            filteredHospitals.length
        )}টি হাসপাতালের তথ্য পাওয়া গেছে`;

}


// ===============================
// Loading UI
// ===============================

function showLoading() {


    if (
        !hospitalList
    ) return;


    hospitalList.innerHTML = `

        <div
            class="loading-box"
        >

            ⏳ হাসপাতালের তথ্য লোড হচ্ছে...

        </div>

    `;

}


// ===============================
// Error UI
// ===============================

function showError(
    message
) {


    if (
        hospitalList
    ) {

        hospitalList.innerHTML = `

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
// Safe HTTP URL Check
// ===============================

function isSafeHttpUrl(
    value
) {


    try {


        const url =
            new URL(
                value
            );


        return (

            url.protocol ===
                "http:" ||

            url.protocol ===
                "https:"

        );

    } catch {

        return false;

    }

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
    filterHospitals
);


cityFilter?.addEventListener(
    "change",
    filterHospitals
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


        if (
            cityFilter
        ) {

            cityFilter.value =
                "all";

        }


        filterHospitals();

    }
);


// ===============================
// Start
// ===============================

loadHospitals();
