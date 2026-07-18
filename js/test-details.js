// js/test-details.js


import {
    getCollection
} from "./firestore.js";


import {
    escapeHTML,
    formatPrice
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

const testDetails =
    document.getElementById(
        "testDetails"
    );


const diagnosticPrices =
    document.getElementById(
        "diagnosticPrices"
    );


const breadcrumbTestName =
    document.getElementById(
        "breadcrumbTestName"
    );


// ===============================
// Load Test Details
// ===============================

async function loadTestDetails() {


    if (!slug) {

        showTestError(
            "টেস্টের তথ্য পাওয়া যায়নি।"
        );

        return;

    }


    try {


        const tests =
            await getCollection(
                "tests"
            );


        const test =
            tests.find(
                item =>
                    String(
                        item.slug
                    ).toLowerCase() ===
                    String(
                        slug
                    ).toLowerCase()
            );


        if (!test) {

            showTestError(
                "এই টেস্টের তথ্য পাওয়া যায়নি।"
            );

            return;

        }


        renderTestDetails(
            test
        );


        await loadDiagnosticPrices(
            test
        );


    } catch (error) {


        console.error(
            "Test Details Error:",
            error
        );


        showTestError(
            "টেস্টের তথ্য লোড করতে সমস্যা হয়েছে।"
        );

    }

}


// ===============================
// Render Test Details
// ===============================

function renderTestDetails(
    test
) {


    const name =
        escapeHTML(
            test.name ||
            "টেস্টের নাম নেই"
        );


    document.title =
        `${name} | MediTest BD`;


    if (
        breadcrumbTestName
    ) {

        breadcrumbTestName.textContent =
            test.name ||
            "বিস্তারিত";

    }


    const category =
        escapeHTML(
            getCategoryName(
                test.category
            ) ||
            "অন্যান্য"
        );


    const description =
        escapeHTML(
            test.description
        );


    const purpose =
        escapeHTML(
            test.purpose
        );


    const sample =
        escapeHTML(
            test.sample
        );


    const preparation =
        escapeHTML(
            test.preparation
        );


    const reportTime =
        escapeHTML(
            test.reportTime
        );


    const normalRange =
        escapeHTML(
            test.normalRange
        );


    const note =
        escapeHTML(
            test.note
        );


    const price =
        test.price !== undefined &&
        test.price !== null &&
        test.price !== ""
            ? formatPrice(
                test.price
            )
            : "মূল্য জানা নেই";


    testDetails.innerHTML = `

        <article
            class="test-details-card"
        >

            <div
                class="details-header"
            >

                <div
                    class="details-icon"
                >

                    🧪

                </div>


                <div>

                    <h1>

                        ${name}

                    </h1>


                    <span
                        class="test-category"
                    >

                        ${category}

                    </span>

                </div>

            </div>


            <div
                class="details-price"
            >

                <span>
                    আনুমানিক মূল্য
                </span>


                <strong>
                    ${price}
                </strong>

            </div>


            ${createInfoSection(
                "📖 এই টেস্ট সম্পর্কে",
                description
            )}


            ${createInfoSection(
                "🎯 কেন এই টেস্ট করা হয়?",
                purpose
            )}


            ${createInfoSection(
                "🧪 নমুনা / Sample",
                sample
            )}


            ${createInfoSection(
                "⚠️ টেস্টের আগে প্রস্তুতি",
                preparation
            )}


            ${createInfoSection(
                "⏱️ রিপোর্ট পাওয়ার সময়",
                reportTime
            )}


            ${createInfoSection(
                "📊 স্বাভাবিক মাত্রা / Normal Range",
                normalRange
            )}


            ${createInfoSection(
                "📝 বিশেষ নোট",
                note
            )}

        </article>

    `;

}


// ===============================
// Diagnostic Prices Load
// ===============================

async function loadDiagnosticPrices(
    test
) {


    if (
        !diagnosticPrices
    ) return;


    try {


        const prices =
            await getCollection(
                "diagnostic_prices"
            );


        const testSlug =
            String(
                test.slug ||
                ""
            ).toLowerCase();


        const filteredPrices =
            prices.filter(
                item => {


                    const itemTestSlug =
                        String(
                            item.testSlug ||
                            ""
                        ).toLowerCase();


                    return (
                        itemTestSlug ===
                        testSlug
                    );

                }
            );


        renderDiagnosticPrices(
            filteredPrices
        );


    } catch (error) {


        console.error(
            "Diagnostic Price Error:",
            error
        );


        diagnosticPrices.innerHTML = `

            <div
                class="error-box"
            >

                ❌ মূল্য লোড করা যায়নি।

            </div>

        `;

    }

}


// ===============================
// Render Diagnostic Prices
// ===============================

function renderDiagnosticPrices(
    prices
) {


    if (
        !prices ||
        prices.length === 0
    ) {


        diagnosticPrices.innerHTML = `

            <div
                class="empty-box"
            >

                📭 এই টেস্টের জন্য এখনো কোনো ডায়াগনস্টিক সেন্টারের মূল্য যোগ করা হয়নি।

            </div>

        `;


        return;

    }


    diagnosticPrices.innerHTML =
        prices
            .map(
                priceCard
            )
            .join("");

}


// ===============================
// Price Card
// ===============================

function priceCard(
    data
) {


    const center =
        escapeHTML(
            data.center ||
            data.centerName ||
            "সেন্টারের নাম নেই"
        );


    const city =
        escapeHTML(
            data.city ||
            ""
        );


    const address =
        escapeHTML(
            data.address ||
            ""
        );


    const price =
        data.price !== undefined &&
        data.price !== null &&
        data.price !== ""
            ? formatPrice(
                data.price
            )
            : "মূল্য জানা নেই";


    return `

        <article
            class="price-card"
        >

            <h3>

                🏥 ${center}

            </h3>


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


            <strong
                class="price-value"
            >

                ${price}

            </strong>

        </article>

    `;

}


// ===============================
// Info Section
// ===============================

function createInfoSection(
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


            <p>

                ${content}

            </p>

        </section>

    `;

}


// ===============================
// Category Name
// ===============================

function getCategoryName(
    category
) {


    if (
        !category
    ) return "";


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
// Error UI
// ===============================

function showTestError(
    message
) {


    if (
        testDetails
    ) {

        testDetails.innerHTML = `

            <div
                class="error-box"
            >

                ❌ ${escapeHTML(
                    message
                )}

                <br><br>

                <a
                    href="tests.html"
                    class="details-button"
                >

                    ← সকল টেস্টে ফিরে যান

                </a>

            </div>

        `;

    }


    if (
        diagnosticPrices
    ) {

        diagnosticPrices.innerHTML =
            "";

    }

}


// ===============================
// Start
// ===============================

loadTestDetails();
