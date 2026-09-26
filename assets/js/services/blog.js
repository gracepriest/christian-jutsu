import { getCollection, findById, insert, update, softDelete, uniqueSlug, upsertTagByName } from "../store.js";
import { logAction } from "./audit.js";
import { assertRole } from "../auth.js";

function normalizeTags(tagCsv, actorId) {
  const tags = String(tagCsv || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return [...new Set(tags.map((name) => {
    const existing = getCollection("tags").find((tag) => tag.slug === name.toLowerCase() || tag.name.toLowerCase() === name.toLowerCase());
    return (existing || upsertTagByName(name, actorId)).slug;
  }))];
}

function validate(input) {
  if (!input.title || input.title.trim().length < 3) throw new Error("Post title must be at least 3 characters");
  if (!input.excerpt || input.excerpt.trim().length < 8) throw new Error("Excerpt must be at least 8 characters");
  if (!input.content || input.content.trim().length < 20) throw new Error("Content must be at least 20 characters");
  if (input.publishedAt && Number.isNaN(new Date(input.publishedAt).getTime())) throw new Error("Choose a valid publication date");
}

export function listPublicBlogPosts() {
  return getCollection("blogPosts")
    .filter((p) => p.status === "Published")
    .sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt));
}

export function listAllBlogPosts() {
  return getCollection("blogPosts").sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getBlogPostBySlug(slug, includeDraft = false) {
  const post = getCollection("blogPosts", true).find((p) => p.slug === slug && !p.isDeleted);
  if (!post) return null;
  if (!includeDraft && post.status !== "Published") return null;
  return post;
}

export function getBlogPostById(id) {
  return findById("blogPosts", id);
}

export function searchBlogPosts(term) {
  const q = String(term || "").trim().toLowerCase();
  if (!q) return listPublicBlogPosts();
  return listPublicBlogPosts().filter((p) =>
    [p.title, p.excerpt, p.content].some((f) => String(f || "").toLowerCase().includes(q))
  );
}

export function createBlogPost(input, actor) {
  assertRole(actor, ["Admin"]);
  validate(input);
  const slug = uniqueSlug("blogPosts", input.slug || input.title);
  const tags = normalizeTags(input.tags, actor.id);
  const post = insert("blogPosts", {
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim().slice(0, 400),
    content: input.content.trim().slice(0, 30000),
    tags,
    status: input.status === "Published" ? "Published" : "Draft",
    publishedAt: input.status === "Published" ? (input.publishedAt || new Date().toISOString()) : null
  }, actor.id);
  logAction(actor.id, "create", "blog", post.id, `Created post ${post.title}`);
  return post;
}

export function updateBlogPost(id, input, actor) {
  assertRole(actor, ["Admin"]);
  const current = findById("blogPosts", id);
  if (!current) throw new Error("Post not found");
  validate(input);
  const slug = uniqueSlug("blogPosts", input.slug || input.title, id);
  const status = input.status === "Published" ? "Published" : "Draft";
  const publishedAt = status === "Published" ? (input.publishedAt || current.publishedAt || new Date().toISOString()) : null;
  const post = update("blogPosts", id, {
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim().slice(0, 400),
    content: input.content.trim().slice(0, 30000),
    tags: normalizeTags(input.tags, actor.id),
    status,
    publishedAt
  });
  logAction(actor.id, "update", "blog", id, `Updated post ${post.title}`);
  return post;
}

export function deleteBlogPost(id, actor) {
  assertRole(actor, ["Admin"]);
  const row = softDelete("blogPosts", id);
  if (!row) throw new Error("Post not found");
  logAction(actor.id, "delete", "blog", id, "Soft deleted post");
  return row;
}
