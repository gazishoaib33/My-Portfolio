const roles = [
    "Data Analyst",
    "Machine Learning Practitioner",
    "NLP Practitioner",
    "Applied Statistics Enthusiast"
];

let index = 0;

function typeRole() {
    const roleEl = document.querySelector(".typed-role");
    if (!roleEl || document.hidden) {
        return;
    }
    roleEl.textContent = roles[index];
    index = (index + 1) % roles.length;
}

typeRole();
setInterval(typeRole, 1800);

const menu = document.getElementById("nav-menu");
const hamburger = document.getElementById("hamburger");

hamburger?.addEventListener("click", () => {
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    menu.style.display = isExpanded ? "none" : "flex";
    hamburger.setAttribute("aria-expanded", String(!isExpanded));
});

const debounce = (fn, delay = 150) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

window.addEventListener("resize", debounce(() => {
    if (window.innerWidth > 768 && menu) {
        menu.style.display = "";
        hamburger?.setAttribute("aria-expanded", "false");
    }
}, 180));

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card[data-category]");

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        filterButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        projectCards.forEach((card) => {
            const categories = card.dataset.category || "";
            card.style.display = filter === "all" || categories.includes(filter) ? "" : "none";
        });
    });
});

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalClose = document.getElementById("modal-close");

document.querySelectorAll(".project-more").forEach((btn) => {
    btn.addEventListener("click", () => {
        modalTitle.textContent = btn.dataset.modalTitle || "Project Preview";
        modalDesc.textContent = btn.dataset.modalDesc || "";
        modal?.classList.add("open");
        modal?.setAttribute("aria-hidden", "false");
        modalClose?.focus();
    });
});

modalClose?.addEventListener("click", () => {
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden", "true");
});

modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modal?.classList.remove("open");
        modal?.setAttribute("aria-hidden", "true");
    }
});

async function loadRepoStats() {
    const cards = document.querySelectorAll(".project-card[data-repo]");
    await Promise.all([...cards].map(async (card) => {
        const repo = card.dataset.repo;
        const starsEl = card.querySelector("[data-stars]");
        const forksEl = card.querySelector("[data-forks]");
        if (!repo || !starsEl || !forksEl) {
            return;
        }
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`);
            if (!response.ok) {
                throw new Error("repo lookup failed");
            }
            const data = await response.json();
            starsEl.textContent = data.stargazers_count ?? "0";
            forksEl.textContent = data.forks_count ?? "0";
        } catch (_error) {
            starsEl.textContent = "N/A";
            forksEl.textContent = "N/A";
        }
    }));
}
loadRepoStats();

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(form) {
    let valid = true;
    const fields = ["name", "email", "message"];
    fields.forEach((name) => {
        const input = form.elements.namedItem(name);
        input?.classList.remove("is-invalid");
        if (!input?.value?.trim()) {
            valid = false;
            input?.classList.add("is-invalid");
            return;
        }
        if (name === "email" && !emailRegex.test(input.value.trim())) {
            valid = false;
            input.classList.add("is-invalid");
        }
        if (name === "message" && input.value.trim().length < 20) {
            valid = false;
            input.classList.add("is-invalid");
        }
    });
    return valid;
}

if (contactForm && formStatus) {
    const publicKey = "YOUR_EMAILJS_PUBLIC_KEY";
    const serviceId = "YOUR_EMAILJS_SERVICE_ID";
    const templateId = "YOUR_EMAILJS_TEMPLATE_ID";
    if (window.emailjs) {
        window.emailjs.init({ publicKey });
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        formStatus.classList.remove("is-error");

        if (!validateForm(contactForm)) {
            formStatus.classList.add("is-error");
            formStatus.textContent = "Please fill all fields correctly (message must be at least 20 characters).";
            return;
        }

        formStatus.textContent = "Sending your message...";
        const submitButton = contactForm.querySelector("button[type=\"submit\"]");
        submitButton.disabled = true;

        try {
            await window.emailjs.sendForm(serviceId, templateId, contactForm);
            formStatus.textContent = "Thanks! Your message has been sent.";
            contactForm.reset();
        } catch (_error) {
            formStatus.classList.add("is-error");
            formStatus.textContent = "Unable to send right now. Please try again later.";
        } finally {
            submitButton.disabled = false;
        }
    });
}

const resumeDownload = document.getElementById("resume-download");
resumeDownload?.addEventListener("click", () => {
    const key = "resume_download_count";
    const current = Number(localStorage.getItem(key) || "0") + 1;
    localStorage.setItem(key, String(current));
    if (window.gtag) {
        window.gtag("event", "resume_download", { count: current });
    }
});

const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

const terminalResponses = {
    help: "Available commands: help, show projects, show skills, contact",
    "show projects": "Featured projects: Explainable ML, Disaster Classification, Loan Approval Pipeline, BI systems.",
    "show skills": "Skills: Python, SQL, Power BI, NLP, TensorFlow, Scikit-learn, SHAP, LIME.",
    contact: "Reach out at gazishoaib953@gmail.com or +8801865283150."
};

terminalInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
        return;
    }
    const command = terminalInput.value.trim().toLowerCase();
    terminalOutput.textContent = terminalResponses[command] || "Unknown command. Try: help";
    terminalInput.value = "";
});
