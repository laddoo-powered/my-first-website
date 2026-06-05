const startButton = document.querySelector("#startBtn");
const startMenu = document.querySelector("#startMenu");
const appsGrid = document.querySelector("#appsGrid");
const scrobbleTicker = document.querySelector("#scrobbleTicker");
const scrobbleFrame = document.querySelector("#scrobbleFrame");

const LASTFM_WIDGET_URL = "https://lastfm-vercel-widget-deploy.vercel.app/";
const lastfmOrigin = new URL(LASTFM_WIDGET_URL).origin;

const apps = [
  {
    name: "hotch potch",
    icon: "📜",
    color: "#2b579a",
    url: "https://mr-hotch-potch.vercel.app"
  },
  {
    name: "add to dictionary",
    icon: "🔏",
    color: "#217346",
    url: "https://add-to-dictionary-sucktoes.vercel.app"
  }
];

function createAppButton(app) {
  const button = document.createElement("button");
  button.className = "app-item";
  button.type = "button";
  button.addEventListener("click", () => {
    window.location.href = app.url;
  });

  const icon = document.createElement("span");
  icon.className = "app-icon";
  icon.style.background = app.color;
  icon.textContent = app.icon;
  icon.setAttribute("aria-hidden", "true");

  const name = document.createElement("span");
  name.className = "app-name";
  name.textContent = app.name;

  button.append(icon, name);
  return button;
}

function renderApps() {
  const fragment = document.createDocumentFragment();
  apps.forEach((app) => fragment.append(createAppButton(app)));
  appsGrid.replaceChildren(fragment);
}

function setStartMenu(open) {
  startMenu.classList.toggle("hidden", !open);
  startButton.classList.toggle("is-open", open);
  startButton.setAttribute("aria-expanded", String(open));
}

function setScrobbleTicker(isLive) {
  scrobbleTicker?.classList.toggle("hidden", !isLive);
  document.body.classList.toggle("has-live-scrobble", Boolean(isLive));
}

startButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  setStartMenu(startMenu.classList.contains("hidden"));
});

startMenu?.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", () => setStartMenu(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setStartMenu(false);
});

window.addEventListener("message", (event) => {
  if (event.origin !== lastfmOrigin) return;
  if (event.data?.type !== "lastfm:scrobble-status") return;

  setScrobbleTicker(event.data.isLive === true);
});

if (scrobbleFrame) {
  scrobbleFrame.src = LASTFM_WIDGET_URL;
}

renderApps();
