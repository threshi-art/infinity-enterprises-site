import { chromium } from 'playwright';
import { readFile, writeFile } from 'fs/promises';
import { spawn } from 'child_process';
import { readdir } from 'fs/promises';

const VIEWPORTS = [
  { width: 1440, height: 900, name: '1440x900' },
  { width: 390, height: 844, name: '390x844' },
];

const ROUTES = [
  '/development/atlas',
  '/',
  '/issues',
  '/form',
  '/development',
  '/enigmas',
  '/ether',
  '/foundation',
];

async function startDevServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['-e', `
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

async function measureRoute(browser, route, viewport, baseline) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const url = `http://localhost:3000${route}`;

  // Step 1: Measure current state
  const responses = [];
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    if (status >= 200 && status < 300) {
      const headers = await response.allHeaders();
      const contentType = headers['content-type'] || '';
      let bytes = 0;
      
      const contentLength = headers['content-length'];
      if (contentLength) {
        bytes = parseInt(contentLength, 10);
      } else {
        try {
          const body = await response.body();
          bytes = body.length;
        } catch {}
      }
      
      responses.push({ url, contentType, bytes });
    }
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  const totalBytes = responses.reduce((sum, r) => sum + r.bytes, 0);
  const mediaResponses = responses.filter(r => r.url.includes('/media/') && r.url.endsWith('.jpg'));
  const mediaBytes = mediaResponses.reduce((sum, r) => sum + r.bytes, 0);
  
  await context.close();

  // Step 2: Measure with WebP interception
  const contextWebP = await browser.newContext({ viewport });
  const pageWebP = await contextWebP.newPage();
  
  const webpResponses = [];
  
  // Intercept and replace JPG with WebP
  await pageWebP.route('**/*', async (route) => {
    const request = route.request();
    const reqUrl = request.url();
    
    if (reqUrl.includes('/media/') && reqUrl.endsWith('.jpg')) {
      // Extract image name
      const match = reqUrl.match(/\/media\/([^/]+)\.jpg$/);
      if (match) {
        const imageName = match[1];
        const variantSuffix = viewport.width === 1440 ? '-desktop-1x' : '-mobile-1x';
        let webpPath = `src/assets/perf/${imageName}${variantSuffix}.webp`;
        
        try {
          const webpContent = await readFile(webpPath);
          route.fulfill({
            status: 200,
            contentType: 'image/webp',
            body: webpContent,
          });
          webpResponses.push({ 
            url: reqUrl, 
            contentType: 'image/webp', 
            bytes: webpContent.length,
            replaced: true 
          });
          return;
        } catch (e) {
          // Fall back to desktop-1x if mobile doesn't exist
          if (variantSuffix === '-mobile-1x') {
            webpPath = `src/assets/perf/${imageName}-desktop-1x.webp`;
            try {
              const webpContent = await readFile(webpPath);
              route.fulfill({
                status: 200,
                contentType: 'image/webp',
                body: webpContent,
              });
              webpResponses.push({ 
                url: reqUrl, 
                contentType: 'image/webp', 
                bytes: webpContent.length,
                replaced: true,
                fallback: true 
              });
              return;
            } catch {}
          }
        }
      }
    }
    
    // Not a media JPG or couldn't replace - continue normally
    route.continue();
  });
  
  pageWebP.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    if (status >= 200 && status < 300 && !webpResponses.find(r => r.url === url)) {
      const headers = await response.allHeaders();
      const contentType = headers['content-type'] || '';
      let bytes = 0;
      
      const contentLength = headers['content-length'];
      if (contentLength) {
        bytes = parseInt(contentLength, 10);
      } else {
        try {
          const body = await response.body();
          bytes = body.length;
        } catch {}
      }
      
      webpResponses.push({ url, contentType, bytes, replaced: false });
    }
  });

  await pageWebP.goto(url, { waitUntil: 'networkidle' });
  await pageWebP.waitForTimeout(1000);
  
  const projectedBytes = webpResponses.reduce((sum, r) => sum + r.bytes, 0);
  
  await contextWebP.close();

  return {
    route,
    viewport: viewport.name,
    baseline,
    measured: totalBytes,
    mediaBytes,
    projected: projectedBytes,
    responses: responses.sort((a, b) => b.bytes - a.bytes).slice(0, 10),
    mediaRequests: mediaResponses.map(r => ({
      url: r.url,
      image: r.url.match(/\/media\/([^/]+)\.jpg$/)?.[1] + '.jpg',
      bytes: r.bytes,
    })),
  };
}

async function main() {
  console.log('Starting dev server...');
  const server = await startDevServer();

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  const baseline = {
    '/development/atlas': { '1440x900': 1479, '390x844': 1479 },
    '/': { '1440x900': 1278, '390x844': 787 },
    '/issues': { '1440x900': 1269, '390x844': 1123 },
    '/form': { '1440x900': 1267, '390x844': 1267 },
    '/development': { '1440x900': 1091, '390x844': 1091 },
    '/enigmas': { '1440x900': 1086, '390x844': 748 },
    '/ether': { '1440x900': 1080, '390x844': 1080 },
    '/foundation': { '1440x900': 1001, '390x844': 1001 },
  };

  const results = [];

  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      console.log(`\nMeasuring ${route} at ${viewport.name}...`);
      const baselineKB = baseline[route][viewport.name];
      const result = await measureRoute(browser, route, viewport, baselineKB);
      results.push(result);
      
      const measuredKB = Math.round(result.measured / 1024);
      const projectedKB = Math.round(result.projected / 1024);
      const diff = baselineKB - measuredKB;
      const match = Math.abs(diff) < baselineKB * 0.05 ? '✓' : `⚠ ${diff > 0 ? '+' : ''}${diff} KB`;
      console.log(`  Baseline: ${baselineKB} KB, Measured: ${measuredKB} KB ${match}`);
      console.log(`  Media JPG: ${Math.round(result.mediaBytes / 1024)} KB`);
      console.log(`  Projected: ${projectedKB} KB`);
    }
  }

  await browser.close();
  server.kill();

  console.log('\nWriting results...');
  await writeFile('src/assets/perf/measured-routes.json', JSON.stringify({ results }, null, 2));
  console.log('✓ Done');
}

main().catch(console.error);
