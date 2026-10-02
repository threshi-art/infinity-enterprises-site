import { appendFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const TRACKED_ISSUES = [
  { number: 88, rail: 'Now', gate: 'PR #124 has green checks; required exact-head reviews remain.' },
  { number: 94, rail: 'Next', gate: 'Staged. Forge posts Ready after #88 merges into studio because both edit the test command.' },
  { number: 81, rail: 'Hold', gate: 'Sample-data placement decision.' },
  { number: 82, rail: 'Hold', gate: 'Named editor and reviewed static source basis.' },
  { number: 87, rail: 'Hold', gate: 'Parent route and transition interface.' },
  { number: 89, rail: 'Hold', gate: 'Cover Story and issue-numbering decision.' },
  { number: 90, rail: 'Hold', gate: 'Moderator, storage, retention, and access contract.' },
  { number: 91, rail: 'Hold', gate: 'Verified sources, timing, curated marks, and final handoff.' },
  { number: 92, rail: 'Hold', gate: 'Splash choice and component boundary.' },
  { number: 93, rail: 'Hold', gate: 'Approved contributor records and named human editor.' },
];

const USER_AGENT = 'savrano-activation-watch';
const READ_ONLY_NOTICE = 'Automated observation only. A detected marker is not authorization to start source work; only the parent owner can post a complete Ready card.';

function tableCell(value) {
  return String(value ?? '—')
    .replaceAll('|', '\\|')
    .replaceAll('\r', ' ')
    .replaceAll('\n', '<br>');
}

function labelsText(labels = []) {
  const names = labels.map((label) => typeof label === 'string' ? label : label.name).filter(Boolean);
  return names.length ? names.map((name) => `\`${name}\``).join(' ') : '—';
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return '—';
  return date.toISOString().replace('.000Z', 'Z');
}

function markerFromComment(comment) {
  const match = String(comment.body ?? '').match(/^\s*(?:##\s*(Ready|Blocked)\b[^\n]*|\*\*Status:\s*(Ready|Blocked)\.?\*\*)/i);
  if (!match) return null;
  return {
    kind: match[1] ?? match[2],
    createdAt: comment.created_at ?? comment.createdAt ?? null,
    url: comment.html_url ?? comment.url ?? null,
  };
}

export function latestExplicitMarker(comments = []) {
  const matches = comments
    .map(markerFromComment)
    .filter(Boolean)
    .sort((left, right) => new Date(right.createdAt ?? 0) - new Date(left.createdAt ?? 0));
  return matches[0] ?? null;
}

function markerText(marker) {
  if (!marker) return 'No Ready/Blocked marker detected';
  const label = `${marker.kind} marker detected`;
  const rendered = marker.url ? `[${label}](${marker.url})` : label;
  return marker.createdAt ? `${rendered}<br>${formatTime(marker.createdAt)}` : rendered;
}

function normalizedIssue(plan, issue, comments) {
  return {
    ...plan,
    title: issue.title ?? `Issue #${plan.number}`,
    url: issue.html_url ?? `https://github.com/${issue.repository ?? ''}/issues/${plan.number}`,
    state: issue.state ?? 'unknown',
    labels: issue.labels ?? [],
    updatedAt: issue.updated_at ?? issue.updatedAt ?? null,
    marker: latestExplicitMarker(comments),
  };
}

export function formatActivationWatch({ repository, generatedAt = new Date().toISOString(), issues }) {
  const rows = issues.map((issue) => {
    const issueLink = issue.url ? `[#${issue.number} · ${tableCell(issue.title)}](${issue.url})` : `#${issue.number} · ${tableCell(issue.title)}`;
    return `| ${tableCell(issue.rail)} | ${issueLink} | ${tableCell(issue.state)} | ${labelsText(issue.labels)} | ${tableCell(formatTime(issue.updatedAt))} | ${markerText(issue.marker)} | ${tableCell(issue.gate)} |`;
  });

  return [
    '# SAVRONO Activation Watch',
    '',
    '> **READ-ONLY ACTIONS SUMMARY** · Repository: `' + tableCell(repository) + '` · Snapshot: `' + formatTime(generatedAt) + '`',
    '>',
    `> ${READ_ONLY_NOTICE}`,
    '',
    '## Queue snapshot',
    '',
    '| Rail | Issue | State | Labels | Last GitHub update | Latest explicit marker | Controlling gate |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
    '',
    '## Interpretation',
    '',
    '- `Ready marker detected` reports only an explicit marker at the start of a tracked issue comment: `## Ready` or `**Status: Ready.**`. It does **not** validate the card, the file boundary, dependencies, tests, reviewer, or parent-owner authority.',
    '- `Blocked marker detected` reports only an explicit `## Blocked` or `**Status: Blocked.**` marker at the start of a comment. Read the linked issue comment for the actual blocker and next action.',
    '- `No Ready/Blocked heading detected` is absence of an observed marker, not proof that a contract is incomplete or that no work exists.',
    '',
    '## Automation boundary',
    '',
    '- This workflow uses GitHub read APIs only and writes only to standard output or the Actions job summary.',
    '- It never comments, labels, assigns, opens, closes, merges, commits, deploys, publishes, or creates source branches.',
    '- The watch cannot verify marker authorship because every bot comment uses the shared GitHub account. Its output is not a Ready signal or implementation authorization.',
    '- GitHub Issues, pull requests, checks, and owner comments remain the authoritative records. A `studio` or `main` merge remains separate from ChatGPT Sites publication.',
    '',
  ].join('\n');
}

async function githubJson(fetchImpl, url, token) {
  const response = await fetchImpl(url, {
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'user-agent': USER_AGENT,
      'x-github-api-version': '2022-11-28',
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function loadCommentHistory(fetchImpl, baseUrl, token) {
  const comments = [];
  for (let page = 1; ; page += 1) {
    const batch = await githubJson(fetchImpl, `${baseUrl}?per_page=100&page=${page}`, token);
    if (!Array.isArray(batch)) throw new Error('GitHub API comments response must be an array.');
    comments.push(...batch);
    if (batch.length < 100) return comments;
  }
}

export async function loadLiveSnapshot({ fetchImpl = fetch, repository, token, plans = TRACKED_ISSUES }) {
  if (!repository || !/^[^/]+\/[^/]+$/.test(repository)) {
    throw new Error('GITHUB_REPOSITORY must have the form owner/repository.');
  }
  if (!token) {
    throw new Error('GITHUB_TOKEN is required for a live activation watch run.');
  }

  const base = `https://api.github.com/repos/${repository}/issues`;
  const issues = await Promise.all(plans.map(async (plan) => {
    const issue = await githubJson(fetchImpl, `${base}/${plan.number}`, token);
    const comments = await loadCommentHistory(fetchImpl, `${base}/${plan.number}/comments`, token);
    return normalizedIssue(plan, { ...issue, repository }, comments);
  }));

  return { repository, generatedAt: new Date().toISOString(), issues };
}

export async function loadFixture(file) {
  const fixture = JSON.parse(await readFile(file, 'utf8'));
  const plans = fixture.plans ?? TRACKED_ISSUES;
  const byNumber = new Map((fixture.issues ?? []).map((issue) => [issue.number, issue]));
  const issues = plans.map((plan) => {
    const issue = byNumber.get(plan.number) ?? { number: plan.number, title: `Issue #${plan.number}`, state: 'unknown', labels: [], comments: [] };
    return normalizedIssue(plan, issue, issue.comments ?? []);
  });
  return {
    repository: fixture.repository ?? 'owner/repository',
    generatedAt: fixture.generatedAt ?? new Date().toISOString(),
    issues,
  };
}

async function writeSummary(markdown) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    await appendFile(summaryPath, `${markdown}\n`, 'utf8');
    console.log(`Activation Watch summary written to ${summaryPath}`);
    return;
  }
  console.log(markdown);
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const fixtureIndex = argv.indexOf('--fixture');
  const snapshot = fixtureIndex >= 0
    ? await loadFixture(argv[fixtureIndex + 1])
    : await loadLiveSnapshot({ repository: env.GITHUB_REPOSITORY, token: env.GITHUB_TOKEN });
  await writeSummary(formatActivationWatch(snapshot));
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((error) => {
    console.error(`Activation Watch failed: ${error.message}`);
    process.exitCode = 1;
  });
}
