/* ============================================================
PORTAL APLIKASI SEKOLAH
APP.JS — TAHAP 2 | PORTAL PUBLIK + LOGIN
============================================================ */

/* ============================================================
KONFIGURASI PORTAL
============================================================ */

const PORTAL_CONFIG = {

name: "Portal Aplikasi Sekolah",

subtitle:
"Pusat akses sistem informasi sekolah",

defaultTheme: "light"

};

/* ============================================================
DATA APLIKASI
=============

CARA MENAMBAHKAN APLIKASI:

{
id: "nama-unik",
name: "Nama Aplikasi",
description: "Deskripsi aplikasi.",
category: "Administrasi",
icon: "fa-file",
url: "https://alamat-aplikasi.com",
status: "active",
featured: true
}

STATUS:
active       = Aktif
maintenance = Maintenance
coming       = Segera Hadir

============================================================ */

const applications = [

{
id: "penomoran-surat",

name:
  "Penomoran Surat Otomatis",

description:
  "Sistem pengelolaan dan pembuatan nomor surat secara otomatis dan terstruktur.",

category:
  "Administrasi",

icon:
  "fa-file-signature",

url:
  "#",

requiresLogin:
  true,

roles:
  ["Admin", "Operator", "Kepala Sekolah"],

status:
  "active",

featured:
  true

},

{
id: "presensi-siswa",

name:
  "Presensi Siswa",

description:
  "Sistem presensi dan pengelolaan kehadiran siswa secara digital.",

category:
  "Kesiswaan",

icon:
  "fa-user-check",

url:
  "#",

requiresLogin:
  true,

roles:
  ["Admin", "Operator", "Kepala Sekolah"],

status:
  "active",

featured:
  true

},

{
id: "sipjj",

name:
  "Pelaporan Guru PJJ / SIPJJ",

description:
  "Sistem pelaporan guru yang melaksanakan pembelajaran jarak jauh.",

category:
  "Guru",

icon:
  "fa-chalkboard-user",

url:
  "https://oprcoding-a11y.github.io/sipjj-camera/",

requiresLogin:
  true,

roles:
  ["Admin", "Guru", "Kepala Sekolah"],

status:
  "active",

featured:
  true

},

{
id: "administrasi-sekolah",

name:
  "Administrasi Sekolah",

description:
  "Pusat pengelolaan administrasi sekolah dan data pendukung lainnya.",

category:
  "Administrasi",

icon:
  "fa-school",

url:
  "#",

requiresLogin:
  true,

roles:
  ["Admin", "Operator", "Kepala Sekolah"],

status:
  "active",

featured:
  false

},

{
id: "rekap-laporan",

name:
  "Rekap & Laporan",

description:
  "Pusat pengelolaan berbagai rekapitulasi dan laporan sekolah.",

category:
  "Pelaporan",

icon:
  "fa-chart-column",

url:
  "#",

requiresLogin:
  true,

roles:
  ["Admin", "Operator", "Guru", "Kepala Sekolah"],

status:
  "coming",

featured:
  false

}

];

/* ============================================================
STATE
============================================================ */

let currentCategory = "Semua";

let currentSearch = "";

let toastTimer = null;
let currentUser = null;

const DEMO_USERS = [
  { username: "admin", password: "admin123", name: "Administrator", role: "Admin" },
  { username: "operator", password: "operator123", name: "Operator Sekolah", role: "Operator" },
  { username: "guru", password: "guru123", name: "Guru Sekolah", role: "Guru" },
  { username: "kepala", password: "kepala123", name: "Kepala Sekolah", role: "Kepala Sekolah" }
];

/* ============================================================
DOM READY
============================================================ */

document.addEventListener(
"DOMContentLoaded",
initializePortal
);

/* ============================================================
INITIALIZE
============================================================ */

function initializePortal() {

initializeTheme();

initializeSearch();

initializeThemeButton();

initializeBackToTop();

renderCategories();

updateStatistics();

renderApplications();

updateCurrentYear();

initializeAuth();

}

/* ============================================================
THEME
============================================================ */

function initializeTheme() {

const savedTheme =
localStorage.getItem("portalTheme");

const theme =
savedTheme ||
PORTAL_CONFIG.defaultTheme;

if (theme === "dark") {

document.body.classList.add("dark-mode");

}

updateThemeIcon();

}

function initializeThemeButton() {

const button =
document.getElementById("themeToggle");

if (!button) return;

button.addEventListener(
"click",
toggleTheme
);

}

function toggleTheme() {

document.body.classList.toggle(
"dark-mode"
);

const isDark =
document.body.classList.contains(
"dark-mode"
);

localStorage.setItem(
"portalTheme",
isDark ? "dark" : "light"
);

updateThemeIcon();

}

function updateThemeIcon() {

const button =
document.getElementById("themeToggle");

if (!button) return;

const icon =
button.querySelector("i");

if (!icon) return;

const isDark =
document.body.classList.contains(
"dark-mode"
);

icon.className =
isDark
? "fa-solid fa-sun"
: "fa-solid fa-moon";

button.title =
isDark
? "Gunakan mode terang"
: "Gunakan mode gelap";

}

/* ============================================================
SEARCH
============================================================ */

function initializeSearch() {

const input =
document.getElementById("searchInput");

const clearButton =
document.getElementById("clearSearch");

if (!input) return;

input.addEventListener(
"input",
function () {

  currentSearch =
    this.value.trim().toLowerCase();

  updateClearButton();

  renderApplications();

}

);

if (clearButton) {

clearButton.addEventListener(
  "click",
  clearSearch
);

}

}

function clearSearch() {

const input =
document.getElementById("searchInput");

if (!input) return;

input.value = "";

currentSearch = "";

updateClearButton();

renderApplications();

input.focus();

}

function updateClearButton() {

const button =
document.getElementById("clearSearch");

if (!button) return;

button.classList.toggle(
"show",
currentSearch.length > 0
);

}

/* ============================================================
KEYBOARD SHORTCUT
============================================================ */

document.addEventListener(
"keydown",
function (event) {

if (
  (event.ctrlKey || event.metaKey) &&
  event.key.toLowerCase() === "k"
) {

  event.preventDefault();

  const input =
    document.getElementById(
      "searchInput"
    );

  if (input) {

    input.focus();

    input.select();

  }

}


if (
  event.key === "Escape" &&
  currentSearch
) {

  clearSearch();

}

}
);

/* ============================================================
CATEGORIES
============================================================ */

function getCategories() {

const categories =
applications
.map(app => app.category)
.filter(Boolean);

return [
"Semua",
...new Set(categories)
];

}

function renderCategories() {

const container =
document.getElementById(
"categoryContainer"
);

if (!container) return;

const categories =
getCategories();

container.innerHTML =
categories
.map(category => {

    const active =
      category === currentCategory
        ? "active"
        : "";

    const icon =
      category === "Semua"
        ? "fa-border-all"
        : getCategoryIcon(category);

    return `

      <button
        type="button"
        class="category-button ${active}"
        onclick="selectCategory('${escapeAttribute(category)}')">

        <i class="fa-solid ${icon}"></i>

        ${escapeHtml(category)}

      </button>

    `;

  })
  .join("");

}

function getCategoryIcon(category) {

const icons = {

"Administrasi":
  "fa-building",

"Kesiswaan":
  "fa-user-graduate",

"Guru":
  "fa-chalkboard-user",

"Akademik":
  "fa-book-open",

"Pelaporan":
  "fa-chart-column",

"Utilitas":
  "fa-toolbox"

};

return (
icons[category] ||
"fa-folder"
);

}

function selectCategory(category) {

currentCategory =
category;

renderCategories();

renderApplications();

}

/* ============================================================
FILTER APPLICATIONS
============================================================ */

function getFilteredApplications() {

return applications.filter(
app => {

  const matchesCategory =
    currentCategory === "Semua" ||
    app.category ===
      currentCategory;


  const searchableText = [

    app.name,

    app.description,

    app.category

  ]
    .join(" ")
    .toLowerCase();


  const matchesSearch =
    !currentSearch ||
    searchableText.includes(
      currentSearch
    );


  return (
    matchesCategory &&
    matchesSearch
  );

}

);

}

/* ============================================================
RENDER APPLICATIONS
============================================================ */

function renderApplications() {

const container =
document.getElementById(
"applicationsContainer"
);

const featuredContainer =
document.getElementById(
"featuredAppsContainer"
);

const emptyState =
document.getElementById(
"emptyState"
);

const featuredSection =
document.getElementById(
"featuredSection"
);

if (!container) return;

const filtered =
getFilteredApplications();

const featured =
filtered.filter(
app => app.featured
);

/* --------------------------------
ALL APPLICATIONS
-------------------------------- */

container.innerHTML =
filtered.length
? filtered
.map(renderApplicationCard)
.join("")
: "";

/* --------------------------------
FEATURED APPLICATIONS
-------------------------------- */

if (
featuredContainer &&
featuredSection
) {

featuredContainer.innerHTML =
  featured.length
    ? featured
        .map(renderApplicationCard)
        .join("")
    : "";

featuredSection.style.display =
  featured.length
    ? ""
    : "none";

}

/* --------------------------------
EMPTY STATE
-------------------------------- */

if (emptyState) {

emptyState.hidden =
  filtered.length > 0;

}

updateResultCounters(
filtered,
featured
);

updateSectionTitle();

}

/* ============================================================
ACCESS CONTROL — TAHAP 3
============================================================ */
function hasApplicationAccess(app) {
  if (!app.requiresLogin) return true;
  if (!currentUser) return false;
  return Array.isArray(app.roles) && app.roles.includes(currentUser.role);
}

function getAccessLabel(app) {
  if (!app.requiresLogin) return "Publik";
  if (!currentUser) return "Perlu Login";
  return hasApplicationAccess(app) ? "Diizinkan" : "Terbatas";
}

function getAccessClass(app) {
  if (!app.requiresLogin) return "access-public";
  if (!currentUser) return "access-login";
  return hasApplicationAccess(app) ? "access-allowed" : "access-restricted";
}

function requestApplicationAccess(id) {
  const app = applications.find(item => item.id === id);
  if (!app) return;

  if (app.status !== "active") {
    showToast("Informasi", app.status === "coming" ? "Aplikasi ini segera hadir." : "Aplikasi sedang dalam maintenance.");
    return;
  }

  if (app.requiresLogin && !currentUser) {
    showToast("Login Diperlukan", `Silakan login untuk mengakses ${app.name}.`);
    openLogin();
    return;
  }

  if (app.requiresLogin && !hasApplicationAccess(app)) {
    showToast("Akses Terbatas", `Role ${currentUser.role} belum memiliki akses ke aplikasi ini.`);
    return;
  }

  if (!app.url || app.url === "#") {
    showToast("Belum Terhubung", `URL ${app.name} belum dikonfigurasi.`);
    return;
  }

  window.open(app.url, "_blank", "noopener,noreferrer");
}

/* ============================================================
APPLICATION CARD
============================================================ */

function renderApplicationCard(app) {

const status = getStatusConfig(app.status);
const accessLabel = getAccessLabel(app);
const accessClass = getAccessClass(app);

let buttonText = "Buka Aplikasi";
let buttonIcon = "fa-arrow-up-right-from-square";
let disabled = false;

if (app.status !== "active") {
  buttonText = app.status === "coming" ? "Segera Hadir" : "Maintenance";
  buttonIcon = "fa-lock";
  disabled = true;
} else if (app.requiresLogin && !currentUser) {
  buttonText = "Login untuk Akses";
  buttonIcon = "fa-right-to-bracket";
} else if (app.requiresLogin && !hasApplicationAccess(app)) {
  buttonText = "Akses Terbatas";
  buttonIcon = "fa-shield-halved";
  disabled = true;
} else if (!app.url || app.url === "#") {
  buttonText = "Belum Terhubung";
  buttonIcon = "fa-link-slash";
  disabled = true;
}

const button = `
  <button type="button" class="open-button ${disabled ? "disabled" : ""}" ${disabled ? "disabled" : `onclick="requestApplicationAccess('${escapeAttribute(app.id)}')"`}>
    ${buttonText}
    <i class="fa-solid ${buttonIcon}"></i>
  </button>
`;

return `
<article class="application-card">
  <div class="card-top">
    <div class="application-icon">
      <i class="fa-solid ${escapeAttribute(app.icon)}"></i>
    </div>
    <div class="card-badges">
      <span class="status-badge ${status.className}"><span class="status-dot"></span>${status.label}</span>
      <span class="access-badge ${accessClass}"><i class="fa-solid ${app.requiresLogin ? "fa-lock" : "fa-globe"}"></i>${accessLabel}</span>
    </div>
  </div>

  <div class="card-content">
    <h3>${escapeHtml(app.name)}</h3>
    <p>${escapeHtml(app.description)}</p>
  </div>

  <div class="card-footer">
    <span class="category-label"><i class="fa-solid ${getCategoryIcon(app.category)}"></i>${escapeHtml(app.category)}</span>
    ${button}
  </div>

  ${app.featured ? `<i class="fa-solid fa-star featured-star" aria-hidden="true"></i>` : ""}
</article>
`;

}

/* ============================================================
STATUS
============================================================ */

function getStatusConfig(status) {

const configs = {

active: {

  label: "Aktif",

  className:
    "status-active"

},

maintenance: {

  label: "Maintenance",

  className:
    "status-maintenance"

},

coming: {

  label: "Segera Hadir",

  className:
    "status-coming"

}

};

return (
configs[status] ||
configs.coming
);

}

/* ============================================================
OPEN APPLICATION
============================================================ */

function openApplication(url) {

if (
!url ||
url === "#"
) {

showToast(
  "Informasi",
  "Alamat aplikasi belum dikonfigurasi."
);

return;

}

window.open(
url,
"_blank",
"noopener,noreferrer"
);

}

/* ============================================================
STATISTICS
============================================================ */

function updateStatistics() {

const total =
applications.length;

const active =
applications.filter(
app =>
app.status === "active"
).length;

const featured =
applications.filter(
app =>
app.featured === true
).length;

const categories =
new Set(
applications.map(
app => app.category
)
).size;

setText(
"totalApps",
total
);

setText(
"activeApps",
active
);

setText(
"featuredApps",
featured
);

setText(
"totalCategories",
categories
);

}

/* ============================================================
RESULT COUNTERS
============================================================ */

function updateResultCounters(
filtered,
featured
) {

setText(
"allAppsCount",
formatApplicationCount(
filtered.length
)
);

setText(
"featuredCount",
formatApplicationCount(
featured.length
)
);

}

function formatApplicationCount(count) {

return count === 1
? "1 aplikasi"
: `${count} aplikasi`;

}

/* ============================================================
SECTION TITLE
============================================================ */

function updateSectionTitle() {

const title =
document.getElementById(
"applicationSectionTitle"
);

if (!title) return;

if (currentSearch) {

title.textContent =
  `Hasil Pencarian`;

return;

}

if (
currentCategory &&
currentCategory !== "Semua"
) {

title.textContent =
  currentCategory;

return;

}

title.textContent =
"Semua Aplikasi";

}

/* ============================================================
RESET FILTER
============================================================ */

function resetFilters() {

currentCategory =
"Semua";

currentSearch =
"";

const input =
document.getElementById(
"searchInput"
);

if (input) {

input.value = "";

}

updateClearButton();

renderCategories();

renderApplications();

}

/* ============================================================
TOAST
============================================================ */

function showToast(
title,
message
) {

const toast =
document.getElementById("toast");

const titleElement =
document.getElementById(
"toastTitle"
);

const messageElement =
document.getElementById(
"toastMessage"
);

if (
!toast ||
!titleElement ||
!messageElement
) return;

titleElement.textContent =
title;

messageElement.textContent =
message;

toast.classList.add("show");

clearTimeout(
toastTimer
);

toastTimer =
setTimeout(
hideToast,
4000
);

}

function hideToast() {

const toast =
document.getElementById(
"toast"
);

if (!toast) return;

toast.classList.remove(
"show"
);

}

/* ============================================================
BACK TO TOP
============================================================ */

function initializeBackToTop() {

const button =
document.getElementById(
"backToTop"
);

if (!button) return;

window.addEventListener(
"scroll",
function () {

  button.classList.toggle(
    "show",
    window.scrollY > 400
  );

}

);

button.addEventListener(
"click",
scrollToTop
);

}

function scrollToTop() {

window.scrollTo({

top: 0,

behavior: "smooth"

});

}

/* ============================================================
YEAR
============================================================ */

function updateCurrentYear() {

const element =
document.getElementById(
"currentYear"
);

if (!element) return;

element.textContent =
new Date().getFullYear();

}

/* ============================================================
HELPER
============================================================ */

function setText(
id,
value
) {

const element =
document.getElementById(id);

if (element) {

element.textContent =
  value;

}

}

/* ============================================================
SECURITY HELPERS
============================================================ */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");
}

/* ============================================================
AUTHENTICATION — LOGIN OPSIONAL
============================================================ */
function initializeAuth() {
  const saved = localStorage.getItem("portalUser");
  if (saved) {
    try { currentUser = JSON.parse(saved); } catch (_) { currentUser = null; }
  }

  const loginButton = document.getElementById("loginButton");
  const closeLogin = document.getElementById("closeLogin");
  const overlay = document.getElementById("loginOverlay");
  const form = document.getElementById("loginForm");
  const userButton = document.getElementById("userButton");
  const logoutButton = document.getElementById("logoutButton");
  const passwordToggle = document.getElementById("passwordToggle");

  if (loginButton) loginButton.addEventListener("click", () => openLogin());
  if (closeLogin) closeLogin.addEventListener("click", closeLoginModal);
  if (overlay) overlay.addEventListener("click", e => { if (e.target === overlay) closeLoginModal(); });
  if (form) form.addEventListener("submit", handleLogin);
  if (userButton) userButton.addEventListener("click", toggleUserDropdown);
  if (logoutButton) logoutButton.addEventListener("click", logoutUser);
  if (passwordToggle) passwordToggle.addEventListener("click", togglePassword);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeLoginModal();
      closeUserDropdown();
    }
  });

  document.addEventListener("click", e => {
    const menu = document.getElementById("userMenu");
    if (menu && !menu.contains(e.target)) closeUserDropdown();
  });

  updateAuthUI();
}

function openLogin() {
  const overlay = document.getElementById("loginOverlay");
  const error = document.getElementById("loginError");
  if (!overlay) return;
  if (error) { error.hidden = true; error.textContent = ""; }
  overlay.hidden = false;
  document.body.classList.add("modal-open");
  setTimeout(() => document.getElementById("loginUsername")?.focus(), 50);
}

function closeLoginModal() {
  const overlay = document.getElementById("loginOverlay");
  if (overlay) overlay.hidden = true;
  document.body.classList.remove("modal-open");
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("loginUsername")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;
  const error = document.getElementById("loginError");
  const user = DEMO_USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    if (error) { error.textContent = "Username atau password salah."; error.hidden = false; }
    return;
  }

  currentUser = { username: user.username, name: user.name, role: user.role };
  localStorage.setItem("portalUser", JSON.stringify(currentUser));
  updateAuthUI();
  renderApplications();
  closeLoginModal();
  document.getElementById("loginForm")?.reset();
  showToast("Login Berhasil", `Selamat datang, ${user.name}.`);
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem("portalUser");
  closeUserDropdown();
  updateAuthUI();
  renderApplications();
  showToast("Logout Berhasil", "Anda telah keluar dari akun.");
}

function updateAuthUI() {
  const loginButton = document.getElementById("loginButton");
  const userMenu = document.getElementById("userMenu");
  if (!loginButton || !userMenu) return;

  loginButton.hidden = !!currentUser;
  userMenu.hidden = !currentUser;

  if (currentUser) {
    ["currentUserName", "dropdownUserName"].forEach(id => setText(id, currentUser.name));
    ["currentUserRole", "dropdownUserRole"].forEach(id => setText(id, currentUser.role));
  }
}

function toggleUserDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("userDropdown");
  if (dropdown) dropdown.hidden = !dropdown.hidden;
}

function closeUserDropdown() {
  const dropdown = document.getElementById("userDropdown");
  if (dropdown) dropdown.hidden = true;
}

function togglePassword() {
  const input = document.getElementById("loginPassword");
  const button = document.getElementById("passwordToggle");
  if (!input || !button) return;
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  button.innerHTML = `<i class="fa-solid ${show ? "fa-eye-slash" : "fa-eye"}"></i>`;
}

/* ============================================================
EXPOSE FUNCTIONS
============================================================ */

window.selectCategory =
selectCategory;

window.resetFilters =
resetFilters;

window.openApplication =
openApplication;

window.requestApplicationAccess =
requestApplicationAccess;

window.clearSearch =
clearSearch;

window.hideToast =
hideToast;

window.scrollToTop =
scrollToTop;
