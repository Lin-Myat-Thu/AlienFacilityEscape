// ===============================
// GET ELEMENTS
// ===============================
const bgMusic = document.getElementById("bgMusic");
const sceneBg = document.getElementById("scene-bg");
const toast = document.getElementById("toast");
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const musicToggleBtn = document.getElementById("musicToggleBtn");

// ===============================
// GAME STATE
// ===============================
let musicMuted = false;

// ===============================
// INITIALIZE GAME
// ===============================
window.onload = () => {
    changeBackground("bg_image/Start.png");
    startMusic();
};

// ===============================
// BACKGROUND
// ===============================
function changeBackground(imagePath) {
    sceneBg.style.backgroundImage = `url('${imagePath}')`;
}

// ===============================
// MUSIC
// ===============================
function startMusic() {
    bgMusic.volume = 0.1;
    bgMusic.play();
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

musicToggleBtn.onclick = () => {
    musicMuted = !musicMuted;
    bgMusic.muted = musicMuted;
    musicToggleBtn.textContent = musicMuted ? "Unmute Music" : "Mute Music";
};

// ===============================
// MENU
// ===============================
menuBtn.onclick = () => {
    sideMenu.classList.add("active");
    overlay.classList.remove("hidden");
};

closeBtn.onclick = closeMenu;
overlay.onclick = closeMenu;

function closeMenu() {
    sideMenu.classList.remove("active");
    overlay.classList.add("hidden");
}

