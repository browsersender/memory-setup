# Decisions (ADR-lite)

A record of the major choices made on this project. Each decision is one markdown file. Filename: `YYYY-MM-DD-short-slug.md`.

## Why this exists separately from `bible.md`

`bible.md` describes the *current shape* of the system. This folder describes *how it got that shape* — the choices, the rejected alternatives, and the reasoning. When future-you (or future-Claude) asks "why did we do it this way?", the answer is here, not in the bible.

A decision being recorded here doesn't mean it's permanent. Decisions can be **superseded** or **reversed** — when that happens, create a new decision file and set `status: superseded` (or `reversed`) on the old one, with `supersedes:` pointing at it. **When you supersede a decision, fill in its Hindsight section** — that's where the meta-learning lives.

## Format

```markdown
---
date: YYYY-MM-DD
status: accepted      # proposed | accepted | superseded | reversed
supersedes:           # filename of decision this replaces, if any
---

# Short decision title

## Context
What was the situation that forced a choice. The constraints, the symptoms, the trigger.

## Decision
What we chose. One sentence if possible, then elaborate.

## Why
The reasoning. **Include the alternatives you rejected and why** — this is often the most valuable part.

## Consequences
What this enables, what it makes harder, what needs to change downstream. Include both the wins and the costs.

## Hindsight
*(Optional. Fill in when this decision is superseded or reversed.)*

What we learned later. Was this decision right? What made us realize it wasn't? If we could go back, what would we do differently? This is where the meta-learning lives — the part future-you most wants to read before making a similar choice.
```

See `_example.md` for a fleshed-out example.

## When to write a decision

- A choice that wasn't obvious — you considered multiple options.
- A choice that future-you will be tempted to reverse without understanding why it was made.
- A choice that affects more than one component.
- A choice that came from a failure or incident.

**Don't** write decisions for:
- Routine implementation choices that any reader would make the same way.
- Choices already documented in code comments or commit messages.
- Things that are really tasks (those go in `assignments/`).
