import { getCollection, findById, insert, update, softDelete, uniqueSlug } from "../store.js";
import { logAction } from "./audit.js";
import { assertRole } from "../auth.js";

function validateTitle(title) {
  if (!title || title.trim().length < 3) throw new Error("Title must be at least 3 characters");
}

export function listPublishedPages() {
  return getCollection("pages")
    .filter((p) => p.isPublished)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function listAllPages() {
  return getCollection("pages").sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getPageBySlug(slug, includeUnpublished = false) {
  const page = getCollection("pages", true).find((p) => p.slug === slug && !p.isDeleted);
  if (!page) return null;
  if (!includeUnpublished && !page.isPublished) return null;
  return page;
}

export function getPageById(id) {
  return findById("pages", id);
}

export function createPage(input, actor) {
  assertRole(actor, ["Admin"]);
  validateTitle(input.title);
  const slug = uniqueSlug("pages", input.slug || input.title);
  const page = insert("pages", {
    title: input.title.trim(),
    slug,
    content: String(input.content || "").slice(0, 20000),
    isPublished: Boolean(input.isPublished)
  }, actor.id);
  logAction(actor.id, "create", "page", page.id, `Created page ${page.title}`);
  return page;
}

export function updatePage(id, input, actor) {
  assertRole(actor, ["Admin"]);
  const current = findById("pages", id);
  if (!current) throw new Error("Page not found");
  validateTitle(input.title);
  const slug = uniqueSlug("pages", input.slug || input.title, id);
  const page = update("pages", id, {
    title: input.title.trim(),
    slug,
    content: String(input.content || "").slice(0, 20000),
    isPublished: Boolean(input.isPublished)
  });
  logAction(actor.id, "update", "page", id, `Updated page ${page.title}`);
  return page;
}

export function togglePagePublish(id, actor) {
  assertRole(actor, ["Admin"]);
  const page = findById("pages", id);
  if (!page) throw new Error("Page not found");
  const updated = update("pages", id, { isPublished: !page.isPublished });
  logAction(actor.id, "publish-toggle", "page", id, `${updated.isPublished ? "Published" : "Unpublished"} page`);
  return updated;
}

export function deletePage(id, actor) {
  assertRole(actor, ["Admin"]);
  const row = softDelete("pages", id);
  if (!row) throw new Error("Page not found");
  logAction(actor.id, "delete", "page", id, "Soft deleted page");
  return row;
}
