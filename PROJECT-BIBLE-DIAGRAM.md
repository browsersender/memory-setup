# Project Bible System — Architecture Diagram (v4)

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        PROJECT BIBLES SYSTEM                                 ║
║              "What is this thing, why does it exist, how does it work?"       ║
╚═══════════════════════════════════════════════════════════════════════════════╝


═══════════════════════════════════════════════════════════════════════════════
 WHERE IT SITS — Four Persistence Layers
═══════════════════════════════════════════════════════════════════════════════

 ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐
 │   MEMORY.md     │  │    Skills    │  │   Roadmaps   │  │ PROJECT BIBLES │
 │                 │  │              │  │              │  │                │
 │  "what's true   │  │  "how do I   │  │  "what will  │  │  "what IS this │
 │   RIGHT NOW"    │  │   do X?"     │  │   happen?"   │  │   and WHY?"    │
 │                 │  │              │  │              │  │                │
 │  volatile state │  │  procedures  │  │  futures     │  │  canonical     │
 │  hot/warm/cold  │  │  141+ skills │  │  now/next/   │  │  narrative     │
 │                 │  │              │  │  later       │  │                │
 └─────────────────┘  └──────────────┘  └──────────────┘  └────────────────┘
         │                   │                  │                  │
         └───────────────────┴──────────────────┴──────────────────┘
                              │
                     Each references the others.
                     Single source of truth per fact.
                     Bible knows where every fact lives in the story.


═══════════════════════════════════════════════════════════════════════════════
 FOLDER STRUCTURE — One Bible = One Folder
═══════════════════════════════════════════════════════════════════════════════

 Desktop/Project Bibles/
 │
 ├── _TEMPLATE_v4/              ← Copy this to start a new bible
 │
 ├── {{Project Name}}/          ← One folder per project (80+ bibles)
 │   │
 │   ├── bible.md               ← THE canonical document (shape + intent)
 │   ├── cold-start.md          ← 2-minute triage (read FIRST)
 │   ├── roadmap.md             ← Forward plan (now/next/later)
 │   ├── runbook.md             ← Literal commands (start/stop/verify)
 │   ├── glossary.md            ← Project-specific jargon
 │   │
 │   ├── assignments/           ← Task tracking
 │   │   ├── open/              ← Queued tasks (one .md per task)
 │   │   └── done/              ← Completed tasks
 │   │
 │   ├── decisions/             ← ADR-lite choice records
 │   │   └── YYYY-MM-DD-slug.md
 │   │
 │   ├── conversations/         ← Saved chats worth keeping
 │   │   └── YYYY-MM-DD-slug.md
 │   │
 │   └── references/            ← Pointers to context elsewhere
 │       └── README.md          ← Index of skills, memories, code paths
 │
 ├── INDEX.md                   ← Master index of all bibles
 ├── CONNECTION-INDEX.md        ← Cross-bible connections
 ├── BIBLE-GLOSSARY.md          ← System-wide glossary
 ├── MASTER-ROADMAP.md          ← Cross-project roadmap
 └── EXPERIMENT-INDEX.md        ← Cross-project experiment tracker


═══════════════════════════════════════════════════════════════════════════════
 BIBLE.MD — The Core Document (v4 sections)
═══════════════════════════════════════════════════════════════════════════════

 ┌─────────────────────────────────────────────────────────────────────┐
 │                         bible.md                                    │
 │                                                                     │
 │  ┌─ IDENTITY ──────────────────────────────────────────────────┐   │
 │  │  Meta          — status, dates, paths, owner                │   │
 │  │  Abstract      — 150-300 word "back cover" (conceptual)     │   │
 │  │  Cold-start    — 5-8 sentence operational summary           │   │
 │  │  Pulse         — 3-5 running health metrics (facts)         │   │
 │  │  Vital signs   — 3 things to check for health               │   │
 │  │  Intent        — the WHY (want/need/wound/lie/truth)        │   │
 │  └─────────────────────────────────────────────────────────────┘   │
 │                              │                                      │
 │  ┌─ ANATOMY ───────────────────────────────────────────────────┐   │
 │  │  Components    — YAML: role, voice, depends, wound, status  │   │
 │  │  Structure     — narrative beats: inciting→pivot→dark→win   │   │
 │  │  Invariants    — rules that thread through everything       │   │
 │  │  Threads       — parallel workstreams + convergence points  │   │
 │  │  Integration   — connections to other projects (→ ← ↔)     │   │
 │  │  World         — OS, ports, APIs, daily life                │   │
 │  │  Style/Voice   — how the project talks                      │   │
 │  └─────────────────────────────────────────────────────────────┘   │
 │                              │                                      │
 │  ┌─ LAB NOTEBOOK (v4 additions) ───────────────────────────────┐   │
 │  │  Key Findings  — what you LEARNED (from papers, experiments)│   │
 │  │  Experiments   — structured build results (the engine)      │   │
 │  │  Sparks        — ideas surfaced while building              │   │
 │  │  Nags          — known gaps, risks, honest limitations      │   │
 │  │  Kills         — things proved WRONG about your own project │   │
 │  └─────────────────────────────────────────────────────────────┘   │
 │                              │                                      │
 │  ┌─ SELF-AUDIT ────────────────────────────────────────────────┐   │
 │  │  Honest Accounting — correction log (Paper 467 pattern)     │   │
 │  │  Known Drift       — bible vs reality conflicts             │   │
 │  │  Open Questions    — conceptual gaps to resolve             │   │
 │  └─────────────────────────────────────────────────────────────┘   │
 │                              │                                      │
 │  ┌─ OUTPUTS ───────────────────────────────────────────────────┐   │
 │  │  Adapter Outputs — derived docs generated from the bible    │   │
 │  └─────────────────────────────────────────────────────────────┘   │
 └─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
 THE v4 ENGINE — Responses Drive Everything
═══════════════════════════════════════════════════════════════════════════════

                        Build / Experiment
                               │
                               ▼
                  ┌────────────────────────┐
                  │    RESPONSE ENTRY      │
                  │                        │
                  │  Date:                 │
                  │  Result: CONFIRMED /   │
                  │    FALSIFIED / PARTIAL │
                  │  What changed:         │
                  └────────┬───────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  SPARKS  │ │   NAGS   │ │  KILLS   │
        │          │ │          │ │          │
        │  "what   │ │  "what   │ │  "what   │
        │  new     │ │  gaps or │ │  did we  │
        │  ideas?" │ │  risks?" │ │  prove   │
        │          │ │          │ │  WRONG?" │
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │            │            │
             ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Future  │ │  Honest  │ │ Credibil-│
        │  builds  │ │ Accounting│ │  ity     │
        │          │ │          │ │          │
        │ Priority:│ │ Types:   │ │ "We test │
        │ HIGH /   │ │ CRITICAL │ │  our own │
        │ MEDIUM / │ │ overclaim│ │  claims  │
        │ LOW /    │ │ untested │ │  and pub- │
        │ FUTURE   │ │ math fact│ │  lish    │
        │          │ │ lesson   │ │  what    │
        │          │ │ learned  │ │  fails"  │
        └──────────┘ └──────────┘ └──────────┘


═══════════════════════════════════════════════════════════════════════════════
 COMPANION FILES — Different Audiences, Same Truth
═══════════════════════════════════════════════════════════════════════════════

 ┌───────────────────────────────────────────────────────────────────────┐
 │                                                                       │
 │   cold-start.md          "I just opened this project. What do I      │
 │   (read first)            need to know in 2 minutes?"                │
 │        │                                                              │
 │        │    Mirrors: Vital signs, Pulse, latest Findings,            │
 │        │             critical Nags, don'ts                            │
 │        │                                                              │
 │        ├──▶ runbook.md      "I need to actually RUN something.       │
 │        │    (commands)        Give me literal commands."              │
 │        │                                                              │
 │        │        Contains: Triage, start/stop, service inventory,     │
 │        │                  recovery recipes, gotchas, file map        │
 │        │                                                              │
 │        ├──▶ bible.md        "I need to UNDERSTAND this system.       │
 │        │    (shape+intent)   Give me the full picture."              │
 │        │                                                              │
 │        ├──▶ roadmap.md      "What's PLANNED?"                        │
 │        │    (future)         now / next / later / done               │
 │        │                                                              │
 │        └──▶ glossary.md     "What does that WORD mean?"              │
 │             (jargon)         Project-specific terms only             │
 │                                                                       │
 └───────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
 UPDATE DISCIPLINE — When Each File Changes
═══════════════════════════════════════════════════════════════════════════════

 ┌──────────────┬───────────────────────────────────────────────────────┐
 │ File         │ When it updates                                      │
 ├──────────────┼───────────────────────────────────────────────────────┤
 │ cold-start   │ End of EVERY session that touched this project       │
 │ roadmap      │ End of every session (often)                         │
 │ bible.md     │ Shape changes (rare) + Findings/Sparks/Nags/         │
 │              │ Kills/Experiments (after every build)                 │
 │ runbook      │ When operations/ports/services change                │
 │ glossary     │ When a new non-obvious term appears                  │
 │ assignments/ │ As tasks open and close                              │
 │ decisions/   │ When a choice gets made                              │
 │ conversations│ Manual — only save chats worth finding again         │
 │ references/  │ When you discover where related context lives        │
 └──────────────┴───────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
 TEMPLATE EVOLUTION
═══════════════════════════════════════════════════════════════════════════════

 v1 ──────▶ v2 ──────▶ v3 ──────▶ v4
 │          │          │          │
 │ Intent   │ +Abstract│ +Runbook │ +Key Findings
 │ Comps    │ +Cold-   │ +Glossary│ +Sparks
 │ Struct   │  start   │ +Cold-   │ +Nags
 │ Invari-  │  summary │  start   │ +Kills
 │  ants    │ +Vital   │  file    │ +Experiments/
 │ Threads  │  signs   │ +Honest  │  Responses
 │          │          │  Account │ +Pulse
 │ Narrative│ Scannable│ +Known   │ +Integration
 │ core     │          │  Drift   │  Map
 │          │          │ +YAML    │
 │          │          │  comps   │ Living lab
 │          │          │          │ notebook
 │          │          │Operational│
 │          │          │& self-   │
 │          │          │auditing  │

 WHEN TO MAKE A BIBLE:
 ✅ Long-running system
 ✅ Non-obvious intent
 ✅ Hard-won lessons across sessions
 ❌ One-off scripts
 ❌ Abandoned projects
 ❌ Pure configuration
 ❌ README already tells the whole story
```
