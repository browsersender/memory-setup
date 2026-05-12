# {{Thread Bible Name}} — Thread Bible

> One-sentence elevator: what convergent theme this thread bible manages, across which projects.

> **Need to actually run it?** → see [`runbook.md`](runbook.md) (literal commands, recovery recipes, service inventory). The bible explains *what & why*. The runbook explains *how to type things*.
>
> **Hit an unfamiliar term?** → see [`glossary.md`](glossary.md). Project-specific jargon lives there.

---

## Meta

- **Status:** active | dormant | archived
- **Started:** YYYY-MM-DD
- **Last shape change:** YYYY-MM-DD
- **Type:** thread bible (cross-project manager)
- **Manages:** {{list of project bibles this thread bible connects}}
- **Owner:** Brian / Claude / shared

---

## Abstract

> **The back cover of the book.** ~150-300 words, self-contained prose. A reader should understand what convergent theme this thread bible manages, which projects it connects, what product outcome it drives, and what state it's in. Different from project bibles (which describe a single system) — this describes a *theme* that spans multiple systems.

(2-4 paragraphs of self-contained prose)

---

## Cold-start summary

> **The most-read section.** Tells a future reader (human or Claude) the whole story compressed into 5-8 sentences. What theme, which projects, what state, what matters most, what to be careful about.

5-8 sentences max. Update whenever the thread bible's shape changes.

---

## Pulse

> **Running numbers.** The 3-5 metrics that tell you the thread's health at a glance.

| Metric | Value | As of |
|---|---|---|
| Sparks total | {{number}} | YYYY-MM-DD |
| Sparks routed | {{number}} | YYYY-MM-DD |
| Sparks completed | {{number}} | YYYY-MM-DD |
| Project bibles connected | {{number}} | YYYY-MM-DD |
| Threads active | {{number}} | YYYY-MM-DD |

---

## Vital signs

> If you only check three things to know if the thread is healthy, check these.

1. **{{name}}** — `{{where}}` — healthy = `{{what good looks like}}`
2. **{{name}}** — `{{where}}` — healthy = `{{what good looks like}}`
3. **{{name}}** — `{{where}}` — healthy = `{{what good looks like}}`

---

## Intent

A short prose description of what this thread bible manages and why. 2-5 sentences. Lead with the practical purpose — what product outcome does this theme drive?

> **Optional narrative scaffolding:**
> - **Want** — surface goal
> - **Need** — deep goal
> - **Wound** — the pain that triggered this convergence
> - **Lie** — the wrong approach (scattered sparks with no routing)
> - **Truth** — what the thread bible reveals

---

## Components — project bibles

> The project bibles this thread bible connects. Each is a component in the thread's story.

```yaml
components:
  - name: {{Project Bible Name}}
    role: protagonist | supporting | mentor | foil
    one_line: What this project contributes to the thread
    sparks_contributed: {{number}}
    depends_on: [other-project-1]
    wound: the constraint this project carries
    status: healthy | flaky | deprecated | planned
```

---

## Structure — the beats (thread *history*, not future)

> How this convergent theme emerged over time.

- **Inciting incident:** when the sparks first appeared across separate projects
- **Midpoint shift:** when the convergence was recognized
- **Dark night:** when it broke worst or seemed impossible
- **Climax:** when the pieces connected
- **Resolution:** where it lives now

---

## Invariants — the rules that thread through

```yaml
invariants:
  - rule: {{the rule}}
    why: {{the reason}}
    where: {{which project bibles this applies to}}
```

---

## Threads — convergent themes

> The convergent themes within this thread bible. Each thread groups sparks from multiple project bibles that touch the same product outcome.

```yaml
threads:
  - name: {{Thread name}}
    outcome: {{one sentence — what product capability this thread produces}}
    status: active | paused | done
    source_bibles: [bible-1, bible-2, bible-3]
    sparks:
      - spark: {{spark description}}
        source: {{which project bible}}
        priority: HIGH | MEDIUM | LOW
        status: raw | confirmed | done
    convergence_points: [thread-2, thread-3]  # other threads this one depends on or feeds
    notes: {{brief description}}
```

---

## Integration Map

> How the project bibles connect through this thread bible. Direction: `->` = feeds into, `<-` = consumes from, `<->` = bidirectional.

| Connection | Direction | What flows | Status |
|---|---|---|---|
| {{project bible A}} -> {{project bible B}} | -> | {{what crosses the boundary}} | active / planned |

---

## Journal

> **Chronological session log.** The raw lab notebook. What happened, what was tried, what surprised us, what decisions were made. Claude logs work here across sessions. The journal is the *ground truth* — everything else (Memory, Sparks, Responses) is distilled from it.
>
> Each entry is one session. Update at the end of every session that touches this thread.

### YYYY-MM-DD — {{session title}}
**What happened:** {{1-3 sentences}}
**Key decisions:**
- {{decision and why}}
**Surprises:**
- {{anything unexpected}}
**Commits:**
- `{{repo}}` `{{hash}}` — {{one-line description}}

<!--
The Journal lifecycle:
  Journal (raw, chronological)
    -> things that matter get distilled into ->
  Memory (topical, persistent)
    -> things that fire get promoted to ->
  Sparks (actionable ideas)
    -> things that land get documented in ->
  Responses (structured findings)
-->

---

## Memory

> **Distilled from Journal.** The thread bible's own persistent knowledge — decisions, patterns, and warnings that carry forward across sessions. NOT raw facts (those are in the Journal). Memory is the *distilled* version.
>
> Update when Journal entries surface something worth persisting. Remove when a memory becomes stale or is superseded.

### Decisions
> What was decided and why. Load-bearing context that future sessions need.

- **{{decision}}** — {{why}} (learned YYYY-MM-DD)

### Patterns
> What keeps working. Proven approaches.

- **{{pattern}}** — {{evidence}} (learned YYYY-MM-DD)

### Warnings
> What keeps failing. Anti-patterns.

- **{{warning}}** — {{what went wrong}} (learned YYYY-MM-DD)

---

## Commits

> **Cross-project commit log.** When work lands in any project bible that participates in this thread, the commit is logged here. Organized chronologically. This is the PM's view of "what shipped across the whole theme."

| Date | Repo | Hash | Description | Thread |
|---|---|---|---|---|
| YYYY-MM-DD | {{repo name}} | `{{short hash}}` | {{one-line}} | {{which thread}} |

---

## World — operating environment

- **Where it runs:** {{environments}}
- **What it touches:** {{external systems}}
- **Daily life:** {{what ordinary operation looks like}}
- **Power structure:** {{what controls what}}
- **Genre-specific:** {{language / runtime / deploy specifics}}

---

## Style / voice

- **Adjectives:** {{3-5 words describing the thread's voice}}
- **Patterns:** {{naming conventions, log formats}}
- **Influences:** {{prior art, libraries, people}}

---

## Key Findings

> Empirical results and theoretical discoveries that shape this thread's direction. Not derivable from code.

**Finding 1: {{one-line statement}}**
Source: {{paper, experiment, incident}}
{{2-4 sentences}}

---

## Experiments / Responses

> Structured build and experiment results. Each entry follows the template so you can scan the thread's empirical history.

#### {{Title}}
**Date:** YYYY-MM-DD
**Result:** CONFIRMED | FALSIFIED | PARTIAL | NEW FINDING
**What changed:**
- {{bullet points}}
**Sparks fired:** {{new ideas}}
**Nags raised:** {{concerns}}
**Kills:** {{things proved wrong — or "None"}}
**Other threads affected:** {{list of thread bibles impacted}}

---

## Sparks

> **Routed from source project bibles.** Each spark names its source bible so you can trace it back. Priority reflects the thread-level assessment (may differ from the project-level priority). Status tracks progress through the thread.

| Spark | Source | Priority | Status |
|---|---|---|---|
| {{description}} | {{project bible name}} | HIGH / MEDIUM / LOW | raw / confirmed / done |

---

## Nags

> Known gaps, risks, overclaims, and limitations across the thread.

| Nag | Type | Source |
|---|---|---|
| {{description}} | {{CRITICAL / overclaim / untested / gap / lesson}} | {{project bible or observation}} |

---

## Kills

> Things proved WRONG about this thread's claims.

### Kill 1: {{one-line description}}
- **Original claim (YYYY-MM-DD):** "{{what was believed}}"
- **Killed by:** {{experiment, paper, analysis}}
- **What's actually true:** {{corrected understanding}}
- **Impact:** {{what changed}}

---

## Known drift — bible vs reality

```yaml
drift:
  - claimed: {{what the bible says}}
    actually: {{what's true}}
    where: {{file or system}}
    noticed: YYYY-MM-DD
    status: open | reconciled
```

---

## Honest Accounting

### Corrections

(none yet — the first real correction triggers the first entry)

---

## Open questions / unresolved

- [ ] question
- [ ] question

---

## Adapter outputs

- **Status briefing** — which threads are active, which are blocked, what's next
- **Spark routing report** — which sparks are orphaned, which converge
- **Cross-project dependency map** — what blocks what across project bibles
