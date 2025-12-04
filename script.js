// Smooth Scrolling
document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Typing Animation
const roles = ["R&D Engineer", "Data Analyst", "NLP Learner", "Tech Enthusiast"];
let index = 0;

function typingEffect() {
    document.querySelector(".role").textContent = roles[index];
    index = (index + 1) % roles.length;
}
typingEffect();
setInterval(typingEffect, 2000);

// Mobile Menu
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
    navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
});
