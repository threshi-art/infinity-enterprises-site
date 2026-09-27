(async () => {
  const grid = document.getElementById('signal-grid');
  const status = document.getElementById('signal-status');
  if (!grid || !status) return;
  try {
    const response = await fetch('/api/dispatch', { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error('Feed unavailable');
    const data = await response.json();
    if (!Array.isArray(data.items) || !data.items.length) throw new Error('No entries');
    const images = ['/media/tech-macro.jpg', '/media/tech-lounge.jpg'];
    const descriptions = ['Latest from the original publisher.', 'A new update from the software world.'];
    const cards = data.items.slice(0, 2).map((item, index) => {
      const link = document.createElement('a'); link.className = 'signal-card'; link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const image = document.createElement('img'); image.src = images[index]; image.alt = index === 0 ? 'Semiconductor detail in dramatic light' : 'Vintage computing equipment in a dark lounge'; image.loading = 'lazy';
      const body = document.createElement('div');
      const label = document.createElement('span'); label.className = 'label'; label.textContent = 'GitHub Changelog / ' + (item.date || 'Latest');
      const title = document.createElement('h3'); title.textContent = item.title;
      const summary = document.createElement('p'); summary.textContent = descriptions[index];
      const read = document.createElement('span'); read.className = 'read'; read.textContent = 'Read at GitHub ↗';
      body.append(label, title, summary, read); link.append(image, body); return link;
    });
    grid.replaceChildren(...cards, grid.lastElementChild);
    status.textContent = 'GitHub Changelog / Recent source updates';
  } catch {
    status.textContent = 'Infinity editorial picks / Outside feed unavailable';
  }
})();
