# Ready card template

Post this card on the child issue before any implementation begins. A draft handoff is **not** Ready.

```markdown
## Ready — #<issue> — <short slice>

- **Branch / target:** `manus/<issue>-<short-name>` → `studio`
- **Editable files:** `<exact paths>`
- **Read-only / preservation constraints:** `<exact paths and invariants>`
- **Interface:** `<inputs, outputs, events, schema version, and error behavior>`
- **Satisfied dependencies:** `<issue links and exact commit/PR heads>`
- **Focused tests:** `<test names and required scenarios>`
- **Evidence:** `<build/test commands; desktop/phone, accessibility, rights, or source evidence as applicable>`
- **Named independent reviewer:** `<login or role>`
- **Integration owner:** `<name>`
- **Rollback:** `Revert this PR; no migration, external side effect, or production publication is included in this slice.`
```

## Validity check

The implementation owner confirms all of the following before starting:

1. The parent owner—not a helper—posted or explicitly adopted the Ready card.
2. Every editable file is named, and no shared/integration file is implied.
3. The interface defines enough failure behavior to write focused tests.
4. A non-author reviewer is named.
5. Each unresolved owner decision is either recorded as satisfied or explicitly outside the slice.

If any item changes during implementation, stop, record the conflict, and obtain a revised Ready card before continuing.
