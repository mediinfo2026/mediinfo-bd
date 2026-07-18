// js/tests.js


import {
    getCollection
} from "./firestore.js";


import {
    escapeHTML,
    formatPrice
} from "./helpers.js";


// ===============================
// State
// ===============================

let allTests = [];

let filteredTests = [];


// ===============================
// DOM Elements
// ===============================

const testList =
    document.getElementById("testList");


const searchInput =
    document.getElementById("testSearchInput");


const categoryFilter =
    document.getElementById("categoryFilter");


const clearSearchButton =
    document.getElementById("clearSearchButton");


const resultInfo =
    document.getElementById("resultInfo");


// ===============================
// Load Tests
// ===============================

async function loadTests() {

    try {

        showLoading();


        allTests =
            await getCollection("tests");


        allTests =
            allTests
                .filter(test => test.name)
                .sort((a, b) =>
                    String(a.name)
                        .localeCompare(
                            String(b.name),
                            "bn"
                        )
                );


        filteredTests =
            [...allTests];


        loadCategories();


        renderTests();


    } catch (error) {

        console.error(
            "Tests Load Error:",
            error
        );


        showError(
            "টেস্টের তথ্য লোড করা যায়নি।"
        );

    }

}


// ===============================
// Load Categories
// ===============================

function loadCategories() {


    if (!categoryFilter) return;


    const categories =
        new Map();


    allTests.forEach(test => {


        const category =
            getCategoryName(
                test.category
            );


        if (category) {

            const slug =
                test.categorySlug ||
                createSimpleSlug(category);


            if (!categories.has(slug)) {

                categories.set(
                    slug,
                    category
                );

            }

        }

    });


    categoryFilter.innerHTML = `

        <option value="all">
            সকল ক্যাটাগরি
        </option>

    `;


    [...categories.entries()]
        .sort((a, b) =>
            a[1].localeCompare(
                b[1],
                "bn"
            )
        )
        .forEach(
            ([slug, name]) => {


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    slug;


                option.textContent =
                    name;


                categoryFilter.appendChild(
                    option
                );

            }
        );

}


// ===============================
// Search + Filter
// ===============================

function filterTests() {


    const searchText =
        searchInput
            ?.value
            .trim()
            .toLowerCase() || "";


    const selectedCategory =
        categoryFilter
            ?.value || "all";


    filteredTests =
        allTests.filter(test => {


            const category =
                getCategoryName(
                    test.category
                );


            const searchableText = [

                test.name,

                test.slug,

                test.description,

                test.purpose,

                test.symptoms,

                test.keywords,

                category

            ]

                .filter(Boolean)

                .join(" ")

                .toLowerCase();


            const matchesSearch =
                !searchText ||
                searchableText.includes(
                    searchText
                );


            const testCategorySlug =
                test.categorySlug ||
                createSimpleSlug(
                    category
                );


            const matchesCategory =
                selectedCategory === "all" ||
                testCategorySlug ===
                selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    renderTests();

}


// ===============================
// Render Tests
// ===============================

function renderTests() {


    if (!testList) return;


    if (
        filteredTests.length === 0
    ) {

        testList.innerHTML = `

            <div class="empty-box">

                📭 কোনো টেস্ট পাওয়া যায়নি।

            </div>

        `;


        updateResultInfo();


        return;

    }


    testList.innerHTML =
        filteredTests
            .map(
                testCard
            )
            .join("");


    updateResultInfo();

}


// ===============================
// Test Card
// ===============================

function testCard(test) {


    const name =
        escapeHTML(
            test.name || "নাম নেই"
        );


    const category =
        escapeHTML(
            getCategoryName(
                test.category
            ) || "অন্যান্য"
        );


    const description =
        escapeHTML(
            getShortDescription(
                test.description
            )
        );


    const price =
        test.price !== undefined &&
        test.price !== null &&
        test.price !== ""
            ? formatPrice(
                test.price
            )
            : "মূল্য জানা নেই";


    const slug =
        encodeURIComponent(
            test.slug ||
            createSimpleSlug(
                test.name
            )
        );


    return `

        <article
            class="test-card"
        >

            <div
                class="test-card-icon"
            >

                🧪

            </div>


            <div
                class="test-card-content"
            >

                <h2>

                    ${name}

                </h2>


                <span
                    class="test-category"
                >

                    ${category}

                </span>


                <p>

                    ${description}

                </p>


                <div
                    class="test-card-footer"
                >

                    <strong>

                        ${price}

                    </strong>


                    <a
                        href="test-details.html?slug=${slug}"
                        class="details-button"
                    >

                        বিস্তারিত →

                    </a>

                </div>

            </div>

        </article>

    `;

}


// ===============================
// Result Info
// ===============================

function updateResultInfo() {


    if (!resultInfo) return;


    resultInfo.textContent =

        `মোট ${toBanglaNumber(
            filteredTests.length
        )}টি টেস্ট পাওয়া গেছে`;

}


// ===============================
// Loading
// ===============================

function showLoading() {


    if (!testList) return;


    testList.innerHTML = `

        <div
            class="loading-box"
        >

            ⏳ টেস্ট লোড হচ্ছে...

        </div>

    `;

}


// ===============================
// Error
// ===============================

function showError(message) {


    if (!testList) return;


    testList.innerHTML = `

        <div
            class="error-box"
        >

            ❌ ${escapeHTML(
                message
            )}

        </div>

    `;

}


// ===============================
// Category Name
// ===============================

function getCategoryName(category) {


    if (!category) return "";


    if (
        typeof category ===
        "string"
    ) {

        return category;

    }


    if (
        typeof category ===
        "object"
    ) {

        return (

            category.name ||

            category.title ||

            ""

        );

    }


    return "";

}


// ===============================
// Short Description
// ===============================

function getShortDescription(
    description
) {


    if (!description) {

        return "এই টেস্ট সম্পর্কে বিস্তারিত তথ্য দেখতে ক্লিক করুন।";

    }


    const text =
        String(
            description
        );


    return text.length > 140

        ? text.substring(
            0,
            140
        ) + "..."

        : text;

}


// ===============================
// Simple Slug
// ===============================

function createSimpleSlug(text) {


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
    filterTests
);


categoryFilter?.addEventListener(
    "change",
    filterTests
);


clearSearchButton?.addEventListener(
    "click",
    () => {


        if (searchInput) {

            searchInput.value =
                "";

        }


        if (categoryFilter) {

            categoryFilter.value =
                "all";

        }


        filterTests();

    }
);


// ===============================
// Start
// ===============================

loadTests();
