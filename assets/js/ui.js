export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

export function toast(message, type = "success") {
  let container = document.getElementById("cjToastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "cjToastContainer";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "false");
    document.body.append(container);
  }
  const theme = ["success", "warning", "info"].includes(type) ? type : "danger";
  const el = document.createElement("div");
  el.className = `toast show text-bg-${theme}`;
  el.setAttribute("role", theme === "danger" ? "alert" : "status");
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${escapeHtml(message)}</div><button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button></div>`;
  container.append(el);
  const timer = window.setTimeout(() => el.remove(), 6000);
  el.querySelector("button").addEventListener("click", () => {
    window.clearTimeout(timer);
    el.remove();
  });
}

// Hashchange does not fire for the current URL. Mutations still need a render.
export function navigate(path = window.location.hash || "#/") {
  const hash = path.startsWith("#") ? path : `#${path.startsWith("/") ? path : `/${path}`}`;
  if (window.location.hash === hash) window.dispatchEvent(new CustomEvent("cj:refresh"));
  else window.location.hash = hash;
}

export function refresh() {
  window.dispatchEvent(new CustomEvent("cj:refresh"));
}

export function confirmAction(message) {
  return window.confirm(message);
}

export function parseQuery(search = "") {
  return Object.fromEntries(new URLSearchParams(search));
}

export function paginate(items, page = 1, pageSize = 10) {
  pageSize = Number.isFinite(Number(pageSize)) ? Math.max(1, Math.floor(Number(pageSize))) : 10;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const requestedPage = Number.isFinite(Number(page)) ? Math.floor(Number(page)) : 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page: currentPage,
    pageSize,
    totalPages
  };
}

export function paginationHtml(basePath, page, totalPages, query = {}) {
  if (totalPages <= 1) return "";
  const q = { ...query };
  const links = [];
  for (let p = 1; p <= totalPages; p += 1) {
    q.page = String(p);
    const queryString = Object.keys(q)
      .filter((k) => q[k] !== "" && q[k] != null)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`)
      .join("&");
    const href = `#${basePath}${queryString ? `?${queryString}` : ""}`;
    links.push(`<li class="page-item ${p === page ? "active" : ""}"><a class="page-link" href="${escapeHtml(href)}" ${p === page ? 'aria-current="page"' : ""} aria-label="Page ${p}">${p}</a></li>`);
  }
  return `<nav aria-label="Pagination"><ul class="pagination">${links.join("")}</ul></nav>`;
}
