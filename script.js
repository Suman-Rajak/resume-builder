(function () {
  "use strict";

  /* ---------- Icons ---------- */
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    up: svg('<path d="M12 19V5M5 12l7-7 7 7"/>'),
    down: svg('<path d="M12 5v14M5 12l7 7 7-7"/>'),
    remove: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    grip: svg('<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>')
  };

  /* ---------- Section definitions ---------- */
  const bulletsHint = "One point per line. Each line becomes a bullet.";
  const META = {
    skills: { title: "Skills" },
    experience: {
      title: "Experience", item: "Experience", addLabel: "Add experience",
      fields: [
        { k: "title", l: "Job title", w: "half", req: true, ph: "e.g. Frontend Intern" },
        { k: "company", l: "Company", w: "half", req: true, ph: "e.g. Acme Labs" },
        { k: "location", l: "Location", w: "full", ph: "e.g. Remote or Kolkata" },
        { k: "start", l: "Start date", w: "third", ph: "Jun 2024" },
        { k: "end", l: "End date", w: "third", ph: "Dec 2024" },
        { k: "present", t: "present", l: "I work here now", w: "third" },
        { k: "points", t: "textarea", l: "Description", w: "full", hint: bulletsHint, ph: "Built the checkout page in React\nCut page load time by 30%" }
      ]
    },
    education: {
      title: "Education", item: "Education", addLabel: "Add education",
      fields: [
        { k: "institution", l: "Institution", w: "full", req: true, ph: "e.g. Jadavpur University" },
        { k: "degree", l: "Degree or course", w: "half", req: true, ph: "e.g. B.Tech" },
        { k: "field", l: "Field of study", w: "half", ph: "e.g. Computer Science" },
        { k: "start", l: "Start", w: "third", ph: "2021" },
        { k: "end", l: "End", w: "third", ph: "2025" },
        { k: "grade", l: "Grade or CGPA", w: "third", ph: "8.6 / 10" }
      ]
    },
    projects: {
      title: "Projects", item: "Project", addLabel: "Add project",
      fields: [
        { k: "name", l: "Project name", w: "full", req: true, ph: "e.g. Expense Tracker" },
        { k: "link", t: "url", l: "Project link", w: "half", ph: "myapp.com" },
        { k: "sourceLink", t: "url", l: "Source code link", w: "half", ph: "github.com/you/repo" },
        { k: "tech", l: "Tech used", w: "full", ph: "React, Node, MongoDB" },
        { k: "points", t: "textarea", l: "Description", w: "full", hint: bulletsHint, ph: "Tracks spending by category\nExports monthly reports as CSV" }
      ]
    },
    awards: {
      title: "Awards", item: "Award", addLabel: "Add award",
      fields: [
        { k: "title", l: "Title", w: "half", req: true, ph: "e.g. Smart India Hackathon winner" },
        { k: "date", l: "Date", w: "half", ph: "Mar 2024" },
        { k: "issuer", l: "Issuer or organisation", w: "full", ph: "e.g. Ministry of Education" },
        { k: "description", t: "textarea", l: "Short description", w: "full", ph: "What you won it for" }
      ]
    },
    volunteering: {
      title: "Volunteering", item: "Volunteering", addLabel: "Add volunteering",
      fields: [
        { k: "role", l: "Role", w: "half", req: true, ph: "e.g. Event Coordinator" },
        { k: "organisation", l: "Organisation", w: "half", req: true, ph: "e.g. NSS" },
        { k: "start", l: "Start date", w: "third", ph: "Aug 2023" },
        { k: "end", l: "End date", w: "third", ph: "Mar 2024" },
        { k: "present", t: "present", l: "I volunteer here now", w: "third" },
        { k: "points", t: "textarea", l: "Description", w: "full", hint: bulletsHint, ph: "Organised a blood donation camp for 200+ donors" }
      ]
    }
  };
  const DEFAULT_ORDER = ["skills", "experience", "education", "projects", "awards", "volunteering"];
  const OPTIONAL = ["awards", "volunteering"];

  function blank(sec) {
    const o = {};
    META[sec].fields.forEach(f => { o[f.k] = f.t === "present" ? false : ""; });
    return o;
  }

  /* ---------- Resume templates ---------- */
  // Each template's look lives in style.css under .tpl-<id>.
  // `side` lists the sections that go in the left column (two-column layouts only).
  // `thumb` is the picker thumbnail: [class, x, y, width, height] bars on a 30×42 mini page.
  const stack = (x, y, ws, cls = "m", h = 1, step = 2.2) => ws.map((w, i) => [cls, x, +(y + i * step).toFixed(2), w, h]);
  const TEMPLATES = [
    {
      id: "classic", name: "Classic", desc: "Serif type with ruled section headings",
      thumb: [
        ["k", 4, 4, 14, 2.6], ["m", 4, 8, 20, 1],
        ["k", 4, 12, 8, 1.5], ["k", 4, 14.3, 22, .4], ...stack(4, 16, [22, 19, 21]),
        ["k", 4, 24, 8, 1.5], ["k", 4, 26.3, 22, .4], ...stack(4, 28, [22, 20, 17])
      ]
    },
    {
      id: "modern", name: "Modern", desc: "Clean sans-serif with a colour accent",
      thumb: [
        ["k", 4, 4, 15, 2.8], ["m", 4, 8.2, 18, 1], ["a", 4, 11, 22, .9],
        ["a", 4, 14, 7, 1.3], ["l", 12, 14.45, 14, .4], ...stack(4, 16.5, [22, 18, 20]),
        ["a", 4, 25, 7, 1.3], ["l", 12, 25.45, 14, .4], ...stack(4, 27.5, [22, 21, 16])
      ]
    },
    {
      id: "minimal", name: "Minimal", desc: "Centred header, light and airy",
      thumb: [
        ["k", 9, 5, 12, 2.2], ["m", 6.5, 9, 17, .9],
        ["l", 4, 13, 22, .3], ["g", 4, 15.5, 6, .9], ...stack(4, 18, [22, 19, 21], "m", .9),
        ["l", 4, 26, 22, .3], ["g", 4, 28.5, 6, .9], ...stack(4, 31, [22, 18], "m", .9)
      ]
    },
    {
      id: "compact", name: "Compact", desc: "Headings in a side gutter. Fits more on one page",
      thumb: [
        ["k", 4, 4, 13, 2.4], ["m", 4, 7.6, 22, .9],
        ["k", 4, 10.5, 22, .4], ["k", 4, 12, 5, 1.2], ...stack(11, 12, [15, 13, 15, 12], "m", .9, 1.8),
        ["k", 4, 19.8, 22, .4], ["k", 4, 21.3, 5, 1.2], ...stack(11, 21.3, [15, 14, 11, 15], "m", .9, 1.8),
        ["k", 4, 29.1, 22, .4], ["k", 4, 30.6, 5, 1.2], ...stack(11, 30.6, [15, 12, 14], "m", .9, 1.8)
      ]
    },
    {
      id: "sidebar", name: "Sidebar", desc: "Two columns, with contact, skills and education on the left",
      side: ["skills", "education"],
      thumb: [
        ["k", 4, 4, 14, 2.6], ["m", 4, 8, 18, .9],
        ["s", 3, 11.5, 9, 27.5],
        ["a", 4.5, 13.5, 5, 1.1], ...stack(4.5, 15.5, [6, 5, 6], "m", .9, 1.8),
        ["a", 4.5, 22, 5, 1.1], ...stack(4.5, 24, [6, 4.5, 5.5], "m", .9, 1.8),
        ["a", 14, 11.5, 7, 1.3], ["l", 14, 13.4, 12, .3], ...stack(14, 14.8, [12, 10, 12, 11], "m", .9, 2),
        ["a", 14, 24, 7, 1.3], ["l", 14, 25.9, 12, .3], ...stack(14, 27.3, [12, 11, 9], "m", .9, 2)
      ]
    }
  ];

  /* ---------- State ---------- */
  const state = {
    personal: { name: "", email: "", address: "" },
    links: { github: "", linkedin: "", portfolio: "", leetcode: "" },
    about: "",
    skills: { mode: "grouped", groups: [{ category: "", items: "" }], simple: "" },
    experience: [blank("experience")],
    education: [blank("education")],
    projects: [blank("projects")],
    awards: [],
    volunteering: [],
    sectionOrder: DEFAULT_ORDER.slice(),
    template: TEMPLATES[0].id
  };

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setPath(path, val) {
    const ks = path.split(".");
    let o = state;
    for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
    o[ks[ks.length - 1]] = val;
  }
  function move(arr, from, to) {
    if (to < 0 || to >= arr.length || from === to) return false;
    const [x] = arr.splice(from, 1);
    arr.splice(to, 0, x);
    return true;
  }
  function normUrl(u) {
    u = (u || "").trim();
    if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = "https://" + u.replace(/^\/+/, "");
    try {
      const x = new URL(u);
      return /^https?:$/.test(x.protocol) && x.hostname.includes(".") ? x.href : "";
    } catch { return ""; }
  }
  const shortUrl = (href) => href.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
  const link = (href, text) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>`;
  const lines = (s) => (s || "").split("\n").map(x => x.trim()).filter(Boolean);
  const csv = (s) => (s || "").split(",").map(x => x.trim()).filter(Boolean).join(", ");

  function hasContent(obj) {
    return Object.values(obj).some(v => typeof v === "string" ? v.trim() !== "" : false);
  }
  function isSectionEmpty(sec) {
    if (sec === "skills") {
      const s = state.skills;
      return s.mode === "grouped" ? !s.groups.some(g => csv(g.items)) : !csv(s.simple);
    }
    return !state[sec].some(hasContent);
  }
  function cardLabel(sec, it, i) {
    const first = META[sec].fields[0].k;
    return (it[first] || "").trim() || `${META[sec].item} ${i + 1}`;
  }
  function dateRange(s, e, present) {
    const end = present ? "Present" : (e || "").trim();
    s = (s || "").trim();
    return s && end ? `${s} – ${end}` : (s || end);
  }

  /* ---------- Form rendering (reorderable part) ---------- */
  function sectionHead(sec, idx, n, extra = "") {
    const m = META[sec];
    const opt = OPTIONAL.includes(sec) ? ' <span class="opt">(optional)</span>' : "";
    return `<div class="section-head">
      <h2 id="h-${sec}">${m.title}${opt}</h2>${extra}
      <button type="button" class="btn icon-btn" data-action="sec-up" data-sec="${sec}" aria-label="Move ${m.title} section up" ${idx === 0 ? "disabled" : ""}>${ICON.up}</button>
      <button type="button" class="btn icon-btn" data-action="sec-down" data-sec="${sec}" aria-label="Move ${m.title} section down" ${idx === n - 1 ? "disabled" : ""}>${ICON.down}</button>
    </div>`;
  }

  function fieldHTML(sec, i, f, it) {
    const id = `${sec}-${i}-${f.k}`;
    const path = `${sec}.${i}.${f.k}`;
    const w = "f-" + (f.w || "full");
    if (f.t === "present") {
      return `<label class="check ${w}"><input type="checkbox" id="${id}" data-path="${path}" ${it.present ? "checked" : ""}> ${f.l}</label>`;
    }
    const req = f.req ? ' <span class="req" aria-hidden="true">*</span>' : "";
    const desc = f.hint ? ` aria-describedby="${id}-hint"` : "";
    const hint = f.hint ? `<span class="hint" id="${id}-hint">${f.hint}</span>` : "";
    const disabled = f.k === "end" && it.present ? " disabled" : "";
    const ctrl = f.t === "textarea"
      ? `<textarea id="${id}" data-path="${path}" rows="3" placeholder="${esc(f.ph || "")}"${desc}>${esc(it[f.k])}</textarea>`
      : `<input type="${f.t === "url" ? "url" : "text"}" id="${id}" data-path="${path}" value="${esc(it[f.k])}" placeholder="${esc(f.ph || "")}"${f.req ? " required" : ""}${disabled}${desc}>`;
    return `<div class="field ${w}"><label for="${id}">${f.l}${req}</label>${ctrl}${hint}</div>`;
  }

  function cardHTML(sec, it, i, n) {
    const m = META[sec];
    const name = esc(cardLabel(sec, it, i));
    return `<div class="card" id="card-${sec}-${i}">
      <div class="card-head">
        <h3 id="ch-${sec}-${i}">${name}</h3>
        <button type="button" class="btn icon-btn" data-action="card-up" data-sec="${sec}" data-i="${i}" aria-label="Move ${name} up" ${i === 0 ? "disabled" : ""}>${ICON.up}</button>
        <button type="button" class="btn icon-btn" data-action="card-down" data-sec="${sec}" data-i="${i}" aria-label="Move ${name} down" ${i === n - 1 ? "disabled" : ""}>${ICON.down}</button>
        <button type="button" class="btn icon-btn danger" data-action="card-remove" data-sec="${sec}" data-i="${i}" aria-label="Remove ${name}">${ICON.remove}</button>
      </div>
      <div class="card-body"><div class="grid">${m.fields.map(f => fieldHTML(sec, i, f, it)).join("")}</div></div>
    </div>`;
  }

  function skillsHTML(idx, n) {
    const s = state.skills;
    const toggle = `<div class="segmented" role="group" aria-label="Skills format">
      <button type="button" data-action="skill-mode" data-mode="grouped" aria-pressed="${s.mode === "grouped"}">Grouped</button>
      <button type="button" data-action="skill-mode" data-mode="simple" aria-pressed="${s.mode === "simple"}">Simple list</button>
    </div>`;
    let body;
    if (s.mode === "grouped") {
      const rows = s.groups.map((g, i) => `<div class="skill-row">
          <input type="text" data-path="skills.groups.${i}.category" value="${esc(g.category)}" placeholder="e.g. Languages" aria-label="Category ${i + 1}">
          <input type="text" class="skill-items" data-path="skills.groups.${i}.items" value="${esc(g.items)}" placeholder="e.g. C, C++, Python" aria-label="Skills in category ${i + 1}, comma separated">
          <button type="button" class="btn icon-btn danger" data-action="skill-remove" data-i="${i}" aria-label="Remove skill group ${i + 1}" ${s.groups.length === 1 ? "disabled" : ""}>${ICON.remove}</button>
        </div>`).join("");
      body = `<div class="skill-groups">
          <div class="skill-row skill-labels" aria-hidden="true"><span>Category</span><span>Skills (comma separated)</span><span></span></div>
          ${rows}
        </div>
        <button type="button" class="btn btn-ghost add-btn" data-action="skill-add">${ICON.plus} Add skill group</button>`;
    } else {
      body = `<div class="field">
          <label for="skills-simple">All skills</label>
          <textarea id="skills-simple" data-path="skills.simple" rows="3" placeholder="C, C++, HTML, CSS, React, Git, Docker" aria-describedby="skills-simple-hint">${esc(s.simple)}</textarea>
          <span class="hint" id="skills-simple-hint">Separate skills with commas.</span>
        </div>`;
    }
    return `<section class="section" aria-labelledby="h-skills">${sectionHead("skills", idx, n)}<div class="section-body">${toggle}${body}</div></section>`;
  }

  function sectionHTML(sec, idx, n) {
    if (sec === "skills") return skillsHTML(idx, n);
    const m = META[sec], items = state[sec];
    const addBtn = (cls) => `<button type="button" class="btn btn-ghost ${cls}" data-action="add" data-sec="${sec}">${ICON.plus} ${m.addLabel}</button>`;
    if (OPTIONAL.includes(sec) && items.length === 0) {
      return `<section class="section is-empty" aria-labelledby="h-${sec}">${sectionHead(sec, idx, n, addBtn(""))}</section>`;
    }
    return `<section class="section" aria-labelledby="h-${sec}">
      ${sectionHead(sec, idx, n)}
      <div class="section-body">${items.map((it, i) => cardHTML(sec, it, i, items.length)).join("")}${addBtn("add-btn")}</div>
    </section>`;
  }

  function renderSections() {
    const n = state.sectionOrder.length;
    $("#sections").innerHTML = state.sectionOrder.map((sec, idx) => sectionHTML(sec, idx, n)).join("");
  }

  /* ---------- Template picker ---------- */
  const thumbSVG = (rects) => `<svg viewBox="0 0 30 42" aria-hidden="true">${rects.map(([c, x, y, w, h]) => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx=".4"/>`).join("")}</svg>`;
  function renderTemplatePicker() {
    $("#tpl-list").innerHTML = TEMPLATES.map(t => `<button type="button" class="tpl-btn" data-action="template" data-tpl="${t.id}" aria-pressed="${t.id === state.template}" title="${t.desc}">
        ${thumbSVG(t.thumb)}<span>${t.name}</span>
      </button>`).join("");
  }

  /* ---------- Resume preview ---------- */
  const R = {
    skills() {
      const s = state.skills;
      let inner = "";
      if (s.mode === "grouped") {
        inner = s.groups.filter(g => csv(g.items)).map(g =>
          g.category.trim() ? `<p><strong>${esc(g.category.trim())}:</strong> ${esc(csv(g.items))}</p>` : `<p>${esc(csv(g.items))}</p>`
        ).join("");
      } else if (csv(s.simple)) {
        inner = `<p>${esc(csv(s.simple))}</p>`;
      }
      return inner ? `<div class="r-skills">${inner}</div>` : "";
    },
    experience(it) {
      const head = [it.title, it.company].map(x => x.trim()).filter(Boolean);
      const headHTML = head.length === 2 ? `<span class="r-title">${esc(head[0])}</span>, ${esc(head[1])}` : `<span class="r-title">${esc(head[0] || "")}</span>`;
      return entry(headHTML, dateRange(it.start, it.end, it.present), it.location.trim(), bullets(it.points));
    },
    education(it) {
      const deg = [it.degree, it.field].map(x => x.trim()).filter(Boolean).join(" in ");
      const sub = [deg, it.grade.trim() && `Grade: ${it.grade.trim()}`].filter(Boolean).join(", ");
      return entry(`<span class="r-title">${esc(it.institution)}</span>`, dateRange(it.start, it.end, false), sub, "");
    },
    projects(it) {
      const href = normUrl(it.link), src = normUrl(it.sourceLink);
      let name = esc(it.name.trim() || "Untitled project");
      name = `<span class="r-title">${href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${name}</a>` : name}</span>`;
      if (src) name += `<span class="r-code">[${link(src, "Code")}]</span>`;
      return entry(name, "", csv(it.tech), bullets(it.points));
    },
    awards(it) {
      const desc = it.description.trim() ? `<p>${esc(it.description.trim())}</p>` : "";
      return entry(`<span class="r-title">${esc(it.title)}</span>`, it.date.trim(), it.issuer.trim(), desc);
    },
    volunteering(it) {
      const head = [it.role, it.organisation].map(x => x.trim()).filter(Boolean);
      const headHTML = head.length === 2 ? `<span class="r-title">${esc(head[0])}</span>, ${esc(head[1])}` : `<span class="r-title">${esc(head[0] || "")}</span>`;
      return entry(headHTML, dateRange(it.start, it.end, it.present), "", bullets(it.points));
    }
  };
  function bullets(text) {
    const ls = lines(text);
    return ls.length ? `<ul>${ls.map(l => `<li>${esc(l.replace(/^[-•*]\s*/, ""))}</li>`).join("")}</ul>` : "";
  }
  function entry(head, date, sub, extra) {
    return `<div class="r-entry">
      <div class="r-row"><div>${head}</div>${date ? `<div class="r-date">${esc(date)}</div>` : ""}</div>
      ${sub ? `<div class="r-sub">${esc(sub)}</div>` : ""}${extra}
    </div>`;
  }
  const rSection = (title, inner) => `<section class="r-section"><h2>${title}</h2><div class="r-content">${inner}</div></section>`;

  function contactItems() {
    const p = state.personal, L = state.links;
    const parts = [];
    const email = p.email.trim();
    if (email) parts.push(EMAIL_RE.test(email) ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : esc(email));
    if (p.address.trim()) parts.push(esc(p.address.trim()));
    ["github", "linkedin", "portfolio", "leetcode"].forEach(k => {
      const href = normUrl(L[k]);
      if (href) parts.push(link(href, shortUrl(href)));
    });
    return parts;
  }

  function renderPreview() {
    const tpl = TEMPLATES.find(t => t.id === state.template) || TEMPLATES[0];
    const name = state.personal.name.trim();
    const contact = contactItems();

    const cols = { main: "", side: "" };
    let any = false;
    state.sectionOrder.forEach(sec => {
      const inner = sec === "skills" ? R.skills() : state[sec].filter(hasContent).map(R[sec]).join("");
      if (!inner) return;
      any = true;
      cols[tpl.side?.includes(sec) ? "side" : "main"] += rSection(META[sec].title, inner);
    });

    let html = `<header class="r-head">
      <h1 class="r-name">${name ? esc(name) : '<span class="r-ph">Your name</span>'}</h1>
      ${!tpl.side && contact.length ? `<p class="r-contact">${contact.join('<span class="sep"> · </span>')}</p>` : ""}
      ${state.about.trim() ? `<p class="r-about">${esc(state.about.trim())}</p>` : ""}
    </header>`;

    if (tpl.side) {
      // Two-column templates list contact details in the side column instead of under the name
      if (contact.length) cols.side = rSection("Contact", `<ul class="r-contact-list">${contact.map(c => `<li>${c}</li>`).join("")}</ul>`) + cols.side;
      html += cols.side ? `<div class="r-cols"><div class="r-side">${cols.side}</div><div class="r-main">${cols.main}</div></div>` : cols.main;
    } else {
      html += cols.main;
    }

    if (!any && !name) html += `<p class="r-empty-note">Start filling in the form. Your resume builds here as you type.</p>`;
    const paper = $("#resume");
    paper.className = `paper tpl-${tpl.id}`;
    paper.innerHTML = html;
  }

  /* ---------- Reorder dialog ---------- */
  const dlg = $("#reorder-dialog");
  const list = $("#order-list");
  function renderOrderList() {
    const n = state.sectionOrder.length;
    list.innerHTML = state.sectionOrder.map((sec, i) => `<li draggable="true" data-i="${i}">
        <span class="grip">${ICON.grip}</span>
        <span class="o-label">${META[sec].title}</span>
        ${isSectionEmpty(sec) ? '<span class="empty-tag">empty</span>' : ""}
        <button type="button" class="btn icon-btn" data-action="sec-up" data-sec="${sec}" aria-label="Move ${META[sec].title} up" ${i === 0 ? "disabled" : ""}>${ICON.up}</button>
        <button type="button" class="btn icon-btn" data-action="sec-down" data-sec="${sec}" aria-label="Move ${META[sec].title} down" ${i === n - 1 ? "disabled" : ""}>${ICON.down}</button>
      </li>`).join("");
  }
  function refreshOrder() {
    renderSections();
    renderPreview();
    if (dlg.open) renderOrderList();
  }

  let dragFrom = null;
  list.addEventListener("dragstart", e => {
    const li = e.target.closest("li"); if (!li) return;
    dragFrom = +li.dataset.i;
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(dragFrom));
  });
  list.addEventListener("dragover", e => {
    e.preventDefault();
    list.querySelectorAll(".drop-target").forEach(x => x.classList.remove("drop-target"));
    const li = e.target.closest("li");
    if (li) li.classList.add("drop-target");
  });
  list.addEventListener("drop", e => {
    e.preventDefault();
    const li = e.target.closest("li");
    if (li && dragFrom !== null && move(state.sectionOrder, dragFrom, +li.dataset.i)) refreshOrder();
  });
  list.addEventListener("dragend", () => {
    dragFrom = null;
    list.querySelectorAll(".dragging, .drop-target").forEach(x => x.classList.remove("dragging", "drop-target"));
  });

  /* ---------- Validation ---------- */
  function validate(el) {
    const path = el.dataset.path;
    let ok = true;
    if (path === "personal.name") ok = el.value.trim() !== "";
    else if (path === "personal.email") ok = EMAIL_RE.test(el.value.trim());
    else return true;
    el.closest(".field").classList.toggle("invalid", !ok);
    el.setAttribute("aria-invalid", String(!ok));
    return ok;
  }

  /* ---------- Events ---------- */
  function onValue(t) {
    const path = t.dataset.path;
    if (!path) return;
    setPath(path, t.type === "checkbox" ? t.checked : t.value);
    const [sec, i, key] = path.split(".");

    if (key === "present") {
      const end = document.getElementById(`${sec}-${i}-end`);
      if (end) end.disabled = t.checked;
    }
    if (META[sec] && META[sec].fields && key === META[sec].fields[0].k) {
      const h = document.getElementById(`ch-${sec}-${i}`);
      if (h) h.textContent = cardLabel(sec, state[sec][+i], +i);
    }
    if (path === "about") $("#about-count").textContent = `${t.value.length} / 500`;
    if (t.closest(".field.invalid")) validate(t);
    renderPreview();
  }
  $("#form").addEventListener("submit", e => e.preventDefault());
  document.addEventListener("input", e => { if (e.target.type !== "checkbox") onValue(e.target); });
  document.addEventListener("change", e => { if (e.target.type === "checkbox") onValue(e.target); });
  document.addEventListener("focusout", e => { if (e.target.dataset && e.target.dataset.path) validate(e.target); });

  function refocus(scope, action, sec, i) {
    const sel = (a) => `[data-action="${a}"][data-sec="${sec}"]${i !== undefined ? `[data-i="${i}"]` : ""}`;
    const opposite = action.endsWith("up") ? action.replace("up", "down") : action.replace("down", "up");
    const b = scope.querySelector(sel(action));
    (b && !b.disabled ? b : scope.querySelector(sel(opposite)))?.focus();
  }

  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, sec } = btn.dataset;
    const i = btn.dataset.i !== undefined ? +btn.dataset.i : undefined;
    const inDialog = !!btn.closest("dialog");

    switch (action) {
      case "sec-up":
      case "sec-down": {
        const from = state.sectionOrder.indexOf(sec);
        if (move(state.sectionOrder, from, from + (action === "sec-up" ? -1 : 1))) {
          refreshOrder();
          refocus(inDialog ? dlg : $("#sections"), action, sec);
        }
        break;
      }
      case "add": {
        state[sec].push(blank(sec));
        renderSections(); renderPreview();
        const idx = state[sec].length - 1;
        const first = document.querySelector(`#card-${sec}-${idx} input, #card-${sec}-${idx} textarea`);
        if (first) first.focus();
        break;
      }
      case "card-up":
      case "card-down": {
        const to = i + (action === "card-up" ? -1 : 1);
        if (move(state[sec], i, to)) {
          renderSections(); renderPreview();
          refocus($("#sections"), action, sec, to);
        }
        break;
      }
      case "card-remove": {
        const it = state[sec][i];
        if (hasContent(it) && !confirm(`Remove “${cardLabel(sec, it, i)}”? This can't be undone.`)) break;
        state[sec].splice(i, 1);
        renderSections(); renderPreview();
        $(`#h-${sec}`)?.closest(".section")?.querySelector("[data-action='add']")?.focus();
        break;
      }
      case "skill-mode":
        state.skills.mode = btn.dataset.mode;
        renderSections(); renderPreview();
        document.querySelector(`[data-action="skill-mode"][data-mode="${btn.dataset.mode}"]`)?.focus();
        break;
      case "skill-add": {
        state.skills.groups.push({ category: "", items: "" });
        renderSections();
        document.querySelector(`[data-path="skills.groups.${state.skills.groups.length - 1}.category"]`)?.focus();
        break;
      }
      case "skill-remove":
        state.skills.groups.splice(i, 1);
        renderSections(); renderPreview();
        document.querySelector('[data-action="skill-add"]')?.focus();
        break;
      case "template":
        state.template = btn.dataset.tpl;
        document.querySelectorAll('[data-action="template"]').forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
        renderPreview();
        break;
      case "open-reorder":
        renderOrderList();
        dlg.showModal();
        break;
      case "open-about":
        $("#about-dialog").showModal();
        break;
      case "close-dialog":
        btn.closest("dialog").close();
        break;
      case "reset-order":
        state.sectionOrder = DEFAULT_ORDER.slice();
        refreshOrder();
        break;
      case "show-preview":
        document.body.classList.add("show-preview");
        $(".preview-bar [data-action='hide-preview']").focus();
        break;
      case "hide-preview":
        document.body.classList.remove("show-preview");
        $(".preview-toggle").focus();
        break;
      case "download": {
        const okName = validate($("#p-name"));
        const okEmail = validate($("#p-email"));
        if (!okName || !okEmail) {
          document.body.classList.remove("show-preview");
          (okName ? $("#p-email") : $("#p-name")).focus();
          return;
        }
        window.print();
        break;
      }
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && document.body.classList.contains("show-preview") && !document.querySelector("dialog[open]")) {
      document.body.classList.remove("show-preview");
    }
  });

  /* ---------- Init ---------- */
  renderTemplatePicker();
  renderSections();
  renderPreview();
})();
