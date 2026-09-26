import { getPageBySlug } from "../services/pages.js";
import { escapeHtml } from "../ui.js";
import { getCurrentUser } from "../auth.js";

export function renderCmsPageView(slug) {
  const page = getPageBySlug(slug, getCurrentUser()?.role === "Admin");
  if (!page) return `<div class="alert alert-warning">Page not found.</div>`;
  return `
    <article class="card cj-card">
      <div class="card-body p-4">
        <h1 class="h3">${escapeHtml(page.title)}</h1>
        ${page.isPublished ? "" : '<p class="alert alert-warning">Draft preview. This page is only visible to the demo administrator.</p>'}
        <div class="mb-0 content-prose" style="white-space: pre-wrap">${escapeHtml(page.content)}</div>
      </div>
    </article>
  `;
}
