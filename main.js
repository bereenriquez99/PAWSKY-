// Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Mobile nav */
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close on click
  $$("#navMenu a").forEach(a => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Footer year */
$("#year").textContent = String(new Date().getFullYear());

/* Reveal on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });

$$(".reveal").forEach(el => io.observe(el));

/* Toast */
const toastEl = $("#toast");
let toastTimer = null;

function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

$$("[data-toast]").forEach(btn => {
  btn.addEventListener("click", () => toast(btn.getAttribute("data-toast")));
});

/* Forms (demo) */
const reviewForm = $("#reviewForm");
const reviewMsg = $("#reviewMsg");

if (reviewForm) {
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(reviewForm);
    const name = (fd.get("name") || "").toString().trim();
    const pet = (fd.get("pet") || "").toString().trim();

    reviewMsg.textContent = `¡Gracias, ${name}! 🐾 Reseña recibida para ${pet}. (Demo)`;
    reviewForm.reset();
    toast("Reseña enviada ⭐");
  });
}

const newsletterForm = $("#newsletterForm");
const newsletterMsg = $("#newsletterMsg");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterMsg.textContent = "¡Listo! Te llegará el próximo tip 🧠🐾 (Demo)";
    newsletterForm.reset();
    toast("Suscripción lista ✨");
  });
}

const contactForm = $("#contactForm");
const contactMsg = $("#contactMsg");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const service = fd.get("service");
    contactMsg.textContent = `¡Solicitud enviada! Te responderemos pronto sobre: ${service} ✨ (Demo)`;
    contactForm.reset();
    toast("Solicitud enviada 📨");
  });
}

/* Calendar (demo availability) */
const calTitle = $("#calTitle");
const calGrid = $("#calGrid");
const calInfo = $("#calInfo");
const calPrev = $("#calPrev");
const calNext = $("#calNext");

// Example booked dates (YYYY-MM-DD). Replace with real logic later.
const booked = new Set([
  "2026-02-21", "2026-02-22", "2026-02-27",
  "2026-03-03", "2026-03-10", "2026-03-18",
]);

let view = new Date(); // current month
let selected = null;

function pad(n){ return String(n).padStart(2, "0"); }
function ymd(d){
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function renderCalendar() {
  if (!calGrid || !calTitle) return;

  calGrid.innerHTML = "";

  const year = view.getFullYear();
  const month = view.getMonth(); // 0-based

  const monthName = view.toLocaleString("es-MX", { month: "long", year: "numeric" });
  calTitle.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const dayNames = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  dayNames.forEach(n => {
    const el = document.createElement("div");
    el.className = "dayName";
    el.textContent = n;
    calGrid.appendChild(el);
  });

  // First day of month
  const first = new Date(year, month, 1);
  // Convert JS Sunday=0.. to Monday=0.. index
  const firstIndex = (first.getDay() + 6) % 7;

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Leading blanks
  for (let i = 0; i < firstIndex; i++) {
    const empty = document.createElement("div");
    empty.className = "day is-empty";
    empty.setAttribute("aria-hidden", "true");
    calGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = ymd(date);
    const isBusy = booked.has(key);
    const isSelected = selected === key;

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "day" + (isBusy ? " is-busy" : "") + (isSelected ? " is-selected" : "");
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `${key} ${isBusy ? "ocupado" : "disponible"}`);

    const top = document.createElement("div");
    top.className = "dayTop";

    const num = document.createElement("span");
    num.textContent = String(day);

    const badge = document.createElement("span");
    badge.className = "badge " + (isBusy ? "busy" : "free");
    badge.textContent = isBusy ? "Busy" : "Free";

    top.appendChild(num);
    top.appendChild(badge);
    cell.appendChild(top);

    cell.addEventListener("click", () => {
      if (isBusy) {
        selected = key;
        calInfo.textContent = `📌 ${key}: está ocupado. Puedes elegir otra fecha o enviarnos tu rango de fechas.`;
        toast("Ese día está ocupado 😅");
      } else {
        selected = key;
        calInfo.textContent = `✅ ${key}: disponible. ¡Envíanos tu solicitud en Contacto para confirmar!`;
        toast("Fecha seleccionada 📅");
      }
      renderCalendar();
    });

    calGrid.appendChild(cell);
  }
}

if (calPrev) {
  calPrev.addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    renderCalendar();
  });
}
if (calNext) {
  calNext.addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    renderCalendar();
  });
}

renderCalendar();
