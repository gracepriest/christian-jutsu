export function renderNotFoundView() {
  return `
    <section class="cj-404 card cj-card">
      <div class="card-body p-5">
        <h1 class="display-6">404: Corridor Ends Here</h1>
        <p class="lead">The lanterns fade, and this path does not exist.</p>
        <a class="btn btn-primary" href="#/"><i class="bi bi-house-door me-1"></i>Return Home</a>
      </div>
    </section>
  `;
}