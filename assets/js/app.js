import { initStore } from "./store.js";
import { Router } from "./router.js";
import { renderLayout, bindLayoutEvents } from "./components/layout.js";
import { renderHomeView } from "./views/home.js";
import { renderAboutView } from "./views/static.js";
import { renderBeliefsView, bindBeliefsView } from "./views/beliefs.js";
import { renderContactView, bindContactView } from "./views/contact.js";
import { renderBlogListView, bindBlogListView, renderBlogSingleView } from "./views/blog.js";
import {
  renderForumCategoriesView,
  bindForumCategoriesView,
  renderForumCategoryView,
  bindForumCategoryView,
  renderThreadView,
  bindThreadView
} from "./views/forum.js";
import { renderCmsPageView } from "./views/cms.js";
import { renderLoginView, bindLoginView } from "./views/login.js";
import {
  renderAdminDashboardView,
  bindAdminDashboardView,
  renderAdminPagesView,
  bindAdminPagesView,
  renderAdminBlogView,
  bindAdminBlogView,
  renderAdminForumView,
  bindAdminForumView,
  renderAdminContactView,
  bindAdminContactView,
  renderAdminAuditView,
  bindAdminAuditView
} from "./views/admin.js";

const app = document.getElementById("app");
const router = new Router();

router.add("/", () => ({ html: renderHomeView() }));
router.add("/about", () => ({ html: renderAboutView() }));
router.add("/beliefs", ({ query }) => ({ html: renderBeliefsView(query), bind: () => bindBeliefsView(query) }));
router.add("/contact", () => ({ html: renderContactView(), bind: bindContactView }));

router.add("/blog", ({ query }) => ({ html: renderBlogListView(query), bind: bindBlogListView }));
router.add("/blog/:slug", ({ params }) => ({ html: renderBlogSingleView(params.slug) }));

router.add("/forum", ({ query }) => ({ html: renderForumCategoriesView(query), bind: bindForumCategoriesView }));
router.add("/forum/:categorySlug", ({ params, query }) => ({
  html: renderForumCategoryView(params.categorySlug, query),
  bind: () => bindForumCategoryView(params.categorySlug)
}));
router.add("/thread/:threadSlug", ({ params, query }) => ({
  html: renderThreadView(params.threadSlug, query),
  bind: () => bindThreadView(params.threadSlug)
}));

router.add("/page/:slug", ({ params }) => ({ html: renderCmsPageView(params.slug) }));
router.add("/login", () => ({ html: renderLoginView(), bind: bindLoginView }));

router.add("/admin", ({ path }) => ({ html: renderAdminDashboardView(path), bind: bindAdminDashboardView }), { roles: ["Admin"] });
router.add("/admin/pages", ({ path }) => ({ html: renderAdminPagesView(path), bind: bindAdminPagesView }), { roles: ["Admin"] });
router.add("/admin/blog", ({ path }) => ({ html: renderAdminBlogView(path), bind: bindAdminBlogView }), { roles: ["Admin"] });
router.add("/admin/forum", ({ path }) => ({ html: renderAdminForumView(path), bind: bindAdminForumView }), { roles: ["Admin", "Moderator"] });
router.add("/admin/contact", ({ path, query }) => ({ html: renderAdminContactView(path, query), bind: bindAdminContactView }), { roles: ["Admin"] });
router.add("/admin/audit", ({ path }) => ({ html: renderAdminAuditView(path), bind: bindAdminAuditView }), { roles: ["Admin"] });

function renderRoute(event) {
  const resolved = router.resolve();
  if (!resolved) return;
  app.innerHTML = renderLayout({ routePath: resolved.path, contentHtml: resolved.html });
  bindLayoutEvents();
  document.title = `${app.querySelector('h1')?.textContent.trim() || 'Welcome'} · Christian Jutsu`;
  if (event?.type === 'hashchange') {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }
  if (typeof resolved.bind === "function") resolved.bind();
}

try {
  initStore();
  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("cj:refresh", renderRoute);
  if (!window.location.hash) window.history.replaceState(null, '', '#/');
  renderRoute();
} catch (error) {
  app.innerHTML = `<main class="container app-loading"><h1>Our church community</h1><p>The community features need browser storage. Enable storage for this site and reload.</p><p><a href="about.html">About our faith</a> · <a href="practices.html">Read the practices</a> · <a href="exercises.html">Daily exercises</a></p></main>`;
  console.error(error);
}
