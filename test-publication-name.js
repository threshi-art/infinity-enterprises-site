import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { PUBLICATION_NAME, PUBLICATION_NAME_STATUS, applyPublicationName } from './src/publication-config.mjs';

test('PUBLICATION_NAME config exports a non-empty string', () => {
  assert.ok(typeof PUBLICATION_NAME === 'string', 'PUBLICATION_NAME must be a string');
  assert.ok(PUBLICATION_NAME.length > 0, 'PUBLICATION_NAME must not be empty');
});

test('applyPublicationName escapes HTML entities', () => {
  const result = applyPublicationName('<b>__PUBLICATION_NAME__</b>', 'Test & Co');
  assert.equal(result, '<b>Test &amp; Co</b>');
});

test('applyPublicationName throws on empty name', () => {
  assert.throws(() => applyPublicationName('<b>__PUBLICATION_NAME__</b>', ''), {
    message: 'Publication name must be a non-empty string'
  });
});

test('applyPublicationName throws on non-string name', () => {
  assert.throws(() => applyPublicationName('<b>__PUBLICATION_NAME__</b>', null), {
    message: 'Publication name must be a non-empty string'
  });
});

const ALLOW_LIST = [
  { path: 'src/publication-config.mjs', reason: 'Config file that defines PUBLICATION_NAME' },
  { path: 'src/data/osint-sources.json', reason: 'External data catalog' },
  { path: 'src/assets', reason: 'Assets directory (excluded from scan)' }
];

async function walkDirectory(dir, extensions, excludePaths = []) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = fullPath.replace(/^\.\//, '');
    
    if (excludePaths.some(exclude => relativePath.startsWith(exclude))) {
      continue;
    }
    
    if (entry.isDirectory()) {
      files.push(...await walkDirectory(fullPath, extensions, excludePaths));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function checkForHardcodedNames(content, filePath) {
  const lines = content.split('\n');
  const findings = [];
  const pattern = /\b(savrono|sovrano|svrano|svran)\w*/gi;
  
  lines.forEach((line, index) => {
    const matches = [...line.matchAll(pattern)];
    if (matches.length > 0) {
      findings.push({
        file: filePath,
        line: index + 1,
        match: matches[0][0]
      });
    }
  });
  
  const currentNamePattern = new RegExp('\\b' + PUBLICATION_NAME + '\\b', 'i');
  lines.forEach((line, index) => {
    if (currentNamePattern.test(line)) {
      findings.push({
        file: filePath,
        line: index + 1,
        match: PUBLICATION_NAME
      });
    }
  });
  
  return findings;
}

test('hardcoding guard detects hardcoded publication names in source files', async () => {
  const srcFiles = await walkDirectory('src', ['.html', '.mjs', '.js', '.css', '.json'], [
    'src/assets',
    'src/publication-config.mjs',
    'src/data'
  ]);
  
  const rootFiles = ['build.mjs'];
  const allFiles = [...srcFiles, ...rootFiles];
  
  const allFindings = [];
  
  for (const file of allFiles) {
    if (ALLOW_LIST.some(entry => file.includes(entry.path))) {
      continue;
    }
    
    const content = await readFile(file, 'utf8');
    const findings = checkForHardcodedNames(content, file);
    allFindings.push(...findings);
  }
  
  if (allFindings.length > 0) {
    const message = 'Found hardcoded publication names. Use __PUBLICATION_NAME__ token instead:\n' +
      allFindings.map(f => `  ${f.file}:${f.line} - "${f.match}"`).join('\n');
    assert.fail(message);
  }
});

test('fixture test proves guard can fail', () => {
  const fixtureContent = 'This is a test with SAVRONO in it';
  const findings = checkForHardcodedNames(fixtureContent, 'fixture.txt');
  assert.ok(findings.length > 0, 'Guard should detect hardcoded name in fixture');
});

test('built worker contains no __PUBLICATION_NAME__ tokens', async () => {
  const compiled = await readFile('dist/server/index.js', 'utf8');
  assert.ok(!compiled.includes('__PUBLICATION_NAME__'), 
    '__PUBLICATION_NAME__ token found in built output - must be replaced during build');
});

async function checkMainReleaseGuard(env = process.env, builtContent = null) {
  if (env.GITHUB_BASE_REF === 'main' && PUBLICATION_NAME_STATUS === 'working-name') {
    const content = builtContent || await readFile('dist/server/index.js', 'utf8');
    const workingNamePattern = /\b(savrono|sovrano|svrano|svran)\w*/i;
    
    if (workingNamePattern.test(content)) {
      throw new Error(
        'PUBLICATION_NAME is still a working name (#140/#107) and appears in the built output; ' +
        'confirm name status before a studio-to-main release.'
      );
    }
  }
}

test('working name cannot reach main branch', async () => {
  await checkMainReleaseGuard();
});

test('main-release guard: working name absent from build passes', async () => {
  const cleanBuild = 'const worker = { fetch() { return new Response("Hello"); } };';
  await assert.doesNotReject(
    async () => checkMainReleaseGuard({ GITHUB_BASE_REF: 'main' }, cleanBuild),
    'Should pass when working name is absent from build'
  );
});

test('main-release guard: working name present in build fails', async () => {
  if (PUBLICATION_NAME_STATUS === 'working-name') {
    const dirtyBuild = 'const title = "Welcome to SAVRONO"; const worker = {};';
    await assert.rejects(
      async () => checkMainReleaseGuard({ GITHUB_BASE_REF: 'main' }, dirtyBuild),
      /working name.*appears in the built output/,
      'Should fail when working name appears in build'
    );
  }
});

test('main-release guard: final status passes', async () => {
  const mockBuild = 'const title = "Some content"; const worker = {};';
  const finalEnv = { GITHUB_BASE_REF: 'main' };
  
  if (PUBLICATION_NAME_STATUS !== 'working-name') {
    await assert.doesNotReject(
      async () => checkMainReleaseGuard(finalEnv, mockBuild),
      'Should pass when status is not working-name'
    );
  }
});

test('main-release guard passes when base is studio', async () => {
  await assert.doesNotReject(async () => checkMainReleaseGuard({ GITHUB_BASE_REF: 'studio' }));
});

test('main-release guard: real build on studio passes as if targeting main', async () => {
  await checkMainReleaseGuard({ GITHUB_BASE_REF: 'main' });
});
