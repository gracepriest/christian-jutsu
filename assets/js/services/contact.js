import { getCollection, insert, update, findById } from "../store.js";
import { logAction } from "./audit.js";
import { assertRole } from "../auth.js";

const THROTTLE_MS = 30000;

function validateMessage(input) {
  if (!input.name || input.name.trim().length < 2) throw new Error("Name is required");
  if (!input.email || !/^\S+@\S+\.\S+$/.test(input.email.trim())) throw new Error("Valid email is required");
  if (!input.message || input.message.trim().length < 10) throw new Error("Message must be at least 10 characters");
}

export function submitContactMessage(input, createdBy = "public") {
  if (String(input.website || "").trim()) throw new Error("Unable to save this message. Leave the website field blank.");
  validateMessage(input);
  const latest = getCollection("contactMessages").reduce((timestamp, row) => Math.max(timestamp, Date.parse(row.createdAt) || 0), 0);
  const remaining = THROTTLE_MS - (Date.now() - latest);
  if (remaining > 0) throw new Error(`Please wait ${Math.ceil(remaining / 1000)} seconds before saving another message.`);
  const message = insert("contactMessages", {
    name: input.name.trim().slice(0, 120),
    email: input.email.trim().toLowerCase(),
    subject: String(input.subject || "").trim().slice(0, 160),
    message: input.message.trim().slice(0, 4000),
    status: "Open"
  }, createdBy);
  logAction(createdBy, "submit", "contact-message", message.id, "Saved contact message to the local inbox");
  return message;
}

export function listContactMessages(filter = "all") {
  const rows = getCollection("contactMessages").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (filter === "open") return rows.filter((r) => r.status === "Open");
  if (filter === "resolved") return rows.filter((r) => r.status === "Resolved");
  return rows;
}

export function markContactResolved(id, actor) {
  assertRole(actor, ["Admin"]);
  const row = findById("contactMessages", id);
  if (!row) throw new Error("Message not found");
  const updated = update("contactMessages", id, { status: "Resolved", resolvedAt: new Date().toISOString() });
  logAction(actor.id, "resolve", "contact-message", id, "Marked contact message resolved");
  return updated;
}
