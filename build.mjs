import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';

const [home, about, atlas, diana, development, learning, journal, foundation, youth, techLounge, login, roadmaps, sharedCss, music, hero, detail, dianaImage, dianaCardsImage, developmentImage, techLoungeImage, techMacroImage, worker] = await Promise.all([
  readFile('src/home.html', 'utf8'),
  readFile('src/about.html', 'utf8'),
  readFile('src/atlas.html', 'utf8'),
  readFile('src/diana.html', 'utf8'),
  readFile('src/development.html', 'utf8'),
  readFile('src/learning.html', 'utf8'),
  readFile('src/journal.html', 'utf8'),
  readFile('src/foundation.html', 'utf8'),
  readFile('src/youth.html', 'utf8'),
  readFile('src/tech-lounge.html', 'utf8'),
  readFile('src/login.html', 'utf8'),
  readFile('src/roadmaps.json', 'utf8'),
  readFile('src/site.css', 'utf8'),
  readFile('src/music.js', 'utf8'),
  readFile('src/assets/hero.png'),
  readFile('src/assets/detail.png'),
  readFile('src/assets/diana.png'),
  readFile('src/assets/diana-cards.png'),
  readFile('src/assets/development.png'),
  readFile('src/assets/tech-lounge.png'),
  readFile('src/assets/tech-macro.png'),
  readFile('src/worker.js', 'utf8'),
]);
const catalog = JSON.parse(roadmaps);
if (!Array.isArray(catalog.items) || catalog.items.length < 90) throw new Error('Roadmap catalog is incomplete');
if (catalog.items.some(item => !item.url.startsWith('https://roadmap.sh/'))) throw new Error('Unexpected roadmap destination');
function page(source) {
  return source
    .replace('/* SHARED_CSS */', sharedCss)
    .replace('/* MUSIC_SCRIPT */', music)
    .replaceAll('__HERO_IMAGE__', '/media/hero.png')
    .replaceAll('__DETAIL_IMAGE__', '/media/detail.png')
    .replaceAll('__DIANA_IMAGE__', '/media/diana.png')
    .replaceAll('__DIANA_CARDS__', '/media/diana-cards.png')
    .replaceAll('__DEVELOPMENT_IMAGE__', '/media/development.png')
    .replaceAll('__TECH_LOUNGE_IMAGE__', '/media/tech-lounge.png')
    .replaceAll('__TECH_MACRO_IMAGE__', '/media/tech-macro.png');
}
const compiled = worker
  .replace('/* HOME_HTML */ null', JSON.stringify(page(home)))
  .replace('/* ABOUT_HTML */ null', JSON.stringify(page(about)))
  .replace('/* DIANA_HTML */ null', JSON.stringify(page(diana)))
  .replace('/* DEVELOPMENT_HTML */ null', JSON.stringify(page(development)))
  .replace('/* LEARNING_HTML */ null', JSON.stringify(page(learning).replace('/* ROADMAPS_JSON */ []', JSON.stringify(catalog.items))))
  .replace('/* JOURNAL_HTML */ null', JSON.stringify(page(journal)))
  .replace('/* FOUNDATION_HTML */ null', JSON.stringify(page(foundation)))
  .replace('/* YOUTH_HTML */ null', JSON.stringify(page(youth)))
  .replace('/* TECH_LOUNGE_HTML */ null', JSON.stringify(page(techLounge)))
  .replace('/* ATLAS_HTML */ null', JSON.stringify(page(atlas)))
  .replace('/* LOGIN_HTML */ null', JSON.stringify(login))
  .replace('/* HERO_IMAGE */ null', JSON.stringify(hero.toString('base64')))
  .replace('/* DETAIL_IMAGE */ null', JSON.stringify(detail.toString('base64')))
  .replace('/* DIANA_IMAGE */ null', JSON.stringify(dianaImage.toString('base64')))
  .replace('/* DIANA_CARDS_IMAGE */ null', JSON.stringify(dianaCardsImage.toString('base64')))
  .replace('/* DEVELOPMENT_IMAGE */ null', JSON.stringify(developmentImage.toString('base64')))
  .replace('/* TECH_LOUNGE_IMAGE */ null', JSON.stringify(techLoungeImage.toString('base64')))
  .replace('/* TECH_MACRO_IMAGE */ null', JSON.stringify(techMacroImage.toString('base64')));
if (/\/\* (?:HOME_HTML|ABOUT_HTML|ATLAS_HTML|DIANA_HTML|DEVELOPMENT_HTML|LEARNING_HTML|JOURNAL_HTML|FOUNDATION_HTML|YOUTH_HTML|TECH_LOUNGE_HTML|LOGIN_HTML|HERO_IMAGE|DETAIL_IMAGE|DIANA_IMAGE|DIANA_CARDS_IMAGE|DEVELOPMENT_IMAGE|TECH_LOUNGE_IMAGE|TECH_MACRO_IMAGE) \*\//.test(compiled)) throw new Error('Build marker missing');
await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', compiled);
