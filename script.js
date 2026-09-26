// The reading pages remain readable without JavaScript. Enhance their shared navigation.
(() => {
  const routePath = '/' + location.pathname.split('/').pop().replace('.html', '');
  let user = null;
  let pages = [];
  try {
    const db = JSON.parse(localStorage.getItem('cj_db') || 'null');
    const session = JSON.parse(localStorage.getItem('cj_session') || 'null');
    user = db?.users?.find(row => row.id === session?.userId && !row.isDeleted) || null;
    pages = db?.pages?.filter(row => row.isPublished && !row.isDeleted) || [];
  } catch { /* Reading pages also work when browser storage is unavailable. */ }
  const header = document.querySelector('.site-header');
  if (header) {
    document.querySelector('.skip-link')?.remove();
    header.outerHTML = window.CJSite.header({routePath, user, pages});
  }
  window.CJSite.bind();
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('cj_session');
    window.location.href = 'index.html#/';
  });
})();
