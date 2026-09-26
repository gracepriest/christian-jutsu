import { listPublicBlogPosts } from '../services/blog.js';
import { listForumCategories, listThreadsByCategory } from '../services/forum.js';
import { escapeHtml, formatDate } from '../ui.js';

export function renderHomeView() {
  const posts = listPublicBlogPosts().slice(0, 3);
  const categories = listForumCategories().slice(0, 2);
  return `
    <section class="home-hero" aria-labelledby="welcome-title">
      <div class="hero-copy"><p class="eyebrow"><span></span> WELCOME TO OUR CHURCH</p>
        <h1 id="welcome-title">Rooted in grace.<br>Growing in <em>Christ.</em></h1>
        <p class="hero-intro">A church community where we worship, grow in faith, and care for one another. Begin with what Christ has already given.</p>
        <div class="hero-actions"><a class="button button-primary" href="index.html#/beliefs">Explore our beliefs <span aria-hidden="true">↗</span></a><a class="text-link" href="practices.html">Find a practice <span aria-hidden="true">→</span></a></div>
        <div class="hero-footnote"><span class="tiny-cross" aria-hidden="true">✝</span> Grace is the foundation. Growth is the journey.</div>
      </div>
      <div class="hero-art" aria-label="A cross within an arched chapel window"><div class="chapel-window"><div class="window-ring ring-one"></div><div class="window-ring ring-two"></div><div class="window-light"></div><div class="window-cross"></div><div class="window-hills"></div><div class="window-sill"></div></div><div class="art-caption"><span>ABIDE IN ME, AND I IN YOU.</span><span>JOHN 15:4</span></div><span class="art-label">FAITH · PRACTICE · COMMUNITY</span></div>
    </section>
    <div class="foundation-strip"><p>One foundation.<br><strong>A whole life of faith.</strong></p><span>Grace received</span><span>Identity in Christ</span><span>A renewed mind</span><span>Life in the Spirit</span></div>
    <section class="home-section"><div class="section-heading"><div><p class="eyebrow">A PLACE TO BEGIN</p><h2>Make room for what matters.</h2></div><p>Explore the teaching.<br>Put faith into everyday practice.</p></div>
      <div class="path-grid">
        <a class="path-card" href="index.html#/beliefs"><span class="path-number">01 / BELIEVE</span><span class="path-symbol" aria-hidden="true">✝</span><h3>A foundation of grace</h3><p>Explore what we believe about salvation, identity, abiding, and the life of the Spirit.</p><span class="card-link">What we believe <span>↗</span></span></a>
        <a class="path-card" href="practices.html"><span class="path-number">02 / PRACTICE</span><span class="path-symbol" aria-hidden="true">✧</span><h3>Faith with intention</h3><p>Explore baptism, Communion, prayer, and step-by-step devotional guides centered on Christ.</p><span class="card-link">Explore the practices <span>↗</span></span></a>
        <a class="path-card" href="exercises.html"><span class="path-number">03 / GROW</span><span class="path-symbol" aria-hidden="true">☼</span><h3>Small, faithful rhythms</h3><p>Bring Scripture, reflection, forgiveness, and gratitude into the ordinary moments of your day.</p><span class="card-link">Find a daily exercise <span>↗</span></span></a>
      </div>
    </section>
    <section class="abiding-feature"><div><p class="eyebrow">THE HEART OF OUR PRACTICE</p><h2>Let His words<br>make their home in you.</h2></div><div><p>Our life together begins with our union with Christ. We return to His words, consider their meaning, and let His character shape how we think, love, and act.</p><p>Prayer and practice respond to grace already given. God remains the source; the Holy Spirit brings the fruit.</p><a class="text-link" href="index.html#/beliefs?article=22">Read about abiding <span aria-hidden="true">→</span></a></div></section>
    <section class="home-section"><div class="section-heading"><div><p class="eyebrow">FROM THE JOURNAL</p><h2>Thoughts for the journey.</h2></div><a class="text-link" href="index.html#/blog">All reflections <span aria-hidden="true">→</span></a></div><div class="journal-grid">${posts.map((post, index) => `<article class="journal-card"><div class="journal-meta"><span>REFLECTION ${String(index+1).padStart(2,'0')}</span><time datetime="${escapeHtml(post.publishedAt || post.createdAt)}">${formatDate(post.publishedAt || post.createdAt)}</time></div><h3><a href="index.html#/blog/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.excerpt)}</p><a class="text-link" href="index.html#/blog/${encodeURIComponent(post.slug)}">Read reflection <span aria-hidden="true">↗</span></a></article>`).join('') || '<p>Reflections will appear here when published.</p>'}</div></section>
    <section class="community-feature"><div><p class="eyebrow">WALK TOGETHER</p><h2>There is room<br>for you here.</h2><p>Bring your questions, share a reflection, or join a conversation about living out your faith.</p><a class="button button-light" href="index.html#/forum">Enter the community <span aria-hidden="true">↗</span></a></div><div class="community-topics">${categories.map(category => `<a href="index.html#/forum/${encodeURIComponent(category.slug)}"><span class="topic-count">${listThreadsByCategory(category.id).length} THREADS</span><h3>${escapeHtml(category.name)} <span aria-hidden="true">↗</span></h3><p>${escapeHtml(category.description || '')}</p></a>`).join('') || '<p>New conversations are welcome.</p>'}</div></section>
  `;
}
