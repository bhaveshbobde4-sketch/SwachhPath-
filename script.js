// =====================================================
// SWACHHPATH — SMART WASTE MANAGEMENT
// DEMO + BACKEND READY VERSION
// =====================================================


// =====================================================
// MODE
// =====================================================

// true  = Demo Mode (abhi)
// false = Real Backend Mode (project complete hone ke baad)

const DEMO_MODE = false;


// =====================================================
// BACKEND API
// =====================================================

// Baad mein apne backend ka URL yahan dalna
// Example:
// const API_URL = "https://your-backend.com/api/bin";

const API_URL = "";


// =====================================================
// INITIAL DATA
// =====================================================

let wetLevel = 65;
let dryLevel = 42;

let lastRealUpdate = null;


// =====================================================
// GET ELEMENTS
// =====================================================

const percentageElements =
    document.querySelectorAll(".percentage");

const wetBar =
    document.querySelector(".wet-progress");

const dryBar =
    document.querySelector(".dry-progress");

const alertCard =
    document.querySelector(".alert-card");

const demoModeElement =
    document.querySelector(".demo-mode");




// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    // -----------------------------
    // Progress bars
    // -----------------------------

    if (wetBar) {
        wetBar.style.width = wetLevel + "%";
    }

    if (dryBar) {
        dryBar.style.width = dryLevel + "%";
    }


    // -----------------------------
    // Percentages
    // -----------------------------

    if (percentageElements.length >= 2) {

        percentageElements[0].textContent =
            wetLevel + "%";

        percentageElements[1].textContent =
            dryLevel + "%";
    }


    // -----------------------------
    // Individual bin status
    // -----------------------------

    updateBinStatus(
        wetLevel,
        ".wet-status"
    );

    updateBinStatus(
        dryLevel,
        ".dry-status"
    );


    // -----------------------------
    // System alert
    // -----------------------------

    updateAlert();


    // -----------------------------
    // Last updated
    // -----------------------------

    updateLastUpdated();
}


// =====================================================
// BIN STATUS
// =====================================================

function updateBinStatus(level, selector) {

    const status = document.querySelector(selector);

    if (!status) return;

    if (level >= 90) {

        status.textContent = "🔴 Full — Collection Required";
        status.style.color = "#dc2626";

    } else if (level >= 61) {

        status.textContent = "🟠 Almost Full";
        status.style.color = "#d97706";

    } else if (level >= 31) {

        status.textContent = "🟡 Partially Filled";
        status.style.color = "#ca8a04";

    } else {

        status.textContent = "🟢 Empty";
        status.style.color = "#238636";
    }
}

// =====================================================
// SYSTEM ALERT
// =====================================================

function updateAlert() {

    if (!alertCard) {
        return;
    }

    const status =
        alertCard.querySelector(".status");

    const message =
        alertCard.querySelector("p");


    if (!status || !message) {
        return;
    }


    // =================================================
    // BOTH FULL
    // =================================================

    if (
        wetLevel >= 90 &&
        dryLevel >= 90
    ) {

        status.textContent =
            "🔴 Both Bins Full";

        status.style.color =
            "#dc2626";

        message.textContent =
            "Wet and Dry bins require immediate collection.";

        alertCard.style.borderTop =
            "4px solid #dc2626";

        showNotification();
    }


    // =================================================
    // WET FULL
    // =================================================

    else if (wetLevel >= 90) {

        status.textContent =
            "🔴 Wet Bin Full";

        status.style.color =
            "#dc2626";

        message.textContent =
            "Wet waste bin requires immediate collection.";

        alertCard.style.borderTop =
            "4px solid #dc2626";

        showNotification();
    }


    // =================================================
    // DRY FULL
    // =================================================

    else if (dryLevel >= 90) {

        status.textContent =
            "🔴 Dry Bin Full";

        status.style.color =
            "#dc2626";

        message.textContent =
            "Dry waste bin requires immediate collection.";

        alertCard.style.borderTop =
            "4px solid #dc2626";

        showNotification();
    }


    // =================================================
    // ALMOST FULL
    // =================================================

    else if (
        wetLevel >= 75 ||
        dryLevel >= 75
    ) {

        status.textContent =
            "🟠 Almost Full";

        status.style.color =
            "#d97706";

        message.textContent =
            "Waste collection required soon.";

        alertCard.style.borderTop =
            "4px solid #d97706";

        hideNotification();
    }


    // =================================================
    // NORMAL
    // =================================================

    else {

        status.textContent =
            "🟢 All Normal";

        status.style.color =
            "#238636";

        message.textContent =
            "No bin requires collection.";

        alertCard.style.borderTop =
            "4px solid #2f9e44";

        hideNotification();
    }
}


// =====================================================
// DEMO SENSOR DATA
// =====================================================

function generateDemoSensorData() {

    /*
       Demo ke liye random values.

       Baad mein actual ESP32 data
       backend se aayega.
    */


    wetLevel =
        Math.floor(
            Math.random() * 51
        ) + 50;


    dryLevel =
        Math.floor(
            Math.random() * 51
        ) + 50;


    // Keep 0–100

    wetLevel =
        Math.max(
            0,
            Math.min(100, wetLevel)
        );

    dryLevel =
        Math.max(
            0,
            Math.min(100, dryLevel)
        );


    updateDashboard();
}


// =====================================================
// REAL BACKEND DATA
// =====================================================

async function getRealSensorData() {

    if (!API_URL) {

        console.warn(
            "Backend API URL is not configured."
        );

        return;
    }


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Backend response failed."
            );
        }


        const data =
            await response.json();


        /*
        Expected backend response:

        {
            "wet": 72,
            "dry": 48
        }
        */


        if (
            typeof data.wet === "number" &&
            typeof data.dry === "number"
        ) {

            wetLevel =
                Math.max(
                    0,
                    Math.min(100, data.wet)
                );

            dryLevel =
                Math.max(
                    0,
                    Math.min(100, data.dry)
                );

            lastRealUpdate =
                new Date();

            updateDashboard();
        }

    }

    catch (error) {

        console.error(
            "Unable to get sensor data:",
            error
        );
    }
}


// =====================================================
// GET SENSOR DATA
// =====================================================

function getSensorData() {

    if (DEMO_MODE) {

        generateDemoSensorData();

    } else {

        getRealSensorData();
    }
}


// =====================================================
// LAST UPDATED
// =====================================================

function updateLastUpdated() {

    const lastUpdated =
        document.getElementById(
            "lastUpdated"
        );

    if (!lastUpdated) {
        return;
    }


    const now =
        lastRealUpdate || new Date();


    const date =
        now.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );


    lastUpdated.textContent =
        date + " • " + time;
}


// =====================================================
// REFRESH BUTTON
// =====================================================

function refreshDashboard() {

    getSensorData();

    console.log(
        "Dashboard data refreshed."
    );
}

function loadFirebaseData() {

    const ref = db.ref("dustbins/dustbin_01");

    ref.on("value", (snapshot) => {
    const data = snapshot.val();

    if (!data) return;

    // Actual ultrasonic fill level → DRY WASTE card
    wetLevel = 0;
    dryLevel = Number(data.fillPercentage ?? 0);

    

        wetLevel = Math.max(0, Math.min(100, wetLevel));
        dryLevel = Math.max(0, Math.min(100, dryLevel));


        // =========================
        // LOCATION
        // =========================

        const latitude = Number(data.latitude);
        const longitude = Number(data.longitude);

        const locationElement =
            document.getElementById("binLocation");

        if (locationElement) {
            locationElement.textContent =
                data.location || "Dustbin Location";
        }


        // =========================
        // LIVE LID STATUS
        // =========================

        const lidStatus =
            data.lidStatus || "CLOSED";

        const lidElement =
            document.getElementById("lidStatus");

        if (lidElement) {
            lidElement.textContent = lidStatus;
        }


        // =========================
        // LIVE MAP
        // =========================

        if (
            latitude &&
            longitude &&
            document.getElementById("dustbinMap")
        ) {

            document.getElementById("dustbinMap").innerHTML = `
                <iframe
                    src="https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed"
                    width="100%"
                    height="400"
                    style="border:0; border-radius:15px;"
                    loading="lazy">
                </iframe>
            `;
        }


        // =========================
        // UPDATE DASHBOARD
        // =========================

        lastRealUpdate = new Date();

        updateDashboard();


        // =========================
        // FIREBASE STATUS
        // =========================

        console.log("LIVE Firebase Data:", data);

    }, (error) => {

        console.error("Firebase error:", error);

    });
}

loadFirebaseData();
// =====================================================
// AUTOMATIC DATA UPDATE
// =====================================================


// =====================================================
// NOTIFICATION
// =====================================================

function showNotification() {

    const notification =
        document.getElementById(
            "wasteNotification"
        );

    const message =
        document.getElementById(
            "notificationMessage"
        );


    if (
        !notification ||
        !message
    ) {
        return;
    }


    if (
        wetLevel >= 90 &&
        dryLevel >= 90
    ) {

        message.textContent =
            "Wet and Dry bins require immediate collection.";

    }

    else if (wetLevel >= 90) {

        message.textContent =
            "Wet waste bin requires immediate collection.";

    }

    else if (dryLevel >= 90) {

        message.textContent =
            "Dry waste bin requires immediate collection.";
    }


    notification.classList.add(
        "show"
    );
}


// =====================================================
// HIDE NOTIFICATION
// =====================================================

function hideNotification() {

    const notification =
        document.getElementById(
            "wasteNotification"
        );


    if (notification) {

        notification.classList.remove(
            "show"
        );
    }
}


// =====================================================
// CLOSE NOTIFICATION
// =====================================================

function closeNotification() {

    hideNotification();
}




// =====================================================
// SCROLL REVEAL
// =====================================================

const revealElements =
    document.querySelectorAll(
        ".info-card, .dashboard-card, .step, .contact-box > div"
    );


if (
    "IntersectionObserver" in window
) {

    const revealObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "show"
                            );

                        }

                        else {

                            entry.target.classList.remove(
                                "show"
                            );
                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    revealElements.forEach(
        function (element) {

            revealObserver.observe(
                element
            );

        }
    );
}


// =====================================================
// INITIAL LOAD
// =====================================================


updateDashboard();


// =====================================================
// END
// =====================================================

// =====================================================
// LOGIN / REGISTER
// Demo authentication using localStorage
// =====================================================
const authArea = document.getElementById("authArea");
const authModal = document.getElementById("authModal");
const closeAuth = document.getElementById("closeAuth");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

function getUsers() {
    return JSON.parse(localStorage.getItem("swachhpathUsers") || "[]");
}

function openAuth(mode = "login") {
    if (!authModal) return;
    authModal.classList.add("show");
    authModal.setAttribute("aria-hidden", "false");
    showAuthForm(mode);
}

function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove("show");
    authModal.setAttribute("aria-hidden", "true");
}

function showAuthForm(mode) {
    if (!loginForm || !registerForm) return;
    loginForm.style.display = mode === "login" ? "block" : "none";
    registerForm.style.display = mode === "register" ? "block" : "none";
}

function setMessage(id, text, ok = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.style.color = ok ? "#238636" : "#dc2626";
}

function renderAuthArea() {
    if (!authArea) return;
    const currentUser = JSON.parse(localStorage.getItem("swachhpathCurrentUser") || "null");

    if (currentUser) {
        authArea.innerHTML = `
            <span class="welcome-user">👋 Welcome, ${escapeHtml(currentUser.name)}</span>
            <button class="logout-btn" id="logoutBtn" type="button">Logout</button>
        `;
        document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
    } else {
        authArea.innerHTML = `<button class="auth-btn" id="loginOpenBtn" type="button">Login / Register</button>`;
        document.getElementById("loginOpenBtn")?.addEventListener("click", () => openAuth("login"));
    }
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function registerUser() {
    const name = document.getElementById("registerName")?.value.trim();
    const email = document.getElementById("registerEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("registerPassword")?.value;
    const confirm = document.getElementById("registerConfirm")?.value;

    if (!name || !email || !password || !confirm) return setMessage("registerMessage", "Please fill all fields.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMessage("registerMessage", "Enter a valid email.");
    if (password.length < 6) return setMessage("registerMessage", "Password must be at least 6 characters.");
    if (password !== confirm) return setMessage("registerMessage", "Passwords do not match.");

    const users = getUsers();
    if (users.some(user => user.email === email)) return setMessage("registerMessage", "Email already registered.");

    users.push({ name, email, password });
    localStorage.setItem("swachhpathUsers", JSON.stringify(users));
    setMessage("registerMessage", "Registration successful! Now login.", true);
    setTimeout(() => { showAuthForm("login"); setMessage("loginMessage", "Account created. Please login.", true); }, 700);
}

function loginUser() {
    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("loginPassword")?.value;
    const user = getUsers().find(item => item.email === email && item.password === password);

    if (!user) return setMessage("loginMessage", "Invalid email or password.");

    localStorage.setItem("swachhpathCurrentUser", JSON.stringify({ name: user.name, email: user.email }));
    setMessage("loginMessage", `Welcome, ${user.name}!`, true);
    renderAuthArea();
    setTimeout(closeAuthModal, 500);
}

function logoutUser() {
    localStorage.removeItem("swachhpathCurrentUser");
    renderAuthArea();
}

document.getElementById("loginBtn")?.addEventListener("click", loginUser);
document.getElementById("registerBtn")?.addEventListener("click", registerUser);
document.getElementById("showRegister")?.addEventListener("click", () => showAuthForm("register"));
document.getElementById("showLogin")?.addEventListener("click", () => showAuthForm("login"));
closeAuth?.addEventListener("click", closeAuthModal);
authModal?.addEventListener("click", e => { if (e.target === authModal) closeAuthModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAuthModal(); });
renderAuthArea();
