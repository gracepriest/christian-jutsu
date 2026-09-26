/* Library pages (such as Exercises and Prayers): need filters, search, and shareable links.
 * The list itself is plain HTML built by scripts/build-library.mjs, so it works without this script.
 * The toolbar's data-noun / data-noun-plural name the items in status messages. */
(() => {
  const toolbar = document.getElementById('library-toolbar');
  const library = document.querySelector('.library');
  const search = document.getElementById('library-search');
  const status = document.getElementById('library-status');
  const noResults = document.getElementById('library-no-results');
  const header = document.querySelector('.site-header');
  if (!toolbar || !search || !status || !noResults || !library) return;
  const noun = toolbar.dataset.noun || 'item';
  const plural = toolbar.dataset.nounPlural || 'items';
  const buttons = [...toolbar.querySelectorAll('[data-need]')];
  const cards = [...document.querySelectorAll('.library-card')];
  const groups = [...document.querySelectorAll('.library-group')];
  // Search the title and content only, not the time or "Longer" labels, the "Also in" links, or button labels.
  const searchableText = (card) => [card.querySelector('summary h3'), ...card.querySelectorAll('.library-body > :not(.library-footer)')]
    .map((element) => element.textContent).join(' ').toLocaleLowerCase();
  const cardText = new Map(cards.map((card) => [card, searchableText(card)]));
  const needIds = new Set(buttons.map((button) => button.dataset.need));
  const labelTimers = new WeakMap();
  let current = 'all';
  let statusTimer;

  toolbar.hidden = false;
  document.querySelectorAll('[data-copy-link], [data-close]').forEach((button) => { button.hidden = false; });

  const count = (n) => `${n} ${n === 1 ? noun : plural}`;

  function setStatus(parts) {
    status.replaceChildren(...parts.map((part) => {
      if (typeof part === 'string') return document.createTextNode(part);
      const strong = document.createElement('strong');
      strong.textContent = part.strong;
      return strong;
    }));
  }

  function updateStatus() {
    clearTimeout(statusTimer);
    const raw = search.value.trim();
    const shown = cards.filter((card) => !card.hidden).length;
    const needTitle = buttons.find((button) => button.dataset.need === current)?.dataset.title;
    if (raw && !shown) setStatus([`No ${plural} match “${raw}”.`]);
    else if (raw) setStatus([`${count(shown)} match “${raw}”`, ...(needTitle ? [' in ', { strong: needTitle }] : []), '.']);
    else if (needTitle) setStatus([`${count(shown)} for `, { strong: needTitle }, '.']);
    else setStatus([`Showing all ${count(shown)}.`]);
  }

  // Updates the cards right away. While typing, the status line waits for a pause
  // so screen readers are not interrupted on every keystroke.
  function apply({ debounceStatus = false } = {}) {
    const term = search.value.trim().toLocaleLowerCase();
    let shown = 0;
    for (const card of cards) {
      const inNeed = current === 'all' || (card.dataset.needs || '').split(' ').includes(current);
      const match = inNeed && (!term || cardText.get(card).includes(term));
      card.hidden = !match;
      if (match) shown += 1;
    }
    for (const group of groups) group.hidden = !group.querySelector('.library-card:not([hidden])');
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.need === current));
    noResults.hidden = shown > 0;
    if (debounceStatus) {
      clearTimeout(statusTimer);
      statusTimer = setTimeout(updateStatus, 400);
    } else {
      updateStatus();
    }
  }

  function setNeed(id, updateAddress) {
    current = needIds.has(id) ? id : 'all';
    apply();
    if (updateAddress) {
      history.replaceState(null, '', current === 'all' ? location.pathname + location.search : `#need=${current}`);
    }
  }

  // Applies #need=<id>, #<item-id>, or an empty hash (All). Returns 'need' | 'item' | null.
  // Any other hash (such as the #main-content skip link) or an unknown need is left alone,
  // except on first load, where the page falls back to All. An empty hash can only mean All,
  // because filter clicks replace the address rather than adding history entries.
  function fromAddress(initial) {
    let hash = location.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch { /* keep the raw hash */ }
    if (hash.startsWith('need=')) {
      const id = hash.slice(5);
      if (!initial && !needIds.has(id)) return null;
      setNeed(id, false);
      return 'need';
    }
    const card = hash ? document.getElementById(hash) : null;
    if (card && card.classList.contains('library-card')) {
      search.value = '';
      setNeed('all', false);
      card.open = true;
      requestAnimationFrame(() => card.scrollIntoView({ block: 'start' }));
      return 'item';
    }
    if (initial || !hash) setNeed('all', false);
    return null;
  }

  // The toolbar sits just under the sticky site header. The header part of the scroll offset
  // comes from site.css (html { scroll-padding-top: 110px }), so cards only need extra room
  // for the toolbar. Header height changes without a resize (such as the mobile menu opening)
  // are not tracked.
  function measure() {
    const top = header ? header.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty('--library-toolbar-top', `${top}px`);
    document.documentElement.style.setProperty('--library-scroll-offset', `${toolbar.offsetHeight + 12}px`);
  }

  // After an "Also in" link (or Back/Forward) applies a filter, bring the list into view
  // and move focus to the chosen filter button.
  function showChosenFilter() {
    library.scrollIntoView({ block: 'start' });
    const pressed = buttons.find((button) => button.dataset.need === current);
    if (!pressed) return;
    pressed.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    pressed.focus({ preventScroll: true });
  }

  // A filter or search can shrink the list under a visitor who has scrolled deep into it. The
  // browser then clamps the scroll position, which can carry the toolbar they just used off the
  // top of the screen. When the library's top has already scrolled under the site header, bring
  // the start of the results back into view. Near the top of the page nothing moves, and focus
  // stays where it is (on the search box or the tapped filter). While typing, the jump is instant:
  // each keystroke keeps the caret in view, which would cut a smooth scroll short.
  function keepResultsInView(behavior = 'auto') {
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    if (library.getBoundingClientRect().top < headerBottom) library.scrollIntoView({ block: 'start', behavior });
  }

  function closeCard(button) {
    const card = button.closest('.library-card');
    card.open = false;
    card.querySelector('summary').focus({ preventScroll: true });
    card.scrollIntoView({ block: 'nearest' });
  }

  async function copyLink(button) {
    const url = `${location.href.split('#')[0]}#${button.closest('.library-card').id}`;
    const label = button.querySelector('.library-button-label');
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this link:', url);
      return;
    }
    // Change only the label so the aria-hidden icon stays in place.
    if (label) {
      clearTimeout(labelTimers.get(button));
      label.textContent = 'Link copied';
      labelTimers.set(button, setTimeout(() => { label.textContent = 'Copy link'; }, 2000));
    }
    // Announce it through the live status line, then restore the normal status.
    clearTimeout(statusTimer);
    setStatus(['Link copied.']);
    statusTimer = setTimeout(updateStatus, 2000);
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      setNeed(button.dataset.need, true);
      keepResultsInView();
    });
  }
  search.addEventListener('input', () => {
    apply({ debounceStatus: true });
    keepResultsInView('instant');
  });
  window.addEventListener('hashchange', () => {
    if (fromAddress(false) === 'need') showChosenFilter();
  });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  document.addEventListener('click', (event) => {
    const close = event.target.closest('[data-close]');
    if (close) {
      closeCard(close);
      return;
    }
    const copy = event.target.closest('[data-copy-link]');
    if (copy) copyLink(copy);
  });

  measure();
  fromAddress(true);
})();
