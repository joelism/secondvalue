// --- Mini Router (Tabs) ---
const tabs = document.querySelectorAll(".tab");
const section = document.querySelector(".section");
const placeholder = document.getElementById("placeholder");
const placeholderTitle = document.getElementById("placeholderTitle");

function setActive(route) {
  tabs.forEach(t => t.classList.toggle("is-active", t.dataset.route === route));

  if (route === "artikel") {
    section.hidden = false;
    placeholder.hidden = true;
  } else {
    section.hidden = true;
    placeholder.hidden = false;
    const map = {
      kontakte: "Kontakte",
      auszahlungen: "Auszahlungen",
      journal: "Journal"
    };
    placeholderTitle.textContent = map[route] || "Seite";
  }
}

tabs.forEach(t => t.addEventListener("click", () => setActive(t.dataset.route)));

// --- Table (aktuell leer, nur Layout) ---
const tbody = document.getElementById("tbody");
const count = document.getElementById("count");
const q = document.getElementById("q");
const status = document.getElementById("status");
const archived = document.getElementById("archived");

let items = []; // später füllen wir das (wenn du willst: LocalStorage / JSON / etc.)

function render() {
  tbody.innerHTML = "";

  // Filter (aktuell ohne Items trotzdem logisch vorbereitet)
  const query = (q.value || "").trim().toLowerCase();
  const statusVal = status.value;
  const includeArchived = archived.checked;

  const filtered = items.filter(it => {
    if (!includeArchived && it.archived) return false;
    if (statusVal && it.status !== statusVal) return false;
    if (query) {
      const hay = `${it.nr} ${it.titel} ${it.lieferant} ${it.lager}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  count.textContent = `${filtered.length} Artikel`;

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.className = "empty";
    td.innerHTML = `
      Noch keine Artikel vorhanden.<br>
      <span style="font-weight:600; opacity:.8;">Benutze „Neuen Artikel erfassen“, sobald wir das Formular bauen.</span>
    `;
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  filtered.forEach(it => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(it.nr)}</td>
      <td>${escapeHtml(it.titel)}</td>
      <td>${escapeHtml(it.lieferant)}</td>
      <td><span class="badge">${escapeHtml(it.status)}</span></td>
      <td>${escapeHtml(it.erfasst)}</td>
      <td>${escapeHtml(it.lager)}</td>
      <td>
        <div class="actions">
          <button class="iconbtn" title="Bearbeiten" data-id="${it.id}">
            <img src="assets/edit.svg" alt="Bearbeiten">
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// --- UI actions ---
document.getElementById("btnNewArticle").addEventListener("click", () => {
  alert("Formular kommt als nächste Seite 🙂 Schick mir das Bild/Design davon.");
});

document.getElementById("btnCsv").addEventListener("click", () => {
  alert("CSV-Export bauen wir später – aktuell nur Hauptseite/Layout.");
});

[q, status, archived].forEach(el => el.addEventListener("input", render));

// Initial
setActive("artikel");
render();
