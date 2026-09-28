import { readFileSync } from 'node:fs';

export function analyzeSuspectDays(dailyViews, clearedDays = []) {
  const cleared = new Set(clearedDays);
  const flagged = [];
  
  // Sort days chronologically
  const sortedDays = [...dailyViews].sort((a, b) => a.day.localeCompare(b.day));
  
  for (let i = 0; i < sortedDays.length; i++) {
    const current = sortedDays[i];
    
    // Get baseline days: previous 14 days that are neither flagged nor uncleared
    const baselineDays = [];
    for (let j = i - 1; j >= 0 && baselineDays.length < 14; j--) {
      const prev = sortedDays[j];
      const isFlagged = flagged.some(f => f.day === prev.day);
      const isCleared = cleared.has(prev.day);
      
      if (!isFlagged || isCleared) {
        baselineDays.push(prev.views);
      }
    }
    
    // Don't flag anything until we have at least 7 baseline days
    if (baselineDays.length < 7) {
      continue;
    }
    
    // Calculate median of baseline
    const sorted = [...baselineDays].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const baseline = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
    
    // Flag if views > 3x baseline and views >= 50
    if (current.views >= 50 && current.views > 3 * baseline) {
      flagged.push({
        day: current.day,
        views: current.views,
        baseline
      });
    }
  }
  
  return flagged;
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  let input;
  let clearedDays = [];
  
  // Read daily views
  if (process.argv[2] === '--json' || process.argv[2] === '-') {
    // Read from stdin
    input = '';
    process.stdin.on('data', chunk => { input += chunk; });
    process.stdin.on('end', () => processInput(input, clearedDays));
  } else if (process.argv[2]) {
    // Read from file
    input = readFileSync(process.argv[2], 'utf8');
    
    // Check for cleared-days file
    if (process.argv[3]) {
      const clearedData = readFileSync(process.argv[3], 'utf8');
      clearedDays = JSON.parse(clearedData);
    } else {
      try {
        const clearedData = readFileSync('data/cleared-days.json', 'utf8');
        clearedDays = JSON.parse(clearedData);
      } catch {}
    }
    
    processInput(input, clearedDays);
  } else {
    console.error('Usage: node scripts/suspect-days.mjs <daily-views.json> [cleared-days.json]');
    console.error('   or: wrangler d1 execute ... --json | node scripts/suspect-days.mjs --json');
    process.exit(1);
  }
}

function processInput(input, clearedDays) {
  const data = JSON.parse(input);
  
  // Handle wrangler d1 execute --json output format
  const dailyViews = Array.isArray(data) ? data : 
                     data.results?.[0]?.results || data.results || [];
  
  const flagged = analyzeSuspectDays(dailyViews, clearedDays);
  
  if (flagged.length === 0) {
    console.log('No suspect days found.');
  } else {
    console.log('Suspect days:');
    console.log('============');
    for (const entry of flagged) {
      console.log(`${entry.day}: ${entry.views} views (baseline: ${entry.baseline.toFixed(1)})`);
    }
    console.log(`\nTotal: ${flagged.length} suspect day(s)`);
  }
}
