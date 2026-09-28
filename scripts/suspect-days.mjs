import { readFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export function normalizeInput(data) {
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
  return dailyViews.map(row => ({
    day: row.day,
    views: Number(row.views)
  }));
}

export function formatReport(results) {
  const suspect = results.filter(r => r.status === 'suspect');
  const cleared = results.filter(r => r.status === 'cleared');
  const notChecked = results.filter(r => r.status === 'not_checked');
  const ok = results.filter(r => r.status === 'ok');
  
  // Check if no day has enough history
  const hasBaseline = ok.length > 0 || suspect.length > 0;
  
  let output = '';
  
  if (!hasBaseline && notChecked.length > 0) {
    output += 'no baseline yet: clear the first 7 days\n';
  }
  
  if (suspect.length > 0) {
    output += 'Suspect days:\n';
    output += '============\n';
    for (const entry of suspect) {
      output += `${entry.day}: ${entry.views} views (baseline: ${entry.baseline.toFixed(1)})\n`;
    }
    output += `\nTotal: ${suspect.length} suspect day(s)\n`;
  } else if (hasBaseline) {
    output += 'No suspect days found.\n';
  }
  
  if (cleared.length > 0) {
    output += '\nCleared days:\n';
    output += '=============\n';
    for (const entry of cleared) {
      output += `${entry.day}: ${entry.views} views (manually verified)\n`;
    }
  }
  
  if (notChecked.length > 0) {
    output += '\nNot checked (insufficient baseline):\n';
    output += '====================================\n';
    for (const entry of notChecked) {
      output += `${entry.day}: ${entry.views} views\n`;
    }
  }
  
  return output;
}

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
    // User-specified file: resolve relative to cwd
    try {
      const clearedData = readFileSync(clearedFile, 'utf8');
      clearedDays = JSON.parse(clearedData);
    } catch (err) {
      console.error(`Error reading cleared file ${clearedFile}: ${err.message}`);
      process.exit(1);
    }
  } else {
    // Default file: resolve relative to repo root
    try {
      const scriptPath = fileURLToPath(import.meta.url);
      const repoRoot = join(dirname(scriptPath), '..');
      const defaultPath = join(repoRoot, 'data', 'cleared-days.json');
      const clearedData = readFileSync(defaultPath, 'utf8');
      try {
        clearedDays = JSON.parse(clearedData);
      } catch (parseErr) {
        console.error(`Error parsing ${defaultPath}: ${parseErr.message}`);
        process.exit(1);
      }
    } catch (err) {
      // Default file missing is OK, treat as empty array
      if (err.code !== 'ENOENT') {
        console.error(`Error reading default cleared-days.json: ${err.message}`);
        process.exit(1);
      }
    }
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
  const dailyViews = normalizeInput(data);
  
  if (dailyViews.length === 0) {
    console.log('no data: 0 days in input');
    return;
  }
  
  const results = analyzeSuspectDays(dailyViews, clearedDays);
  const output = formatReport(results);
  process.stdout.write(output);
}
