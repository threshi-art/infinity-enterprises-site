import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'fs/promises';
import { spawn } from 'child_process';

const VIEWPORTS = [
  { width: 1440, height: 900, name: '1440x900' },
  { width: 390, height: 844, name: '390x844' },
];

const BUDGET_BYTES = 1_000_000;
const LOAD_WAIT_MS = 3000;

const routes = [
  '/',
  '/about',
  '/about/diana',
  '/about/standards',
  '/blog',
  '/contact',
  '/culture',
  '/daily-desk',
  '/development',
  '/development/atlas',
  '/enigmas',
  '/enigmas/aegis-awaiting-proof',
  '/enigmas/ai-accountability-across-systems',
  '/enigmas/civilization-of-interfaces',
  '/enigmas/discovery-with-purpose',
  '/enigmas/eiram-evidence-uncertainty',
  '/enigmas/foundation-research-vision',
  '/enigmas/noesis-chooses-to-reason',
  '/enigmas/our-american-story',
  '/enigmas/pacific-royal-academy-design',
  '/enigmas/power-and-accountability',
  '/enigmas/seraphim-human-authority',
  '/enigmas/socrates-art-of-why',
  '/enigmas/test-a-legal-claim',
  '/enigmas/the-evidence-threshold',
  '/enigmas/the-machine-that-asks-why',
  '/enigmas/what-would-reform-cost',
  '/enigmas/when-the-model-says-i-dont-know',
  '/ether',
  '/food',
  '/form',
  '/foundation',
  '/foundation/youth',
  '/inquiry',
  '/issues',
  '/journal',
  '/learning',
  '/motor',
  '/music',
  '/partners',
  '/practice',
  '/privacy',
  '/reading-list',
  '/search',
  '/subscribe',
  '/support',
  '/tech-lounge',
];

const ADMIN_ROUTES = ['/admin', '/api/'];

function isAdminRoute(route) {
  return ADMIN_ROUTES.some(prefix => route.startsWith(prefix));
}

async function startDevServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['-e', `
      import {readFileSync} from 'fs';
      import {createServer} from 'http';
      const worker = await import('./dist/server/index.js');
      const env = {PIN_CODE: 'test', SESSION_SECRET: 'test'};
      createServer(async (req, res) => {
        try {
          const response = await worker.default.fetch(
            new Request('http://localhost:3000' + req.url, {
              method: req.method,
              headers: req.headers,
            }),
            env
          );
          res.writeHead(response.status, Object.fromEntries(response.headers));
          if (response.body) {
            const reader = response.body.getReader();
            while (true) {
              const {done, value} = await reader.read();
              if (done) break;
              res.write(value);
            }
          }
          res.end();
        } catch (e) {
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      }).listen(3000, () => console.log('Server ready'));
    `], { shell: false });

    let started = false;
    server.stdout.on('data', (data) => {
      if (data.toString().includes('Server ready') && !started) {
        started = true;
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    server.on('error', reject);

    setTimeout(() => {
      if (!started) {
        reject(new Error('Server failed to start within timeout'));
      }
    }, 10000);
  });
}

async function measureRoute(browser, route, viewport, strict) {
  const context = await browser.newContext({
    viewport,
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
  });

  const page = await context.newPage();
  const url = `http://localhost:3000${route}`;

  const transferredBytes = [];
  const layoutShifts = [];

  page.on('response', async (response) => {
    const request = response.request();
    const headers = await response.allHeaders();
    const contentLength = headers['content-length'];
    
    if (contentLength) {
      transferredBytes.push(parseInt(contentLength, 10));
    } else {
      try {
        const body = await response.body();
        transferredBytes.push(body.length);
      } catch {}
    }
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  const clsPromise = page.evaluate(() => {
    return new Promise((resolve) => {
      const shifts = [];
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            shifts.push(entry.value);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      setTimeout(() => {
        observer.disconnect();
        resolve(shifts.reduce((sum, val) => sum + val, 0));
      }, 3000);
    });
  });

  const cls = await clsPromise;

  const axeBuilder = new AxeBuilder({ page });
  const axeResults = await axeBuilder
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  const violations = {};
  for (const violation of axeResults.violations) {
    const key = violation.id;
    if (!violations[key]) {
      violations[key] = {
        impact: violation.impact || 'minor',
        count: 0,
      };
    }
    violations[key].count += violation.nodes.length;
  }

  await context.close();

  const totalBytes = transferredBytes.reduce((sum, val) => sum + val, 0);
  const overBudget = totalBytes > BUDGET_BYTES;

  const contextReduced = await browser.newContext({
    viewport,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  });
  const pageReduced = await contextReduced.newPage();
  await pageReduced.goto(url, { waitUntil: 'networkidle' });

  const hasMotion = await pageReduced.evaluate(() => {
    const animations = document.getAnimations();
    return animations.some(anim => {
      if (anim.playState !== 'running') return false;
      const effect = anim.effect;
      if (!effect || !effect.getComputedTiming) return false;
      const timing = effect.getComputedTiming();
      return timing.duration > 10;
    });
  });

  await contextReduced.close();

  return {
    route,
    viewport: viewport.name,
    violations,
    totalBytes,
    cls,
    overBudget,
    hasMotionWithReducedMotion: hasMotion,
  };
}

async function main() {
  const strict = process.argv.includes('--strict');

  console.log('Building site...');
  const { execSync } = await import('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (e) {
    console.error('Build failed');
    process.exit(1);
  }

  console.log('Starting dev server...');
  const server = await startDevServer();

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  const results = [];
  const errors = [];

  for (const route of routes) {
    if (isAdminRoute(route)) {
      continue;
    }

    for (const viewport of VIEWPORTS) {
      try {
        console.log(`Testing ${route} at ${viewport.name}...`);
        const result = await measureRoute(browser, route, viewport, strict);
        results.push(result);
      } catch (error) {
        console.error(`Error testing ${route} at ${viewport.name}:`, error.message);
        errors.push({ route, viewport: viewport.name, error: error.message });
      }
    }
  }

  await browser.close();
  server.kill();

  console.log('Generating reports...');

  const jsonReport = {
    date: new Date().toISOString(),
    results,
    errors,
  };

  await writeFile('a11y-report.json', JSON.stringify(jsonReport, null, 2));

  let markdown = '# Accessibility and Performance Report\n\n';
  markdown += `Date: ${new Date().toISOString().split('T')[0]}\n\n`;
  markdown += '## Summary\n\n';
  markdown += `- Routes tested: ${results.length / VIEWPORTS.length}\n`;
  markdown += `- Viewports: ${VIEWPORTS.map(v => v.name).join(', ')}\n`;

  const allViolations = {};
  for (const result of results) {
    for (const [id, data] of Object.entries(result.violations)) {
      if (!allViolations[id]) {
        allViolations[id] = { impact: data.impact, count: 0 };
      }
      allViolations[id].count += data.count;
    }
  }

  const violationsByImpact = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const data of Object.values(allViolations)) {
    violationsByImpact[data.impact] = (violationsByImpact[data.impact] || 0) + data.count;
  }

  markdown += `- Critical violations: ${violationsByImpact.critical}\n`;
  markdown += `- Serious violations: ${violationsByImpact.serious}\n`;
  markdown += `- Moderate violations: ${violationsByImpact.moderate}\n`;
  markdown += `- Minor violations: ${violationsByImpact.minor}\n\n`;

  markdown += '## Results by Route\n\n';
  markdown += '| Route | Viewport | Critical | Serious | Moderate | Minor | KB | CLS | Over Budget |\n';
  markdown += '|-------|----------|----------|---------|----------|-------|-----|-----|-------------|\n';

  for (const result of results) {
    const vByImpact = { critical: 0, serious: 0, moderate: 0, minor: 0 };
    for (const data of Object.values(result.violations)) {
      vByImpact[data.impact] = (vByImpact[data.impact] || 0) + data.count;
    }
    const kb = Math.round(result.totalBytes / 1024);
    const clsStr = result.cls.toFixed(3);
    const budgetMark = result.overBudget ? '⚠️' : '✓';
    markdown += `| ${result.route} | ${result.viewport} | ${vByImpact.critical} | ${vByImpact.serious} | ${vByImpact.moderate} | ${vByImpact.minor} | ${kb} | ${clsStr} | ${budgetMark} |\n`;
  }

  markdown += '\n## Top Violations by Count\n\n';
  const sortedViolations = Object.entries(allViolations).sort((a, b) => b[1].count - a[1].count).slice(0, 10);
  for (const [id, data] of sortedViolations) {
    markdown += `- **${id}** (${data.impact}): ${data.count} occurrences\n`;
  }

  const overBudgetRoutes = results.filter(r => r.overBudget);
  if (overBudgetRoutes.length > 0) {
    markdown += '\n## Pages Over Budget\n\n';
    for (const result of overBudgetRoutes) {
      const kb = Math.round(result.totalBytes / 1024);
      markdown += `- ${result.route} at ${result.viewport}: ${kb} KB\n`;
    }
  }

  const maxCLS = Math.max(...results.map(r => r.cls));
  markdown += `\n## Maximum CLS: ${maxCLS.toFixed(3)}\n`;

  const withMotion = results.filter(r => r.hasMotionWithReducedMotion);
  if (withMotion.length > 0) {
    markdown += '\n## Reduced Motion Violations\n\n';
    for (const result of withMotion) {
      markdown += `- ${result.route} at ${result.viewport}: animations still running with reduced motion\n`;
    }
  }

  if (errors.length > 0) {
    markdown += '\n## Errors\n\n';
    for (const error of errors) {
      markdown += `- ${error.route} at ${error.viewport}: ${error.error}\n`;
    }
  }

  await writeFile('a11y-report.md', markdown);

  console.log('\nReports written to a11y-report.json and a11y-report.md');

  if (strict) {
    const hasCriticalOrSerious = violationsByImpact.critical > 0 || violationsByImpact.serious > 0;
    const hasOverBudget = overBudgetRoutes.length > 0;
    if (hasCriticalOrSerious || hasOverBudget) {
      console.error('\nStrict mode: Critical/serious violations or budget breaches detected');
      process.exit(1);
    }
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
