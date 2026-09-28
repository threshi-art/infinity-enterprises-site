import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { createPublicationPages } from './src/publication-pages.mjs';

const [home, about, standards, atlas, diana, development, learning, journal, foundation, youth, techLounge, ether, motor, form, enigmas, enigmaArticle, enigmaStories, projectsJson, editorialJson, login, admin, roadmaps, sharedCss, music, dispatchScript, splashCss, splashScript, etherScript, etherImages, motorScript, motorImages, formScript, formImages, hero, detail, dianaImage, dianaCardsImage, developmentImage, techLoungeImage, techMacroImage, politicsImage, lawImage, academyImage, researchImage, learningImage, foundationImage, youthImage, coverImage, feedsConfig, feedsScript, worker] = await Promise.all([
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
  readFile('src/ether.html', 'utf8'),
  readFile('src/motor.html', 'utf8'),
  readFile('src/form.html', 'utf8'),
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
  readFile('src/splash.css', 'utf8'),
  readFile('src/splash.js', 'utf8'),
  readFile('src/ether.js', 'utf8'),
  Promise.all([1,2,3,4].map(i => readFile(`src/assets/ether-${i}.jpg`))),
  readFile('src/motor.js', 'utf8'),
  Promise.all([1,2,3,4].map(i => readFile(`src/assets/motor-${i}.jpg`))),
  readFile('src/form.js', 'utf8'),
  Promise.all([1,2,3,4,5,6,7].map(i => readFile(`src/assets/form-${i}.jpg`))),
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
  readFile('src/feeds.json', 'utf8'),
  readFile('src/feeds.js', 'utf8'),
  readFile('src/worker.js', 'utf8'),
]);
const catalog = JSON.parse(roadmaps);
const stories = JSON.parse(enigmaStories);
const projects = JSON.parse(projectsJson);
const editorial = JSON.parse(editorialJson);
const publicationCss = await readFile('src/publication.css', 'utf8');
const publicationScript = await readFile('src/publication.js', 'utf8');
const foodImage = await readFile('src/assets/food.jpg');
const { pages: publicationPages, searchRecords, existingDepartments } = createPublicationPages(stories, projects, editorial);
const feedOrigin = 'https://infinity-enterprises.infinity-ent-8507.chatgpt.site';
if (!Array.isArray(projects) || projects.length < 10 || projects.some(project => !['AI','Software','Civic','Research'].includes(project.field) || !['feature','products','prototypes','ideas'].includes(project.group))) throw new Error('Invalid project catalog');
const sections = ['Politics', 'The Intelligence Desk', 'Law, Power & Institutions', 'Civilization Futures', 'The Reading Room'];
if (!Array.isArray(stories) || stories.length < 3 || new Set(stories.map(story => story.slug)).size !== stories.length || stories.some(story => !/^[a-z0-9-]+$/.test(story.slug) || !sections.includes(story.section) || !Array.isArray(story.paragraphs) || story.paragraphs.length < 3)) throw new Error('Invalid Enigmas catalog');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const feedXml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Infinity Enterprises</title><link>${feedOrigin}/issues</link><description>Original essays and new issues from Infinity Enterprises.</description><language>en-us</language>${stories.map(story=>`<item><title>${escapeHtml(story.title)}</title><link>${feedOrigin}/enigmas/${story.slug}</link><guid isPermaLink="true">${feedOrigin}/enigmas/${story.slug}</guid><description>${escapeHtml(story.dek)}</description></item>`).join('')}</channel></rss>`;
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
const renderedStories = Object.fromEntries(stories.map(story => [story.slug, page(enigmaArticle, '/enigmas/' + story.slug)
  .replaceAll('/* ARTICLE_TITLE */', escapeHtml(story.title))
  .replaceAll('/* ARTICLE_DEK */', escapeHtml(story.dek))
  .replaceAll('/* ARTICLE_CATEGORY */', escapeHtml(story.category))
  .replaceAll('/* ARTICLE_READ */', escapeHtml(story.read))
  .replaceAll('/* ARTICLE_IMAGE */', escapeHtml(story.image))
  .replaceAll('/* ARTICLE_ALT */', escapeHtml(story.alt))
  .replace('<figure class="cover-figure">', '<p class="article-credit">By Infinity Enterprises Editorial · Original analysis</p><figure class="cover-figure">')
  .replaceAll('/* ARTICLE_BODY */', story.paragraphs.map((paragraph, index) => `<p${index === 0 ? ' class="first"' : ''}>${escapeHtml(paragraph)}</p>`).join(''))
  .replace('</head>', `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:story.title,description:story.dek,image:feedOrigin+story.image,mainEntityOfPage:feedOrigin+'/enigmas/'+story.slug,author:{'@type':'Organization',name:'Infinity Enterprises'},isAccessibleForFree:true}).replace(/</g,'\\u003c')}</script></head>`)]));
if (!Array.isArray(catalog.items) || catalog.items.length < 90) throw new Error('Roadmap catalog is incomplete');
if (catalog.items.some(item => !item.url.startsWith('https://roadmap.sh/'))) throw new Error('Unexpected roadmap destination');
function page(source, path = '/') {
  if (path === '/search') source = source.replace('<script>/* PUBLICATION_SCRIPT */</script>', `<script>window.infinityIndex=${JSON.stringify(searchRecords).replace(/</g,'\\u003c')};</script><script>/* PUBLICATION_SCRIPT */</script>`);
  const hasPublicationStyle = source.includes('/* PUBLICATION_CSS */');
  const hasPublicationFooter = source.includes('class="publication-links"');
  const mainLinks = [['/daily-desk','01','The Daily Desk'],['/culture','02','Culture'],['/motor','03','MOTOR'],['/food','04','Food'],['/practice','05','The Practice'],['/music','06','Music'],['/inquiry','07','Academic Journal'],['/tech-lounge','08','Tech Lounge'],['/development','09','In Development'],['/about','10','About the Enterprise']];
  const mainNav = '<span class="toc-label">Explore Infinity</span>' + mainLinks.map(([href,no,label]) => `<a href="${href}"><span>${no}</span>${label}</a>`).join('') + '<span class="toc-label toc-secondary">The publication</span>' + [['/blog','Agentic@Enigmas / Opinion'],['/issues','Issues'],['/search','Search'],['/reading-list','Reading list'],['/subscribe','The monthly letter'],['/partners','Partnerships'],['/support','Support'],['/contact','Contact'],['/about/standards','Editorial standards'],['/admin','Staff']].map(([href,label]) => `<a href="${href}" class="child">${label}</a>`).join('');
  const roomBar = '<nav class="room-bar" aria-label="Main sections"><span>Explore the issue</span>' + mainLinks.map(([href,,label])=>`<a href="${href}"${path===href?' aria-current="page"':''}>${label}</a>`).join('') + '</nav>';
  const homeIndex = `<section class="home-department-index" aria-labelledby="department-index-title"><span class="hub-meta">Infinity / The complete index</span><h2 id="department-index-title">Every room has a door.</h2><div>${mainLinks.map(([href,no,label])=>`<a href="${href}"><span>${no}</span>${label}<span aria-hidden="true">↗</span></a>`).join('')}</div><p>Find original stories and visual editions throughout the house. <a href="/issues">Open the issue archive ↗</a></p></section>`;
  const title = source.match(/<title>([^<]+)<\/title>/)?.[1] || 'Infinity Enterprises';
  const description = source.match(/<meta name="description" content="([^"]*)"/)?.[1] || 'An independent publication.';
  const origin = 'https://infinity-enterprises.infinity-ent-8507.chatgpt.site';
  const metadata = `<link rel="canonical" href="${origin}${path}"><meta property="og:type" content="${path.startsWith('/enigmas/')?'article':'website'}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${origin}${path}"><meta property="og:image" content="${origin}/media/cover.jpg"><meta name="twitter:card" content="summary_large_image">`;
  const readerTools = path.startsWith('/enigmas/') ? `<div class="reading-tools"><button type="button" data-save-story="${path}" aria-pressed="false">Save this story</button><button type="button" id="share-story">Share this story ↗</button><a href="/reading-list">My reading list ↗</a></div><p class="reader-note">Saved stories stay on this device.</p>` : '';
  const result = source
    .replace('/* SHARED_CSS */', sharedCss)
    .replace('/* PUBLICATION_CSS */', publicationCss)
    .replace(/<nav class="toc-panel"[^>]*>[\s\S]*?<\/nav>/, `<nav class="toc-panel" aria-label="Site contents">${mainNav}</nav>`)
    .replace('</header>', '</header>' + (path === '/form' ? '' : roomBar))
    .replace('</head>', metadata + (hasPublicationStyle ? '' : `<style>${publicationCss}</style>`) + '</head>')
    .replace('</footer>', (hasPublicationFooter ? '' : '<div class="publication-links"><a href="/issues">Issues</a><a href="/search">Search</a><a href="/subscribe">Letter</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a></div>') + '</footer>')
    .replace('</main>', (path === '/' ? homeIndex : (existingDepartments[path] || '')) + '</main>')
    .replace('/* ARTICLE_BODY */', '/* ARTICLE_BODY */' + readerTools + `<div class="related-reading"><strong>Continue the thread</strong><a href="/inquiry">Inquiry ↗</a><a href="/development/atlas">Project Atlas ↗</a><a href="/subscribe">The monthly letter ↗</a></div>`)
    .replace('/* MUSIC_SCRIPT */', music)
    .replace('/* PUBLICATION_SCRIPT */', publicationScript)
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
  return source.includes('/* PUBLICATION_SCRIPT */') ? result : result.replace('</body>', `<script>${publicationScript}</script></body>`);
}
const workerWithFeeds = feedsScript.replace('/* FEEDS_CONFIG */ null', feedsConfig) + '\n' + worker;
const compiled = workerWithFeeds
  .replace('/* HOME_HTML */ null', JSON.stringify(page(home, '/').replace('/* SPLASH_CSS */', splashCss).replace('/* SPLASH_SCRIPT */', splashScript)))
  .replace('/* ABOUT_HTML */ null', JSON.stringify(page(about, '/about')))
  .replace('/* STANDARDS_HTML */ null', JSON.stringify(page(standards, '/about/standards')))
  .replace('/* DIANA_HTML */ null', JSON.stringify(page(diana, '/about/diana')))
  .replace('/* DEVELOPMENT_HTML */ null', JSON.stringify(page(development, '/development').replace('<!-- PRODUCT_CARDS -->', productCards).replace('<!-- PROTOTYPE_CARDS -->', prototypeCards).replace('<!-- IDEA_CARDS -->', ideaCards)))
  .replace('/* LEARNING_HTML */ null', JSON.stringify(page(learning, '/learning').replace('/* ROADMAPS_JSON */ []', JSON.stringify(catalog.items))))
  .replace('/* JOURNAL_HTML */ null', JSON.stringify(page(journal, '/journal')))
  .replace('/* FOUNDATION_HTML */ null', JSON.stringify(page(foundation, '/foundation')))
  .replace('/* YOUTH_HTML */ null', JSON.stringify(page(youth, '/foundation/youth')))
  .replace('/* TECH_LOUNGE_HTML */ null', JSON.stringify(page(techLounge, '/tech-lounge')))
  .replace('/* ETHER_HTML */ null', JSON.stringify(page(ether, '/ether').replace('/* ETHER_SCRIPT */', etherScript)))
  .replace('/* MOTOR_HTML */ null', JSON.stringify(page(motor, '/motor').replace('/* MOTOR_SCRIPT */', motorScript)))
  .replace('/* FORM_HTML */ null', JSON.stringify(page(form, '/form').replace('/* FORM_SCRIPT */', formScript)))
  .replace('/* ENIGMAS_HTML */ null', JSON.stringify(page(enigmas, '/enigmas').replace('<!-- LEAD_STORY -->', card(stories[0], true)).replace('<!-- STORY_SECTIONS -->', storySections)))
  .replace('/* ENIGMA_ARTICLES */ null', JSON.stringify(renderedStories))
  .replace('/* ATLAS_HTML */ null', JSON.stringify(page(atlas, '/development/atlas').replace('<!-- PROJECT_CARDS -->', projectCards)))
  .replace('/* PUBLICATION_PAGES */ null', JSON.stringify(Object.fromEntries(Object.entries(publicationPages).map(([path, markup]) => [path, page(markup, path).replace('/* DISPATCH_SCRIPT */', dispatchScript)]))))
  .replace('/* FEED_XML */ null', JSON.stringify(feedXml))
  .replace('/* LOGIN_HTML */ null', JSON.stringify(login))
  .replace('/* ADMIN_HTML */ null', JSON.stringify(page(admin, '/admin').replace('<!-- EDITORIAL_QUEUE -->', editorialQueue).replace('<main>', '<main><div style="padding:16px 5vw;background:#e6b187;color:#102435;font-weight:800"><a href="/admin/inbox">Reader inbox ↗</a> &nbsp;&nbsp; <a href="/admin/subscribers">Issue list ↗</a></div>')))
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
  .replace('/* COVER_IMAGE */ null', JSON.stringify(coverImage.toString('base64')))
  .replace('/* FOOD_IMAGE */ null', JSON.stringify(foodImage.toString('base64')))
  .replace('/* ETHER_IMAGES */ null', JSON.stringify(etherImages.map(image => image.toString('base64'))))
  .replace('/* MOTOR_IMAGES */ null', JSON.stringify(motorImages.map(image => image.toString('base64'))))
  .replace('/* FORM_IMAGES */ null', JSON.stringify(formImages.map(image => image.toString('base64'))));
if (/\/\* (?:HOME_HTML|ABOUT_HTML|ATLAS_HTML|DIANA_HTML|DEVELOPMENT_HTML|LEARNING_HTML|JOURNAL_HTML|FOUNDATION_HTML|YOUTH_HTML|TECH_LOUNGE_HTML|ENIGMAS_HTML|ENIGMA_ARTICLES|LOGIN_HTML|ADMIN_HTML|HERO_IMAGE|DETAIL_IMAGE|DIANA_IMAGE|DIANA_CARDS_IMAGE|DEVELOPMENT_IMAGE|TECH_LOUNGE_IMAGE|TECH_MACRO_IMAGE|ENIGMAS_POLITICS_IMAGE|ENIGMAS_LAW_IMAGE|ENIGMAS_ACADEMY_IMAGE) \*\//.test(compiled)) throw new Error('Build marker missing');
await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', compiled);
