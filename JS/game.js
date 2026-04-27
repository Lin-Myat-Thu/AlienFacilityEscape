// ===============================
// GET ELEMENTS
// ===============================
const storyText = document.getElementById("story-text");
const choicesDiv = document.getElementById("choices");
const inventoryText = document.getElementById("inventory");
const bgMusic = document.getElementById("bgMusic");
const healthBar = document.getElementById("health-bar");
const gameOverModal = document.getElementById("gameOverModal");
const deathReason = document.getElementById("deathReason");
const playAgainBtn = document.getElementById("playAgainBtn");
const quitBtn = document.getElementById("quitBtn");
const sceneBg = document.getElementById("scene-bg");
const toast = document.getElementById("toast");
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const resetBtn = document.getElementById("resetBtn");
const musicToggleBtn = document.getElementById("musicToggleBtn");

// ===============================
// GAME STATE
// ===============================
let hasGun = false;
let hasKeycard = false;
let hasTablet = false;
let holeRevealed = false;
let currentScene = "room";
let health = 100;
let typing = false;
let typingInterval = null;
let musicMuted = false;
let guardsDefeated = false;

// ===============================
// INITIALIZE GAME
// ===============================
window.onload = () => {
    changeBackground("bg_image/Start.png");
    updateInventory();
    updateHealthBar();
    startMusic();
    startRoom();
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

// ===============================
// HEALTH
// ===============================
function updateHealthBar() {
    healthBar.style.width = health + "%";
}

function damagePlayer(amount) {
    health -= amount;
    if (health<=0){
        health = 0;
        // gameOver("You have succumbed to your injuries. The alien facility claims another victim.");
    }
    updateHealthBar();
   
}

// ===============================
// INVENTORY
// ===============================
function updateInventory() {
    let items = [];
    if (hasGun) items.push("Plasma Gun");
    if (hasKeycard) items.push("Key Card");
    if (hasTablet) items.push("Tablet");
    inventoryText.textContent = items.length ? items.join(", ") : "None";
}

// ===============================
// TEXT SYSTEM
// ===============================
function typeText(text, callback) {
    typing = true;
    if (typingInterval) clearInterval(typingInterval);
    storyText.textContent = "";

    let i = 0;
    typingInterval = setInterval(() => {
        storyText.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(typingInterval);
            typing = false;
            if (callback) callback();
        }
    }, 15);
}

function addChoice(text, action) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => {
        if (!typing) action();
    };
    choicesDiv.appendChild(btn);
}

function clearChoices() {
    choicesDiv.innerHTML = "";
}

// ===============================
// BACKGROUND LOGIC
// ===============================
function getRoomBackground() {

    // No hole revealed yet
    if (!holeRevealed && !hasKeycard) {
        return "bg_image/Start.png";
    }

    // Hole revealed, no keycard
    if (holeRevealed && !hasKeycard) {
        return "bg_image/AccessKeyWithHole.png";
    }

    // Hole revealed + keycard
    if (holeRevealed && hasKeycard) {
        return "bg_image/NoAccessKeyAndHole.png";
    }

    // No hole but has keycard
    if (!holeRevealed && hasKeycard) {
        return "bg_image/AccessKeyWithNoHole.png";
    }
}

// ===============================
// DOOR BACKGROUND
// ===============================

function getDoorBackground() {
     if (!hasKeycard) {
        return "bg_image/Start.png";
    }

    return holeRevealed
        ? "bg_image/OpenDoorWithHole.png"
        : "bg_image/OpenDoorNoHole.png";
}

// ===============================
// SCENES
// ===============================
function startRoom() {
    currentScene = "room";
    clearChoices();

    changeBackground(getRoomBackground());
    typeText(
        "You wake up inside a glowing alien containment chamber. The air smells metallic. A dim light flickers above you.",
        () => {
            addChoice("Check Bed", checkBed);
            addChoice("Check Desk", checkDesk);
            addChoice("Open Door", openDoor);
        }
    );
}

function checkBed() {
    currentScene = "bed";
    clearChoices();
    if (!holeRevealed) {
        holeRevealed = true;
    }
    changeBackground(getRoomBackground());
    typeText(
        "You move the strange alien bed aside. Beneath it... a hidden tunnel entrance.",
        () => {
            addChoice("Enter Tunnel", enterTunnel);
            addChoice("Go Back", startRoom);
        }
    );
}

function enterTunnel() {
    currentScene = "tunnel";
    clearChoices();
    const checkGun = hasGun;
    changeBackground(
        checkGun 
        ? "bg_image/TunnelNoGun.png"
        : "bg_image/TunnelWithGun.jpeg"
    );

    if (!checkGun) {
        typeText(
            "You crawl into the tunnel. It's dark and narrow. You find an abandoned plasma gun on the ground.",
            () => {
                hasGun = true;
                updateInventory();
                addChoice("Go Deeper", deadEnd);
                addChoice("Return to Room", startRoom);
            }
        );
    } else {
        typeText(
            "You crawl into the tunnel again. It is empty. Nothing else remains here.",
            () => {
                addChoice("Go Deeper", deadEnd);
                addChoice("Return to Room", startRoom);
            }
        );
    }
}

function deadEnd() {
    currentScene = "deadend";
    clearChoices();
    changeBackground("bg_image/DeadEnd.png");
    typeText(
        "You move deeper into the tunnel... It leads to a sealed metal wall. It's a dead end.",
        () => {
            addChoice("Return", startRoom);
        }
    );
}

function checkDesk() {
    currentScene = "desk";
    clearChoices();
    if (!hasKeycard) {
        typeText(
            "You search the alien desk. You find an access key card on the desk.",
            () => {
                hasKeycard = true;
                changeBackground(getRoomBackground());
                updateInventory();
                addChoice("Return", startRoom);
            }
        );
    } else {
        typeText(
            "You search the desk again. Nothing else useful is here.",
            () => {
                addChoice("Return", startRoom);
            }
        );
    }
}

function openDoor() {
    currentScene = "door";
    clearChoices();
    changeBackground(getDoorBackground());
    if (hasKeycard) {
        typeText(
            "You swipe the key card. The door slides open....",
            () => {
                addChoice("Step into the hallway", hallwayScene);
            }
        );
    } else {
        typeText(
            "The door scanner flashes red. You need an access key card.",
            () => {
                addChoice("Return", startRoom);
            }
        );
    }
}
// ===============================
// HALLWAY SCENE
// ===============================
function hallwayScene() {
    currentScene = "hallway";
    clearChoices();
    changeBackground("bg_image/Hallway.jpeg");
    typeText(
        "The metal door slides open with a mechanical hiss. A long corridor stretches before you. Something moves in the distance...",
        () => {
            addChoice("Run down the hallway", runHallway);
            addChoice("Sneak through the shadows", sneakHallway);
        }
    );
}

function runHallway() {
    changeBackground("bg_image/Hallway.jpeg");
    gameOver(
        "You sprint forward. Red lights flash. A plasma blast hits you instantly.You were too reckless."
    );
}

function sneakHallway() {
    currentScene = "controlcenter";
    clearChoices();
    changeBackground("bg_image/ControlCenter.jpeg");

    typeText(
        "You move silently and reach a glowing Alien Control Center.",
        () => {
            addChoice("Investigate the control center", investigateCenter);
            addChoice("Hack the system", hackSystem);
        }
    );
}

// ===============================
// CONTROL CENTER
// ===============================
function hackSystem() {
    changeBackground("bg_image/ControlCenter.jpeg");
    gameOver(
        "You attempt to hack the alien system and fail. Alarm activated. Guards rush in and eliminate you. Alien technology was beyond your understanding."
    );
}

function investigateCenter() {
    currentScene = "tablet";
    clearChoices();
    changeBackground("bg_image/NoTablet.png");
    typeText(
        "You Check the tablet. It shows a map of the facility and a route to the emergency exit. So You take the tablet with you.",
        () => {
            hasTablet = true;
            updateInventory();
            addChoice("Follow the mapped route", exitDoorScene);
        }
    );
}

// ===============================
// EXIT DOOR SCENE
// ===============================
function exitDoorScene() {
    currentScene = "exitdoor";
    clearChoices();
    changeBackground("bg_image/AlienGuardDoor.png");
    typeText(
        "Two armed alien guards stand between you and freedom.",
        () => {
            addChoice("Fight the guards", fightGuards);
            addChoice("Distract them by throwing the tablet", distractGuards);
        }
    );
}

function fightGuards() {
    currentScene = "fightguards";
    clearChoices();
    if (guardsDefeated) {
        // For load error case where player has already defeated guards but is still takeing  the damage.
        changeBackground("bg_image/AlienDie.png");

        typeText(
            "You draw your plasma gun. After an intense firefight, both guards fall.",
            () => {
                addChoice("Shoot the door open", victoryEnding);
                addChoice("Check the tablet again", checkTablet);
            }
        );
        return;
    }
    if (!hasGun) {
        changeBackground("bg_image/AlienMoveCloser.png");

        typeText(
            "You charge forward with nothing but desperation...",
            () => {
                damagePlayer(100);
                gameOver(
                    "Plasma fire tears through you. You needed firepower to survive."
                );
            }
        );
    } else {
        changeBackground("bg_image/AlienDie.png");
        damagePlayer(40);
        guardsDefeated = true;
        typeText(
            "You draw your plasma gun. After an intense firefight, both guards fall.",
            () => {
                addChoice("Shoot the door open", victoryEnding);
                addChoice("Check the tablet again", checkTablet);
            }
        );
    }
}

function distractGuards() {
    hasTablet = false;
    updateInventory();
    changeBackground("bg_image/ExitDoor.png");
    if (hasGun) {
        typeText(
            "In panic, you throw the tablet and bolt for the door. The aliens got distracted but they are faster than you think. They fire at you as you run. ",
            () => {
                damagePlayer(100);
                gameOver(
                "You fall with the plasma gun still clutched in your hand.You had the power to fight.But you chose to run."
                );
            }
        );
    } else {
        typeText(
            "In panic, you throw the tablet and bolt for the door. The aliens fire without hesitation. Your gamble bought nothing but a few seconds of false hope.",
            () => {
                damagePlayer(100);
                gameOver(
                    "Plasma fire tears through you.You needed firepower to survive."
                );
            }
        );
    }
}
function checkTablet() {
    currentScene = "checktablet";
    clearChoices();
    changeBackground("bg_image/CheckTablet.png");
    typeText(
        "You check the tablet. It shows other humans are still trapped inside the facility. You can try to find them and escape together... Or you can escape alone.",
        () => {
            addChoice("Shoot the door open (Escape Alone)", selfishEnding);
            addChoice("Try to find other survivors", findSurvivors);
        }
    );
}
function findSurvivors() {
    currentScene = "findsurvivors";
    clearChoices();
    changeBackground("bg_image/GoBacktoHallway.png");
    typeText(
        "You tighten your grip on the plasma gun. You won't leave them behind.Somewhere in the dark halls of this alien facility… others are still fighting to survive. You step back into the shadows — not as a victim, but as hope.",
        () => {
            addChoice("To be Continued... (Restart Game)", restartGame);
        }
    );
}



// ===============================
//  Victory Ending
// ===============================
function victoryEnding() {
    currentScene = "victory";
    clearChoices();
    changeBackground("bg_image/ExistDoorOpen.png");
    typeText( 
        "You escape the alien chamber. Freedom at last... But Earth still needs saving.", 
        () => { 
            addChoice("Play Again", restartGame); 
            addChoice("Quit", quitToIntro);
         } 
        ); 
    }

// ===============================
// Selfish Ending
// ===============================
function selfishEnding() {
    currentScene = "selfish";
    clearChoices();
    changeBackground("bg_image/ExistDoorOpen.png");
    typeText(
        "You lower the tablet. The trapped survivors fade from the screen… and you turn away." +
        "You blast the door open and step outside." +
        "The sky is no longer blue. It glows with alien machinery. Towers of unfamiliar metal pierce the horizon. Drones hum above like mechanical vultures." +
        "Earth is no longer ours." +
        "You are free." +
        "Alone." +
        "And you chose it.",
        () => {
            addChoice("Play Again", restartGame);
            addChoice("Quit", quitToIntro);
        }
    );
}

// ===============================
// GAME OVER
// ===============================
function gameOver(reason) {
    stopMusic();
    clearChoices();
    health = 0;
    updateHealthBar();
    deathReason.textContent = reason;
    gameOverModal.classList.remove("hidden");
}

playAgainBtn.onclick = () => {
    gameOverModal.classList.add("hidden");
    restartGame();
};

quitBtn.onclick = () => {
    window.location.href = "index.html";
};

function resetGameState() {
    holeRevealed = false;
    hasGun = false;
    hasKeycard = false;
    hasTablet = false;
    currentScene = "room";
    updateInventory();
}

// ===============================
// RESTART
// ===============================
function restartGame() {
    health = 100;
    healthBar.style.width = "100%";
    resetGameState();
    updateInventory();
    startMusic();
    startRoom();
}
function quitToIntro() {
    window.location.href = "index.html";
}

// ===============================
// SAVE / LOAD
// ===============================
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

saveBtn.onclick = () => {
    const gameData = {
        hasGun,
        hasKeycard,
        hasTablet,
        holeRevealed,
        currentScene,
        health,
        guardsDefeated
    };

    localStorage.setItem("cyberEscapeSave", JSON.stringify(gameData));
    showToast("Game Saved!");
    closeMenu();
};

loadBtn.onclick = () => {
    const data = JSON.parse(localStorage.getItem("cyberEscapeSave"));

    if (!data) {
        showToast("No saved game found!");
        return;
    }

    // Restore state
    hasGun = data.hasGun;
    hasKeycard = data.hasKeycard;
    hasTablet = data.hasTablet;
    holeRevealed = data.holeRevealed;
    currentScene = data.currentScene;
    health = data.health;
    guardsDefeated = data.guardsDefeated;
    

    updateHealthBar();
    updateInventory();
    startMusic();
    closeMenu();

    // Load correct scene
    switch (currentScene) {
        case "room": startRoom(); break;
        case "bed": checkBed(); break;
        case "tunnel": enterTunnel(); break;
        case "deadend": deadEnd(); break;
        case "desk": checkDesk(); break;
        case "door": openDoor(); break;
        case "hallway": hallwayScene(); break;
        case "controlcenter": sneakHallway(); break;
        case "tablet": investigateCenter(); break;
        case "exitdoor": exitDoorScene(); break;
        case "fightguards": fightGuards(); break;
        case "checktablet": checkTablet(); break;
        case "findsurvivors": findSurvivors(); break;
        case "victory": victoryEnding(); break;
        case "selfish": selfishEnding(); break;
    }

    showToast("Game Loaded!");
};

resetBtn.onclick = () => {
    restartGame();
    closeMenu();
};