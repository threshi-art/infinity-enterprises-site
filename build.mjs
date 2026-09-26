import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';

const [home, about, standards, atlas, diana, development, learning, journal, foundation, youth, techLounge, enigmas, enigmaArticle, enigmaStories, projectsJson, editorialJson, login, admin, roadmaps, sharedCss, music, dispatchScript, hero, detail, dianaImage, dianaCardsImage, developmentImage, techLoungeImage, techMacroImage, politicsImage, lawImage, academyImage, researchImage, learningImage, foundationImage, youthImage, coverImage, worker] = await Promise.all([
  readFile('src/home.html', 'utf8'),
  readFile('src/about.html', 'utf8'),
  readFile('src/standards.html', 'utf8'),
  readFile('src/atlas.html', 'utf8'),
  readFile('src/diana.html', 'utf8'),
  readFile('src/development.html', 'utf8'),
  readFile('src/learning.html', 'utf8'),
  readFile('src/journal.html', 'utf8'),
  readFile('src/foundation.html', 'utf8'),
  readFile('src/youth.html', 'utf8'),
  readFile('src/tech-lounge.html', 'utf8'),
  readFile('src/enigmas.html', 'utf8'),
  readFile('src/enigma-article.html', 'utf8'),
  readFile('src/enigmas.json', 'utf8'),
  readFile('src/projects.json', 'utf8'),
  readFile('src/editorial.json', 'utf8'),
  readFile('src/login.html', 'utf8'),
  readFile('src/admin.html', 'utf8'),
  readFile('src/roadmaps.json', 'utf8'),
  readFile('src/site.css', 'utf8'),
  readFile('src/music.js', 'utf8'),
  readFile('src/dispatch.js', 'utf8'),
  readFile('src/assets/hero.jpg'),
  readFile('src/assets/detail.jpg'),
  readFile('src/assets/diana.jpg'),
  readFile('src/assets/diana-cards.jpg'),
  readFile('src/assets/development.jpg'),
  readFile('src/assets/tech-lounge.jpg'),
  readFile('src/assets/tech-macro.jpg'),
  readFile('src/assets/enigmas-politics.jpg'),
  readFile('src/assets/enigmas-law.jpg'),
  readFile('src/assets/enigmas-academy.jpg'),
  readFile('src/assets/research.jpg'),
  readFile('src/assets/learning.jpg'),
  readFile('src/assets/foundation.jpg'),
  readFile('src/assets/youth.jpg'),
  readFile('src/assets/cover.jpg'),
  readFile('src/worker.js', 'utf8'),
]);
const catalog = JSON.parse(roadmaps);
const stories = JSON.parse(enigmaStories);
const projects = JSON.parse(projectsJson);
const editorial = JSON.parse(editorialJson);
if (!Array.isArray(projects) || projects.length < 10 || projects.some(project => !['AI','Software','Civic','Research'].includes(project.field) || !['feature','products','prototypes','ideas'].includes(project.group))) throw new Error('Invalid project catalog');
const sections = ['Politics', 'The Intelligence Desk', 'Law, Power & Institutions', 'Civilization Futures', 'The Reading Room'];
if (!Array.isArray(stories) || stories.length < 3 || new Set(stories.map(story => story.slug)).size !== stories.length || stories.some(story => !/^[a-z0-9-]+$/.test(story.slug) || !sections.includes(story.section) || !Array.isArray(story.paragraphs) || story.paragraphs.length < 3)) throw new Error('Invalid Enigmas catalog');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const projectLink = project => project.link ? `<a class="project-link" href="${escapeHtml(project.link)}">Read the related work ↗</a>` : '<span class="project-link muted">Public demonstration in preparation</span>';
const projectImage = project => `style="--card-image:url('${escapeHtml(project.image)}')"`;
const projectCards = projects.map((project, index) => `<article class="card" data-field="${escapeHtml(project.field)}" data-search="${escapeHtml(project.title + ' ' + project.discipline)}" ${projectImage(project)}><div class="card-top"><span class="index">${String(index + 1).padStart(2, '0')}</span><span class="stage">${escapeHtml(project.stage)}</span></div><h3>${escapeHtml(project.title)}</h3><p class="desc">${escapeHtml(project.description)}</p><div class="card-bottom"><p class="discipline">${escapeHtml(project.discipline)}</p><p class="next"><b>What exists / </b>${escapeHtml(project.evidence)}</p><p class="next"><b>Next / </b>${escapeHtml(project.next)}</p>${projectLink(project)}</div></article>`).join('');
const group = name => projects.filter(project => project.group === name);
const productCards = group('products').map((project, index) => `<article class="project-card" ${projectImage(project)}><span class="stage">${escapeHtml(project.stage)}</span><span class="number">0${index + 1}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p><dl><dt>What exists</dt><dd>${escapeHtml(project.evidence)}</dd><dt>Next</dt><dd>${escapeHtml(project.next)}</dd></dl>${projectLink(project)}</article>`).join('');
const prototypeCards = group('prototypes').map(project => `<article class="prototype-card" ${projectImage(project)}><span class="stage">${escapeHtml(project.stage)}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p><dl><dt>What exists / Next</dt><dd>${escapeHtml(project.evidence)} ${escapeHtml(project.next)}</dd></dl>${projectLink(project)}</article>`).join('');
const ideaCards = group('ideas').map((project, index) => `<article class="idea-card"><span class="number">0${index + 1}</span><h3>${escapeHtml(project.title)}</h3><div class="details"><span class="stage">${escapeHtml(project.stage)}</span><p>${escapeHtml(project.description)}</p><p><strong>Evidence:</strong> ${escapeHtml(project.evidence)}</p><p><strong>Next:</strong> ${escapeHtml(project.next)}</p>${projectLink(project)}</div></article>`).join('');
const editorialQueue = editorial.queue.map(item => `<div class="queue-row"><span>${escapeHtml(item.desk)}</span><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.state)}</span><p>${escapeHtml(item.next)}</p></div>`).join('');
const card = (story, lead = false) => `<a class="story-card ${lead ? 'story-lead' : ''}" href="/enigmas/${story.slug}"><img src="${escapeHtml(story.image)}" alt="${escapeHtml(story.alt)}" loading="${lead ? 'eager' : 'lazy'}"><span class="story-meta">${escapeHtml(story.status)} <span>·</span> ${escapeHtml(story.read)}</span><h3>${escapeHtml(story.title)}</h3><p>${escapeHtml(story.dek)}</p><span class="read-link">Read the essay ↗</span></a>`;
const sectionIds = {'Politics':'politics','The Intelligence Desk':'intelligence','Law, Power & Institutions':'law','Civilization Futures':'civilization','The Reading Room':'reading-room'};
const sectionIntro = {'Politics':'The republic in its full light and shadow.','The Intelligence Desk':'How minds and machines reason together.','Law, Power & Institutions':'Rules, evidence, and a path to correction.','Civilization Futures':'Visions held to the discipline of feasibility.','The Reading Room':'The first essays that opened this conversation.'};
const storySections = sections.map((section, index) => {const group=stories.filter(story=>story.section===section);return `<section class="editorial-section" id="${sectionIds[section]}"><div class="section-top"><div><span class="section-label">0${index+1} / Agentic@Enigmas</span><h2>${escapeHtml(section)}</h2><p>${escapeHtml(sectionIntro[section])}</p></div><ul class="section-index" aria-label="${escapeHtml(section)} stories">${group.map(story=>`<li><a href="/enigmas/${story.slug}">${escapeHtml(story.title)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul></div><div class="story-grid">${(index===0?group.slice(1):group).map(story=>card(story)).join('')}</div></section>`}).join('');
const renderedStories = Object.fromEntries(stories.map(story => [story.slug, page(enigmaArticle)
  .replaceAll('/* ARTICLE_TITLE */', escapeHtml(story.title))
  .replaceAll('/* ARTICLE_DEK */', escapeHtml(story.dek))
  .replaceAll('/* ARTICLE_CATEGORY */', escapeHtml(story.category))
  .replaceAll('/* ARTICLE_READ */', escapeHtml(story.read))
  .replaceAll('/* ARTICLE_IMAGE */', escapeHtml(story.image))
  .replaceAll('/* ARTICLE_ALT */', escapeHtml(story.alt))
  .replaceAll('/* ARTICLE_BODY */', story.paragraphs.map((paragraph, index) => `<p${index === 0 ? ' class="first"' : ''}>${escapeHtml(paragraph)}</p>`).join(''))]));
if (!Array.isArray(catalog.items) || catalog.items.length < 90) throw new Error('Roadmap catalog is incomplete');
if (catalog.items.some(item => !item.url.startsWith('https://roadmap.sh/'))) throw new Error('Unexpected roadmap destination');
function page(source) {
  return source
    .replace('/* SHARED_CSS */', sharedCss)
    .replace('</nav></details>', '<a href="/admin" class="child"><span>10</span>Admin / Employee</a></nav></details>')
    .replace('/* MUSIC_SCRIPT */', music)
    .replace('/* DISPATCH_SCRIPT */', dispatchScript)
    .replaceAll('__HERO_IMAGE__', '/media/hero.jpg')
    .replaceAll('__DETAIL_IMAGE__', '/media/detail.jpg')
    .replaceAll('__DIANA_IMAGE__', '/media/diana.jpg')
    .replaceAll('__DIANA_CARDS__', '/media/diana-cards.jpg')
    .replaceAll('__DEVELOPMENT_IMAGE__', '/media/development.jpg')
    .replaceAll('__TECH_LOUNGE_IMAGE__', '/media/tech-lounge.jpg')
    .replaceAll('__TECH_MACRO_IMAGE__', '/media/tech-macro.jpg')
    .replaceAll('__RESEARCH_IMAGE__', '/media/research.jpg')
    .replaceAll('__LEARNING_IMAGE__', '/media/learning.jpg')
    .replaceAll('__FOUNDATION_IMAGE__', '/media/foundation.jpg')
    .replaceAll('__YOUTH_IMAGE__', '/media/youth.jpg')
    .replaceAll('__COVER_IMAGE__', '/media/cover.jpg')
    .replaceAll('__ENIGMAS_LAW_IMAGE__', '/media/enigmas-law.jpg')
    .replaceAll('__ENIGMAS_POLITICS_IMAGE__', '/media/enigmas-politics.jpg');
}
const compiled = worker
  .replace('/* HOME_HTML */ null', JSON.stringify(page(home)))
  .replace('/* ABOUT_HTML */ null', JSON.stringify(page(about)))
  .replace('/* STANDARDS_HTML */ null', JSON.stringify(page(standards)))
  .replace('/* DIANA_HTML */ null', JSON.stringify(page(diana)))
  .replace('/* DEVELOPMENT_HTML */ null', JSON.stringify(page(development).replace('<!-- PRODUCT_CARDS -->', productCards).replace('<!-- PROTOTYPE_CARDS -->', prototypeCards).replace('<!-- IDEA_CARDS -->', ideaCards)))
  .replace('/* LEARNING_HTML */ null', JSON.stringify(page(learning).replace('/* ROADMAPS_JSON */ []', JSON.stringify(catalog.items))))
  .replace('/* JOURNAL_HTML */ null', JSON.stringify(page(journal)))
  .replace('/* FOUNDATION_HTML */ null', JSON.stringify(page(foundation)))
  .replace('/* YOUTH_HTML */ null', JSON.stringify(page(youth)))
  .replace('/* TECH_LOUNGE_HTML */ null', JSON.stringify(page(techLounge)))
  .replace('/* ENIGMAS_HTML */ null', JSON.stringify(page(enigmas).replace('<!-- LEAD_STORY -->', card(stories[0], true)).replace('<!-- STORY_SECTIONS -->', storySections)))
  .replace('/* ENIGMA_ARTICLES */ null', JSON.stringify(renderedStories))
  .replace('/* ATLAS_HTML */ null', JSON.stringify(page(atlas).replace('<!-- PROJECT_CARDS -->', projectCards)))
  .replace('/* LOGIN_HTML */ null', JSON.stringify(login))
  .replace('/* ADMIN_HTML */ null', JSON.stringify(page(admin).replace('<!-- EDITORIAL_QUEUE -->', editorialQueue)))
  .replace('/* HERO_IMAGE */ null', JSON.stringify(hero.toString('base64')))
  .replace('/* DETAIL_IMAGE */ null', JSON.stringify(detail.toString('base64')))
  .replace('/* DIANA_IMAGE */ null', JSON.stringify(dianaImage.toString('base64')))
  .replace('/* DIANA_CARDS_IMAGE */ null', JSON.stringify(dianaCardsImage.toString('base64')))
  .replace('/* DEVELOPMENT_IMAGE */ null', JSON.stringify(developmentImage.toString('base64')))
  .replace('/* TECH_LOUNGE_IMAGE */ null', JSON.stringify(techLoungeImage.toString('base64')))
  .replace('/* TECH_MACRO_IMAGE */ null', JSON.stringify(techMacroImage.toString('base64')))
  .replace('/* ENIGMAS_POLITICS_IMAGE */ null', JSON.stringify(politicsImage.toString('base64')))
  .replace('/* ENIGMAS_LAW_IMAGE */ null', JSON.stringify(lawImage.toString('base64')))
  .replace('/* ENIGMAS_ACADEMY_IMAGE */ null', JSON.stringify(academyImage.toString('base64')))
  .replace('/* RESEARCH_IMAGE */ null', JSON.stringify(researchImage.toString('base64')))
  .replace('/* LEARNING_IMAGE */ null', JSON.stringify(learningImage.toString('base64')))
  .replace('/* FOUNDATION_IMAGE */ null', JSON.stringify(foundationImage.toString('base64')))
  .replace('/* YOUTH_IMAGE */ null', JSON.stringify(youthImage.toString('base64')))
  .replace('/* COVER_IMAGE */ null', JSON.stringify(coverImage.toString('base64')));
if (/\/\* (?:HOME_HTML|ABOUT_HTML|ATLAS_HTML|DIANA_HTML|DEVELOPMENT_HTML|LEARNING_HTML|JOURNAL_HTML|FOUNDATION_HTML|YOUTH_HTML|TECH_LOUNGE_HTML|ENIGMAS_HTML|ENIGMA_ARTICLES|LOGIN_HTML|ADMIN_HTML|HERO_IMAGE|DETAIL_IMAGE|DIANA_IMAGE|DIANA_CARDS_IMAGE|DEVELOPMENT_IMAGE|TECH_LOUNGE_IMAGE|TECH_MACRO_IMAGE|ENIGMAS_POLITICS_IMAGE|ENIGMAS_LAW_IMAGE|ENIGMAS_ACADEMY_IMAGE) \*\//.test(compiled)) throw new Error('Build marker missing');
await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', compiled);
