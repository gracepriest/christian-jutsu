import { getCurrentUser } from "../auth.js";
import {
  listForumCategories,
  getCategoryBySlug,
  listThreadsByCategory,
  createThread,
  getThreadBySlug,
  listPostsByThread,
  replyToThread,
  searchThreads
} from "../services/forum.js";
import { findById } from "../store.js";
import { escapeHtml, formatDate, navigate, paginate, paginationHtml, toast } from "../ui.js";

export function renderForumCategoriesView(query) {
  const q = String(query.q || "").trim().toLowerCase();
  const categories = listForumCategories().filter((c) => !q || c.name.toLowerCase().includes(q));

  return `
    <section>
      <h1 class="h3 mb-3">Forum Categories</h1>
      <form id="forumSearchForm" class="row g-2 mb-3">
        <div class="col-md-8"><label class="form-label" for="forumField1">Search categories</label><input id="forumField1" class="form-control" name="q" value="${escapeHtml(q)}" placeholder="Search categories"></div>
        <div class="col-md-4"><button class="btn btn-primary w-100" type="submit">Search</button></div>
      </form>
      <div class="row">
        ${categories.map((c) => `
          <div class="col-md-6 mb-3">
            <div class="card cj-card h-100"><div class="card-body">
              <h3 class="h5"><a href="#/forum/${c.slug}">${escapeHtml(c.name)}</a></h3>
              <p class="mb-0">${escapeHtml(c.description || "")}</p>
            </div></div>
          </div>
        `).join("") || '<p class="text-muted">No categories found.</p>'}
      </div>
    </section>
  `;
}

export function bindForumCategoriesView() {
  const form = document.getElementById("forumSearchForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = new FormData(form).get("q") || "";
    navigate(`#/forum?q=${encodeURIComponent(String(q))}`);
  });
}

export function renderForumCategoryView(slug, query) {
  const category = getCategoryBySlug(slug);
  if (!category) return `<div class="alert alert-warning">Category not found.</div>`;

  const q = String(query.q || "").trim();
  const page = Number(query.page || 1);
  const threadList = q ? searchThreads(q).filter((t) => t.categoryId === category.id) : listThreadsByCategory(category.id);
  const paged = paginate(threadList, page, 10);
  const user = getCurrentUser();

  return `
    <section>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3 mb-0">${escapeHtml(category.name)}</h1>
        <a href="#/forum" class="btn btn-outline-secondary btn-sm">All categories</a>
      </div>
      <p>${escapeHtml(category.description || "")}</p>

      <form class="row g-2 mb-3" id="threadSearchForm">
        <div class="col-md-8"><label class="form-label" for="forumField2">Search threads in this category</label><input id="forumField2" class="form-control" name="q" value="${escapeHtml(q)}" placeholder="Search threads in this category"></div>
        <div class="col-md-4"><button class="btn btn-primary w-100" type="submit">Search</button></div>
      </form>

      ${paged.items.map((t) => `
        <article class="card cj-card mb-2"><div class="card-body">
          <h3 class="h6 mb-1"><a href="#/thread/${t.slug}">${escapeHtml(t.title)}</a></h3>
          <small class="text-muted">Last activity ${formatDate(t.lastActivityAt || t.updatedAt)} ${t.isLocked ? "- Locked" : ""}</small>
        </div></article>
      `).join("") || "<div class='alert alert-warning'>No threads found.</div>"}

      ${paginationHtml(`/forum/${category.slug}`, paged.page, paged.totalPages, { q })}

      <hr>
      ${user ? `
      <h2 class="h5">Start a Thread</h2>
      <form id="newThreadForm" class="card cj-card p-3">
        <input type="hidden" name="categoryId" value="${category.id}">
        <div class="mb-2"><label class="form-label" for="forumField3">Thread title</label><input id="forumField3" name="title" class="form-control" maxlength="180" placeholder="Thread title" required></div>
        <div class="mb-2"><label class="form-label" for="forumField4">Opening post</label><textarea id="forumField4" name="content" class="form-control" rows="4" maxlength="5000" placeholder="Opening post" required></textarea></div>
        <button class="btn btn-primary" type="submit">Create Thread</button>
      </form>
      ` : `<div class="alert alert-info">Log in to create threads.</div>`}
    </section>
  `;
}

export function bindForumCategoryView(slug) {
  const searchForm = document.getElementById("threadSearchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = new FormData(searchForm).get("q") || "";
      navigate(`#/forum/${slug}?q=${encodeURIComponent(String(q))}`);
    });
  }

  const form = document.getElementById("newThreadForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return toast("Please log in first.", "warning");
    const fd = new FormData(form);
    try {
      const thread = createThread({
        categoryId: String(fd.get("categoryId")),
        title: String(fd.get("title")),
        content: String(fd.get("content"))
      }, user);
      toast("Thread created.", "success");
      navigate(`#/thread/${thread.slug}`);
    } catch (err) {
      toast(err.message, "danger");
    }
  });
}

export function renderThreadView(slug, query) {
  const thread = getThreadBySlug(slug);
  if (!thread) return `<div class="alert alert-warning">Thread not found.</div>`;
  const posts = listPostsByThread(thread.id);
  const page = Number(query.page || 1);
  const paged = paginate(posts, page, 10);
  const user = getCurrentUser();

  const postsHtml = paged.items.map((p) => {
    const author = findById("users", p.authorId);
    return `
      <article class="card cj-card mb-2"><div class="card-body">
        <div class="d-flex justify-content-between">
          <strong>${escapeHtml(author?.name || author?.email || "Member")}</strong>
          <small class="text-muted">${formatDate(p.createdAt)}</small>
        </div>
        <p class="mb-0 mt-2" style="white-space: pre-wrap">${escapeHtml(p.content)}</p>
      </div></article>
    `;
  }).join("");

  return `
    <section>
      <h1 class="h4">${escapeHtml(thread.title)} ${thread.isLocked ? "<span class='badge text-bg-secondary'>Locked</span>" : ""}</h1>
      <p><a href="#/forum">All forum categories</a></p>
      ${postsHtml || '<p class="text-muted">There are no visible posts in this thread.</p>'}
      ${paginationHtml(`/thread/${thread.slug}`, paged.page, paged.totalPages)}
      <hr>
      ${user && !thread.isLocked ? `
      <form id="replyForm" class="card cj-card p-3">
        <div class="mb-2"><label class="form-label" for="forumField5">Write a reply</label><textarea id="forumField5" name="content" class="form-control" rows="4" maxlength="5000" placeholder="Write a reply" required></textarea></div>
        <button class="btn btn-primary" type="submit">Reply</button>
      </form>` : `<div class="alert ${thread.isLocked ? "alert-warning" : "alert-info"}">${thread.isLocked ? "Thread is locked." : "Log in to reply."}</div>`}
    </section>
  `;
}

export function bindThreadView(slug) {
  const form = document.getElementById("replyForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return toast("Please log in.", "warning");
    const thread = getThreadBySlug(slug);
    if (!thread) return;
    const content = String(new FormData(form).get("content") || "");

    try {
      replyToThread(thread.id, content, user);
      toast("Reply added.", "success");
      const lastPage = Math.max(1, Math.ceil(listPostsByThread(thread.id).length / 10));
      navigate(`#/thread/${thread.slug}?page=${lastPage}`);
    } catch (err) {
      toast(err.message, "danger");
    }
  });
}
