Launched by:

### Description

[Describe the changes in this pull request.]

### Related Issue

Refs #[issue]

[For PRs into `studio`, use `Refs #[issue]`. Use `Closes #[issue]` only when the issue's full acceptance criteria are satisfied; use `Refs #[issue]` for partial work or work still waiting on live, phone, or migration checks. For release PRs into `main` carrying multiple issues, list one per line and repeat the problem, corrective action, and evidence record per issue. Merging to `main` does not publish the live Site, and GitHub auto-closing an issue is not proof the work is complete.]

### Objective Evidence & Screenshots

Record the exact head commit, then the build or automated check results with run links, the pages, viewports and accessibility checks examined, and which acceptance criteria are met or still unverified. Do not describe an unrun check as passing.

| Before | After |
|--------|-------|
| [Screenshot or description] | [Screenshot or description] |

### Type of Change & Corrective Action

**Corrective Action Taken:**

[List what actually changed in the source, assets, configuration, or documentation. Identify content preserved, moved, or removed. Explain any departure from the issue's proposed corrective action.]

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update

### Checklist

- [ ] I have performed a self-review of my code.
- [ ] I have provided objective evidence that my changes work.
- [ ] Tests added or updated, or N/A with a reason.
- [ ] Screenshots and logs contain no personal details.
- [ ] Reviewed by someone other than the author (link the review comment)
- [ ] Every required check (Build, and Accessibility and Performance) is green on the exact head commit, and the latest non-author review covers that commit with no open blocker or major findings (minor findings may be deferred to a follow-up PR when the merge comment lists them)

### Final notes to reviewer

[For a PR into `studio`, name the peer reviewer (Puck by default, or Forge for Ember's and Conduit's code PRs and all art PRs); the merge follows Merge authority in AGENTS.md. For a release PR into `main`, name the final reviewer; the merge follows Merge authority in AGENTS.md. List the files or tradeoffs needing close attention, open questions, dependencies, risks, follow-ups, and anything the reviewer should look at first. State whether `studio` pushes are paused for release review.]

### Publishing

- [ ] Source change only; live Sites publication will follow separately
- [ ] This PR records an already published Sites version in `site-source.json`

Sites version and source commit, if applicable:
