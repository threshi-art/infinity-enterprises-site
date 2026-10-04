// Renderer for external feed items (Daily Desk and home #latest)
// Fetches /api/feeds?section=mercati only; /api/dispatch is not used
(function() {
  function formatDateTime(isoString) {
    try {
      const date = new Date(isoString);
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'America/Los_Angeles',
        timeZoneName: 'short'
      });
      const parts = formatter.formatToParts(date);
      const month = parts.find(p => p.type === 'month').value;
      const day = parts.find(p => p.type === 'day').value;
      const year = parts.find(p => p.type === 'year').value;
      return `${month} ${day}, ${year} PT`;
    } catch {
      return '';
    }
  }

  function isValidUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  function renderFeedItems(items, limit) {
    const sorted = items.slice().sort((a, b) => {
      const aTime = new Date(a.published).getTime();
      const bTime = new Date(b.published).getTime();
      return bTime - aTime;
    });
    const selected = limit ? sorted.slice(0, limit) : sorted;
    
    return selected.filter(item => isValidUrl(item.url)).map(item => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      const headline = document.createElement('span');
      headline.className = 'desk-headline';
      headline.textContent = item.title;
      
      const newTabText = document.createElement('span');
      newTabText.className = 'visually-hidden';
      newTabText.textContent = ' (opens in a new tab)';
      
      link.appendChild(headline);
      link.appendChild(newTabText);
      
      const meta = document.createElement('span');
      meta.className = 'desk-meta';
      
      const source = document.createElement('span');
      source.className = 'desk-source';
      source.textContent = item.source;
      
      const time = document.createElement('time');
      time.className = 'desk-time';
      time.setAttribute('datetime', item.published);
      time.textContent = formatDateTime(item.published);
      
      meta.appendChild(source);
      meta.appendChild(document.createTextNode(' · '));
      meta.appendChild(time);
      
      li.appendChild(link);
      li.appendChild(meta);
      
      return li;
    });
  }

  function renderSignalCard(item) {
    const card = document.createElement('a');
    card.className = 'signal-card';
    card.href = item.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    
    const body = document.createElement('div');
    
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = item.source + ' · ' + formatDateTime(item.published);
    
    const title = document.createElement('h3');
    title.textContent = item.title;
    
    const read = document.createElement('span');
    read.className = 'read';
    read.textContent = 'Read at ' + item.source + ' ↗';
    
    const newTabText = document.createElement('span');
    newTabText.className = 'visually-hidden';
    newTabText.textContent = ' (opens in a new tab)';
    
    body.appendChild(label);
    body.appendChild(title);
    body.appendChild(read);
    body.appendChild(newTabText);
    card.appendChild(body);
    
    return card;
  }

  // Expose renderer for tests
  globalThis.__deskRender = renderFeedItems;

  // Daily Desk pages: #desk-news (full list) and #desk-latest (top 3 teaser)
  const deskNews = document.getElementById('desk-news');
  const deskNewsStatus = document.getElementById('desk-news-status');
  const deskLatest = document.getElementById('desk-latest');
  
  if (deskNews || deskLatest) {
    (async function() {
      const targetList = deskNews || deskLatest;
      const targetStatus = deskNewsStatus;
      
      try {
        const response = await fetch('/api/feeds?section=mercati', {
          headers: { accept: 'application/json' }
        });
        
        if (!response.ok) throw new Error('Feed unavailable');
        
        const data = await response.json();
        
        if (!Array.isArray(data.items) || !data.items.length) {
          throw new Error('No entries');
        }
        
        const limit = deskLatest ? 3 : null;
        const items = renderFeedItems(data.items, limit);
        targetList.replaceChildren(...items);
        
        if (targetStatus) {
          targetStatus.textContent = data.stale 
            ? 'Policy & markets releases / Data may be stale' 
            : 'Policy & markets releases / Recent source updates';
        }
        
        if (data.stale && targetList) {
          const staleNotice = document.createElement('p');
          staleNotice.className = 'desk-stale';
          staleNotice.textContent = 'These items may be stale.';
          targetList.insertAdjacentElement('beforebegin', staleNotice);
        }
      } catch (err) {
        const fallback = document.createElement('p');
        fallback.textContent = 'Outside releases are unavailable right now. ';
        const osintLink = document.createElement('a');
        osintLink.href = '/osint';
        osintLink.textContent = 'Visit the OSINT directory';
        fallback.appendChild(osintLink);
        fallback.appendChild(document.createTextNode('.'));
        
        targetList.replaceChildren(fallback);
        
        if (targetStatus) {
          targetStatus.textContent = 'Outside releases unavailable';
        }
      }
    })();
  }

  // Home #latest (#signal-grid)
  const signalGrid = document.getElementById('signal-grid');
  const signalStatus = document.getElementById('signal-status');
  
  if (signalGrid && signalStatus) {
    (async function() {
      try {
        const response = await fetch('/api/feeds?section=mercati', {
          headers: { accept: 'application/json' }
        });
        
        if (!response.ok) throw new Error('Feed unavailable');
        
        const data = await response.json();
        
        if (!Array.isArray(data.items) || !data.items.length) {
          throw new Error('No entries');
        }
        
        const sorted = data.items.slice().sort((a, b) => {
          const aTime = new Date(a.published).getTime();
          const bTime = new Date(b.published).getTime();
          return bTime - aTime;
        });
        
        const top2 = sorted.slice(0, 2).filter(item => isValidUrl(item.url));
        const cards = top2.map(item => renderSignalCard(item));
        
        const lastCard = signalGrid.lastElementChild;
        signalGrid.replaceChildren(...cards, lastCard);
        
        signalStatus.textContent = 'Policy & markets releases / Recent source updates';
      } catch (err) {
        signalStatus.textContent = 'Infinity editorial picks / Outside feed unavailable';
      }
    })();
  }
})();
