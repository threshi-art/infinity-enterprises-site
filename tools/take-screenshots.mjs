// Screenshot tool for visual comparison of contrast fixes before and after
import { chromium } from 'playwright';
import { mkdir, access } from 'fs/promises';
import { spawn } from 'child_process';

const routes = [
  { path: '/', name: 'home' },
  { path: '/journal', name: 'journal' },
  { path: '/tech-lounge', name: 'tech-lounge' },
  { path: '/enigmas', name: 'enigmas' },
  { path: '/enigmas/who-governs-the-reasoning', name: 'enigmas-article' },
  { path: '/daily-desk', name: 'daily-desk' },
  { path: '/music', name: 'music' },
];

const widths = [1440, 390];

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
            new Request('http://localhost:3001' + req.url, {
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
      }).listen(3001, () => console.log('Server ready'));
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

async function main() {
  const outputDir = '/opt/cursor/artifacts/contrast-18';
  
  try {
    await access(outputDir);
  } catch {
    await mkdir(outputDir, { recursive: true });
  }

  console.log('Starting dev server...');
  const server = await startDevServer();

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  for (const route of routes) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: width === 1440 ? 900 : 844 },
        colorScheme: route.path.includes('enigmas') || route.path.includes('journal') || route.path.includes('tech-lounge') ? 'light' : 'dark',
      });

      const page = await context.newPage();
      const url = `http://localhost:3001${route.path}`;
      
      console.log(`Capturing ${route.name} at ${width}px...`);
      
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      const filename = `${outputDir}/${route.name}-${width}-after.png`;
      await page.screenshot({ path: filename, fullPage: true });
      
      await context.close();
    }
  }

  await browser.close();
  server.kill();

  console.log(`Screenshots saved to ${outputDir}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
