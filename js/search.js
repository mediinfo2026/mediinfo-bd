// js/search.js


import {
    getCollection
} from "./firestore.js";


import {
    escapeHTML
} from "./helpers.js";


// =====================================
// State
// =====================================

let allSearchData = [];

let currentQuery = "";


// =====================================
// DOM Elements
// =====================================

const searchForm =
    document.getElementById(
        "globalSearchForm"
    );


const searchInput =
    document.getElementById(
        "globalSearchInput"
    );


const clearSearchButton =
    document.getElementById(
        "clearGlobalSearchButton"
    );


const resultInfo =
    document.getElementById(
        "globalSearchResultInfo"
    );


const searchResults =
    document.getElementById(
        "globalSearchResults"
    );


// =====================================
// Collection Configuration
// =====================================

const COLLECTIONS = [

    {
        collection: "tests",
        type: "test",
        label: "মেডিকেল টেস্ট",
        icon: "🧪",
        url: "test.html?slug="
    },


    {
        collection: "diseases",
        type: "disease",
        label: "রোগ",
        icon: "🦠",
        url: "disease.html?slug="
    },


    {
        collection: "hospitals",
        type: "hospital",
        label: "হাসপাতাল",
        icon: "🏥",
        url: "hospitals.html"
    },


    {
        collection: "diagnostic_centers",
        type: "diagnostic-center",
        label: "ডায়াগনস্টিক সেন্টার",
        icon: "🏥",
        url: "diagnostic-centers.html"
    },


    {
        collection: "departments",
        type: "department",
        label: "মেডিকেল বিভাগ",
        icon: "🩺",
        url: "department.html?slug="
    },


    {
        collection: "doctor_guides",
        type: "doctor-guide",
        label: "ডাক্তার গাইড",
        icon: "👨‍⚕️",
        url: "doctor-guide.html?slug="
    }

];


// =====================================
// Load All Search Data
// =====================================

async function loadSearchData() {


    try {


        showLoading();


        const collectionResults =
            await Promise.all(

                COLLECTIONS.map(
                    async config => {


                        try {


                            const items =
                                await getCollection(
                                    config.collection
                                );


                            return items.map(
                                item => ({

                                    ...item,

                                    _type:
                                        config.type,

                                    _label:
                                        config.label,

                                    _icon:
                                        config.icon,

                                    _collection:
                                        config.collection,

                                    _url:
                                        config.url

                                })
                            );


                        } catch (
                            error
                        ) {


                            console.error(

                                `Failed to load collection: ${config.collection}`,

                                error

                            );


                            return [];

                        }

                    }
                )

            );


        allSearchData =
            collectionResults.flat();


        hideLoading();


        const urlParams =
            new URLSearchParams(
                window.location.search
            );


        const query =
            urlParams.get(
                "q"
            );


        if (
            query
        ) {


            searchInput.value =
                query;


            performSearch(
                query
            );

        } else {


            showInitialMessage();

        }


    } catch (
        error
    ) {


        console.error(
            "Global Search Error:",
            error
        );


        showError(
            "সার্চ ডেটা লোড করতে সমস্যা হয়েছে।"
        );

    }

}


// =====================================
// Perform Search
// =====================================

function performSearch(
    query
) {


    currentQuery =
        String(
            query ||
            ""
        )
            .trim();


    if (
        !currentQuery
    ) {


        showInitialMessage();


        return;

    }


    const normalizedQuery =
        normalizeText(
            currentQuery
        );


    const results =
        allSearchData
            .map(
                item => ({

                    item,

                    score:
                        calculateScore(
                            item,
                            normalizedQuery
                        )

                })
            )
            .filter(
                result =>
                    result.score >
                    0
            )
            .sort(
                (a, b) =>
                    b.score -
                    a.score
            )
            .map(
                result =>
                    result.item
            );


    renderResults(
        results
    );

}


// =====================================
// Calculate Search Score
// =====================================

function calculateScore(
    item,
    query
) {


    const name =
        normalizeText(
            item.name ||
            item.title
        );


    const slug =
        normalizeText(
            item.slug
        );


    const searchableText =
        normalizeText(
            getSearchableText(
                item
            )
        );


    let score =
        0;


    if (
        name ===
        query
    ) {

        score += 100;

    }


    if (
        name.startsWith(
            query
        )
    ) {

        score += 60;

    }


    if (
        name.includes(
            query
        )
    ) {

        score += 40;

    }


    if (
        slug.includes(
            query
        )
    ) {

        score += 20;

    }


    if (
        searchableText.includes(
            query
        )
    ) {

        score += 10;

    }


    return score;

}


// =====================================
// Get Searchable Text
// =====================================

function getSearchableText(
    item
) {


    const ignoredKeys = [

        "_type",

        "_label",

        "_icon",

        "_collection",

        "_url",

        "id"

    ];


    return Object.entries(
        item
    )

        .filter(
            ([key]) =>
                !ignoredKeys.includes(
                    key
                )
        )

        .map(
            ([, value]) =>
                getTextValue(
                    value
                )
        )

        .filter(
            Boolean
        )

        .join(
            " "
        );

}


// =====================================
// Render Results
// =====================================

function renderResults(
    results
) {


    if (
        !searchResults
    ) return;


    if (
        results.length ===
        0
    ) {


        searchResults.innerHTML = `

            <div
                class="empty-box"
            >

                📭

                <br><br>

                “${escapeHTML(
                    currentQuery
                )}”

                এর জন্য কোনো তথ্য পাওয়া যায়নি।

            </div>

        `;


        if (
            resultInfo
        ) {

            resultInfo.textContent =
                "কোনো সার্চ রেজাল্ট পাওয়া যায়নি।";

        }


        return;

    }


    searchResults.innerHTML =
        results
            .map(
                resultCard
            )
            .join("");


    if (
        resultInfo
    ) {

        resultInfo.textContent =

            `“${currentQuery}” এর জন্য মোট ${toBanglaNumber(
                results.length
            )}টি ফলাফল পাওয়া গেছে`;

    }

}


// =====================================
// Result Card
// =====================================

function resultCard(
    item
) {


    const name =
        getTextValue(
            item.name ||
            item.title
        );


    const description =
        getShortText(
            item.description ||
            item.summary ||
            item.purpose ||
            item.content
        );


    const category =
        getTextValue(
            item.category
        );


    const city =
        getTextValue(
            item.city
        );


    const icon =
        item._icon ||
        "📄";


    const label =
        item._label ||
        "তথ্য";


    const slug =
        getTextValue(
            item.slug
        );


    let url;


    if (
        item._type ===
        "hospital"
    ) {


        url =
            "hospitals.html";

    } else if (
        item._type ===
        "diagnostic-center"
    ) {


        url =
            "diagnostic-centers.html";

    } else {


        url =
            item._url +
            encodeURIComponent(
                slug
            );

    }


    return `

        <article
            class="search-result-card"
        >

            <div
                class="search-result-icon"
            >

                ${icon}

            </div>


            <div
                class="search-result-content"
            >

                <span
                    class="search-result-type"
                >

                    ${escapeHTML(
                        label
                    )}

                </span>


                <h2>

                    ${escapeHTML(
                        name ||
                        "নাম নেই"
                    )}

                </h2>


                ${
                    category
                        ? `
                            <p>

                                📂 ${escapeHTML(
                                    category
                                )}

                            </p>
                        `
                        : ""
                }


                ${
                    city
                        ? `
                            <p>

                                📍 ${escapeHTML(
                                    city
                                )}

                            </p>
                        `
                        : ""
                }


                ${
                    description
                        ? `
                            <p>

                                ${escapeHTML(
                                    description
                                )}

                            </p>
                        `
                        : ""
                }


                <a
                    href="${escapeHTML(
                        url
                    )}"
                    class="details-button"
                >

                    বিস্তারিত দেখুন →

                </a>

            </div>

        </article>

    `;

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


        return [

            value.name,

            value.title,

            value.value

        ]

            .filter(
                Boolean
            )

            .join(
                " "
            );

    }


    return String(
        value
    ).trim();

}


// =====================================
// Normalize Text
// =====================================

function normalizeText(
    value
) {


    return String(
        value ||
        ""
    )

        .toLowerCase()

        .trim()

        .replace(
            /\s+/g,
            " "
        );

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
        text.length <= 220
    ) {

        return text;

    }


    return (

        text.substring(
            0,
            220
        ) + "..."

    );

}


// =====================================
// Loading UI
// =====================================

function showLoading() {


    if (
        searchResults
    ) {

        searchResults.innerHTML = `

            <div
                class="loading-box"
            >

                ⏳ সার্চ ডেটা লোড হচ্ছে...

            </div>

        `;

    }


    if (
        resultInfo
    ) {

        resultInfo.textContent =
            "তথ্য লোড হচ্ছে...";

    }

}


// =====================================
// Initial Message
// =====================================

function showInitialMessage() {


    if (
        searchResults
    ) {

        searchResults.innerHTML = `

            <div
                class="empty-box"
            >

                🔍

                <br><br>

                উপরের সার্চ বক্সে আপনার প্রয়োজনীয় তথ্য লিখুন।

            </div>

        `;

    }


    if (
        resultInfo
    ) {

        resultInfo.textContent =
            "সার্চ করার জন্য কিছু লিখুন।";

    }

}


// =====================================
// Hide Loading
// =====================================

function hideLoading() {


    if (
        searchResults &&
        searchResults.querySelector(
            ".loading-box"
        )
    ) {

        searchResults.innerHTML =
            "";

    }

}


// =====================================
// Error UI
// =====================================

function showError(
    message
) {


    if (
        searchResults
    ) {

        searchResults.innerHTML = `

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

searchForm?.addEventListener(
    "submit",
    event => {


        event.preventDefault();


        performSearch(
            searchInput.value
        );


        const query =
            encodeURIComponent(
                searchInput.value.trim()
            );


        const newUrl =
            query
                ? `search.html?q=${query}`
                : "search.html";


        window.history.replaceState(
            {},
            "",
            newUrl
        );

    }
);


searchInput?.addEventListener(
    "input",
    () => {


        if (
            searchInput.value.trim()
        ) {

            performSearch(
                searchInput.value
            );

        } else {

            showInitialMessage();

        }

    }
);


clearSearchButton?.addEventListener(
    "click",
    () => {


        searchInput.value =
            "";


        currentQuery =
            "";


        window.history.replaceState(
            {},
            "",
            "search.html"
        );


        showInitialMessage();


        searchInput.focus();

    }
);


// =====================================
// Start
// =====================================

loadSearchData();
