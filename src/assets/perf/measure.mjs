import { readFile } from 'fs/promises';
import { createHash } from 'crypto';

async function measure() {
  const workerSource = await readFile('dist/server/index.js', 'utf8');
  
  // Find all base64 strings
  const base64Pattern = /"(\/9j[A-Za-z0-9+/=]{100,})"/g;
  const matches = [...workerSource.matchAll(base64Pattern)];
  
  console.log(`Found ${matches.length} base64 image strings in bundle\n`);
  
  // Decode and hash each one
  const base64Images = new Map();
  for (let i = 0; i < matches.length; i++) {
    const base64Data = matches[i][1];
    const decoded = Buffer.from(base64Data, 'base64');
    const hash = createHash('sha256').update(decoded).digest('hex');
    
    base64Images.set(hash, {
      index: i,
      base64Bytes: base64Data.length,
      decodedBytes: decoded.length,
    });
  }
  
  // Read and hash source JPGs
  const sourceFiles = [
    'hero.jpg', 'detail.jpg', 'diana.jpg', 'diana-cards.jpg',
    'development.jpg', 'tech-lounge.jpg', 'tech-macro.jpg',
    'enigmas-politics.jpg', 'enigmas-law.jpg', 'enigmas-academy.jpg',
    'research.jpg', 'learning.jpg', 'foundation.jpg', 'youth.jpg',
    'cover.jpg', 'food.jpg',
    'ether-1.jpg', 'ether-2.jpg', 'ether-3.jpg', 'ether-4.jpg',
    'motor-1.jpg', 'motor-2.jpg', 'motor-3.jpg', 'motor-4.jpg',
    'form-1.jpg', 'form-2.jpg', 'form-3.jpg', 'form-4.jpg',
    'form-5.jpg', 'form-6.jpg', 'form-7.jpg'
  ];
  
  const sourceHashes = new Map();
  for (const filename of sourceFiles) {
    try {
      const content = await readFile(`src/assets/${filename}`);
      const hash = createHash('sha256').update(content).digest('hex');
      sourceHashes.set(hash, filename);
    } catch (e) {
      console.error(`Could not read ${filename}`);
    }
  }
  
  // Match base64 to source
  const imageInfo = new Map();
  for (const [hash, info] of base64Images.entries()) {
    if (sourceHashes.has(hash)) {
      const filename = sourceHashes.get(hash);
      imageInfo.set(filename, {
        base64Bytes: info.base64Bytes,
        decodedBytes: info.decodedBytes,
      });
    } else {
      console.log(`Unmatched base64 image: hash ${hash.slice(0, 16)}... (${info.decodedBytes} bytes)`);
    }
  }
  
  // Extract HTML constants from bundle to find which images each route uses
  const routes = [
    { path: '/', html: 'homeHtml' },
    { path: '/about', html: 'aboutHtml' },
    { path: '/about/standards', html: 'standardsHtml' },
    { path: '/about/diana', html: 'dianaHtml' },
    { path: '/development', html: 'developmentHtml' },
    { path: '/development/atlas', html: 'atlasHtml' },
    { path: '/learning', html: 'learningHtml' },
    { path: '/journal', html: 'journalHtml' },
    { path: '/foundation', html: 'foundationHtml' },
    { path: '/foundation/youth', html: 'youthHtml' },
    { path: '/tech-lounge', html: 'techLoungeHtml' },
    { path: '/ether', html: 'etherHtml' },
    { path: '/motor', html: 'motorHtml' },
    { path: '/form', html: 'formHtml' },
    { path: '/enigmas', html: 'enigmasHtml' },
  ];
  
  const routeImages = {};
  
  for (const route of routes) {
    const images = new Set();
    
    // Find the HTML constant value - need to handle escaped quotes
    // Pattern: const varName = "...content with \" escapes..."
    const startPattern = new RegExp(`const ${route.html}\\s*=\\s*"`);
    const startMatch = workerSource.match(startPattern);
    
    if (startMatch) {
      let pos = startMatch.index + startMatch[0].length;
      let htmlContent = '';
      let escaped = false;
      
      // Read until we find an unescaped closing quote
      while (pos < workerSource.length) {
        const char = workerSource[pos];
        if (escaped) {
          htmlContent += char;
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === '"') {
          break;
        } else {
          htmlContent += char;
        }
        pos++;
      }
      
      // Find all /media/*.jpg references
      const mediaRefs = [...htmlContent.matchAll(/\/media\/([a-z0-9-]+)\.jpg/g)];
      for (const ref of mediaRefs) {
        const imageName = ref[1];
        // Map media names to filenames
        if (imageName === 'hero') images.add('hero.jpg');
        else if (imageName === 'detail') images.add('detail.jpg');
        else if (imageName === 'diana') images.add('diana.jpg');
        else if (imageName === 'diana-cards') images.add('diana-cards.jpg');
        else if (imageName === 'development') images.add('development.jpg');
        else if (imageName === 'tech-lounge') images.add('tech-lounge.jpg');
        else if (imageName === 'tech-macro') images.add('tech-macro.jpg');
        else if (imageName === 'enigmas-politics') images.add('enigmas-politics.jpg');
        else if (imageName === 'enigmas-law') images.add('enigmas-law.jpg');
        else if (imageName === 'enigmas-academy') images.add('enigmas-academy.jpg');
        else if (imageName === 'research') images.add('research.jpg');
        else if (imageName === 'learning') images.add('learning.jpg');
        else if (imageName === 'foundation') images.add('foundation.jpg');
        else if (imageName === 'youth') images.add('youth.jpg');
        else if (imageName === 'cover') images.add('cover.jpg');
        else if (imageName === 'food') images.add('food.jpg');
        else if (imageName.startsWith('ether-')) images.add(imageName + '.jpg');
        else if (imageName.startsWith('motor-')) images.add(imageName + '.jpg');
        else if (imageName.startsWith('form-')) images.add(imageName + '.jpg');
      }
    }
    
    routeImages[route.path] = Array.from(images).sort();
  }
  
  // Also check publication pages (issues route)
  const pubPagesPattern = /const publicationPages\s*=\s*"([^"]{1000,}?)"/s;
  const pubMatch = workerSource.match(pubPagesPattern);
  if (pubMatch) {
    const pubContent = pubMatch[1];
    const mediaRefs = [...pubContent.matchAll(/\/media\/([a-z0-9-]+)\.jpg/g)];
    const pubImages = new Set();
    for (const ref of mediaRefs) {
      const imageName = ref[1];
      if (imageName === 'cover') pubImages.add('cover.jpg');
      else if (imageName === 'hero') pubImages.add('hero.jpg');
      else if (imageName === 'detail') pubImages.add('detail.jpg');
      else if (imageName.startsWith('ether-')) pubImages.add(imageName + '.jpg');
      else if (imageName.startsWith('motor-')) pubImages.add(imageName + '.jpg');
      else if (imageName.startsWith('form-')) pubImages.add(imageName + '.jpg');
      else if (imageName === 'food') pubImages.add('food.jpg');
      else if (imageName === 'research') pubImages.add('research.jpg');
      else if (imageName === 'development') pubImages.add('development.jpg');
      else if (imageName === 'enigmas-politics') pubImages.add('enigmas-politics.jpg');
      else if (imageName === 'tech-macro') pubImages.add('tech-macro.jpg');
    }
    routeImages['/issues'] = Array.from(pubImages).sort();
  }
  
  // Print results
  console.log('\nRoute → Images mapping:\n');
  for (const [route, images] of Object.entries(routeImages).sort()) {
    if (images.length > 0) {
      console.log(`${route}:`);
      for (const img of images) {
        const info = imageInfo.get(img);
        if (info) {
          console.log(`  - ${img} (${Math.round(info.base64Bytes / 1024)} KB base64)`);
        }
      }
    }
  }
  
  // Output JSON for programmatic use
  const output = {
    imageInfo: Object.fromEntries(imageInfo),
    routeImages: routeImages,
  };
  
  await writeFile('src/assets/perf/measured-routes.json', JSON.stringify(output, null, 2));
  console.log('\n✓ Wrote measured-routes.json');
}

import { writeFile } from 'fs/promises';
measure().catch(console.error);
