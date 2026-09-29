# Studio merge closeout checklist

Use this checklist when proposing or executing a delegated merge into `studio`. It does not apply to `main` or actual Site publication, which remain Codex/Seraphim’s release lane.

## Required gates

- [ ] The PR targets `studio` and GitHub reports a clean merge state.
- [ ] The exact current head SHA is recorded in the PR or release ledger.
- [ ] The Build workflow is successful at that SHA.
- [ ] For visual changes, the report-only Accessibility and Performance artifact has been reviewed by the named reviewer; a green workflow alone is not treated as a zero-finding result.
- [ ] A non-author reviewer has reviewed the exact head or posted an explicit SHA-specific approval.
- [ ] All blocking review comments are resolved or have an explicit reviewer disposition.
- [ ] The diff matches the issue’s Ready-card file boundary and acceptance criteria.
- [ ] The diff contains no migration, secret, production setting, unapproved third-party license, or unapproved public-content-policy change.
- [ ] No open PR has a conflicting editable-file boundary.
- [ ] The rollback is a straightforward revert of this PR.

## Change notice

After merge, record this on the relevant issue and the release ledger:

```markdown
## Change Notice — #<issue>

- **Merged PR:** #<number>
- **Merge SHA:** `<sha>`
- **Target:** `studio`
- **Verification:** `<checks, reviewed artifacts, focused evidence>`
- **Production state:** Not live. Codex/Seraphim owns `main` selection and OpenAI/ChatGPT Site publication.
- **Rollback:** Revert `<merge SHA>`.
```
