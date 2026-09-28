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

function rgbToLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

async function measureNodeContrast(page, node, viewport) {
  const selector = node.target[0];
  const messageKey = node.any?.[0]?.data?.messageKey || null;
  const message = node.any?.[0]?.message || '';
  
  let reason = messageKey || 'unknown';
  if (!messageKey) {
    if (message.includes('background image')) reason = 'bgImage';
    else if (message.includes('gradient')) reason = 'bgGradient';
    else if (message.includes('overlap')) reason = 'bgOverlap';
    else if (message.includes('pseudo')) reason = 'pseudoContent';
    else if (message) reason = 'other';
  }
  
  try {
    const elementData = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      
      const style = window.getComputedStyle(el);
      const textContent = el.textContent.trim().substring(0, 100);
      
      const colorStr = style.color;
      const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!match) return null;
      
      const [_, r, g, b, a] = match;
      const alpha = a !== undefined ? parseFloat(a) : 1.0;
      
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseInt(style.fontWeight) || 400;
      
      const rect = el.getBoundingClientRect();
      
      return {
        textContent,
        r: parseInt(r),
        g: parseInt(g),
        b: parseInt(b),
        alpha,
        fontSize,
        fontWeight,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        }
      };
    }, selector);
    
    if (!elementData || !elementData.textContent) {
      return {
        textSnippet: '',
        messageKey: reason,
        status: 'could-not-measure',
        error: 'Element not found or has no text'
      };
    }
    
    const isLargeText = elementData.fontSize >= 24 || 
      (elementData.fontSize >= 18.66 && elementData.fontWeight >= 700);
    const threshold = isLargeText ? 3.0 : 4.5;
    
    await page.evaluate(() => document.fonts.ready);
    
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.scrollIntoView({ block: 'center', inline: 'center' });
    }, selector);
    
    await page.waitForTimeout(100);
    
    const hideResult = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { success: false };
      
      const allNodes = [el, ...el.querySelectorAll('*')];
      const saved = allNodes.map(node => ({
        color: node.style.color,
        textFillColor: node.style.webkitTextFillColor,
        textShadow: node.style.textShadow,
        caretColor: node.style.caretColor
      }));
      
      allNodes.forEach(node => {
        node.style.color = 'transparent';
        node.style.webkitTextFillColor = 'transparent';
        node.style.textShadow = 'none';
        node.style.caretColor = 'transparent';
      });
      
      const before = window.getComputedStyle(el, '::before');
      const after = window.getComputedStyle(el, '::after');
      const hasPseudoText = (before.content && before.content !== 'none' && before.content !== '""') ||
                            (after.content && after.content !== 'none' && after.content !== '""');
      
      if (hasPseudoText) {
        const style = document.createElement('style');
        style.id = 'contrast-measure-pseudo';
        style.textContent = `
          ${sel}::before, ${sel}::after {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
            text-shadow: none !important;
          }
        `;
        document.head.appendChild(style);
      }
      
      return { success: true, saved };
    }, selector);
    
    if (!hideResult.success) {
      return {
        textSnippet: elementData.textContent,
        messageKey: reason,
        status: 'could-not-measure',
        error: 'Could not hide text'
      };
    }
    
    const clip = {
      x: Math.max(0, elementData.rect.x),
      y: Math.max(0, elementData.rect.y),
      width: Math.min(elementData.rect.width, viewport.width - Math.max(0, elementData.rect.x)),
      height: Math.min(elementData.rect.height, viewport.height - Math.max(0, elementData.rect.y))
    };
    
    if (clip.width <= 0 || clip.height <= 0) {
      await page.evaluate(({ sel, saved }) => {
        const style = document.getElementById('contrast-measure-pseudo');
        if (style) style.remove();
        
        const el = document.querySelector(sel);
        if (!el) return;
        const allNodes = [el, ...el.querySelectorAll('*')];
        allNodes.forEach((node, i) => {
          if (saved[i]) {
            node.style.color = saved[i].color;
            node.style.webkitTextFillColor = saved[i].textFillColor;
            node.style.textShadow = saved[i].textShadow;
            node.style.caretColor = saved[i].caretColor;
          }
        });
      }, { sel: selector, saved: hideResult.saved });
      
      return {
        textSnippet: elementData.textContent,
        messageKey: reason,
        status: 'could-not-measure',
        error: 'Element not visible'
      };
    }
    
    const screenshot = await page.screenshot({ clip, type: 'png' });
    
    await page.evaluate(({ sel, saved }) => {
      const style = document.getElementById('contrast-measure-pseudo');
      if (style) style.remove();
      
      const el = document.querySelector(sel);
      if (!el) return;
      const allNodes = [el, ...el.querySelectorAll('*')];
      allNodes.forEach((node, i) => {
        if (saved[i]) {
          node.style.color = saved[i].color;
          node.style.webkitTextFillColor = saved[i].textFillColor;
          node.style.textShadow = saved[i].textShadow;
          node.style.caretColor = saved[i].caretColor;
        }
      });
    }, { sel: selector, saved: hideResult.saved });
    
    const { PNG } = await import('pngjs');
    const png = PNG.sync.read(screenshot);
    
    const blurRadius = Math.max(1, Math.round(elementData.fontSize * 0.08));
    const pixels = [];
    
    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        const idx = (png.width * y + x) << 2;
        const r = png.data[idx];
        const g = png.data[idx + 1];
        const b = png.data[idx + 2];
        pixels.push({ r, g, b, lum: rgbToLuminance(r, g, b) });
      }
    }
    
    if (pixels.length === 0) {
      return {
        textSnippet: elementData.textContent,
        messageKey: reason,
        status: 'could-not-measure',
        error: 'No pixels captured'
      };
    }
    
    const blurred = [];
    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        let sumR = 0, sumG = 0, sumB = 0, count = 0;
        
        for (let dy = -blurRadius; dy <= blurRadius; dy++) {
          for (let dx = -blurRadius; dx <= blurRadius; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < png.height && nx >= 0 && nx < png.width) {
              const pixel = pixels[ny * png.width + nx];
              sumR += pixel.r;
              sumG += pixel.g;
              sumB += pixel.b;
              count++;
            }
          }
        }
        
        const avgR = sumR / count;
        const avgG = sumG / count;
        const avgB = sumB / count;
        blurred.push(rgbToLuminance(avgR, avgG, avgB));
      }
    }
    
    const sortedLum = blurred.slice().sort((a, b) => a - b);
    const medianLum = sortedLum[Math.floor(sortedLum.length / 2)];
    const textLum = rgbToLuminance(elementData.r, elementData.g, elementData.b);
    
    const isTextDark = textLum < medianLum;
    const worstBgLum = isTextDark ? Math.max(...blurred) : Math.min(...blurred);
    
    const meanBgLum = blurred.reduce((sum, l) => sum + l, 0) / blurred.length;
    const p95Index = Math.floor(blurred.length * 0.95);
    const p95BgLum = sortedLum[p95Index];
    
    const L1 = Math.max(textLum, worstBgLum);
    const L2 = Math.min(textLum, worstBgLum);
    const contrastRatio = (L1 + 0.05) / (L2 + 0.05);
    
    const passes = contrastRatio >= threshold;
    
    return {
      textSnippet: elementData.textContent,
      messageKey: reason,
      fontSize: elementData.fontSize,
      fontWeight: elementData.fontWeight,
      isLargeText,
      threshold,
      contrastRatio: parseFloat(contrastRatio.toFixed(2)),
      meanBgLuminance: parseFloat(meanBgLum.toFixed(3)),
      p95BgLuminance: parseFloat(p95BgLum.toFixed(3)),
      textLuminance: parseFloat(textLum.toFixed(3)),
      alpha: elementData.alpha,
      status: passes ? 'pass' : 'fail'
    };
    
  } catch (error) {
    return {
      textSnippet: '',
      messageKey: reason,
      status: 'could-not-measure',
      error: error.message
    };
  }
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
        nodes: [],
      };
    }
    violations[key].count += violation.nodes.length;
    
    for (const node of violation.nodes) {
      const nodeInfo = {
        target: node.target.join(' '),
        html: node.html,
      };
      
      if (key === 'color-contrast' && node.any && node.any.length > 0 && node.any[0].data) {
        const data = node.any[0].data;
        nodeInfo.fgColor = data.fgColor || null;
        nodeInfo.bgColor = data.bgColor || null;
        nodeInfo.contrastRatio = data.contrastRatio || null;
        nodeInfo.fontSize = data.fontSize || null;
        nodeInfo.fontWeight = data.fontWeight || null;
      }
      
      violations[key].nodes.push(nodeInfo);
    }
  }

  const incomplete = {};
  for (const item of axeResults.incomplete) {
    const key = item.id;
    if (!incomplete[key]) {
      incomplete[key] = {
        count: 0,
        nodes: [],
      };
    }
    incomplete[key].count += item.nodes.length;
    
    for (const node of item.nodes) {
      const nodeInfo = {
        target: node.target.join(' '),
        html: node.html.substring(0, 150),
      };
      
      if (key === 'color-contrast') {
        const measurement = await measureNodeContrast(page, node, viewport);
        Object.assign(nodeInfo, measurement);
      }
      
      incomplete[key].nodes.push(nodeInfo);
    }
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
    incomplete,
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
