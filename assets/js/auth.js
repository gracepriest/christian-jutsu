import { findById, getCollection, getSessionKey } from "./store.js";

const SESSION_KEY = getSessionKey();

export function login(email, password) {
  const user = getCollection("users").find(
    (u) => u.email.toLowerCase() === String(email || "").trim().toLowerCase() && u.password === password
  );
  if (!user) return null;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, at: new Date().toISOString() }));
  return user;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  const session = getSession();
  if (!session?.userId) return null;
  return findById("users", session.userId);
}

export function hasRole(user, roles = []) {
  if (!user) return false;
  return roles.includes(user.role);
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

export function requireAuth(roles = []) {
  const user = getCurrentUser();
  if (!user) return { ok: false, reason: "login" };
  if (roles.length && !hasRole(user, roles)) return { ok: false, reason: "forbidden" };
  return { ok: true, user };
}

// This checks demo roles for application behavior; browser storage is not a security boundary.
export function assertRole(actor, roles = []) {
  const current = getCurrentUser();
  if (!actor || !current || current.id !== actor.id || (roles.length && !roles.includes(current.role))) {
    throw new Error("Please sign in with an account allowed to perform this action.");
  }
  return current;
}
