import { getCollection, findById, insert, update, softDelete, uniqueSlug, currentTimestamp } from "../store.js";
import { logAction } from "./audit.js";
import { assertRole } from "../auth.js";

function validateText(text, min = 3) {
  if (!text || text.trim().length < min) throw new Error(`Text must be at least ${min} characters`);
}

export function listForumCategories() {
  return getCollection("forumCategories").sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategoryBySlug(slug) {
  return getCollection("forumCategories").find((c) => c.slug === slug) || null;
}

export function getCategoryById(id) {
  return findById("forumCategories", id);
}

export function createCategory(input, actor) {
  assertRole(actor, ["Admin"]);
  validateText(input.name, 3);
  const slug = uniqueSlug("forumCategories", input.slug || input.name);
  const category = insert("forumCategories", {
    name: input.name.trim(),
    slug,
    description: String(input.description || "").trim().slice(0, 500)
  }, actor.id);
  logAction(actor.id, "create", "forum-category", category.id, `Created category ${category.name}`);
  return category;
}

export function updateCategory(id, input, actor) {
  assertRole(actor, ["Admin"]);
  const current = findById("forumCategories", id);
  if (!current) throw new Error("Category not found");
  validateText(input.name, 3);
  const slug = uniqueSlug("forumCategories", input.slug || input.name, id);
  const row = update("forumCategories", id, {
    name: input.name.trim(),
    slug,
    description: String(input.description || "").trim().slice(0, 500)
  });
  logAction(actor.id, "update", "forum-category", id, `Updated category ${row.name}`);
  return row;
}

export function deleteCategory(id, actor) {
  assertRole(actor, ["Admin"]);
  const row = softDelete("forumCategories", id);
  if (!row) throw new Error("Category not found");
  logAction(actor.id, "delete", "forum-category", id, "Soft deleted category");
  return row;
}

export function listThreadsByCategory(categoryId) {
  if (!findById("forumCategories", categoryId)) return [];
  return getCollection("forumThreads")
    .filter((t) => t.categoryId === categoryId)
    .sort((a, b) => (b.lastActivityAt || b.updatedAt).localeCompare(a.lastActivityAt || a.updatedAt));
}

export function getThreadBySlug(slug) {
  return getCollection("forumThreads").find((t) => t.slug === slug && findById("forumCategories", t.categoryId)) || null;
}

export function createThread(input, actor) {
  assertRole(actor);
  validateText(input.title, 4);
  validateText(input.content, 3);
  const category = findById("forumCategories", input.categoryId);
  if (!category) throw new Error("Category not found");
  const slug = uniqueSlug("forumThreads", input.slug || input.title);
  const thread = insert("forumThreads", {
    categoryId: category.id,
    title: input.title.trim(),
    slug,
    authorId: actor.id,
    isLocked: false,
    lastActivityAt: currentTimestamp()
  }, actor.id);

  insert("forumPosts", {
    threadId: thread.id,
    authorId: actor.id,
    content: input.content.trim().slice(0, 5000)
  }, actor.id);
  logAction(actor.id, "create", "thread", thread.id, `Created thread ${thread.title}`);
  return thread;
}

export function listPostsByThread(threadId) {
  return getCollection("forumPosts")
    .filter((p) => p.threadId === threadId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function replyToThread(threadId, content, actor) {
  assertRole(actor);
  const thread = findById("forumThreads", threadId);
  if (!thread) throw new Error("Thread not found");
  if (!findById("forumCategories", thread.categoryId)) throw new Error("Category not found");
  if (thread.isLocked) throw new Error("Thread is locked");
  validateText(content, 2);
  const post = insert("forumPosts", {
    threadId,
    authorId: actor.id,
    content: content.trim().slice(0, 5000)
  }, actor.id);
  update("forumThreads", threadId, { lastActivityAt: currentTimestamp() });
  logAction(actor.id, "reply", "thread", threadId, "Added a forum reply");
  return post;
}

export function lockThread(threadId, actor, locked = true) {
  assertRole(actor, ["Admin", "Moderator"]);
  if (!findById("forumThreads", threadId)) throw new Error("Thread not found");
  const row = update("forumThreads", threadId, { isLocked: locked, lastActivityAt: currentTimestamp() });
  if (!row) throw new Error("Thread not found");
  logAction(actor.id, locked ? "lock" : "unlock", "thread", threadId, locked ? "Thread locked" : "Thread unlocked");
  return row;
}

export function deleteForumPost(postId, actor) {
  assertRole(actor, ["Admin", "Moderator"]);
  const post = softDelete("forumPosts", postId);
  if (!post) throw new Error("Post not found");
  logAction(actor.id, "delete", "forum-post", postId, "Soft deleted forum post");
  return post;
}

export function searchThreads(term) {
  const q = String(term || "").trim().toLowerCase();
  const categoryIds = new Set(getCollection("forumCategories").map((category) => category.id));
  const all = getCollection("forumThreads").filter((thread) => categoryIds.has(thread.categoryId)).sort((a, b) => (b.lastActivityAt || "").localeCompare(a.lastActivityAt || ""));
  if (!q) return all;
  return all.filter((t) => t.title.toLowerCase().includes(q));
}
