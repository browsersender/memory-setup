---
date: 2026-04-08
status: accepted
supersedes:
---

# Example decision — replace me

## Context
This file exists so the decision format is visible without reading the README. Delete it once your project has at least one real decision.

## Decision
Use this folder to record real decisions, with one markdown file each.

## Why
Considered:
- **Inline notes in `bible.md`** — rejected because the bible should describe the *current shape*, not accumulate every historical choice.
- **Comments in code** — rejected for cross-component decisions; comments live in one file but the decision affects many.
- **A single `DECISIONS.md` file** — rejected because individual files are easier to link, supersede, and reorder.

## Consequences
- Pro: every choice has a permanent home with full context.
- Pro: decisions can be linked from `roadmap.md`, `bible.md`, and from each other.
- Con: requires the discipline to actually write them when a choice is made.
- Con: can grow large over time — accept this; old decisions are still valuable as project history.
