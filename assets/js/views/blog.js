import { getBlogPostBySlug, searchBlogPosts } from "../services/blog.js";
import { escapeHtml, formatDate, navigate, paginate, paginationHtml } from "../ui.js";
import { getCollection } from "../store.js";
import { getCurrentUser } from "../auth.js";

function tagLinks(slugs = []) {
  const tags = getCollection("tags");
  return slugs.map((slug) => `<a class="badge cj-badge me-1" href="#/blog?tag=${encodeURIComponent(slug)}">${escapeHtml(tags.find((tag) => tag.slug === slug)?.name || slug)}</a>`).join("");
}

export function renderBlogListView(query) {
  const q = String(query.q || "").trim();
  const page = Number(query.page || 1);
  const tag = String(query.tag || "");
  const results = searchBlogPosts(q).filter((post) => !tag || (post.tags || []).includes(tag));
  const paged = paginate(results, page, 5);

  const postsHtml = paged.items.length
    ? paged.items.map((p) => `
      <article class="card cj-card mb-3">
        <div class="card-body">
          <h3 class="h5"><a href="#/blog/${p.slug}">${escapeHtml(p.title)}</a></h3>
          <p class="mb-2 text-muted">${formatDate(p.publishedAt || p.createdAt)}</p>
          <p class="mb-2">${escapeHtml(p.excerpt)}</p>
          <div>${tagLinks(p.tags)}</div>
        </div>
      </article>
    `).join("")
    : "<div class='alert alert-warning'>No posts found.</div>";

  return `
    <section>
      <h1 class="h3 mb-3">Blog</h1>
      <form class="row g-2 mb-3" method="get" action="#/blog" id="blogSearchForm">
        <input type="hidden" name="tag" value="${escapeHtml(tag)}">
        <div class="col-md-8"><label class="form-label" for="blogField1">Search posts</label><input id="blogField1" class="form-control" name="q" value="${escapeHtml(q)}" placeholder="Search posts"></div>
        <div class="col-md-4"><button class="btn btn-primary w-100" type="submit"><i class="bi bi-search me-1"></i>Search</button></div>
      </form>
      ${tag ? `<p>Filtered by tag: ${escapeHtml(getCollection("tags").find((item) => item.slug === tag)?.name || tag)}. <a href="#/blog">Clear filter</a></p>` : ""}
      ${postsHtml}
      ${paginationHtml("/blog", paged.page, paged.totalPages, { q, tag })}
    </section>
  `;
}

export function bindBlogListView() {
  const form = document.getElementById("blogSearchForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams({ q: String(data.get("q") || ""), tag: String(data.get("tag") || "") });
    navigate(`#/blog?${params}`);
  });
}

export function renderBlogSingleView(slug) {
  const post = getBlogPostBySlug(slug, getCurrentUser()?.role === "Admin");
  if (!post) {
    return `<div class="alert alert-warning">Post not found.</div>`;
  }

  return `
    <article class="card cj-card">
      <div class="card-body p-4">
        <h1 class="h3">${escapeHtml(post.title)}</h1>
        <p class="text-muted">${post.status === "Published" ? "Published" : "Draft preview"} ${formatDate(post.publishedAt || post.createdAt)}</p>
        <div class="mb-3">${tagLinks(post.tags)}</div>
        <div class="mb-0 content-prose" style="white-space: pre-wrap">${escapeHtml(post.content)}</div>
        <p class="mt-3"><a href="#/blog">Back to all posts</a></p>
      </div>
    </article>
  `;
}
