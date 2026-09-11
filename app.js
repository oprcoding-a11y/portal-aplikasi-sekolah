/* ============================================================
   PORTAL APLIKASI SEKOLAH — TAHAP 2
   Login + Session + Role Access + Dashboard
   Catatan: akun di bawah adalah DEMO frontend.
   Untuk produksi, autentikasi harus dipindahkan ke backend.
============================================================ */

const PORTAL_CONFIG = {
  name: "Portal Aplikasi Sekolah",
  school: "SD Negeri Menteng Atas 05",
  defaultTheme: "light",
  sessionKey: "portalSessionV2",
  rememberKey: "portalRememberV2"
};

const users = [
  { username: "admin", password: "admin123", name: "Administrator", role: "admin", label: "Admin" },
  { username: "operator", password: "operator123", name: "Operator Sekolah", role: "operator", label: "Operator" },
  { username: "guru", password: "guru123", name: "Guru", role: "guru", label: "Guru" },
  { username: "kepala", password: "kepala123", name: "Kepala Sekolah", role: "kepala", label: "Kepala Sekolah" }
];

const applications = [
  {
    id:"penomoran-surat", name:"Penomoran Surat Otomatis",
    description:"Sistem pengelolaan dan pembuatan nomor surat secara otomatis dan terstruktur.",
    category:"Administrasi", icon:"fa-file-signature", url:"#",
    status:"active", featured:true, roles:["admin","operator"]
  },
  {
    id:"presensi-siswa", name:"Presensi Siswa",
    description:"Sistem presensi dan pengelolaan kehadiran siswa secara digital.",
    category:"Kesiswaan", icon:"fa-user-check", url:"#",
    status:"active", featured:true, roles:["admin","operator","guru","kepala"]
  },
  {
    id:"sipjj", name:"Pelaporan Guru PJJ / SIPJJ",
    description:"Sistem pelaporan guru yang melaksanakan pembelajaran jarak jauh.",
    category:"Guru", icon:"fa-chalkboard-user",
    url:"https://oprcoding-a11y.github.io/sipjj-camera/",
    status:"active", featured:true, roles:["admin","guru","kepala"]
  },
  {
    id:"administrasi-sekolah", name:"Administrasi Sekolah",
    description:"Pusat pengelolaan administrasi sekolah dan data pendukung lainnya.",
    category:"Administrasi", icon:"fa-school", url:"#",
    status:"active", featured:false, roles:["admin","operator"]
  },
  {
    id:"rekap-laporan", name:"Rekap & Laporan",
    description:"Pusat pengelolaan berbagai rekapitulasi dan laporan sekolah.",
    category:"Pelaporan", icon:"fa-chart-column", url:"#",
    status:"coming", featured:false, roles:["admin","operator","kepala"]
  }
];

let currentUser = null;
let currentCategory = "Semua";
let currentSearch = "";
let toastTimer = null;

document.addEventListener("DOMContentLoaded", initializePortal);

function initializePortal(){
  initializeTheme();
  bindLoginEvents();
  bindPortalEvents();
  restoreSession();
  updateCurrentYear();
}

function bindLoginEvents(){
  const form = document.getElementById("loginForm");
  const toggle = document.getElementById("togglePassword");

  if(form) form.addEventListener("submit", handleLogin);

  if(toggle){
    toggle.addEventListener("click", () => {
      const input = document.getElementById("password");
      const icon = toggle.querySelector("i");
      if(!input || !icon) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      icon.className = visible ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
      toggle.setAttribute("aria-label", visible ? "Tampilkan password" : "Sembunyikan password");
    });
  }
}

function bindPortalEvents(){
  const search = document.getElementById("searchInput");
  const clear = document.getElementById("clearSearch");
  const theme = document.getElementById("themeToggle");
  const menuButton = document.getElementById("userMenuButton");

  if(search) search.addEventListener("input", e => {
    currentSearch = e.target.value.trim().toLowerCase();
    updateClearButton();
    renderApplications();
  });

  if(clear) clear.addEventListener("click", clearSearch);
  if(theme) theme.addEventListener("click", toggleTheme);

  if(menuButton){
    menuButton.addEventListener("click", e => {
      e.stopPropagation();
      const menu = document.getElementById("userMenu");
      if(menu) menu.classList.toggle("hidden");
    });
  }

  document.addEventListener("click", e => {
    const wrap = document.querySelector(".user-menu-wrap");
    const menu = document.getElementById("userMenu");
    if(wrap && menu && !wrap.contains(e.target)) menu.classList.add("hidden");
  });

  document.addEventListener("keydown", e => {
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
      e.preventDefault();
      const input = document.getElementById("searchInput");
      if(input && !document.getElementById("applicationScreen").classList.contains("hidden")){
        input.focus(); input.select();
      }
    }
    if(e.key === "Escape" && currentSearch) clearSearch();
  });

  window.addEventListener("scroll", () => {
    const btn = document.getElementById("backToTop");
    if(btn) btn.classList.toggle("show", window.scrollY > 400);
  });
}

function handleLogin(event){
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("rememberMe").checked;
  const button = document.getElementById("loginButton");

  if(!username || !password){
    showToast("Login", "Username dan password wajib diisi.");
    return;
  }

  button.classList.add("loading");
  button.querySelector(".button-label").textContent = "Memverifikasi...";
  button.querySelector("i").className = "fa-solid fa-spinner fa-spin";

  setTimeout(() => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if(!user){
      button.classList.remove("loading");
      button.querySelector(".button-label").textContent = "Masuk ke Portal";
      button.querySelector("i").className = "fa-solid fa-arrow-right";
      showToast("Login Gagal", "Username atau password yang Anda masukkan tidak sesuai.");
      document.getElementById("password").focus();
      return;
    }

    currentUser = {
      username:user.username,
      name:user.name,
      role:user.role,
      label:user.label
    };

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(PORTAL_CONFIG.sessionKey, JSON.stringify(currentUser));

    if(remember) localStorage.setItem(PORTAL_CONFIG.rememberKey, "1");
    else localStorage.removeItem(PORTAL_CONFIG.rememberKey);

    showApplication();
    showToast("Login Berhasil", `Selamat datang, ${user.name}.`);
    button.classList.remove("loading");
    button.querySelector(".button-label").textContent = "Masuk ke Portal";
    button.querySelector("i").className = "fa-solid fa-arrow-right";
  }, 500);
}

function restoreSession(){
  let raw = sessionStorage.getItem(PORTAL_CONFIG.sessionKey);

  if(!raw && localStorage.getItem(PORTAL_CONFIG.rememberKey)){
    raw = localStorage.getItem(PORTAL_CONFIG.sessionKey);
  }

  if(raw){
    try{
      currentUser = JSON.parse(raw);
      if(currentUser && currentUser.role){
        showApplication(false);
        return;
      }
    }catch(error){}
  }

  showLogin();
}

function showApplication(showWelcome = true){
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("applicationScreen").classList.remove("hidden");

  updateUserUI();
  resetFilters();
  renderCategories();
  updateStatistics();
  renderApplications();

  if(showWelcome) setTimeout(() => {}, 0);
}

function showLogin(){
  document.getElementById("applicationScreen").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
}

function logout(){
  currentUser = null;
  sessionStorage.removeItem(PORTAL_CONFIG.sessionKey);
  localStorage.removeItem(PORTAL_CONFIG.sessionKey);
  localStorage.removeItem(PORTAL_CONFIG.rememberKey);

  document.getElementById("loginForm").reset();
  document.getElementById("userMenu").classList.add("hidden");
  showLogin();
  showToast("Logout Berhasil", "Anda telah keluar dari Portal.");
}

function getVisibleApplications(){
  if(!currentUser) return [];
  return applications.filter(app => app.roles.includes(currentUser.role));
}

function getCategories(){
  return ["Semua", ...new Set(getVisibleApplications().map(app => app.category).filter(Boolean))];
}

function renderCategories(){
  const container = document.getElementById("categoryContainer");
  if(!container) return;

  container.innerHTML = getCategories().map(category => {
    const active = category === currentCategory ? "active" : "";
    return `<button type="button" class="category-button ${active}" onclick="selectCategory('${escapeAttribute(category)}')">
      <i class="fa-solid ${category === "Semua" ? "fa-border-all" : getCategoryIcon(category)}"></i>
      ${escapeHtml(category)}
    </button>`;
  }).join("");
}

function getCategoryIcon(category){
  return {
    Administrasi:"fa-building",
    Kesiswaan:"fa-user-graduate",
    Guru:"fa-chalkboard-user",
    Akademik:"fa-book-open",
    Pelaporan:"fa-chart-column",
    Utilitas:"fa-toolbox"
  }[category] || "fa-folder";
}

function selectCategory(category){
  currentCategory = category;
  renderCategories();
  renderApplications();
}

function getFilteredApplications(){
  return getVisibleApplications().filter(app => {
    const categoryMatch = currentCategory === "Semua" || app.category === currentCategory;
    const text = `${app.name} ${app.description} ${app.category}`.toLowerCase();
    return categoryMatch && (!currentSearch || text.includes(currentSearch));
  });
}

function renderApplications(){
  const container = document.getElementById("applicationsContainer");
  const featuredContainer = document.getElementById("featuredAppsContainer");
  const featuredSection = document.getElementById("featuredSection");
  const emptyState = document.getElementById("emptyState");

  if(!container) return;

  const filtered = getFilteredApplications();
  const featured = filtered.filter(app => app.featured);

  container.innerHTML = filtered.map(renderApplicationCard).join("");

  if(featuredContainer){
    featuredContainer.innerHTML = featured.map(renderApplicationCard).join("");
  }

  if(featuredSection) featuredSection.style.display = featured.length ? "" : "none";
  if(emptyState) emptyState.hidden = filtered.length > 0;

  setText("allAppsCount", formatCount(filtered.length));
  setText("featuredCount", formatCount(featured.length));

  const title = document.getElementById("applicationSectionTitle");
  if(title) title.textContent = currentSearch ? "Hasil Pencarian" : (currentCategory !== "Semua" ? currentCategory : "Semua Aplikasi");
}

function renderApplicationCard(app){
  const status = getStatusConfig(app.status);
  const isAvailable = app.status === "active" && app.url && app.url !== "#";

  const action = isAvailable
    ? `<button type="button" class="open-button" onclick="openApplication('${escapeAttribute(app.url)}')">Buka Aplikasi <i class="fa-solid fa-arrow-up-right-from-square"></i></button>`
    : `<button type="button" class="open-button disabled" onclick="showToast('Informasi','Alamat aplikasi belum dikonfigurasi.')">${app.status === "coming" ? "Segera Hadir" : "Belum Tersedia"} <i class="fa-solid fa-lock"></i></button>`;

  return `<article class="application-card">
    <div class="card-top">
      <div class="application-icon"><i class="fa-solid ${escapeAttribute(app.icon)}"></i></div>
      <span class="status-badge ${status.className}"><span class="status-dot"></span>${status.label}</span>
    </div>
    <div class="card-content">
      <h3>${escapeHtml(app.name)}</h3>
      <p>${escapeHtml(app.description)}</p>
    </div>
    <div class="card-footer">
      <span class="category-label"><i class="fa-solid ${getCategoryIcon(app.category)}"></i>${escapeHtml(app.category)}</span>
      ${action}
    </div>
    ${app.featured ? '<i class="fa-solid fa-star featured-star" aria-hidden="true"></i>' : ""}
  </article>`;
}

function getStatusConfig(status){
  return {
    active:{label:"Aktif",className:"status-active"},
    maintenance:{label:"Maintenance",className:"status-maintenance"},
    coming:{label:"Segera Hadir",className:"status-coming"}
  }[status] || {label:"Segera Hadir",className:"status-coming"};
}

function openApplication(url){
  if(!url || url === "#"){
    showToast("Informasi","Alamat aplikasi belum dikonfigurasi.");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

function updateStatistics(){
  const visible = getVisibleApplications();
  setText("totalApps", visible.length);
  setText("activeApps", visible.filter(a => a.status === "active").length);
  setText("featuredApps", visible.filter(a => a.featured).length);
  setText("totalCategories", new Set(visible.map(a => a.category)).size);
}

function updateUserUI(){
  if(!currentUser) return;
  const initial = currentUser.name.trim().charAt(0).toUpperCase();

  setText("headerUserName", currentUser.name);
  setText("headerUserRole", currentUser.label);
  setText("menuUserName", currentUser.name);
  setText("menuUserRole", currentUser.label);
  setText("userAvatar", initial);
}

function resetFilters(){
  currentCategory = "Semua";
  currentSearch = "";
  const input = document.getElementById("searchInput");
  if(input) input.value = "";
  updateClearButton();
}

function clearSearch(){
  const input = document.getElementById("searchInput");
  if(input) input.value = "";
  currentSearch = "";
  updateClearButton();
  renderApplications();
  if(input) input.focus();
}

function updateClearButton(){
  const button = document.getElementById("clearSearch");
  if(button) button.classList.toggle("show", currentSearch.length > 0);
}

function formatCount(count){
  return count === 1 ? "1 aplikasi" : `${count} aplikasi`;
}

function initializeTheme(){
  const saved = localStorage.getItem("portalTheme") || PORTAL_CONFIG.defaultTheme;
  if(saved === "dark") document.body.classList.add("dark-mode");
  updateThemeIcon();
}

function toggleTheme(){
  document.body.classList.toggle("dark-mode");
  const dark = document.body.classList.contains("dark-mode");
  localStorage.setItem("portalTheme", dark ? "dark" : "light");
  updateThemeIcon();
}

function updateThemeIcon(){
  const button = document.getElementById("themeToggle");
  const icon = button?.querySelector("i");
  if(!icon) return;
  const dark = document.body.classList.contains("dark-mode");
  icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  button.title = dark ? "Gunakan mode terang" : "Gunakan mode gelap";
}

function updateCurrentYear(){
  setText("currentYear", new Date().getFullYear());
}

function setText(id,value){
  const element = document.getElementById(id);
  if(element) element.textContent = value;
}

function showToast(title,message){
  const toast = document.getElementById("toast");
  const titleEl = document.getElementById("toastTitle");
  const msgEl = document.getElementById("toastMessage");
  if(!toast || !titleEl || !msgEl) return;

  titleEl.textContent = title;
  msgEl.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 3500);
}

function hideToast(){
  document.getElementById("toast")?.classList.remove("show");
}

function scrollToTop(){
  window.scrollTo({top:0,behavior:"smooth"});
}

function escapeHtml(value){
  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function escapeAttribute(value){
  return String(value ?? "")
    .replace(/\\/g,"\\\\")
    .replace(/'/g,"\\'")
    .replace(/"/g,"&quot;");
}

window.selectCategory = selectCategory;
window.resetFilters = resetFilters;
window.openApplication = openApplication;
window.clearSearch = clearSearch;
window.hideToast = hideToast;
window.scrollToTop = scrollToTop;
window.logout = logout;
window.showToast = showToast;
