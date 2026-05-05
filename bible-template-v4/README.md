# Project Bible Template (v4)

A **Project Bible** is not a document — it's a **case file**. The folder is the unit. It's where work on a long-running system *lives across sessions*: the canonical outline, the living roadmap, saved conversations, open assignments, decisions made along the way, and pointers to everywhere else context about the project lives.

## What's new in v4

v3 was a solid template. v4 adds seven sections that emerged organically across 80+ bibles in real use:

| Section | What it is | Why it matters |
|---|---|---|
| **Key Findings** | Research/empirical discoveries that shape design | Not in code, not in commits — the things you LEARNED that changed the project's direction |
| **Sparks** | Ideas identified while building, priority-tracked | Every active bible grew one. Ideas get lost without a home. |
| **Nags** | Known gaps, risks, overclaims, honest limitations | Type-tagged (CRITICAL / overclaim / untested / mathematical fact / lesson learned) |
| **Experiments / Responses** | Structured build results with a template | The lab notebook. Forces you to name sparks, nags, and kills after every build. |
| **Pulse** | Running metric counts (tests, capabilities, coverage) | Quick health number. Facts not aspirations. |
| **Integration Map** | How this project connects to other projects | Emerged in multi-project work. One-liner per connection with direction. |
| **Kills** | Things you proved WRONG about your own project | Your most powerful credibility tool. Different from nags (open) and honest accounting (corrections). |

The **Responses template** is the key mechanism: after every significant build or experiment, you fill in Date / Result / What Changed / Sparks Fired / Nags Raised / Kills. This feeds the Sparks, Nags, and Kills sections automatically. The lab notebook drives the rest.

## Why this exists

You already have three persistence layers, and each does one thing well:

| Layer | Answers |
|---|---|
| `MEMORY.md` / warm tier | "what's true *right now*" |
| Skills (`~/.claude/skills/`, `~/.claude/skill-library/`) | "*how* do I do X" |
| Roadmaps | "what *will* happen" |

**Nothing answers: "what is this thing I built, why does it exist, and how does it work conceptually?"**

That's the bible's job. Skills tell you *how to do a procedure*. Code tells you *what the bytes do*. Memory tells you *what's true today*. The bible tells you the **shape and intent of the system as a whole** — so when you (or Claude) come back after four days, you don't have to grep ten places to reload context.

## How to use this template

1. Copy the entire `_TEMPLATE_v4/` folder.
2. Rename the copy to your project's name, e.g. `Antidetect Engine/`.
3. Open `bible.md` and fill it in. Delete sections that don't apply, add ones that do — the template is a starting shape, not a contract.
4. Start working. As things happen:
   - **Shape of the system changes** → update `bible.md` (rare).
   - **Status / forward plan changes** → update `roadmap.md` (often, ideally at end of each chat).
   - **A choice gets made** → drop a file in `decisions/`.
   - **Something needs doing** → drop a file in `assignments/open/`. Move to `done/` when finished.
   - **A chat is worth keeping** → save it to `conversations/` as `YYYY-MM-DD-slug.md`.
   - **You learned where related context lives** → add it to `references/README.md`.
   - **You built something or ran an experiment** → add a Response entry. Fill in sparks/nags/kills.
   - **You discovered something from reading or research** → add a Key Finding.

## What each file/folder is for

| File / folder | Purpose | Update frequency |
|---|---|---|
| `bible.md` | Canonical outline: intent, components, history, invariants, threads, findings, sparks, nags, kills, experiments | Shape changes = rare. Findings/sparks/nags/experiments = after every build. |
| `roadmap.md` | Living forward plan: now / next / later / recently done / changelog | Often — ideally end of every chat that touched this project |
| `cold-start.md` | 2-minute triage: status, active focus, vital signs, don'ts | End of every session |
| `glossary.md` | Project-specific jargon | When a new non-obvious term appears |
| `runbook.md` | Literal commands: start, stop, verify, recover | When operations change |
| `assignments/` | One markdown file per task. `open/` and `done/` subfolders | As tasks open/close |
| `decisions/` | ADR-lite: each major choice with context, decision, why, consequences | When a choice gets made |
| `conversations/` | Dated snapshots of chats worth keeping. *Manual save only.* | When a chat is worth preserving |
| `references/` | Index of where else context lives — skills, memories, code paths, external links | When you discover a new pointer |

## The Responses → Sparks → Nags → Kills flow

This is the v4 workflow that emerged from real use:

```
Build / Experiment
       ↓
  Response entry (date, result, what changed)
       ↓
  ┌────┴────┐────────┐
  ↓         ↓        ↓
Sparks    Nags     Kills
(ideas)  (gaps)   (proved wrong)
  ↓         ↓        ↓
Future    Honest   Credibility
builds   accounting
```

Every Response forces you to ask three questions:
1. What new ideas did this work surface? → Sparks
2. What concerns or limitations did this reveal? → Nags
3. Did this prove any prior claim wrong? → Kills

## Defaults baked in (override per project)

- **Assignment format:** markdown + YAML frontmatter. Human-editable, diff-friendly, parseable by Ender.
- **Roadmap update trigger:** conversation-driven. At the end of any chat that touched this project, the roadmap should reflect what was decided/done/found.
- **Conversation saving:** **manual.** Drop a chat into `conversations/` only when it's worth finding again.
- **bible.md updates:** shape changes are rare. But Findings, Sparks, Nags, Kills, and Responses update after every build session — they're the living part of the bible.

Override any of these by editing your copy. They're starting choices, not rules.

## How Bibles relate to other systems

Bibles **don't replace** anything. They sit alongside MEMORY, skills, and roadmaps and *reference* them.

```
MEMORY.md       → volatile state          (what's true now)
Skills          → procedures              (how to do X)
Roadmaps        → futures                 (what's next)
PROJECT BIBLES  → canonical narrative ←   (what this IS and why)
Tree / Modes    → which of the above to load when
```

A bible's `references/README.md` should *link to* the relevant atomic memories, skills, and code paths — never duplicate them. Single source of truth for each fact, but the bible knows where every fact lives in the story.

## When NOT to make a bible

- For one-off scripts.
- For projects you've abandoned.
- For things that are just configuration (a bible needs *intent* and *history* to be useful).
- For anything where reading the README of the actual code already tells you the whole story.

A bible is for systems that are **long-running**, have **non-obvious intent**, and accumulate **hard-won lessons** across many sessions. If the system fits all three, make a bible. Otherwise, an atomic memory is enough.

## Evolution: v1 → v2 → v3 → v4

- **v1:** Intent + components + structure + invariants + threads. The narrative core.
- **v2:** Added Abstract, Cold-start summary, Vital signs. Made bibles scannable.
- **v3:** Added Runbook, Glossary, Cold-start file, Honest Accounting, Known Drift, YAML components. Made bibles operational and self-auditing.
- **v4:** Added Key Findings, Sparks, Nags, Kills, Experiments/Responses, Pulse, Integration Map. Made bibles into living lab notebooks that track what you learn, not just what you build.
