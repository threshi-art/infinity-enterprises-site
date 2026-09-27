(() => {
  const key = 'infinity-reading-list-v1';
  let saved;
  try { saved = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(saved)) saved = []; } catch { saved = []; }
  const buttons = document.querySelectorAll('[data-save-story]');
  buttons.forEach(button => {
    const path = button.dataset.saveStory;
    const update = () => { const present = saved.some(item => item.path === path); button.textContent = present ? 'Saved to this device ✓' : 'Save this story'; button.setAttribute('aria-pressed', String(present)); };
    update();
    button.addEventListener('click', () => {
      saved = saved.some(item => item.path === path) ? saved.filter(item => item.path !== path) : [...saved, {path, title: document.title.replace(/ · .*/, ''), savedAt: Date.now()}].slice(-40);
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch {}
      update();
    });
  });
  const list = document.getElementById('saved-reading-list');
  if (list) {
    if (!saved.length) list.innerHTML = '<p>No saved stories yet. Save one from an article to find it here on this device.</p>';
    else saved.slice().reverse().forEach(item => {
      if (!/^\/enigmas\/[a-z0-9-]+$/.test(item.path)) return;
      const a = document.createElement('a'); a.className = 'hub-result'; a.href = item.path;
      const h = document.createElement('h2'); h.textContent = item.title;
      const span = document.createElement('span'); span.textContent = 'Saved story';
      a.append(span, h); list.append(a);
    });
  }
  const share = document.getElementById('share-story');
  if (share) share.addEventListener('click', async () => {
    try { if (navigator.share) await navigator.share({title:document.title,url:location.href}); else {await navigator.clipboard.writeText(location.href); share.textContent='Link copied ✓';} } catch {}
  });
  const query = document.getElementById('site-query');
  if (query) {
    const results = document.getElementById('search-results');
    const count = document.getElementById('search-count');
    const index = Array.isArray(window.infinityIndex) ? window.infinityIndex : [];
    const draw = () => {
      const terms = query.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
      results.replaceChildren();
      const matches = terms.length ? index.filter(item => terms.every(term => `${item.title} ${item.description} ${item.category}`.toLocaleLowerCase().includes(term))).slice(0, 40) : index.filter(item => item.category === 'Room');
      count.textContent = terms.length ? `${matches.length} result${matches.length === 1 ? '' : 's'}` : 'Start with a room, or type to search stories and projects.';
      if (!matches.length) { const p = document.createElement('p'); p.textContent = 'No matches. Try a broader word or browse the issue.'; results.append(p); }
      for (const item of matches) {
        if (!/^\/[a-z0-9\-/]*$/.test(item.url)) continue;
        const a = document.createElement('a'); a.className = 'hub-result'; a.href = item.url;
        const label = document.createElement('span'); label.textContent = item.category;
        const title = document.createElement('h2'); title.textContent = item.title;
        const description = document.createElement('p'); description.textContent = item.description;
        a.append(label, title, description); results.append(a);
      }
    };
    query.addEventListener('input', draw);
    const initial = new URLSearchParams(location.search).get('q');
    if (initial) query.value = initial.slice(0,100);
    draw();
  }
})();
