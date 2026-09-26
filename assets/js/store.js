const DB_KEY = "cj_db";
const SESSION_KEY = "cj_session";

const COLLECTIONS = [
  "users",
  "pages",
  "blogPosts",
  "tags",
  "forumCategories",
  "forumThreads",
  "forumPosts",
  "contactMessages",
  "auditLogs"
];

function now() {
  return new Date().toISOString();
}

function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function baseRecord(createdBy = "system") {
  const ts = now();
  return {
    id: uid(),
    createdAt: ts,
    updatedAt: ts,
    createdBy,
    isDeleted: false
  };
}

export function slugify(input) {
  return String(input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "item";
}

export function uniqueSlug(collection, title, currentId = null, field = "slug") {
  const rows = getCollection(collection, true).filter((r) => !r.isDeleted && r.id !== currentId);
  const existing = new Set(rows.map((r) => r[field]));
  const base = slugify(title);
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export function getDb() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && COLLECTIONS.every((key) => Array.isArray(parsed[key])) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    throw new Error("Browser storage is unavailable or full. Allow site storage or clear unneeded demo data and try again.");
  }
}

function emptyDb() {
  const db = { meta: { version: 1, initializedAt: now() } };
  COLLECTIONS.forEach((key) => {
    db[key] = [];
  });
  return db;
}

function push(collection, payload, createdBy = "system") {
  const db = requireDb();
  const row = { ...baseRecord(createdBy), ...payload };
  db[collection].push(row);
  saveDb(db);
  return row;
}

function seedInitialData() {
  const admin = push("users", {
    email: "admin@christianjutsu.local",
    password: "Admin123!",
    name: "Head Sensei",
    role: "Admin"
  });

  const mod = push("users", {
    email: "moderator@christianjutsu.local",
    password: "Mod123!",
    name: "Forum Steward",
    role: "Moderator"
  });

  const user = push("users", {
    email: "user@christianjutsu.local",
    password: "User123!",
    name: "Dojo Student",
    role: "User"
  });

  const page = push("pages", {
    title: "Rules",
    slug: "rules",
    content: "Walk with discipline, pray with humility, and speak with mercy.",
    isPublished: true
  }, admin.id);

  const tagPrayer = push("tags", { name: "Prayer", slug: "prayer" }, admin.id);
  const tagDiscipline = push("tags", { name: "Discipline", slug: "discipline" }, admin.id);

  push("blogPosts", {
    title: "The First Bow: Reverence Before Action",
    slug: "the-first-bow-reverence-before-action",
    excerpt: "A short reflection on posture, intention, and prayerful discipline.",
    content: "Before any strike, there is stillness. Before any argument, there is listening.",
    tags: [tagPrayer.slug, tagDiscipline.slug],
    status: "Published",
    publishedAt: now()
  }, admin.id);

  push("blogPosts", {
    title: "How to Train the Quiet Mind",
    slug: "how-to-train-the-quiet-mind",
    excerpt: "Practical daily habits for focused devotion.",
    content: "Take ten minutes at dawn. Breathe. Read one passage. Write one action.",
    tags: [tagDiscipline.slug],
    status: "Published",
    publishedAt: now()
  }, admin.id);

  const cat1 = push("forumCategories", {
    name: "Scripture and Sparring",
    slug: "scripture-and-sparring",
    description: "Discuss spiritual principles in daily training."
  }, admin.id);

  const cat2 = push("forumCategories", {
    name: "Prayer Requests",
    slug: "prayer-requests",
    description: "Community support and prayer threads."
  }, admin.id);

  const th1 = push("forumThreads", {
    categoryId: cat1.id,
    title: "How do you handle anger in debate?",
    slug: "how-do-you-handle-anger-in-debate",
    authorId: user.id,
    isLocked: false,
    lastActivityAt: now()
  }, user.id);

  const th2 = push("forumThreads", {
    categoryId: cat2.id,
    title: "Weekly prayer thread",
    slug: "weekly-prayer-thread",
    authorId: mod.id,
    isLocked: false,
    lastActivityAt: now()
  }, mod.id);

  push("forumPosts", {
    threadId: th1.id,
    authorId: user.id,
    content: "I pause and pray before answering. It keeps my words cleaner."
  }, user.id);

  push("forumPosts", {
    threadId: th1.id,
    authorId: mod.id,
    content: "I ask a clarifying question first. Slows the heat down quickly."
  }, mod.id);

  push("forumPosts", {
    threadId: th2.id,
    authorId: mod.id,
    content: "Share requests below. We will pray together tonight."
  }, mod.id);

  push("forumPosts", {
    threadId: th2.id,
    authorId: user.id,
    content: "Please pray for my family this week."
  }, user.id);

  push("auditLogs", {
    actorId: admin.id,
    action: "seed",
    entityType: "system",
    entityId: page.id,
    detail: "Initial demo data seeded"
  }, admin.id);
}

// Browsers seeded before the rename still hold the old "Rule of the Dojo Chapel" page.
function renameLegacyRulesPage(db) {
  const page = db.pages.find((p) => p.slug === "rule-of-the-dojo-chapel");
  if (!page) return;
  page.title = "Rules";
  page.slug = uniqueSlug("pages", "Rules", page.id);
  page.updatedAt = now();
  saveDb(db);
}

export function initStore() {
  let db = getDb();
  if (!db) {
    db = emptyDb();
    saveDb(db);
    seedInitialData();
  } else {
    renameLegacyRulesPage(db);
  }
}

export function resetDemoData() {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem(SESSION_KEY);
  initStore();
}

export function requireDb() {
  const db = getDb();
  if (!db) {
    initStore();
    return getDb();
  }
  return db;
}

export function getCollection(collection, includeDeleted = false) {
  const db = requireDb();
  const rows = db[collection] || [];
  return includeDeleted ? rows : rows.filter((x) => !x.isDeleted);
}

export function findById(collection, id, includeDeleted = false) {
  return getCollection(collection, true).find((x) => x.id === id && (includeDeleted || !x.isDeleted)) || null;
}

export function insert(collection, payload, createdBy = "system") {
  const db = requireDb();
  const row = { ...baseRecord(createdBy), ...payload };
  db[collection].push(row);
  saveDb(db);
  return row;
}

export function update(collection, id, changes) {
  const db = requireDb();
  const row = db[collection].find((x) => x.id === id);
  if (!row) return null;
  Object.assign(row, changes, { updatedAt: now() });
  saveDb(db);
  return row;
}

export function softDelete(collection, id) {
  return update(collection, id, { isDeleted: true });
}

export function upsertTagByName(name, createdBy = "system") {
  const norm = String(name || "").trim();
  if (!norm) return null;
  const slug = uniqueSlug("tags", norm, null, "slug");
  const existing = getCollection("tags").find((t) => t.name.toLowerCase() === norm.toLowerCase());
  if (existing) return existing;
  return insert("tags", { name: norm, slug }, createdBy);
}

export function getSessionKey() {
  return SESSION_KEY;
}

export function currentTimestamp() {
  return now();
}
