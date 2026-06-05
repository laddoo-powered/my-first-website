const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function syncThemeToggle() {
  const currentTheme = root.dataset.theme === "light" ? "light" : "dark";
  themeToggle.textContent = currentTheme === "dark" ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", `Switch to ${currentTheme === "dark" ? "light" : "dark"} theme`);
}

syncThemeToggle();

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  try {
    localStorage.setItem("dashboard-theme", nextTheme);
  } catch (_) {}
  syncThemeToggle();
});

const apps = [
  { name: "hotch potch", icon: "📜", color: "#2b579a", url: "https://mr-hotch-potch.vercel.app" },
  { name: "add to dictionary", icon: "🔏", color: "#217346", url: "https://add-to-dictionary-sucktoes.vercel.app" }
];

const grid = document.getElementById("appsGrid");

apps.forEach((app) => {
  const item = document.createElement("button");
  item.className = "app-item";
  item.type = "button";
  item.addEventListener("click", () => { window.location.href = app.url; });

  const icon = document.createElement("div");
  icon.className = "app-icon";
  icon.style.background = app.color;
  icon.textContent = app.icon;

  const name = document.createElement("div");
  name.className = "app-name";
  name.textContent = app.name;

  item.append(icon, name);
  grid.appendChild(item);
});

const startBtn = document.getElementById("startBtn");
const startMenu = document.getElementById("startMenu");

function setStartMenu(open) {
  startMenu.classList.toggle("hidden", !open);
  startBtn.classList.toggle("menu-open", open);
  startBtn.setAttribute("aria-expanded", String(open));
}

startBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  setStartMenu(startMenu.classList.contains("hidden"));
});

startMenu.addEventListener("click", (event) => {
  event.stopPropagation();
});

const LASTFM_WIDGET_URL = "https://lastfm-vercel-widget-deploy.vercel.app/";

const scrobbleToggle = document.getElementById("scrobbleToggle");
const scrobblePanel = document.getElementById("scrobblePanel");
const scrobbleClose = document.getElementById("scrobbleClose");
const scrobbleFrame = document.getElementById("scrobbleFrame");
let scrobbleLoaded = false;

function ensureScrobbleLoaded() {
  if (!scrobbleLoaded && LASTFM_WIDGET_URL && scrobbleFrame) {
    scrobbleFrame.src = LASTFM_WIDGET_URL;
    scrobbleLoaded = true;
  }
}

function setScrobblePanel(open) {
  if (open) ensureScrobbleLoaded();
  scrobblePanel.classList.toggle("hidden", !open);
  scrobbleToggle.classList.toggle("is-open", open);
  scrobbleToggle.setAttribute("aria-expanded", String(open));
}

scrobbleToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  setScrobblePanel(scrobblePanel.classList.contains("hidden"));
});

scrobbleClose.addEventListener("click", (event) => {
  event.stopPropagation();
  setScrobblePanel(false);
  scrobbleToggle.focus();
});

scrobblePanel.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", () => {
  setStartMenu(false);
  setScrobblePanel(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setStartMenu(false);
    setScrobblePanel(false);
  }
});
