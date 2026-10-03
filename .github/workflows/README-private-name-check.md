# Private Name Check Workflow

## Overview

This GitHub Actions workflow automatically scans for protected personal names in pull requests, commits, issues, and comments. It is designed to prevent accidental exposure of private information while maintaining strict security and privacy controls.

## Current Status

**REPORT-ONLY**: This check is currently in observation mode and is NOT a required check. It will be promoted to required status after a clean observation period.

## How It Works

### Secret-Based Detection

Protected names are stored in the `PROTECTED_NAMES` repository Actions secret, which only the owner configures. The format is pipe-separated names:

```
name1|name2|name3
```

Matching is case-insensitive. When the secret is missing, scan jobs are **skipped** (grey status, not green) to fail closed.

### What Gets Scanned

#### On Pull Requests (`pull_request` event)
- File paths in the diff
- File contents in the diff (added lines only)
- PR title
- PR body
- All commit messages in the PR

#### On Issues and Comments (`issues`, `issue_comment` events)
- Issue title and body
- Issue comments (including comments on pull requests)
- Automatically adds `needs-name-scrub` label when a match is found on issues

**Note:** Comments on pull request conversations are scanned and flagged with an annotation, but do NOT receive the `needs-name-scrub` label because the workflow does not have `pull-requests: write` permission.

### What Doesn't Get Scanned (Current Scope)

- Wiki pages (requires separate `gollum` event handler - planned follow-up)
- Existing `owner:*` labels (owner decision pending)
- Historical issue/PR comments (one-time backfill planned)

## Security Features

### Script Injection Protection

All event text (PR bodies, issue text, comments) is passed exclusively through `env:` variables, never interpolated as `${{ github.event.* }}` directly in `run:` steps. This prevents GitHub's documented script-injection vulnerability.

### Privacy-First Output

When a match is found, the workflow prints ONLY:
- File path and line number (for code)
- Fixed flag text like "PR body" or commit SHA
- Issue/comment numbers

**The matched text itself is NEVER echoed** to logs, comments, or summaries.

### Minimal Permissions

Workflow permissions are explicitly set:
```yaml
permissions:
  contents: read    # For PR diff
  issues: write     # For label management
```

No other permissions are granted.

### No Third-Party Actions

The workflow uses only first-party GitHub actions, pinned by full commit SHA:
- `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683` (v4.2.2)

This prevents supply-chain attacks and ensures reproducibility.

## Testing

A comprehensive test harness is provided at `scripts/test-private-name-check.sh` that validates:

1. Secret presence detection
2. File path scanning
3. File content scanning
4. PR title/body scanning
5. Commit message scanning
6. Issue/comment scanning
7. Script injection protection

Run the tests:

```bash
bash scripts/test-private-name-check.sh
```

All tests use dummy placeholder names (`DUMMYNAME`, `TESTNAME`) and verify that:
- Protected names are detected
- Injection attempts are blocked
- No execution of attacker-controlled code occurs

## Configuration

### Setting Up the Secret

1. The repository owner navigates to: Settings → Secrets and variables → Actions
2. Creates a new repository secret named `PROTECTED_NAMES`
3. Value format: `name1|name2|name3` (pipe-separated, no spaces unless part of a name)

### When Secret is Missing

- The `check-secret` job (renamed to "Private name check - secret status") detects the absence
- A step summary states "skipped: names secret missing" and a `::notice::` annotation is written
- Scan jobs with names starting with "Scan" are skipped (grey status)
- No job shows green while the secret is missing

### When Secret is Present

- Scan jobs run normally
- Findings are reported as warnings with locations
- Job summary shows detailed breakdown of what was scanned
- Check completes successfully (report-only, does not fail the PR)

## Workflow Jobs

### 1. `check-secret` (renamed: "Private name check - secret status")
Detects whether `PROTECTED_NAMES` is set. When missing, writes a skip message to the step summary and a `::notice::` annotation. Outputs `secret_present: true/false`. The job is renamed so it cannot be misread as a scan result.

### 2. `scan-pr-diff` (conditional on secret presence)
Scans PR changes:
- File paths: checks all changed file names
- File contents: checks added lines in the diff (with per-line tracking)
- PR metadata: checks title and body
- Commits: checks all commit messages in the PR

Generates a detailed summary showing findings per category.

### 3. `scan-issue-text` (conditional on secret presence)
Scans issue/comment text:
- Issue title and body (on `issues` event, issues only)
- Comment text (on `issue_comment` event)
- Adds `needs-name-scrub` label automatically when matches are found on issues (not on PR comments, which would require `pull-requests: write`)

## Future Enhancements (Planned)

1. **Wiki scanning**: Add `gollum` event handler for wiki page edits
2. **Backfill job**: One-time scan of existing issues/comments to create cleanup worklist
3. **Required status**: After observation period, add as required check in branch protection
4. **Label renaming**: Potentially rename `owner:chris` labels (owner decision required)

## Troubleshooting

### Workflow shows as skipped (grey)
The `PROTECTED_NAMES` secret is not set. This is expected behavior until the owner configures it.

### Workflow found false positives
The check is report-only. Review the warnings and if they're false positives, no action is needed. The owner can adjust the secret content if needed.

### Need to test the workflow
You can test the scanning logic locally:
```bash
bash scripts/test-private-name-check.sh
```

For GitHub Actions testing with the secret present, the owner must:
1. Set the secret with a dummy value (e.g., `DUMMYNAME`)
2. Create a test PR with that name in a file or commit message
3. Verify the workflow detects it

## References

- Issue #131: Original specification
- Issue #115: Prior manual review examples
- Issues #121, #126, #128: Incidents that motivated this check
- AGENTS.md: Repository workflow and review policies
