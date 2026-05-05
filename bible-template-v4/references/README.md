# References

Index of where else context about this project lives. The bible is the canonical narrative — but the actual *facts* live elsewhere (in code, in skills, in atomic memories, on dashboards, in other bibles). This file is the map.

**Rule:** link, don't duplicate. If a fact lives in a feedback memory, link it. Don't copy the text here — when the memory updates, the bible will fall out of sync.

## Other bibles (the constellation)

> If this project shares ground with other Project Bibles, declare the relationship here. Lets a constellation of bibles compose into a graph rather than each being an island.

```yaml
related_bibles:
  - name: Other Project Name
    relationship: depends_on  # depends_on | extended_by | conflicts_with | shares_with | parent_of | child_of
    notes: brief description of how they relate
```

## Skills

Procedures relevant to this project. Path format: `~/.claude/skills/<name>/SKILL.md` or `~/.claude/skill-library/<branch>/<name>/SKILL.md`.

- `~/.claude/skills/example-skill/SKILL.md` — what it does, when this project uses it

## Memories

Atomic memories relevant to this project. Path format: `~/.claude/projects/C--Users-jennb/memory/<file>.md`.

- `memory/example_feedback.md` — one-line description of why it matters here

## Code

Key paths in the actual codebase. Absolute or repo-relative.

- `path/to/file.ts` — what's there
- `path/to/dir/` — what lives there

## External

URLs — docs, dashboards, repos, deployed instances, monitoring boards.

- `https://example.com/dashboard` — what it shows
- `repo-owner/repo-name` — GitHub repo (if any)

---

## Maintaining this file

Add an entry whenever you discover a new pointer worth preserving. Remove entries when they go stale. This file is meant to be skimmed in 30 seconds and tell you where to go next — keep it tight.

**Bidirectional bibles:** when you declare a relationship to another bible in the "Other bibles" section above, add the reciprocal entry in that bible's `references/README.md` too. Otherwise the relationship is one-sided and the other bible doesn't know you exist. This is a manual rule for now — v4 may add automation.
