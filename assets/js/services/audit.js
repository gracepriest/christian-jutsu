import { getCollection, insert } from "../store.js";

export function logAction(actorId, action, entityType, entityId, detail = "") {
  return insert("auditLogs", { actorId, action, entityType, entityId, detail }, actorId || "system");
}

export function listAuditLogs() {
  return getCollection("auditLogs").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}