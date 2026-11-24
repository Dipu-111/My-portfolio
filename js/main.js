// Page logic: loads projects.json, builds the scroll scenes, drives the 3D phone,
// and wires the nav, modals, chat contact form and visitor stats.

// Filled from projects.json: "featured" apps get a scroll scene, the rest go in the More apps section
const projects = [];
const otherApps = [];

const generic = {
  ui: "Flutter & Dart",
  state: "Riverpod · GetX",
  apiName: "Flask REST",
  data: "Oracle · MySQL",
  table: "visits",
  api: ["GET /api/visits", "POST /api/leads", "PUT /api/sync"],
};

const reduceMotion = matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// ---------- Build project steps ----------
const stepsEl = document.getElementById("steps");
const buildSteps = () =>
  stepsEl.insertAdjacentHTML(
    "beforeend",
    projects
      .map(
        (p, i) => `
  <article class="step" id="p-${p.id}" data-kind="project" data-p="${i}" style="--accent:${p.accent}">
    <div class="eyebrow">${String(i + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}</div>
    <h2>${p.name} <span class="status">${p.status}</span></h2>
    <p>${p.desc}</p>
    ${p.points.length ? `<ul>${p.points.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
    <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    ${p.impact ? `<p class="impact"><b>My part</b>${p.impact}</p>` : ""}
    ${[].concat(p.solved || []).map((s) => `<p class="impact solved"><b>Problem solved</b>${s}</p>`).join("")}  </article>`,
      )
      .join(""),
  );

// ---------- Phone screen + layer labels ----------
const screenEl = document.getElementById("screen");
const root = document.documentElement;

function lockScreen() {
  const d = new Date();
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const date = d.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return `<div class="screen-inner lock">
    <div class="lock-time">${time}</div><div class="lock-date">${date}</div>
    <div class="lock-name"><span id="typed"></span><i class="caret"></i></div>
    <div class="lock-role">Flutter Full-Stack Developer</div>
    <div class="lock-hint">scroll to unlock ↓</div></div>`;
}

function setStackLabels(s) {
  document.querySelectorAll("[data-f]").forEach((el) => {
    const k = el.dataset.f;
    if (k === "api")
      el.innerHTML = s.api
        .map(
          (a) =>
            `<div class="api-line"><span>${a}</span><i>200</i></div>`,
        )
        .join("");
    else el.textContent = s[k];
  });
}

let shownKey = null;
function showScreen(key) {
  if (key === shownKey) return;
  const first = shownKey === null;
  shownKey = key;
  const p = key === "lock" ? null : projects[key];
  // each work app has its own accent; the lock screen falls back to the chosen brand colour
  if (p) root.style.setProperty("--accent", p.accent);
  else root.style.removeProperty("--accent");
  // Draw the new app on this same frame. A delayed swap landed after the stack had
  // started closing on fast scrolls, so the old app showed on a half-closed phone.
  renderApp(p);
  setStackLabels(p ? p.stack : generic);
  if (!p) typeName(first ? 500 : 0);
  if (first || reduceMotion) return;
  // restart the fade-in animation
  screenEl.classList.remove("swap");
  void screenEl.offsetWidth;
  screenEl.classList.add("swap");
}

function renderApp(p, target = screenEl) {
  target.innerHTML = p ? p.screen : lockScreen();
  const app = target.querySelector(".app");
  if (p && p.init && app) p.init(app);
}

const modalScreen = document.getElementById("modalScreen");
[screenEl, modalScreen].forEach((container) =>
  container.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || !container.contains(el)) return;
    const app = el.closest(".app");
    actions[el.dataset.act]?.(el, app);
  }),
);

// ---------- Full-size phone modal (small screens) ----------
const phoneModal = document.getElementById("phoneModal");
let lastFocus = null;
function openModal(m) {
  lastFocus = document.activeElement;
  m.classList.add("open");
  m.querySelector(".modal-x")?.focus();
}
function closeModal(m) {
  m.classList.remove("open");
  lastFocus?.focus?.();
}
phoneModal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeModal(phoneModal);
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && phoneModal.classList.contains("open"))
    closeModal(phoneModal);
});

function buildExtras() {
  document
    .getElementById("jump")
    .insertAdjacentHTML(
      "beforeend",
      projects
        .map((p) => `<a href="#p-${p.id}">${p.name.split(":")[0]}</a>`)
        .join(""),
    );
  addRailApps();
  document.getElementById("appsGrid").innerHTML = otherApps
    .map(
      (p) => `
    <article class="app-card spot" style="--accent:${p.accent}">
<div class="app-top">
  <span class="app-ico">${p.name[0]}</span>
  <div><h4>${p.name.split(":")[0]}</h4><span class="status">${p.status}</span></div>
</div>
<p>${p.desc}</p>
${p.points.length ? `<ul>${p.points.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
<div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
<div class="app-links">${(p.links || []).map((l) => `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label} ↗</a>`).join("")}</div>
    </article>`,
    )
    .join("");
}

// ---------- Card spotlight: follow the mouse on any .spot card ----------
document
  .querySelectorAll(".b, .xp-item")
  .forEach((el) => el.classList.add("spot"));
addEventListener(
  "pointermove",
  (e) => {
    const card = e.target.closest?.(".spot");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  },
  { passive: true },
);

// ---------- Nav + timeline rail: highlight the link for the section on screen ----------
// "#work" is just a jump marker, so the whole story section stands in for it
const navLinks = [...document.querySelectorAll(".nav-links a, .rail a")];
const sectionFor = (a) =>
  a.getAttribute("href") === "#work"
    ? document.getElementById("story")
    : document.querySelector(a.getAttribute("href"));
const navIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle("active", sectionFor(a) === en.target),
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
navLinks.forEach((a) => sectionFor(a) && navIO.observe(sectionFor(a)));

// On small screens the 3D phone is too small to use, so a tap opens the app full-size instead
document.getElementById("stage").addEventListener(
  "click",
  (e) => {
    if (
      !mobile ||
      typeof shownKey !== "number" ||
      !e.target.closest(".stack")
    )
      return;
    e.stopPropagation();
    renderApp(projects[shownKey], modalScreen);
    openModal(phoneModal);
  },
  true,
);

let typeTimer;
function typeName(delay) {
  clearTimeout(typeTimer);
  const el = document.getElementById("typed");
  const name = "Dipendra Pandey";
  if (reduceMotion) {
    el.textContent = name;
    return;
  }
  let n = 0;
  const tick = () => {
    el.textContent = name.slice(0, ++n);
    if (n < name.length) typeTimer = setTimeout(tick, 70);
  };
  typeTimer = setTimeout(tick, delay);
}

showScreen("lock");

// ---------- Scroll engine: one rAF loop, transforms + opacity only ----------
const stage = document.getElementById("stage");
const tilt = document.getElementById("tilt");
const stack = document.getElementById("stack");
const glare = document.getElementById("glare");
const layers = [...stack.querySelectorAll(".layer")]; // bottom → top: db, api, state, ui
const labels = [...document.querySelectorAll(".lbls .lbl")]; // bottom → top, same order as layers
const PERSPECTIVE = 1700; // must match .stage perspective
const RAD = Math.PI / 180;

// Where a point in the stack's local 3D space lands on screen, using the same
// rotateX · rotateY · rotateZ order and perspective as the CSS (pure math, no layout reads).
function project(x, y, z, ax, ay, az, tx, ty) {
  let c = Math.cos(az * RAD),
    s = Math.sin(az * RAD);
  const x1 = x * c - y * s,
    y1 = x * s + y * c;
  c = Math.cos(ay * RAD);
  s = Math.sin(ay * RAD);
  const x2 = x1 * c + z * s,
    z2 = -x1 * s + z * c;
  c = Math.cos(ax * RAD);
  s = Math.sin(ax * RAD);
  const y3 = y1 * c - z2 * s + ty,
    z3 = y1 * s + z2 * c;
  const k = PERSPECTIVE / (PERSPECTIVE - z3);
  return [(x2 + tx) * k, y3 * k];
}
const panes = layers.map((l) => l.querySelector(".pane"));
const sats = [...document.querySelectorAll(".sat")];
const tapHint = document.getElementById("tapHint");
let stepEls = [...document.querySelectorAll(".step")];

// Load the project list, attach each project's phone screen, then add its scroll step
fetch("projects.json")
  .then((res) => res.json())
  .then((list) => {
    list.forEach((p) =>
      (p.featured ? projects : otherApps).push({
        ...p,
        ...phoneScreens[p.id],
      }),
    );
    buildSteps();
    buildExtras();
    stepEls = [...document.querySelectorAll(".step")];
    measure();
  })
  .catch(() => console.warn("Could not load projects.json"));
const syncRing = document.getElementById("syncRing");
const syncText = document.getElementById("syncText");
const syncPill = document.getElementById("sync");

const railFill = document.getElementById("railFill");
let railLinks = [...document.querySelectorAll(".rail a")];

// One small rail dot per work app, added once projects.json has loaded. They have
// their own observer, so the "Work" link stays lit while you're inside the story.
const subIO = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) =>
      document
        .querySelector(`.rail a[href="#${en.target.id}"]`)
        ?.classList.toggle("active", en.isIntersecting),
    ),
  { rootMargin: "-45% 0px -50% 0px" },
);
function addRailApps() {
  document.querySelector('.rail a[href="#work"]').insertAdjacentHTML(
    "afterend",
    projects
      .map(
        (p) =>
          `<a href="#p-${p.id}" class="sub" style="--c:${p.accent}"><i></i><span>${p.name.split(":")[0]}</span></a>`,
      )
      .join(""),
  );
  railLinks = [...document.querySelectorAll(".rail a")];
  projects.forEach((p) => subIO.observe(document.getElementById(`p-${p.id}`)));
}

let boxes = [],
  railStops = [],
  maxScroll = 1,
  mobile = false;
function measure() {
  mobile = innerWidth <= 900;
  boxes = stepEls.map((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + scrollY, h: r.height };
  });
  maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - innerHeight,
  );
  // place each rail dot at the scroll progress where its section reaches mid-screen
  railStops = railLinks.map((a) => {
    const top = sectionFor(a).getBoundingClientRect().top + scrollY;
    const at = clamp((top - innerHeight * 0.5) / maxScroll);
    a.style.setProperty("--at", `${(at * 100).toFixed(2)}%`);
    return at;
  });
}
measure();
addEventListener("resize", measure);
addEventListener("load", measure);
document.fonts && document.fonts.ready.then(measure);
new ResizeObserver(measure).observe(stepsEl);

// mouse → target tilt
let mx = 0,
  my = 0,
  tmx = 0,
  tmy = 0;
addEventListener(
  "pointermove",
  (e) => {
    if (e.pointerType !== "mouse") return;
    tmx = (e.clientX / innerWidth - 0.5) * 2;
    tmy = (e.clientY / innerHeight - 0.5) * 2;
  },
  { passive: true },
);

let stageVisible = true;
new IntersectionObserver(([en]) => {
  stageVisible = en.isIntersecting;
}).observe(document.getElementById("story"));

let sy = scrollY,
  activeStep = 0;
const sats0 = [
  [-1.15, -0.55],
  [1.2, -0.15],
  [-1.0, 0.6],
]; // satellite directions (× phone width)

// ---------- Page-wide cursor spotlight ----------
const cursorGlow = document.getElementById("cursorGlow");
let gx = innerWidth / 2,
  gy = innerHeight / 2,
  tgx = gx,
  tgy = gy;
addEventListener(
  "pointermove",
  (e) => {
    if (e.pointerType !== "mouse") return;
    tgx = e.clientX;
    tgy = e.clientY;
    cursorGlow.classList.add("on");
  },
  { passive: true },
);
document.documentElement.addEventListener("mouseleave", () =>
  cursorGlow.classList.remove("on"),
);

function frame(t) {
  // smoothed scroll for a buttery feel
  sy = reduceMotion ? scrollY : sy + (scrollY - sy) * 0.16;
  if (Math.abs(scrollY - sy) < 0.1) sy = scrollY;

  // spotlight trails the cursor with a little easing
  gx += (tgx - gx) * (reduceMotion ? 1 : 0.18);
  gy += (tgy - gy) * (reduceMotion ? 1 : 0.18);
  cursorGlow.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`;

  // nav sync badge
  const prog = clamp(scrollY / maxScroll);
  syncRing.style.strokeDashoffset = (44 * (1 - prog)).toFixed(1);
  railFill.style.transform = `scaleY(${prog.toFixed(4)})`;
  railStops.forEach((at, i) =>
    railLinks[i].classList.toggle("passed", prog >= at - 0.001),
  );
  const label =
    prog < 0.01
      ? "Offline"
      : prog > 0.985
        ? "Synced ✓"
        : `Syncing ${Math.round(prog * 100)}%`;
  if (syncText.textContent !== label) {
    syncText.textContent = label;
    syncPill.classList.toggle("done", prog > 0.985);
  }

  if (stageVisible) {
    // which step is under the reading line, and how far through it we are
    const line = sy + innerHeight * (mobile ? 0.72 : 0.5);
    let i = 0;
    while (i < boxes.length - 1 && line >= boxes[i + 1].top) i++;
    const st = clamp((line - boxes[i].top) / boxes[i].h);
    const el = stepEls[i];
    const kind = el.dataset.kind;

    if (i !== activeStep) {
      stepEls[activeStep].classList.remove("on");
      el.classList.add("on");
      activeStep = i;
    }

    // explode amount e: 0 = assembled phone, 1 = fully exploded stack
    // labelFade dims the stack labels right at an app boundary, where their text swaps
    let e = 0,
      sat = 0,
      labelFade = 1;
    if (kind === "stack") e = smooth(0.08, 0.42, st);
    else if (kind === "project") {
      const p = +el.dataset.p;
      const last = p === projects.length - 1;
      // Each app: hold exploded (its 4 layers labelled) → assemble → phone screen → explode → hold.
      // The holds at the end of one app and the start of the next join into one long pause.
      e = Math.max(
        1 - smooth(0.15, 0.37, st),
        last ? 0 : smooth(0.63, 0.85, st),
      );
      labelFade = smooth(0, 0.05, st) * (last ? 1 : 1 - smooth(0.95, 1, st));
      if (projects[p].erp)
        sat = smooth(0.36, 0.44, st) * (1 - smooth(0.56, 0.64, st));
      showScreen(p);
    }
    if (kind !== "project") showScreen("lock");
    const work = kind === "project" && !!projects[+el.dataset.p].screen; // apps with a rebuilt phone screen are tappable
    tapHint.style.opacity = work
      ? (1 - smooth(0, 0.3, e)).toFixed(2)
      : "0";

    // mouse tilt eases toward target
    mx += (tmx - mx) * 0.07;
    my += (tmy - my) * 0.07;
    const float = reduceMotion
      ? 0
      : Math.sin(t / 1100) * (mobile ? 4 : 8) * (1 - e);

    const ax = lerp(6, 56, e) - my * 7;
    const ay = lerp(-16, 0, e) + mx * 10;
    const az = lerp(0, -36, e);
    const pw = mobile ? 128 : 250;
    const gap = pw * 0.34;

    const ty = float + e * gap * 1.1;
    const tx = -e * pw * (mobile ? 0.5 : 0.38); // slide left while exploded to make room for the labels
    tilt.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    stack.style.transform = `rotateX(${ax.toFixed(2)}deg) rotateY(${ay.toFixed(2)}deg) rotateZ(${az.toFixed(2)}deg)`;
    glare.style.backgroundPosition = `${(50 + mx * 30 - e * 40).toFixed(1)}% 0`;

    const layerAlpha = smooth(0, 0.12, e);
    const lblAlpha = (smooth(0.55, 0.95, e) * labelFade).toFixed(3);
    layers.forEach((L, k) => {
      const z = k * 1.5 + k * gap * e;
      L.style.transform = `translate3d(0,0,${z.toFixed(2)}px)`;
      if (k < 3) panes[k].style.opacity = layerAlpha.toFixed(3);
      // pin the label (plus its leader line) to the right edge of this layer as it moves in 3D
      // anchor low on the right edge: that's the part of each layer that peeks out from under the ones above
      const [lx, ly] = project(pw / 2, pw * 0.6, z, ax, ay, az, tx, ty);
      labels[k].style.opacity = lblAlpha;
      labels[k].style.transform =
        `translate3d(${(lx + (mobile ? 18 : 34)).toFixed(1)}px, ${ly.toFixed(1)}px, 0) translateY(-50%)`;
    });

    // ERP: SFA / CRM / HRM phones fly out around the core platform
    sats.forEach((s, k) => {
      const [dx, dy] = sats0[k];
      s.style.opacity = sat.toFixed(3);
      s.style.transform = `translate3d(${(dx * pw * sat).toFixed(1)}px, ${(dy * pw * 1.2 * sat).toFixed(1)}px, 0) scale(${(0.6 + 0.4 * sat).toFixed(3)})`;
    });
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---------- Bento reveal ----------
const bentoIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const k = [...en.target.parentElement.children].indexOf(en.target);
      en.target.style.transitionDelay = `${(k % 4) * 70}ms`;
      en.target.classList.add("in");
      bentoIO.unobserve(en.target);
    });
  },
  { threshold: 0.15 },
);
document.querySelectorAll(".b").forEach((b) => bentoIO.observe(b));

// ---------- Chat contact form (Formspree) ----------
const msgs = document.getElementById("msgs");
const composer = document.getElementById("composer");
const input = document.getElementById("chatInput");
const sendBtn = composer.querySelector("button");
const lead = { name: "", email: "", message: "" };
let chatStage = "name";

function addMsg(text, who) {
  const m = document.createElement("div");
  m.className = `msg ${who}`;
  m.textContent = text;
  msgs.appendChild(m);
  msgs.scrollTop = msgs.scrollHeight;
  return m;
}
function botSay(text, delay = 650) {
  return new Promise((res) => {
    const typing = document.createElement("div");
    typing.className = "msg them";
    typing.innerHTML = '<div class="typing"><i></i><i></i><i></i></div>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(
      () => {
        typing.remove();
        addMsg(text, "them");
        res();
      },
      reduceMotion ? 0 : delay,
    );
  });
}

let chatStarted = false;
async function startChat() {
  if (chatStarted) return;
  chatStarted = true;
  await botSay("Hey 👋 I'm Dipendra.", 500);
  await botSay(
    "I'm open to Flutter / full-stack roles and freelance work.",
  );
  await botSay("What's your name?");
}
new IntersectionObserver(
  ([en]) => {
    if (en.isIntersecting) startChat();
  },
  { threshold: 0.4 },
).observe(msgs);

composer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || chatStage === "sending" || chatStage === "done") return;
  addMsg(text, "me");
  input.value = "";

  if (chatStage === "name") {
    lead.name = text;
    chatStage = "email";
    input.type = "email";
    input.placeholder = "you@example.com";
    await botSay(`Nice to meet you, ${text}! What's your email?`);
  } else if (chatStage === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      await botSay("Hmm, that email doesn't look right. Try again?");
      return;
    }
    lead.email = text;
    chatStage = "message";
    input.type = "text";
    input.placeholder = "Your message…";
    await botSay("And what would you like to say?");
  } else if (chatStage === "message") {
    lead.message = text;
    chatStage = "sending";
    sendBtn.disabled = true;
    const status = document.createElement("div");
    status.className = "msg-status";
    status.textContent = "Sending…";
    msgs.appendChild(status);
    try {
      const fd = new FormData();
      fd.append("name", lead.name);
      fd.append("_replyto", lead.email);
      fd.append("message", lead.message);
      const res = await fetch("https://formspree.io/f/xkodewpj", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("send failed");
      status.textContent = "Delivered ✓✓";
      chatStage = "done";
      input.placeholder = "Message sent ✓";
      input.disabled = true;
      await botSay("Thanks! I'll get back to you soon. 🙌");
    } catch {
      status.textContent = "Not delivered";
      chatStage = "message";
      sendBtn.disabled = false;
      await botSay(
        "Hmm, that didn't go through. Try again, or WhatsApp me directly.",
      );
    }
  }
});

// ---------- Visitor stats (GoatCounter, cookie-free) ----------
// Off until you set your code, e.g. "dipendra" for https://dipendra.goatcounter.com.
// Local Live Server visits are never counted.
const GOATCOUNTER_CODE = "";
if (GOATCOUNTER_CODE && !["localhost", "127.0.0.1"].includes(location.hostname)) {
  const gc = document.createElement("script");
  gc.async = true;
  gc.src = "https://gc.zgo.at/count.js";
  gc.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.body.appendChild(gc);
}

// ---------- Optional FPS meter: add ?fps to the URL ----------
if (new URLSearchParams(location.search).has("fps")) {
  const fpsEl = document.getElementById("fps");
  fpsEl.style.display = "block";
  let n = 0,
    t0 = performance.now();
  (function loop(now) {
    n++;
    if (now - t0 >= 1000) {
      fpsEl.textContent = `${Math.round((n * 1000) / (now - t0))} fps`;
      n = 0;
      t0 = now;
    }
    requestAnimationFrame(loop);
  })(t0);
}
