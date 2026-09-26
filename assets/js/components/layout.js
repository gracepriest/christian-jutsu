import { getCurrentUser, logout } from '../auth.js';
import { listPublishedPages } from '../services/pages.js';

export function renderLayout({ routePath, contentHtml }) {
  return `${window.CJSite.header({routePath, user: getCurrentUser(), pages: listPublishedPages()})}
    <main class="container site-main${routePath === '/' ? ' home-main' : ''}" id="main-content" tabindex="-1">${contentHtml}</main>
    ${window.CJSite.footer()}`;
}

export function bindLayoutEvents() {
  window.CJSite.bind();
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logout();
    if (window.location.hash === '#/') window.dispatchEvent(new Event('cj:refresh'));
    else window.location.hash = '#/';
  });
}
