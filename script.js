// Smooth scrolling
document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Typing animation
const roles = ["Frontend Developer", "Designer", "Programmer"];
let index = 0;

function typingEffect() {
    document.querySelector(".role").textContent = roles[index];
    index = (index + 1) % roles.length;
}
typingEffect();
setInterval(typingEffect, 2000);

// Mobile menu
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");

hamburger.onclick = () => {
    navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
};
