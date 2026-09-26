import { getCurrentUser } from "../auth.js";
import { resetDemoData, findById, getCollection } from "../store.js";
import {
  listAllPages,
  createPage,
  updatePage,
  togglePagePublish,
  deletePage,
  getPageById
} from "../services/pages.js";
import {
  listAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById
} from "../services/blog.js";
import {
  listForumCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  searchThreads,
  listPostsByThread,
  lockThread,
  deleteForumPost,
  getCategoryById
} from "../services/forum.js";
import { listContactMessages, markContactResolved } from "../services/contact.js";
import { listAuditLogs } from "../services/audit.js";
import { escapeHtml, formatDate, navigate, toast, confirmAction } from "../ui.js";

function nav(activePath) {
  const links = getCurrentUser()?.role === "Moderator" ? [["Forum", "/admin/forum"]] : [
    ["Overview", "/admin"],
    ["Pages", "/admin/pages"],
    ["Blog", "/admin/blog"],
    ["Forum", "/admin/forum"],
    ["Contact", "/admin/contact"],
    ["Audit", "/admin/audit"]
  ];
  return `<ul class="nav nav-pills mb-3">${links
    .map(([label, path]) => `<li class="nav-item"><a class="nav-link ${activePath === path ? "active" : ""}" href="#${path}">${label}</a></li>`)
    .join("")}</ul>`;
}

export function renderAdminDashboardView(path) {
  const user = getCurrentUser();
  return `
    <section>
      <h1 class="h3">Admin Dashboard</h1>
      <p class="text-muted">Signed in as ${escapeHtml(user?.email || "")}. Changes are saved only in this browser.</p>
      ${nav(path)}
      <div class="card cj-card">
        <div class="card-body">
          <p>Manage community pages, blog posts, forum moderation, the local contact inbox, and audit history. The original site pages remain available in the main navigation.</p>
          <button class="btn btn-outline-danger" id="resetDemoBtn"><i class="bi bi-arrow-counterclockwise me-1"></i>Reset Demo Data</button>
        </div>
      </div>
    </section>
  `;
}

export function bindAdminDashboardView() {
  const btn = document.getElementById("resetDemoBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (!confirmAction("Reset all demo data and reseed?")) return;
    resetDemoData();
    toast("Demo data reset.", "success");
    navigate("#/login");
  });
}

export function renderAdminPagesView(path) {
  const pages = listAllPages();
  return `
    <section>
      <h1 class="h3">Pages Management</h1>
      ${nav(path)}
      <div class="row g-4">
        <div class="col-lg-5">
          <form id="pageForm" class="card cj-card p-3">
            <input type="hidden" name="id">
            <h2 class="h5">Create / Edit Page</h2>
            <div class="mb-2"><label class="form-label" for="adminField1">Title</label><input id="adminField1" class="form-control" name="title" placeholder="Title" maxlength="180" required></div>
            <div class="mb-2"><label class="form-label" for="adminField2">Slug (optional)</label><input id="adminField2" class="form-control" name="slug" placeholder="Slug (optional)" maxlength="180"></div>
            <div class="mb-2"><label class="form-label" for="adminField3">Content</label><textarea id="adminField3" class="form-control" name="content" rows="6" maxlength="20000" placeholder="Content"></textarea></div>
            <div class="form-check mb-2"><input class="form-check-input" type="checkbox" name="isPublished" id="pagePublished"><label class="form-check-label" for="pagePublished">Published</label></div>
            <button class="btn btn-primary" type="submit">Save Page</button>
          </form>
        </div>
        <div class="col-lg-7">
          <div class="card cj-card p-3">
            <h2 class="h5">Existing Pages</h2>
            ${pages.map((p) => `
              <div class="border rounded p-2 mb-2">
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <strong>${escapeHtml(p.title)}</strong>
                    <div><small class="text-muted">/${escapeHtml(p.slug)} ${p.isPublished ? "(Published)" : "(Draft)"}</small></div>
                    <a href="#/page/${p.slug}" target="_blank" rel="noopener">Preview</a>
                  </div>
                  <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" data-edit-page="${p.id}">Edit</button>
                    <button class="btn btn-sm btn-outline-secondary" data-toggle-page="${p.id}">${p.isPublished ? "Unpublish" : "Publish"}</button>
                    <button class="btn btn-sm btn-outline-danger" data-del-page="${p.id}">Delete</button>
                  </div>
                </div>
              </div>`).join("") || "<p class='text-muted'>No pages.</p>"}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function bindAdminPagesView() {
  const user = getCurrentUser();
  const form = document.getElementById("pageForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const id = String(fd.get("id") || "");
      const input = {
        title: String(fd.get("title") || ""),
        slug: String(fd.get("slug") || ""),
        content: String(fd.get("content") || ""),
        isPublished: fd.get("isPublished") === "on"
      };
      try {
        if (id) updatePage(id, input, user);
        else createPage(input, user);
        toast("Page saved.", "success");
        navigate("#/admin/pages");
      } catch (err) {
        toast(err.message, "danger");
      }
    });
  }

  document.querySelectorAll("[data-edit-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = getPageById(btn.getAttribute("data-edit-page"));
      if (!page || !form) return;
      form.elements.id.value = page.id;
      form.elements.title.value = page.title;
      form.elements.slug.value = page.slug;
      form.elements.content.value = page.content || "";
      form.elements.isPublished.checked = Boolean(page.isPublished);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-toggle-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      togglePagePublish(btn.getAttribute("data-toggle-page"), user);
      toast("Page publish state updated.", "success");
      navigate("#/admin/pages");
    });
  });

  document.querySelectorAll("[data-del-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmAction("Delete this page?")) return;
      deletePage(btn.getAttribute("data-del-page"), user);
      toast("Page deleted.", "success");
      navigate("#/admin/pages");
    });
  });
}

export function renderAdminBlogView(path) {
  const posts = listAllBlogPosts();
  return `
    <section>
      <h1 class="h3">Blog Management</h1>
      ${nav(path)}
      <div class="row g-4">
        <div class="col-lg-5">
          <form id="blogForm" class="card cj-card p-3">
            <input type="hidden" name="id">
            <h2 class="h5">Create / Edit Post</h2>
            <div class="mb-2"><label class="form-label" for="adminField4">Title</label><input id="adminField4" class="form-control" name="title" maxlength="180" placeholder="Title" required></div>
            <div class="mb-2"><label class="form-label" for="adminField5">Slug (optional)</label><input id="adminField5" class="form-control" name="slug" maxlength="180" placeholder="Slug (optional)"></div>
            <div class="mb-2"><label class="form-label" for="adminField6">Excerpt</label><textarea id="adminField6" class="form-control" name="excerpt" rows="2" maxlength="400" placeholder="Excerpt" required></textarea></div>
            <div class="mb-2"><label class="form-label" for="adminField7">Content</label><textarea id="adminField7" class="form-control" name="content" rows="6" maxlength="30000" placeholder="Content" required></textarea></div>
            <div class="mb-2"><label class="form-label" for="adminField8">Tags (comma-separated)</label><input id="adminField8" class="form-control" name="tags" maxlength="300" placeholder="Tags (comma-separated)"></div>
            <div class="mb-2"><label class="form-label" for="adminField9">Publication date (optional)</label><input id="adminField9" class="form-control" type="datetime-local" name="publishedAt"></div>
            <div class="mb-2">
              <label class="form-label" for="adminField10">Publication status</label><select id="adminField10" class="form-select" name="status">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <button class="btn btn-primary" type="submit">Save Post</button>
          </form>
        </div>
        <div class="col-lg-7">
          <div class="card cj-card p-3">
            <h2 class="h5">Existing Posts</h2>
            ${posts.map((p) => `
              <div class="border rounded p-2 mb-2">
                <div class="d-flex justify-content-between gap-2">
                  <div>
                    <strong>${escapeHtml(p.title)}</strong>
                    <div><small class="text-muted">/${escapeHtml(p.slug)} | ${escapeHtml(p.status)}</small></div>
                    <a href="#/blog/${p.slug}" target="_blank" rel="noopener">Preview</a>
                  </div>
                  <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" data-edit-blog="${p.id}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" data-del-blog="${p.id}">Delete</button>
                  </div>
                </div>
              </div>`).join("") || "<p class='text-muted'>No posts.</p>"}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function bindAdminBlogView() {
  const user = getCurrentUser();
  const form = document.getElementById("blogForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const published = String(fd.get("publishedAt") || "");
      const input = {
        title: String(fd.get("title") || ""),
        slug: String(fd.get("slug") || ""),
        excerpt: String(fd.get("excerpt") || ""),
        content: String(fd.get("content") || ""),
        tags: String(fd.get("tags") || ""),
        status: String(fd.get("status") || "Draft"),
        publishedAt: published || null
      };
      try {
        if (published) input.publishedAt = new Date(published).toISOString();
        const id = String(fd.get("id") || "");
        if (id) updateBlogPost(id, input, user);
        else createBlogPost(input, user);
        toast("Blog post saved.", "success");
        navigate("#/admin/blog");
      } catch (err) {
        toast(err.message, "danger");
      }
    });
  }

  document.querySelectorAll("[data-edit-blog]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const post = getBlogPostById(btn.getAttribute("data-edit-blog"));
      if (!post || !form) return;
      form.elements.id.value = post.id;
      form.elements.title.value = post.title;
      form.elements.slug.value = post.slug;
      form.elements.excerpt.value = post.excerpt;
      form.elements.content.value = post.content;
      const tags = getCollection("tags");
      form.elements.tags.value = (post.tags || []).map((slug) => tags.find((tag) => tag.slug === slug)?.name || slug).join(", ");
      form.elements.status.value = post.status || "Draft";
      const published = post.publishedAt ? new Date(post.publishedAt) : null;
      form.elements.publishedAt.value = published && !Number.isNaN(published.getTime())
        ? new Date(published.getTime() - published.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-del-blog]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmAction("Delete this post?")) return;
      deleteBlogPost(btn.getAttribute("data-del-blog"), user);
      toast("Post deleted.", "success");
      navigate("#/admin/blog");
    });
  });
}

export function renderAdminForumView(path) {
  const user = getCurrentUser();
  const categories = listForumCategories();
  const threads = searchThreads("");

  return `
    <section>
      <h1 class="h3">Forum Moderation</h1>
      ${nav(path)}
      <div class="row g-4">
        <div class="col-lg-5">
          ${user?.role === "Admin" ? `
          <form id="catForm" class="card cj-card p-3 mb-3">
            <input type="hidden" name="id">
            <h2 class="h5">Categories</h2>
            <div class="mb-2"><label class="form-label" for="adminField11">Category name</label><input id="adminField11" class="form-control" name="name" maxlength="160" placeholder="Category name" required></div>
            <div class="mb-2"><label class="form-label" for="adminField12">Slug (optional)</label><input id="adminField12" class="form-control" name="slug" maxlength="160" placeholder="Slug (optional)"></div>
            <div class="mb-2"><label class="form-label" for="adminField13">Description</label><textarea id="adminField13" class="form-control" name="description" rows="3" maxlength="500" placeholder="Description"></textarea></div>
            <button class="btn btn-primary" type="submit">Save Category</button>
          </form>` : ""}

          <div class="card cj-card p-3">
            <h2 class="h5">Existing Categories</h2>
            ${categories.map((c) => `
              <div class="border rounded p-2 mb-2 d-flex justify-content-between gap-2">
                <div>
                  <strong>${escapeHtml(c.name)}</strong>
                  <div><small class="text-muted">/${escapeHtml(c.slug)}</small></div>
                </div>
                ${user?.role === "Admin" ? `
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-outline-primary" data-edit-cat="${c.id}">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" data-del-cat="${c.id}">Delete</button>
                </div>` : ""}
              </div>`).join("")}
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card cj-card p-3">
            <h2 class="h5">Threads</h2>
            ${threads.map((t) => {
              const cat = getCategoryById(t.categoryId);
              const posts = listPostsByThread(t.id);
              return `
                <div class="border rounded p-2 mb-2">
                  <div class="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <strong>${escapeHtml(t.title)}</strong>
                      <div><small class="text-muted">${escapeHtml(cat?.name || "Unknown category")} | ${t.isLocked ? "Locked" : "Open"}</small></div>
                    </div>
                    <button class="btn btn-sm ${t.isLocked ? "btn-outline-success" : "btn-outline-secondary"}" data-lock-thread="${t.id}" data-lock-state="${t.isLocked ? "0" : "1"}">${t.isLocked ? "Unlock" : "Lock"}</button>
                  </div>
                  <div class="mt-2">
                    ${posts.map((p) => {
                      const author = findById("users", p.authorId);
                      return `<div class="small border-top pt-1 mt-1 d-flex justify-content-between"><span>${escapeHtml(author?.email || "unknown")}: ${escapeHtml(p.content.slice(0, 90))}</span><button class="btn btn-sm btn-outline-danger" data-del-post="${p.id}">Delete</button></div>`;
                    }).join("") || "<small class='text-muted'>No posts.</small>"}
                  </div>
                </div>`;
            }).join("") || "<p class='text-muted'>No threads.</p>"}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function bindAdminForumView() {
  const user = getCurrentUser();
  const form = document.getElementById("catForm");

  if (form && user?.role === "Admin") {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const id = String(fd.get("id") || "");
      const input = {
        name: String(fd.get("name") || ""),
        slug: String(fd.get("slug") || ""),
        description: String(fd.get("description") || "")
      };
      try {
        if (id) updateCategory(id, input, user);
        else createCategory(input, user);
        toast("Category saved.", "success");
        navigate("#/admin/forum");
      } catch (err) {
        toast(err.message, "danger");
      }
    });

    document.querySelectorAll("[data-edit-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const c = getCategoryById(btn.getAttribute("data-edit-cat"));
        if (!c) return;
        form.elements.id.value = c.id;
        form.elements.name.value = c.name;
        form.elements.slug.value = c.slug;
        form.elements.description.value = c.description || "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    document.querySelectorAll("[data-del-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!confirmAction("Delete this category? Its threads will also be hidden from the forum.")) return;
        deleteCategory(btn.getAttribute("data-del-cat"), user);
        toast("Category deleted.", "success");
        navigate("#/admin/forum");
      });
    });
  }

  document.querySelectorAll("[data-lock-thread]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const locked = btn.getAttribute("data-lock-state") === "1";
      lockThread(btn.getAttribute("data-lock-thread"), user, locked);
      toast(locked ? "Thread locked." : "Thread unlocked.", "success");
      navigate("#/admin/forum");
    });
  });

  document.querySelectorAll("[data-del-post]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmAction("Delete this forum post?")) return;
      deleteForumPost(btn.getAttribute("data-del-post"), user);
      toast("Forum post deleted.", "success");
      navigate("#/admin/forum");
    });
  });
}

export function renderAdminContactView(path, query) {
  const filter = ["all", "open", "resolved"].includes(query.filter) ? query.filter : "all";
  const items = listContactMessages(filter);
  return `
    <section>
      <h1 class="h3">Contact Messages</h1>
      <p class="text-muted">This inbox contains messages saved in this browser only. No emails are sent.</p>
      ${nav(path)}
      <div class="mb-3">
        <a class="btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-primary"} me-1" href="#/admin/contact?filter=all">All</a>
        <a class="btn btn-sm ${filter === "open" ? "btn-primary" : "btn-outline-primary"} me-1" href="#/admin/contact?filter=open">Open</a>
        <a class="btn btn-sm ${filter === "resolved" ? "btn-primary" : "btn-outline-primary"}" href="#/admin/contact?filter=resolved">Resolved</a>
      </div>
      <div class="card cj-card p-3">
        ${items.map((m) => `
          <div class="border rounded p-2 mb-2">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div>
                <strong>${escapeHtml(m.name)}</strong> <span class="text-muted">(${escapeHtml(m.email)})</span>
                <div>${escapeHtml(m.subject || "No subject")}</div>
                <p class="mb-1">${escapeHtml(m.message)}</p>
                <small class="text-muted">${formatDate(m.createdAt)} | ${m.status}</small>
              </div>
              ${m.status !== "Resolved" ? `<button class="btn btn-sm btn-outline-success" data-resolve-msg="${m.id}">Resolve</button>` : ""}
            </div>
          </div>`).join("") || "<p class='text-muted mb-0'>No messages.</p>"}
      </div>
    </section>
  `;
}

export function bindAdminContactView() {
  const user = getCurrentUser();
  document.querySelectorAll("[data-resolve-msg]").forEach((btn) => {
    btn.addEventListener("click", () => {
      markContactResolved(btn.getAttribute("data-resolve-msg"), user);
      toast("Message marked resolved.", "success");
      navigate("#/admin/contact?filter=open");
    });
  });
}

export function renderAdminAuditView(path) {
  const logs = listAuditLogs();
  return `
    <section>
      <h1 class="h3">Audit Logs</h1>
      ${nav(path)}
      <div class="card cj-card p-3">
        ${logs.map((log) => {
          const actor = findById("users", log.actorId, true);
          return `<div class="border-bottom pb-2 mb-2"><strong>${escapeHtml(log.action)}</strong> <span class="badge text-bg-light">${escapeHtml(log.entityType)}</span><div class="small text-muted">${formatDate(log.createdAt)} by ${escapeHtml(actor?.email || log.createdBy || "system")}</div><div>${escapeHtml(log.detail || "")}</div></div>`;
        }).join("") || "<p class='text-muted mb-0'>No logs yet.</p>"}
      </div>
    </section>
  `;
}

export function bindAdminAuditView() {}
