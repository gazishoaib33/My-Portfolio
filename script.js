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
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});
