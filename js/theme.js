// Theme panel: dark/light theme + accent colour, saved per visitor.
// The choice lives as data-theme / data-accent on <html>; all colours come from
// CSS tokens in css/main.css. A tiny inline script in <head> applies the saved
// choice before first paint; this file wires up the panel.

const THEME_KEY = "dp-theme";
const DEFAULT_THEME = { theme: "dark", accent: "green" }; // the original look

const html = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const themePanel = document.getElementById("themePanel");
const themeColor = document.querySelector('meta[name="theme-color"]');

function loadTheme() {
  try {
    return { ...DEFAULT_THEME, ...JSON.parse(localStorage.getItem(THEME_KEY) || "{}") };
  } catch {
    return { ...DEFAULT_THEME };
  }
}

function saveTheme(state) {
  try {
    const isDefault = state.theme === DEFAULT_THEME.theme && state.accent === DEFAULT_THEME.accent;
    if (isDefault) localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, JSON.stringify(state));
  } catch {
    /* storage blocked (private mode): the choice just won't persist */
  }
}

function applyTheme(state) {
  if (state.theme === "light") html.dataset.theme = "light";
  else delete html.dataset.theme;
  if (state.accent && state.accent !== "green") html.dataset.accent = state.accent;
  else delete html.dataset.accent;

  // keep the browser UI colour in step with the page background
  themeColor?.setAttribute("content", getComputedStyle(html).getPropertyValue("--bg").trim());

  themePanel.querySelectorAll("[data-set-theme]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.setTheme === state.theme)),
  );
  themePanel.querySelectorAll("[data-set-accent]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.setAccent === state.accent)),
  );
}

let themeState = loadTheme();
applyTheme(themeState);

function updateTheme(patch) {
  themeState = { ...themeState, ...patch };
  applyTheme(themeState);
  saveTheme(themeState);
}

// ---------- Panel open / close ----------
function setPanelOpen(open) {
  themePanel.hidden = !open;
  themeBtn.setAttribute("aria-expanded", String(open));
}
themeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  setPanelOpen(themePanel.hidden);
});
document.addEventListener("click", (e) => {
  if (!themePanel.hidden && !themePanel.contains(e.target)) setPanelOpen(false);
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !themePanel.hidden) {
    setPanelOpen(false);
    themeBtn.focus();
  }
});

// ---------- Choices ----------
themePanel.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.dataset.setTheme) updateTheme({ theme: btn.dataset.setTheme });
  else if (btn.dataset.setAccent) updateTheme({ accent: btn.dataset.setAccent });
  else if (btn.id === "themeReset") updateTheme({ ...DEFAULT_THEME });
});
