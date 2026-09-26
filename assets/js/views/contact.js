import { submitContactMessage } from "../services/contact.js";
import { toast } from "../ui.js";

export function renderContactView() {
  return `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card cj-card">
          <div class="card-body p-4">
            <h1 class="h3 mb-3">Contact</h1>
            <p id="contactHelp">Try the contact form. Messages stay in this browser's demo inbox and are not emailed or delivered to the church.</p>
            <form id="contactForm" aria-describedby="contactHelp">
              <div hidden aria-hidden="true"><label for="contactWebsite">Leave this field blank</label><input id="contactWebsite" name="website" autocomplete="off" tabindex="-1"></div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="contactName">Name</label>
                  <input class="form-control" name="name" id="contactName" autocomplete="name" minlength="2" maxlength="120" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="contactEmail">Email</label>
                  <input type="email" class="form-control" name="email" id="contactEmail" autocomplete="email" maxlength="160" required>
                </div>
                <div class="col-12">
                  <label class="form-label" for="contactSubject">Subject (optional)</label>
                  <input class="form-control" name="subject" id="contactSubject" maxlength="160">
                </div>
                <div class="col-12">
                  <label class="form-label" for="contactMessage">Message</label>
                  <textarea class="form-control" name="message" id="contactMessage" rows="5" minlength="10" maxlength="4000" required></textarea>
                </div>
              </div>
              <button class="btn btn-primary mt-3" type="submit">Save to demo inbox</button>
            </form>
            <p class="text-muted mt-3 mb-0">A demo administrator can review and resolve messages in this browser. Please leave 30 seconds between submissions.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindContactView() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      website: String(fd.get("website") || ""),
      message: String(fd.get("message") || "")
    };

    try {
      submitContactMessage(payload);
      toast("Message saved in this browser's demo inbox. No email was sent.", "success");
      form.reset();
    } catch (err) {
      toast(err.message, "danger");
    }
  });
}
