import { login } from "../auth.js";
import { toast, navigate } from "../ui.js";

export function renderLoginView() {
  return `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card cj-card">
          <div class="card-body p-4">
            <h1 class="h4 mb-3">Community demo login</h1>
            <p>Explore the community tools with a demo account. Accounts and changes are stored only in this browser. This is not a secure production login; do not use a personal password.</p>
            <form id="loginForm">
              <div class="mb-3">
                <label class="form-label" for="loginEmail">Email</label>
                <input class="form-control" type="email" name="email" id="loginEmail" autocomplete="username" required>
              </div>
              <div class="mb-3">
                <label class="form-label" for="loginPassword">Password</label>
                <input class="form-control" type="password" name="password" id="loginPassword" autocomplete="current-password" required>
              </div>
              <button class="btn btn-primary w-100" type="submit">Sign In</button>
            </form>
            <small class="text-muted d-block mt-3">Admin demo: admin@christianjutsu.local / Admin123!</small>
            <small class="text-muted d-block mt-3">Moderator demo: moderator@christianjutsu.local / Mod123!</small>
            <small class="text-muted d-block mt-3">Member demo: user@christianjutsu.local / User123!</small>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindLoginView() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const user = login(String(fd.get("email") || ""), String(fd.get("password") || ""));
    if (!user) {
      toast("Invalid credentials.", "danger");
      return;
    }
    toast(`Welcome ${user.name}.`, "success");
    navigate(user.role === "Admin" ? "#/admin" : user.role === "Moderator" ? "#/admin/forum" : "#/forum");
  });
}
