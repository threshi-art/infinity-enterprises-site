#!/usr/bin/env node

/**
 * Headless rendering script for issue #35 v2 room mocks
 * Generates desktop (1440px), phone (390px), reduced-motion, sound-control, 
 * focus, and comparison screenshots using Playwright + Chromium
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ensure output directories exist
const artifactDir = '/opt/cursor/artifacts/issue-35-v2';
await mkdir(artifactDir, { recursive: true });
await mkdir(__dirname, { recursive: true });

console.log('Starting headless render for issue #35 v2 mocks...\n');

const browser = await chromium.launch({ headless: true });

const rooms = [
  { name: 'music', title: 'Music' },
  { name: 'tech-lounge', title: 'Tech@Lounge' },
  { name: 'food', title: 'Food' }
];

// Desktop renders (1440x900)
console.log('Rendering desktop views (1440x900)...');
for (const room of rooms) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.goto(`file://${__dirname}/${room.name}.html`);
  await page.waitForTimeout(500); // Allow fonts and animations to load
  
  const screenshotPath = join(__dirname, `${room.name}-desktop-1440.png`);
  const artifactPath = join(artifactDir, `${room.name}-desktop-1440.png`);
  
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await page.screenshot({ path: artifactPath, fullPage: true });
  
  console.log(`  ✓ ${room.title} desktop: ${screenshotPath}`);
  await context.close();
}

// Phone renders (390x844, deviceScaleFactor 2)
console.log('\nRendering phone views (390x844)...');
for (const room of rooms) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto(`file://${__dirname}/${room.name}.html`);
  await page.waitForTimeout(500);
  
  const screenshotPath = join(__dirname, `${room.name}-phone-390.png`);
  const artifactPath = join(artifactDir, `${room.name}-phone-390.png`);
  
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await page.screenshot({ path: artifactPath, fullPage: true });
  
  console.log(`  ✓ ${room.title} phone: ${screenshotPath}`);
  await context.close();
}

// Reduced motion renders (desktop)
console.log('\nRendering reduced-motion views...');
for (const room of rooms) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  await page.goto(`file://${__dirname}/${room.name}.html`);
  await page.waitForTimeout(500);
  
  const screenshotPath = join(__dirname, `${room.name}-reduced-motion.png`);
  const artifactPath = join(artifactDir, `${room.name}-reduced-motion.png`);
  
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await page.screenshot({ path: artifactPath, fullPage: false });
  
  console.log(`  ✓ ${room.title} reduced-motion: ${screenshotPath}`);
  await context.close();
}

// Sound control frames (desktop, show sound toggle focused and on)
console.log('\nRendering sound-control views...');
for (const room of rooms) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.goto(`file://${__dirname}/${room.name}.html`);
  await page.waitForTimeout(500);
  
  // Toggle sound on and focus the button
  await page.click('.sound-toggle');
  await page.focus('.sound-toggle');
  await page.waitForTimeout(200);
  
  const screenshotPath = join(__dirname, `${room.name}-sound-control.png`);
  const artifactPath = join(artifactDir, `${room.name}-sound-control.png`);
  
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await page.screenshot({ path: artifactPath, fullPage: false });
  
  console.log(`  ✓ ${room.title} sound-control: ${screenshotPath}`);
  await context.close();
}

// Focus frames (desktop, show nav link focused)
console.log('\nRendering focus views...');
for (const room of rooms) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.goto(`file://${__dirname}/${room.name}.html`);
  await page.waitForTimeout(500);
  
  // Focus a nav link to show focus ring
  await page.focus('.nav-link');
  await page.waitForTimeout(200);
  
  const screenshotPath = join(__dirname, `${room.name}-focus.png`);
  const artifactPath = join(artifactDir, `${room.name}-focus.png`);
  
  await page.screenshot({ path: screenshotPath, fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 400 } });
  await page.screenshot({ path: artifactPath, fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 400 } });
  
  console.log(`  ✓ ${room.title} focus: ${screenshotPath}`);
  await context.close();
}

// Side-by-side comparison - desktop (all three rooms)
console.log('\nRendering desktop comparison (side-by-side)...');
{
  const context = await browser.newContext({
    viewport: { width: 4320, height: 900 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  
  // Create a comparison HTML page
  const comparisonHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; display: flex; }
    iframe { width: 1440px; height: 900px; border: none; flex-shrink: 0; }
  </style>
</head>
<body>
  <iframe src="file://${__dirname}/music.html"></iframe>
  <iframe src="file://${__dirname}/tech-lounge.html"></iframe>
  <iframe src="file://${__dirname}/food.html"></iframe>
</body>
</html>
  `.trim();
  
  await page.setContent(comparisonHTML);
  await page.waitForTimeout(1000); // Allow all iframes to load
  
  const screenshotPath = join(__dirname, 'compare-desktop.png');
  const artifactPath = join(artifactDir, 'compare-desktop.png');
  
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await page.screenshot({ path: artifactPath, fullPage: false });
  
  console.log(`  ✓ Desktop comparison: ${screenshotPath}`);
  await context.close();
}

// Side-by-side comparison - phone (all three rooms)
console.log('\nRendering phone comparison (side-by-side)...');
{
  const context = await browser.newContext({
    viewport: { width: 1170, height: 844 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  
  const comparisonHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; display: flex; }
    iframe { width: 390px; height: 844px; border: none; flex-shrink: 0; }
  </style>
</head>
<body>
  <iframe src="file://${__dirname}/music.html"></iframe>
  <iframe src="file://${__dirname}/tech-lounge.html"></iframe>
  <iframe src="file://${__dirname}/food.html"></iframe>
</body>
</html>
  `.trim();
  
  await page.setContent(comparisonHTML);
  await page.waitForTimeout(1000);
  
  const screenshotPath = join(__dirname, 'compare-phone.png');
  const artifactPath = join(artifactDir, 'compare-phone.png');
  
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await page.screenshot({ path: artifactPath, fullPage: false });
  
  console.log(`  ✓ Phone comparison: ${screenshotPath}`);
  await context.close();
}

await browser.close();

console.log('\n✓ All renders complete!');
console.log(`\nScreenshots saved to:`);
console.log(`  - ${__dirname}/`);
console.log(`  - ${artifactDir}/`);
