/* ============================================================
PORTAL APLIKASI SEKOLAH
APP.JS — TAHAP 1
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
  "#",

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
APPLICATION CARD
============================================================ */

function renderApplicationCard(app) {

const status =
getStatusConfig(
app.status
);

const isAvailable =
app.status === "active" &&
app.url &&
app.url !== "#";

const button =
isAvailable

  ? `

    <button
      type="button"
      class="open-button"
      onclick="openApplication('${escapeAttribute(app.url)}')">

      Buka Aplikasi

      <i class="fa-solid fa-arrow-up-right-from-square"></i>

    </button>

  `

  : `

    <button
      type="button"
      class="open-button disabled"
      disabled>

      ${app.status === "coming"
        ? "Segera Hadir"
        : "Maintenance"}

      <i class="fa-solid fa-lock"></i>

    </button>

  `;

return `

<article class="application-card">

  <div class="card-top">

    <div class="application-icon">

      <i class="fa-solid ${escapeAttribute(app.icon)}"></i>

    </div>


    <span class="status-badge ${status.className}">

      <span class="status-dot"></span>

      ${status.label}

    </span>

  </div>


  <div class="card-content">

    <h3>
      ${escapeHtml(app.name)}
    </h3>

    <p>
      ${escapeHtml(app.description)}
    </p>

  </div>


  <div class="card-footer">

    <span class="category-label">

      <i class="fa-solid ${getCategoryIcon(app.category)}"></i>

      ${escapeHtml(app.category)}

    </span>

    ${button}

  </div>


  ${
    app.featured
      ? `
        <i
          class="fa-solid fa-star featured-star"
          aria-hidden="true">
        </i>
      `
      : ""
  }

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
EXPOSE FUNCTIONS
============================================================ */

window.selectCategory =
selectCategory;

window.resetFilters =
resetFilters;

window.openApplication =
openApplication;

window.clearSearch =
clearSearch;

window.hideToast =
hideToast;

window.scrollToTop =
scrollToTop;
