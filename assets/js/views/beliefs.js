import { framework } from "../../content/christian-jutsu-framework.js";
import { escapeHtml } from "../ui.js";

const articleTitles = [
  "The Nature of God", "Salvation", "The Believer’s Identity", "Spirit, Mind, and Body",
  "Faith", "Grace", "Law of the Spirit vs Law of Sin and Death", "Consequences of Sin",
  "Universal Moral Order (Sowing and Reaping)", "Covenant Structure", "Unmerited Grace Activation",
  "Healing", "Demonic Influence", "Discipline", "Abiding", "Rewards", "Suffering and Mystery",
  "Indwelling Fullness and Drawing from the Spirit", "Faith as Participatory Alignment",
  "Forms of Spiritual Attack (The Threat Matrix)", "Spiritual Warfare and Defensive Tactics",
  "The Principle of Abiding Power, and the Distinction Between Grace-Manifestation and Magic"
];

function renderBlocks(blocks) {
  return blocks.map((block) => {
    if (block.type === "heading") return `<h3 class="h5">${escapeHtml(block.text)}</h3>`;
    if (block.type === "paragraph") return `<p>${escapeHtml(block.text)}</p>`;
    const tag = block.type === "ordered" ? "ol" : "ul";
    return `<${tag}>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
  }).join("\n");
}

function articleNumber(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 22 ? number : null;
}

export function renderBeliefsView(query = {}) {
  const selected = articleNumber(query.article);
  return `
    <article class="beliefs-page">
      <header class="cj-hero p-4 p-md-5 mb-4">
        <p class="eyebrow">Our foundation · Framework v${framework.version}</p>
        <h1>Rooted in grace.<br>Formed by Christ.</h1>
        <p class="lead">Explore our church’s beliefs: 22 articles on identity, faith, and life in Christ.</p>
        <a class="btn btn-outline-primary" href="docs/christian-jutsu-framework-v2.1.md" download>Download the framework (.md)</a>
      </header>

      <section class="belief-summary card cj-card mb-4" aria-labelledby="belief-foundation-title">
        <div class="card-body p-4">
          <h2 id="belief-foundation-title" class="h4">The foundation of our beliefs</h2>
          <div class="row g-4">
            <div class="col-md-6"><h3 class="h5">Grace and permanent salvation</h3><p>Salvation is a free gift, received by faith alone in Christ alone. Union with Christ remains permanent; grace never stops flowing, and believers are free from divine condemnation.</p></div>
            <div class="col-md-6"><h3 class="h5">Spirit, soul, and body</h3><p>We believe that the regenerated spirit is perfected in Christ. The mind requires renewal, and the body can be disciplined; sanctification aligns mind and body with the perfected spirit.</p></div>
            <div class="col-md-6"><h3 class="h5">Abiding in the words of Christ</h3><p>Meditation means attending to Jesus’ words and teachings until His heart, mind, intentions, and disposition shape our desires and daily conduct. Fruitfulness expresses faith; it does not preserve salvation.</p></div>
            <div class="col-md-6"><h3 class="h5">Dependence on the Holy Spirit</h3><p>God is the source of power. Prayer, praise, and other Christian practices depend upon Him; no formula, object, practice, or mental technique guarantees a manifestation. Magic and autonomous spiritual control are rejected.</p></div>
          </div>
          <p class="mb-0">We also affirm medicine and science, recognize that not all suffering is caused by personal failure, and leave room for divine mystery.</p>
        </div>
      </section>

      <section class="card cj-card mb-4" aria-labelledby="belief-articles-title">
        <div class="card-body p-4">
          <h2 id="belief-articles-title" class="h4">Read the articles</h2>
          <p>Each article includes the full doctrinal statement and supporting Scripture references from Version 2.1.</p>
          <label class="form-label" for="belief-search">Search the framework</label>
          <input id="belief-search" class="form-control mb-3" type="search" placeholder="Search a teaching, phrase, or Scripture reference" value="${escapeHtml(query.q || "")}" aria-describedby="belief-search-status" aria-controls="belief-articles">
          <div class="d-flex flex-wrap gap-2 mb-3">
            <button class="btn btn-outline-primary btn-sm" type="button" data-belief-action="expand">Open all articles</button>
            <button class="btn btn-outline-primary btn-sm" type="button" data-belief-action="collapse">Close all articles</button>
            <button class="btn btn-outline-secondary btn-sm" type="button" data-belief-action="clear">Clear search</button>
          </div>
          <p id="belief-search-status" class="text-muted mb-3" role="status" aria-live="polite" aria-atomic="true">22 articles available.</p>
          <nav class="article-index" aria-label="Doctrinal article index">
            <ol>${framework.articles.map((article) => `
              <li data-belief-index="${article.number}" value="${article.number}"><a href="index.html#/beliefs?article=${article.number}" data-belief-link="${article.number}">${escapeHtml(articleTitles[article.number - 1])}</a></li>`).join("")}
            </ol>
          </nav>
        </div>
      </section>

      <section id="belief-articles" aria-label="Complete doctrinal framework">
        <details class="doctrine-article card cj-card mb-3" id="framework-introduction" data-belief-source="introduction">
          <summary class="p-4"><span class="h5">Framework introduction</span></summary>
          <div class="card-body p-4">${renderBlocks(framework.introduction)}</div>
        </details>
        ${framework.articles.map((article) => `
          <details class="doctrine-article card cj-card mb-3" id="article-${article.number}" data-belief-article="${article.number}"${selected === article.number ? " open" : ""}>
            <summary class="p-4"><span class="article-number">Article ${article.number}</span><span class="h5">${escapeHtml(articleTitles[article.number - 1])}</span></summary>
            <div class="card-body p-4">
              ${renderBlocks(article.blocks)}
              <a class="article-permalink" href="index.html#/beliefs?article=${article.number}" data-belief-link="${article.number}" aria-label="Link to Article ${article.number}">Link to this article</a>
            </div>
          </details>`).join("")}
        <details class="doctrine-article card cj-card mb-3" id="framework-thesis" data-belief-source="thesis" open>
          <summary class="p-4"><span class="h5">The heart of our faith</span></summary>
          <div class="card-body p-4">${renderBlocks(framework.thesis)}</div>
        </details>
        <p id="belief-no-results" class="card cj-card p-4" hidden>No matching articles or source sections. Try a different teaching or Scripture reference.</p>
      </section>
    </article>
  `;
}

export function bindBeliefsView(query = {}) {
  const page = document.querySelector(".beliefs-page");
  if (!page) return;
  const search = page.querySelector("#belief-search");
  const status = page.querySelector("#belief-search-status");
  const sections = [...page.querySelectorAll("[data-belief-article], [data-belief-source]")];
  const indexItems = [...page.querySelectorAll("[data-belief-index]")];
  const searchText = new Map(sections.map((section) => [section, section.textContent.toLocaleLowerCase()]));
  let openBeforeSearch = null;

  function filter() {
    const term = search.value.trim().toLocaleLowerCase();
    if (term && !openBeforeSearch) openBeforeSearch = new Map(sections.map((section) => [section, section.open]));
    let articles = 0;
    let sourceSections = 0;
    sections.forEach((section) => {
      const match = !term || searchText.get(section).includes(term);
      section.hidden = !match;
      if (match) {
        if (section.dataset.beliefArticle) articles += 1;
        else sourceSections += 1;
      }
      if (term && match) section.open = true;
      else if (!term && openBeforeSearch) section.open = openBeforeSearch.get(section);
    });
    if (!term) openBeforeSearch = null;
    indexItems.forEach((item) => {
      item.hidden = page.querySelector(`#article-${item.dataset.beliefIndex}`).hidden;
    });
    status.textContent = term
      ? `${articles} ${articles === 1 ? "article" : "articles"} and ${sourceSections} ${sourceSections === 1 ? "source section" : "source sections"} match “${search.value.trim()}”.`
      : "22 articles available.";
    page.querySelector("#belief-no-results").hidden = articles + sourceSections > 0;
  }

  function showArticle(number, updateAddress = false) {
    const article = page.querySelector(`#article-${number}`);
    if (!article) return;
    if (search.value) {
      search.value = "";
      filter();
    }
    article.open = true;
    const summary = article.querySelector("summary");
    summary.focus({ preventScroll: true });
    article.scrollIntoView({ block: "start", behavior: "auto" });
    if (updateAddress) window.history.replaceState(null, "", `#/beliefs?article=${number}`);
  }

  search.addEventListener("input", filter);
  page.querySelector('[data-belief-action="clear"]').addEventListener("click", () => {
    search.value = "";
    filter();
    search.focus();
  });
  ["expand", "collapse"].forEach((action) => {
    page.querySelector(`[data-belief-action="${action}"]`).addEventListener("click", () => {
      sections.filter((section) => !section.hidden).forEach((section) => { section.open = action === "expand"; });
    });
  });
  page.querySelectorAll("[data-belief-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      showArticle(Number(link.dataset.beliefLink), true);
    });
  });
  filter();
  const selected = articleNumber(query.article);
  if (selected) window.requestAnimationFrame(() => showArticle(selected));
}
