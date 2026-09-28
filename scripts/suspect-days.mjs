import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function analyzeSuspectDays(dailyViews, clearedDays = []) {
  const cleared = new Set(clearedDays);
  const results = [];
  
  // Sort days chronologically
  const sortedDays = [...dailyViews].sort((a, b) => a.day.localeCompare(b.day));
  
  for (let i = 0; i < sortedDays.length; i++) {
    const current = sortedDays[i];
    
    // Collect usable days: ok status, plus any cleared day
    const usableDays = [];
    for (let j = i - 1; j >= 0 && usableDays.length < 14; j--) {
      const prev = sortedDays[j];
      const prevResult = results.find(r => r.day === prev.day);
      
      // Usable: ok status OR on cleared list (regardless of computed status)
      const isUsable = (prevResult && prevResult.status === 'ok') || cleared.has(prev.day);
      
      if (isUsable) {
        usableDays.push(prev.views);
      }
    }
    
    // Check if we have enough history (at least 7 usable days)
    const hasEnoughHistory = usableDays.length >= 7;
    
    // If on cleared list, always mark as cleared (never suspect or not_checked)
    if (cleared.has(current.day)) {
      results.push({
        day: current.day,
        views: current.views,
        baseline: null,
        status: 'cleared'
      });
      continue;
    }
    
    // Not enough history - mark as not_checked
    if (!hasEnoughHistory) {
      results.push({
        day: current.day,
        views: current.views,
        baseline: null,
        status: 'not_checked'
      });
      continue;
    }
    
    // Calculate median of baseline
    const sorted = [...usableDays].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const baseline = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
    
    // Check if suspect: views >= 50 and views > 3x baseline
    const isSuspect = current.views >= 50 && current.views > 3 * baseline;
    
    results.push({
      day: current.day,
      views: current.views,
      baseline,
      status: isSuspect ? 'suspect' : 'ok'
    });
  }
  
  return results;
}

// CLI usage
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  let input;
  let clearedDays = [];
  
  // Parse arguments
  const args = process.argv.slice(2);
  let inputFile = null;
  let clearedFile = null;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cleared' && args[i + 1]) {
      clearedFile = args[++i];
    } else if (args[i] === '--json' || args[i] === '-') {
      inputFile = '--json';
    } else if (!inputFile) {
      inputFile = args[i];
    }
  }
  
  // Load cleared days
  if (clearedFile) {
    const clearedData = readFileSync(clearedFile, 'utf8');
    clearedDays = JSON.parse(clearedData);
  } else {
    try {
      const clearedData = readFileSync('data/cleared-days.json', 'utf8');
      clearedDays = JSON.parse(clearedData);
    } catch {}
  }
  
  // Read daily views
  if (inputFile === '--json') {
    // Read from stdin
    input = '';
    process.stdin.on('data', chunk => { input += chunk; });
    process.stdin.on('end', () => processInput(input, clearedDays));
  } else if (inputFile) {
    // Read from file
    input = readFileSync(inputFile, 'utf8');
    processInput(input, clearedDays);
  } else {
    console.error('Usage: node scripts/suspect-days.mjs <daily-views.json> [--cleared <file>]');
    console.error('   or: wrangler d1 execute ... --json | node scripts/suspect-days.mjs --json [--cleared <file>]');
    process.exit(1);
  }
}

function processInput(input, clearedDays) {
  const data = JSON.parse(input);
  
  // Normalize input format:
  // - Bare array: [{day, views}]
  // - Wrangler array: [{results: [{day, views}], success: true, meta: {...}}]
  // - Object: {results: [{day, views}]}
  let dailyViews;
  if (Array.isArray(data)) {
    if (data.length > 0 && data[0].results) {
      // Wrangler format: [{results: [...]}]
      dailyViews = data[0].results;
    } else {
      // Bare array
      dailyViews = data;
    }
  } else if (data.results) {
    // Object with results key
    dailyViews = data.results;
  } else {
    dailyViews = [];
  }
  
  // Coerce views to Number
  dailyViews = dailyViews.map(row => ({
    day: row.day,
    views: Number(row.views)
  }));
  
  const results = analyzeSuspectDays(dailyViews, clearedDays);
  
  const suspect = results.filter(r => r.status === 'suspect');
  const cleared = results.filter(r => r.status === 'cleared');
  const notChecked = results.filter(r => r.status === 'not_checked');
  const ok = results.filter(r => r.status === 'ok');
  
  // Check if no day has enough history
  const hasBaseline = ok.length > 0 || suspect.length > 0;
  
  if (!hasBaseline && notChecked.length > 0) {
    console.log('no baseline yet: clear the first 7 days');
  }
  
  if (suspect.length > 0) {
    console.log('Suspect days:');
    console.log('============');
    for (const entry of suspect) {
      console.log(`${entry.day}: ${entry.views} views (baseline: ${entry.baseline.toFixed(1)})`);
    }
    console.log(`\nTotal: ${suspect.length} suspect day(s)`);
  } else if (hasBaseline) {
    console.log('No suspect days found.');
  }
  
  if (cleared.length > 0) {
    console.log('\nCleared days:');
    console.log('=============');
    for (const entry of cleared) {
      console.log(`${entry.day}: ${entry.views} views (manually verified)`);
    }
  }
  
  if (notChecked.length > 0) {
    console.log('\nNot checked (insufficient baseline):');
    console.log('====================================');
    for (const entry of notChecked) {
      console.log(`${entry.day}: ${entry.views} views`);
    }
  }
}
