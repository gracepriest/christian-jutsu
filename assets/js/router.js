import { requireAuth } from "./auth.js";
import { parseQuery, navigate } from "./ui.js";
import { renderNotFoundView } from "./views/notfound.js";

function compilePath(path) {
  const keys = [];
  const pattern = path.split("/").map((segment) => {
    if (/^:[A-Za-z0-9_]+$/.test(segment)) {
      keys.push(segment.slice(1));
      return "([^/]+)";
    }
    return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("/");
  const regex = new RegExp(`^${pattern}$`);
  return { regex, keys };
}

function normalize(hash) {
  const raw = (hash || "#/").replace(/^#/, "");
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export class Router {
  constructor() {
    this.routes = [];
  }

  add(path, handler, opts = {}) {
    const c = compilePath(path);
    this.routes.push({ path, handler, ...c, ...opts });
  }

  match(fullPath) {
    const question = fullPath.indexOf("?");
    const pathname = question < 0 ? fullPath : fullPath.slice(0, question);
    const search = question < 0 ? "" : fullPath.slice(question + 1);
    for (const route of this.routes) {
      const m = pathname.match(route.regex);
      if (!m) continue;
      const params = {};
      try {
        route.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      } catch {
        return { route: null, pathname, params: {}, query: parseQuery(search) };
      }
      return { route, pathname, params, query: parseQuery(search) };
    }
    return { route: null, pathname, params: {}, query: parseQuery(search) };
  }

  resolve() {
    const fullPath = normalize(window.location.hash);
    const m = this.match(fullPath);
    if (!m.route) {
      return { path: m.pathname, html: renderNotFoundView(), bind: null };
    }

    if (m.route.roles) {
      const auth = requireAuth(m.route.roles);
      if (!auth.ok) {
        navigate(auth.reason === "login" ? "#/login" : "#/");
        return null;
      }
    }

    const result = m.route.handler({
      path: m.pathname,
      params: m.params,
      query: m.query
    });

    return {
      path: m.pathname,
      html: result?.html || "",
      bind: result?.bind || null
    };
  }
}
