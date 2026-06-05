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
const scrobbleTicker = document.getElementById("scrobbleTicker");
const scrobbleFrame = document.getElementById("scrobbleFrame");
const lastfmOrigin = new URL(LASTFM_WIDGET_URL).origin;

if (scrobbleFrame && LASTFM_WIDGET_URL) {
  scrobbleFrame.src = LASTFM_WIDGET_URL;
}

function setScrobbleTicker(live) {
  scrobbleTicker?.classList.toggle("hidden", !live);
  document.body.classList.toggle("has-live-scrobble", Boolean(live));
}

window.addEventListener("message", (event) => {
  if (event.origin !== lastfmOrigin) return;
  if (event.data?.type !== "lastfm:scrobble-status") return;
  setScrobbleTicker(event.data.isLive === true);
});

document.addEventListener("click", () => {
  setStartMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setStartMenu(false);
  }
});
