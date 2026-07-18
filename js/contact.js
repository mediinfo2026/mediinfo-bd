// js/contact.js


import {
    addDocument
} from "./firestore.js";


import {
    escapeHTML
} from "./helpers.js";


// =====================================
// DOM Elements
// =====================================

const contactForm =
    document.getElementById(
        "contactForm"
    );


const contactStatus =
    document.getElementById(
        "contactStatus"
    );


// =====================================
// Form Submit
// =====================================

contactForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const formData =
            new FormData(
                contactForm
            );


        const name =
            String(
                formData.get(
                    "name"
                ) ||
                ""
            ).trim();


        const email =
            String(
                formData.get(
                    "email"
                ) ||
                ""
            ).trim();


        const subject =
            String(
                formData.get(
                    "subject"
                ) ||
                ""
            ).trim();


        const message =
            String(
                formData.get(
                    "message"
                ) ||
                ""
            ).trim();


        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {

            showStatus(
                "সবগুলো ঘর পূরণ করুন।",
                "error"
            );


            return;

        }


        if (
            !isValidEmail(
                email
            )
        ) {

            showStatus(
                "সঠিক ই-মেইল ঠিকানা লিখুন।",
                "error"
            );


            return;

        }


        try {


            setSubmitting(
                true
            );


            await addDocument(
                "contact_messages",
                {

                    name,

                    email,

                    subject,

                    message,

                    status:
                        "new",

                    createdAt:
                        new Date()

                }
            );


            showStatus(
                "আপনার বার্তা সফলভাবে পাঠানো হয়েছে। ধন্যবাদ।",
                "success"
            );


            contactForm.reset();


        } catch (
            error
        ) {


            console.error(
                "Contact Form Error:",
                error
            );


            showStatus(
                "বার্তা পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
                "error"
            );


        } finally {


            setSubmitting(
                false
            );

        }

    }
);


// =====================================
// Email Validation
// =====================================

function isValidEmail(
    email
) {


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email
        );

}


// =====================================
// Status Message
// =====================================

function showStatus(
    message,
    type
) {


    if (
        !contactStatus
    ) return;


    contactStatus.textContent =
        message;


    contactStatus.className =
        `form-status ${type}`;

}


// =====================================
// Submit State
// =====================================

function setSubmitting(
    isSubmitting
) {


    const submitButton =
        contactForm?.querySelector(
            'button[type="submit"]'
        );


    if (
        !submitButton
    ) return;


    submitButton.disabled =
        isSubmitting;


    submitButton.textContent =
        isSubmitting
            ? "⏳ পাঠানো হচ্ছে..."
            : "📤 বার্তা পাঠান";

}
