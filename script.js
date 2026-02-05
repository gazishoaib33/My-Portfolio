// Typing effect
const roles = [
    "R&D Engineer",
    "Data Analyst",
    "NLP Learner",
    "Tech Enthusiast"
];

let index = 0;

function typeRole() {
    document.querySelector(".typed-role").textContent = roles[index];
    index = (index + 1) % roles.length;
}

typeRole();
setInterval(typeRole, 1800);

// Mobile Menu
const menu = document.getElementById("nav-menu");
const hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", () => {
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    menu.style.display = isExpanded ? "none" : "flex";
    hamburger.setAttribute("aria-expanded", String(!isExpanded));
});

// Contact form submission
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        formStatus.classList.remove("is-error");
        formStatus.textContent = "Sending your message...";

        const submitButton = contactForm.querySelector("button[type=\"submit\"]");
        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (response.ok) {
                formStatus.textContent = "Thanks! Your message has been sent.";
                contactForm.reset();
            } else {
                formStatus.classList.add("is-error");
                formStatus.textContent = "Something went wrong. Please try again.";
            }
        } catch (error) {
            formStatus.classList.add("is-error");
            formStatus.textContent = "Unable to send right now. Please try again later.";
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}
