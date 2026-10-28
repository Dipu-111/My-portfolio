// Phone app screens rebuilt from the Flutter code (SFA, CRM, ESS, PB Smart), with
// demo data only, plus the tap actions that make them interactive.
// Loaded before main.js; both are classic scripts sharing one global scope.

// ---------- Material icons used by the rebuilt app screens ----------
const ICONS = {
  menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
  cal: "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z",
  clock:
    "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
  login:
    "M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z",
  logout:
    "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  dash: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
  filter: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z",
  person:
    "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  money:
    "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
  task: "M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  chart: "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z",
  done: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z",
  hourglass:
    "M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z",
  trend:
    "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
  card: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
  cart: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
  factory: "M22 22H2V10l7-3v2l5-2v3h3l1-8h3l1 8v12z",
  target:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
};
const ic = (n) =>
  `<svg class="i" viewBox="0 0 24 24"><path d="${ICONS[n]}"/></svg>`;
const statusBar = (bg, fg) =>
  `<div class="sbar" style="background:${bg};color:${fg}"><span>9:41</span><span>▂▄▆ ▮</span></div>`;
const nowTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

// ---------- Screens rebuilt from the Flutter code (demo data only) ----------
// SFA: sales_force_automation_screen.dart
const sfaData = [
  {
    calls: [12, 15],
    visit: [8, 10],
    sales: ["Rs 42K", 70],
    coll: ["Rs 18K", 55],
  },
  {
    calls: [214, 300],
    visit: [160, 220],
    sales: ["Rs 9.4L", 78],
    coll: ["Rs 6.1L", 64],
  },
];
const sfaScreen = `
  <div class="app sfa">
    ${statusBar("#fff", "#000")}
    <div class="abar" style="background:#fff">${ic("menu")}<span>SFA Dashboard</span><span class="sp"></span>${ic("bell")}</div>
    <div class="abody">
<div class="attend">
  <div class="t">${ic("cal")} Attendance <span class="sp"></span><small data-today></small></div>
  <div class="cols">
    <div><small>Log In Time</small><b>09:12 AM</b><small>📍 Location</small></div>
    <div><small>Log Out Time</small><b data-out>--:--</b><small>📍 Location</small></div>
  </div>
  <button data-act="sfa-logout">Log Out</button>
</div>
<div class="card-w">
  <div class="ct"><span style="color:#155DFB;display:flex">${ic("target")}</span>Target vs Achieved</div>
  <div class="legend"><span><i style="background:#155DFC"></i>Target</span><span><i style="background:#2DB3DC"></i>Achieved</span></div>
  <div class="bars" data-bars>${'<div class="g"><span style="background:#155DFC"></span><span style="background:#2DB3DC"></span></div>'.repeat(4)}</div>
  <div class="bar-lbl"><span>Calls</span><span>Visit</span><span>Sales</span><span>Collections</span></div>
</div>
<div class="seg"><button class="on" data-act="sfa-tab" data-v="0">Today</button><button data-act="sfa-tab" data-v="1">MTD</button></div>
<div class="kpis" data-kpis></div>
<div class="tbl">
  <div class="tr th"><span>Customer</span><span>Order</span><span>Dispatch</span><span>Pending</span></div>
  <div class="tr"><span>Demo Traders</span><span>120</span><span>80</span><span>40</span></div>
</div>
    </div>
    <div class="bnav dark"><button class="on">${ic("dash")}SFA Dashboard</button><button data-act="goto" data-v="1">${ic("dash")}CRM Dashboard</button></div>
    <div class="toast-in"></div>
  </div>`;

function renderSfa(app, v) {
  const d = sfaData[v];
  const pct = (a, b) => Math.round((a / b) * 100);
  const ach = [pct(...d.calls), pct(...d.visit), d.sales[1], d.coll[1]];
  app.querySelectorAll("[data-bars] .g").forEach((g, k) => {
    g.children[0].style.height = "100%";
    g.children[1].style.height = `${ach[k]}%`;
  });
  app.querySelector("[data-kpis]").innerHTML = `
    <div class="kpi"><small>Calls</small><b>${d.calls[0]}/${d.calls[1]}</b></div>
    <div class="kpi"><small>Visit</small><b>${d.visit[0]}/${d.visit[1]}</b></div>
    <div class="kpi"><small>Sales</small><b>${d.sales[0]}</b></div>
    <div class="kpi"><small>Collections</small><b>${d.coll[0]}</b></div>`;
}

// CRM: pbrain_dashboard_view.dart + customer_card.dart + custom_lead_card.dart
const crmLeads = [
  {
    t: "Solar inverter supply",
    c: "Demo Hotels",
    due: "05-Nov-2026",
    days: "Due Days: 8",
    p: 45,
    s: "Pending",
  },
  {
    t: "Annual maintenance contract",
    c: "Sample Pharma",
    due: "20-Oct-2026",
    days: "Past Days: 8",
    p: 30,
    s: "Overdue",
  },
  {
    t: "Fleet tracking devices",
    c: "Test Logistics",
    due: "12-Oct-2026",
    days: "Ontime Close: 10-Oct",
    p: 100,
    s: "Closed",
  },
  {
    t: "ERP licence renewal",
    c: "Acme Agro",
    due: "30-Nov-2026",
    days: "Due Days: 33",
    p: 60,
    s: "Pending",
  },
  {
    t: "Printer fleet upgrade",
    c: "Demo Schools",
    due: "15-Oct-2026",
    days: "Past Days: 13",
    p: 20,
    s: "Overdue",
  },
];
const crmColor = {
  Pending: "#F57F57",
  Overdue: "#DE564C",
  Closed: "#4CAF50",
};
const metric = (key, n, pctTxt, w, grad, pc, icon) => `
  <button class="metric${key === "Total" ? " on" : ""}" data-act="crm-filter" data-v="${key}" style="background:${grad}">
    <div class="n">${n}${ic(icon)}</div>
    <small><span>${key} Leads</span><span>${pctTxt}</span></small>
    <div class="pb"><i style="width:${w}%;background:${pc}"></i></div>
  </button>`;
const crmScreen = `
  <div class="app crm">
    <div class="hdr">
${statusBar("transparent", "#fff")}
<div class="user"><span class="av">D</span>Demo User</div>
<div class="abar">${ic("menu")}<span>CRM DASHBOARD</span><span class="sp"></span><span class="chip-d">This Month ▾</span>${ic("bell")}</div>
<div class="range">This Month, 01 Oct - 31 Oct</div>
    </div>
    <div class="metrics">
${metric("Total", 48, "", 100, "linear-gradient(135deg, rgba(236,72,135,.4), rgb(185,84,164))", "rgb(185,84,164)", "chart")}
${metric("Closed", 21, "44%", 44, "linear-gradient(135deg, rgba(69,197,243,.4), rgb(102,146,217))", "rgb(102,146,217)", "done")}
${metric("Pending", 19, "40%", 40, "linear-gradient(135deg, rgba(254,184,44,.8), rgb(245,127,87))", "rgb(245,127,87)", "clock")}
${metric("Overdue", 8, "17%", 17, "linear-gradient(135deg, rgb(233,155,148), rgb(222,86,76))", "rgb(166,37,37)", "hourglass")}
    </div>
    <div class="todo tap" data-act="crm-todo"><b>To-do List</b><span>View All</span></div>
    <div class="sec-t"><span data-sec>All Leads</span><a>View All</a></div>
    <div data-leads></div>
    <button class="fab" data-act="toast" data-v="Opening new lead form…">${ic("add")}Lead</button>
    <div class="bnav dark"><button data-act="goto" data-v="0">${ic("dash")}SFA Dashboard</button><button class="on">${ic("dash")}CRM Dashboard</button></div>
    <div class="scrim" data-act="close-sheet"></div><div class="sheet" data-sheet></div>
    <div class="toast-in"></div>
  </div>`;

function renderCrm(app, filter) {
  const list = crmLeads
    .filter((l) => filter === "Total" || l.s === filter)
    .slice(0, 3);
  app.querySelector("[data-sec]").textContent =
    filter === "Total" ? "All Leads" : `${filter} Leads`;
  app.querySelector("[data-leads]").innerHTML = list
    .map(
      (l) => `
    <div class="lead tap" data-act="toast" data-v="Opening lead timeline…">
<span class="la" style="background:${crmColor[l.s]}">${l.c[0]}</span>
<div class="lt"><b>${l.t}</b><span>Customer: </span>${l.c}<br><span>Due Date: </span>${l.due}<br><span>${l.days}</span></div>
<span class="pct" style="--p:${l.p}%">${l.p}%</span>
    </div>`,
    )
    .join("");
}

// ESS: ess/screen/ess_dashboard.dart + ess_navigation_screen.dart
const essChips = [
  ["Present", 18, "#88E788", "#46B446"],
  ["Absent", 1, "#FF5F5F", "#B72225"],
  ["Leave", 2, "#C17AFF", "#980FFA"],
  ["Holiday", 3, "#00D2F2", "#0092B8"],
  ["Overtime", 4, "#99A1AE", "#495565"],
  ["Late Arrival", 2, "#FDC700", "#FF6800"],
  ["Early\nDeparture", 1, "#FAFF00", "#9C9E20"],
  ["Part-Time", 0, "#88D8E7", "#3BA9C0"],
];
const qaBtn = (act, label, g1, g2, color, icon) =>
  `<button data-act="${act}" style="background:linear-gradient(135deg,${g1},${g2})"><span style="color:${color};display:flex">${ic(icon)}</span>${label}</button>`;
const essScreen = `
  <div class="app ess">
    ${statusBar("#fff", "#000")}
    <div class="abar">DASHBOARD</div>
    <div class="abody">
<div class="seg"><button class="on" data-act="ess-day" data-v="0">Today</button><button data-act="ess-day" data-v="1">Yesterday</button></div>
<div class="att">
  <div class="t">${ic("clock")} Attendance <span class="sp"></span><small data-date></small></div>
  <div class="clock" data-clock>--:--</div>
  <small data-status>Not checked in yet</small>
  <div class="btns"><button data-act="ess-in">Check In</button><button class="ghost" data-act="ess-out" disabled>Check Out</button></div>
</div>
<div class="mini3">
  <div style="background:#EFF6FF"><b style="color:#1447E6" data-hours>0.0</b>Hours</div>
  <div style="background:linear-gradient(135deg,#F0FDF4,#DBFBE6)"><b style="color:#008235">4/5</b>This Week</div>
  <div style="background:linear-gradient(135deg,#FAF5FE,#F2E7FE)"><b style="color:#8200DA">96%</b>Attendance</div>
</div>
<div class="chips8">${essChips.map(([l, n, a, b]) => `<div><i style="background:linear-gradient(135deg,${a},${b})">${n}</i>${l}</div>`).join("")}</div>
<div class="qa-t">Quick Actions</div>
<div class="qa">
  ${qaBtn("ess-action", "Check\nIn/Out", "#EEF5FE", "#DAEAFE", "#2B7FFF", "clock")}
  ${qaBtn("ess-leave", "Apply\nLeave", "#F5ECFF", "#EAD7FF", "#AD46FF", "cal")}
  ${qaBtn("ess-loan", "Loan\nAdvance", "#E8FEEB", "#D3FAD8", "#00A63E", "money")}
  ${qaBtn("ess-task", "Assigned\nTask", "#FFF7ED", "#FFEDD5", "#FF6800", "task")}
</div>
    </div>
    <div class="bnav white"><button class="on">${ic("home")}Dashboard</button><button data-act="toast" data-v="Opening calendar…">${ic("cal")}Calendar</button><button data-act="toast" data-v="Opening profile…">${ic("person")}Profile</button></div>
    <div class="scrim" data-act="close-sheet"></div><div class="sheet" data-sheet></div>
    <div class="toast-in"></div>
  </div>`;

// PB Smart: dashboard/screens/dashboard_page.dart + sales_section.dart + quick_info_section_components/*
const xt = (title, rows, open, head) => `
  <div class="xt${open ? " open" : ""}">
    <div class="xh" data-act="xt-toggle" ${head ? `style="background:${head}"` : ""}><span>${title}</span><span>${open ? "−" : "+"}</span></div>
    <div class="xb">${rows.map(([k, v, cls]) => `<div class="r2"><span>${k}</span><b class="${cls || ""}">${v}</b></div>`).join("")}</div>
  </div>`;
const pbsPanes = {
  sales: `
    <div class="card-w">
<div class="pt">Monthly Target Analysis</div>
<div class="gauges">
  <div class="gauge"><div class="g" style="--c:#F44336;--p:100%"></div><b>Rs 1.2 Cr</b>Target</div>
  <div class="gauge"><div class="g" style="--c:#2196F3;--p:72%"></div><b>Rs 86 L</b>Achieved 72%</div>
</div>
    </div>
    <div class="pt">Quick Info</div>
    <div class="qi">
${[
  ["Today", "4,25,000"],
  ["Yesterday", "3,90,500"],
  ["This Week", "18,40,000"],
  ["This Month", "86,10,000"],
]
  .map(
    ([d, a]) =>
      `<button data-act="pbs-report"><b>${d}</b><small>Amount: Rs ${a}</small></button>`,
  )
  .join("")}
    </div>
    <div class="card-w"><div class="pt">Monthly Sales</div><div class="mchart">${[48, 60, 52, 74, 66, 82, 70, 90].map((h) => `<span style="height:${h}%"></span>`).join("")}</div></div>`,
  collection:
    xt(
      "CASH IN HAND",
      [
        ["TDay Paid :", "1,25,000", "neg"],
        ["TDay Rec :", "3,40,000", "pos"],
        ["MTD Paid :", "22,10,000", "neg"],
        ["MTD Rec :", "31,75,000", "pos"],
        ["MTD Deviation", "+9,65,000", "pos"],
      ],
      true,
    ) +
    xt("PDC", [
      ["Due Today", "2"],
      ["This Week", "7"],
      ["Amount", "Rs 6,40,000"],
    ]) +
    xt("Customer BG", [
      ["Active BG", "14"],
      ["Expiring (30d)", "3", "neg"],
    ]),
  payment:
    xt(
      "SELLING & DISTRIBUTION EXP",
      [
        ["Today", "45,000"],
        ["MTD", "6,20,000"],
        ["Budget used", "62%"],
      ],
      true,
    ) +
    xt("FINANCIAL EXP ANALYSIS", [
      ["Interest", "2,10,000"],
      ["Bank charges", "18,500"],
    ]) +
    xt("VAT STATUS", [
      ["Output VAT", "11,20,000"],
      ["Input VAT", "8,45,000"],
      ["Payable", "2,75,000", "neg"],
    ]),
  purchase:
    `
    <div class="card-w"><div class="pt">Monthly Purchase</div><div class="mchart">${[40, 62, 55, 80, 48, 70, 90, 66].map((h) => `<span style="height:${h}%"></span>`).join("")}</div></div>` +
    xt(
      "PURCHASE -RM (QTY)",
      [
        ["Today", "120 MT"],
        ["MTD", "2,450 MT"],
      ],
      true,
    ) +
    xt("PURCHASE -EXCL RM (VALUE)", [
      ["Today", "3,10,000"],
      ["MTD", "41,00,000"],
    ]),
  production:
    xt(
      "Today Dispatch Status",
      [
        ["Total Vehicle :", "24"],
        ["Export Sales-MT :", "120"],
        ["Local Sales-MT:", "310"],
        ["LC Sales -MT :", "45"],
        ["Total Sales Qty - MT :", "475"],
        ["Avg per truck :", "19.8"],
        ["Pending MLS :", "3", "neg"],
      ],
      true,
      "rgba(50,200,112,.75)",
    ) +
    `<div class="card-w"><div class="pt">Production</div><div class="mchart">${[55, 70, 62, 85, 74, 90].map((h) => `<span style="height:${h}%"></span>`).join("")}</div></div>`,
};
const pbsTab = (key, label, icon, on) =>
  `<button class="${on ? "on" : ""}" data-act="pbs-tab" data-v="${key}">${ic(icon)}${label}</button>`;
const pbsScreen = `
  <div class="app pbs">
    <div class="top">
${statusBar("#2196F3", "#fff")}
<div class="abar">${ic("menu")}<span>Dashboard</span><span class="sp"></span>${ic("filter")}${ic("bell")}</div>
<div class="mq">Management Quick Info</div>
<div class="tabs">
  ${pbsTab("sales", "Sales", "trend", true)}${pbsTab("collection", "Collection", "money")}${pbsTab("payment", "Payment", "card")}
  ${pbsTab("purchase", "Purchase", "cart")}${pbsTab("production", "Production", "factory")}
</div>
    </div>
    <div class="abody" data-pane>${pbsPanes.sales}</div>
    <div class="scrim" data-act="close-sheet"></div><div class="sheet" data-sheet></div>
    <div class="toast-in"></div>
  </div>`;

// ---------- Phone screens, matched to projects.json by id ----------
const phoneScreens = {
  sfa: {
    screen: sfaScreen,
    init: (app) => {
      app.querySelector("[data-today]").textContent =
        new Date().toLocaleDateString([], {
          day: "numeric",
          month: "short",
        });
      renderSfa(app, 0);
    },
  },
  crm: { screen: crmScreen, init: (app) => renderCrm(app, "Total") },
  ess: {
    screen: essScreen,
    init: (app) => {
      app.querySelector("[data-date]").textContent =
        new Date().toLocaleDateString([], {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
    },
  },
  pbsmart: { screen: pbsScreen },
};

// ---------- Tap actions inside the rebuilt app screens ----------
const toastTimers = new WeakMap();
function toastIn(app, msg) {
  const t = app.querySelector(".toast-in");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimers.get(t));
  toastTimers.set(
    t,
    setTimeout(() => t.classList.remove("show"), 1600),
  );
}
function openSheet(app, html) {
  app.querySelector("[data-sheet]").innerHTML =
    html + '<button class="close" data-act="close-sheet">Close</button>';
  app.querySelector("[data-sheet]").classList.add("open");
  app.querySelector(".scrim").classList.add("open");
}
function closeSheet(app) {
  app.querySelector("[data-sheet]")?.classList.remove("open");
  app.querySelector(".scrim")?.classList.remove("open");
}
function setSeg(btn) {
  btn.parentElement
    .querySelectorAll("button")
    .forEach((b) => b.classList.toggle("on", b === btn));
}

function essCheckIn(app) {
  const btnIn = app.querySelector('[data-act="ess-in"]');
  if (btnIn.disabled) return;
  btnIn.disabled = true;
  btnIn.textContent = "Fetching Location";
  setTimeout(() => {
    app.querySelector("[data-clock]").textContent = nowTime();
    app.querySelector("[data-status]").textContent =
      "✓ Checked in · On Time · 📍 Office";
    btnIn.textContent = "Checked In";
    app.querySelector('[data-act="ess-out"]').disabled = false;
    toastIn(app, "Check in successful");
  }, 900);
}
function essCheckOut(app) {
  const btnOut = app.querySelector('[data-act="ess-out"]');
  if (btnOut.disabled) return;
  btnOut.disabled = true;
  btnOut.textContent = "Fetching Location";
  setTimeout(() => {
    btnOut.textContent = "Checked Out";
    app.querySelector("[data-status]").textContent =
      `✓ Checked out at ${nowTime()}`;
    app.querySelector("[data-hours]").textContent = "8.2";
    toastIn(app, "Check out successful");
  }, 900);
}

const actions = {
  goto: (el) =>
    renderApp(projects[+el.dataset.v], el.closest(".screen-inner")),
  toast: (el, app) => toastIn(app, el.dataset.v),
  "close-sheet": (el, app) => closeSheet(app),
  "sfa-tab": (el, app) => {
    setSeg(el);
    renderSfa(app, +el.dataset.v);
  },
  "sfa-logout": (el, app) => {
    app.querySelector("[data-out]").textContent = nowTime();
    el.textContent = "Logged out ✓";
    el.disabled = true;
    toastIn(app, "Location captured, logged out");
  },
  "crm-filter": (el, app) => {
    setSeg(el);
    renderCrm(app, el.dataset.v);
  },
  "crm-todo": (el, app) =>
    openSheet(
      app,
      `<h4>To-do List</h4>
    ${["Call Demo Hotels about quotation", "Send AMC renewal PDF", "Follow up on overdue lead"].map((t) => `<div class="task" data-act="task"><i></i><span>${t}</span></div>`).join("")}`,
    ),
  task: (el) => {
    el.classList.toggle("done");
    el.querySelector("i").textContent = el.classList.contains("done")
      ? "✓"
      : "";
  },
  "ess-day": (el, app) => {
    setSeg(el);
    const y = el.dataset.v === "1";
    const [inBtn, outBtn] = app.querySelectorAll(".att .btns button");
    app.querySelector("[data-clock]").textContent = y
      ? "09:02 → 17:45"
      : "--:--";
    app.querySelector("[data-status]").textContent = y
      ? "On Time · 8.7 hrs"
      : "Not checked in yet";
    app.querySelector("[data-hours]").textContent = y ? "8.7" : "0.0";
    inBtn.disabled = y;
    outBtn.disabled = true;
    inBtn.textContent = "Check In";
    outBtn.textContent = "Check Out";
  },
  "ess-in": (el, app) => essCheckIn(app),
  "ess-out": (el, app) => essCheckOut(app),
  "ess-action": (el, app) =>
    openSheet(
      app,
      `<h4>Select Action</h4>
    <div class="act2">
<button data-act="ess-sheet-in" style="background:linear-gradient(135deg,#E8F8EF,#C9F0DA)"><span style="color:#27AE60;display:flex">${ic("login")}</span>Check\nIN</button>
<button data-act="ess-sheet-out" style="background:linear-gradient(135deg,#FFEBEE,#FFCDD2)"><span style="color:#E57373;display:flex">${ic("logout")}</span>Check\nOUT</button>
    </div>`,
    ),
  "ess-sheet-in": (el, app) => {
    closeSheet(app);
    essCheckIn(app);
  },
  "ess-sheet-out": (el, app) => {
    closeSheet(app);
    essCheckOut(app);
  },
  "ess-leave": (el, app) =>
    openSheet(
      app,
      `<h4>Leave Balance</h4>
    <div class="tbl c3"><div class="tr th"><span>Type</span><span>Taken</span><span>Balance</span></div>
<div class="tr"><span>Annual</span><span>5</span><span>9</span></div>
<div class="tr"><span>Sick</span><span>1</span><span>5</span></div>
<div class="tr"><span>Casual</span><span>2</span><span>4</span></div></div>
    <button class="close" style="background:#AD46FF" data-act="ess-leave-send">Apply Leave</button>`,
    ),
  "ess-leave-send": (el, app) => {
    closeSheet(app);
    toastIn(app, "Leave request sent for approval");
  },
  "ess-loan": (el, app) =>
    openSheet(
      app,
      `<h4>Loan / Advance</h4>
    <div class="tbl c3"><div class="tr th"><span>Amount</span><span>Deduction</span><span>Balance</span></div>
<div class="tr"><span>50,000</span><span>5,000</span><span>30,000</span></div></div>
    <button class="close" style="background:#00A63E" data-act="ess-loan-send">Request Advance</button>`,
    ),
  "ess-loan-send": (el, app) => {
    closeSheet(app);
    toastIn(app, "Advance request submitted");
  },
  "ess-task": (el, app) =>
    openSheet(
      app,
      `<h4>Assigned Task</h4>
    ${["Submit monthly report", "Update customer KYC", "Team meeting at 3 PM"].map((t) => `<div class="task" data-act="task"><i></i><span>${t}</span></div>`).join("")}`,
    ),
  "pbs-tab": (el, app) => {
    setSeg(el);
    app.querySelector("[data-pane]").innerHTML = pbsPanes[el.dataset.v];
  },
  "pbs-report": (el, app) =>
    openSheet(
      app,
      `<h4>Select Report Type</h4><div class="rlist">
    ${[
"Customer Wise Report",
"Dealer Wise Report",
"Product Group Wise Report",
"Product Wise Report",
"Area Wise Report",
    ]
.map((r) => `<button data-act="pbs-open" data-v="${r}">${r}</button>`)
.join("")}</div>`,
    ),
  "pbs-open": (el, app) => {
    closeSheet(app);
    toastIn(app, `Opening ${el.dataset.v}…`);
  },
  "xt-toggle": (el) => {
    const box = el.parentElement;
    box.classList.toggle("open");
    el.lastElementChild.textContent = box.classList.contains("open")
      ? "−"
      : "+";
  },
};
