/* Shared navigation for the application and the original reading pages. */
(() => {
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const practiceLinks = [ ['All practices', 'practices.html'], ['Daily exercises', 'exercises.html'], ['Renunciations', 'renunciations.html'] ];
  // Prayer guides, shown in the Prayers menu and footer. To add a prayer, add a line here,
  // then run: node scripts/sync-shell.mjs
  const prayerLinks = [ ['Banishing and clearing', 'banishing-and-clearing.html'], ['Heavenly places', 'heavenly-places-prayer.html'], ['Exorcism', 'exorcism-prayer.html'] ];
  const prayerMenuLinks = [ ['All prayers', 'prayers.html'], ...prayerLinks ];
  const appHref = (route) => `index.html#${route}`;
  function header({routePath = '/', user = null, pages = []} = {}) {
    const active = (path) => routePath === path || (path !== '/' && routePath.startsWith(path + '/'));
    const link = (text, href, selected) => `<a href="${href}"${selected ? ' class="is-active" aria-current="page"' : ''}>${escape(text)}</a>`;
    // A menu is highlighted when the current page is one of its links; links with a # are ignored.
    const isPage = (href) => !href.includes('#') && routePath === '/' + href.replace('.html', '');
    const menu = (title, links) => `<details class="nav-group${links.some(([, href]) => isPage(href)) ? ' is-active' : ''}"><summary>${title} <span aria-hidden="true">⌄</span></summary><div class="nav-panel">${links.map(([label, href]) => link(label, href, isPage(href))).join('')}</div></details>`;
    return `<a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header"><div class="site-header-inner">
        <a class="site-brand" href="${appHref('/')}" aria-label="Christian Jutsu home"><span class="brand-mark" aria-hidden="true">✝</span><span>Christian Jutsu<small>FAITH LIVED DAILY</small></span></a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation"><span aria-hidden="true">☰</span> Menu</button>
        <nav class="site-navigation" id="site-navigation" aria-label="Main navigation">
          ${link('Home', appHref('/'), active('/'))}
          ${link('About', 'about.html', active('/about'))}
          ${link('Beliefs', appHref('/beliefs'), active('/beliefs'))}
          ${menu('Practice', practiceLinks)}
          ${menu('Prayers', prayerMenuLinks)}
          ${link('Blog', appHref('/blog'), active('/blog'))}
          ${link('Forum', appHref('/forum'), active('/forum') || active('/thread'))}
          ${link('Contact', appHref('/contact'), active('/contact'))}
          ${pages.length ? `<details class="nav-group"><summary>More <span aria-hidden="true">⌄</span></summary><div class="nav-panel">${pages.map(p => link(p.title, appHref('/page/' + encodeURIComponent(p.slug)), active('/page/' + p.slug))).join('')}</div></details>` : ''}
          ${user?.role === 'Admin' ? link('Admin', appHref('/admin'), active('/admin')) : user?.role === 'Moderator' ? link('Moderate', appHref('/admin/forum'), active('/admin/forum')) : ''}
          ${user ? `<button class="session-button" id="logoutBtn" type="button" title="Signed in as ${escape(user.name)}">Sign out</button>` : `<a class="session-button" href="${appHref('/login')}">Sign in <span aria-hidden="true">↗</span></a>`}
        </nav>
      </div></header>`;
  }
  function footer() {
    return `<footer class="site-footer"><div class="footer-grid">
      <div><a class="footer-brand" href="${appHref('/')}">✝ Our church</a><p>Rooted in grace.<br>Formed by the words of Christ.<br>Lived in community.</p></div>
      <div><h2>Discover</h2><a href="about.html">Our church community</a><a href="${appHref('/beliefs')}">What we believe</a><a href="${appHref('/blog')}">Reflections &amp; writing</a></div>
      <div><h2>Practice</h2><a href="practices.html">Practice library</a><a href="exercises.html">Daily exercises</a><a href="renunciations.html">Renunciations</a></div>
      <div><h2>Prayers</h2>${prayerMenuLinks.map(([label, href]) => `<a href="${href}">${escape(label)}</a>`).join('')}</div>
      <div><h2>Connect</h2><a href="${appHref('/forum')}">Community forum</a><a href="${appHref('/contact')}">Contact</a><a href="${appHref('/login')}">Member sign in</a><a href="docs/christian-jutsu-framework-v2.1.md" download>Doctrinal framework ↗</a></div>
    </div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Christian Jutsu</span><span>May grace and peace be with you.</span></div></footer>`;
  }
  function bind() {
    const button = document.querySelector('.menu-toggle');
    const nav = document.getElementById('site-navigation');
    const close = () => { nav?.classList.remove('is-open'); button?.setAttribute('aria-expanded','false'); };
    button?.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open)); nav?.classList.toggle('is-open', open);
    });
    nav?.addEventListener('click', (event) => { if (event.target.closest('a')) { close(); nav.querySelectorAll('details[open]').forEach((d) => { d.open = false; }); } });
    document.querySelector('.site-header')?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { close(); nav?.querySelectorAll('details[open]').forEach(el => el.open = false); button?.focus(); }
    });
    nav?.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => {
      if (detail.open) nav.querySelectorAll('details').forEach(other => { if (other !== detail) other.open = false; });
    }));
  }
  window.CJSite = {header, footer, bind};
})();
