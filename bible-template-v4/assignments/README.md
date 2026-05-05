# Assignments

One markdown file per task. Pickable by Brian, Claude, Ender, Sola, or any other agent. **Owner field is freeform** — as more agents get built, the v1 enum got stale.

## Folders

- `open/` — currently open assignments (any status except done)
- `done/` — finished assignments, kept for history

When an assignment is done, **move** the file from `open/` to `done/`. Don't delete — done assignments are part of the project's history and may be linked from `roadmap.md` "Recently done" entries.

## Format

Each assignment is a markdown file with YAML frontmatter. Filename: `YYYY-MM-DD-short-slug.md`.

```markdown
---
status: open          # open | in_progress | blocked | done
owner: claude         # freeform — any agent name (claude, ender, brian, sola, council, ...)
opened: YYYY-MM-DD
closed:               # YYYY-MM-DD when done
priority: normal      # low | normal | high | urgent
blocks:               # list of other assignment filenames this blocks
blocked_by:           # list of other assignment filenames blocking this
---

# Short title

## Why
One paragraph: the underlying need. Not the task — the *reason* for the task.

## Done when
Concrete acceptance criteria. How will you know it's finished.

## Notes
Anything relevant — code paths, prior attempts, links to memories or decisions.
```

See `open/_example.md` for a fleshed-out example.

## How agents pick up assignments

All agents can read this folder. The frontmatter `owner` field tells them which assignments are theirs. The frontmatter `status` and `blocked_by` fields tell them what's actionable now vs blocked.

A simple `ls open/` plus reading frontmatter is enough — no database, no tooling required.
