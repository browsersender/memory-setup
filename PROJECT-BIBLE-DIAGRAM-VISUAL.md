```
╔═══════════════════════════════════════════════════════════════════════════════════╗
║                          PROJECT BIBLE SYSTEM (v4)                               ║
║            "What is this thing, why does it exist, how does it work?"             ║
╚═══════════════════════════════════════════════════════════════════════════════════╝


    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐
    │  MEMORY.md  │   │   Skills    │   │  Roadmaps   │   │ PROJECT BIBLES  │
    │             │   │             │   │             │   │                 │
    │ "what's true│   │ "how do I   │   │ "what will  │   │ "what IS this   │
    │  right now" │   │  do X?"     │   │  happen?"   │   │  and WHY?"      │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └────────┬────────┘
           │                 │                 │                    │
           └─────────────────┴─────────────────┴────────────────────┘
                                       │
                          Each references the others.
                          Bible knows where every fact
                          lives in the story.


═══════════════════════════════════════════════════════════════════════════════════


                         Desktop/Project Bibles/
                                    │
           ┌────────────────────────┼────────────────────────┐
           │                        │                        │
           ▼                        ▼                        ▼
    ┌──────────────┐    ┌───────────────────┐    ┌──────────────────┐
    │ _TEMPLATE_v4 │    │  {{Project Name}} │    │  System Indexes  │
    │              │    │                   │    │                  │
    │ Copy this to │    │  One folder per   │    │ INDEX.md         │
    │ start a new  │    │  project (80+)    │    │ CONNECTION-INDEX  │
    │ bible        │    │                   │    │ MASTER-ROADMAP   │
    └──────────────┘    └─────────┬─────────┘    │ EXPERIMENT-INDEX │
                                  │              │ BIBLE-GLOSSARY   │
                                  │              └──────────────────┘
                                  │
                                  ▼

    ┌─────────────────────────────────────────────────────────────────┐
    │                     ONE PROJECT FOLDER                          │
    │                                                                 │
    │   ┌─────────────────────────────────────────────────────┐      │
    │   │                  CORE FILES                          │      │
    │   │                                                      │      │
    │   │  ┌─────────────┐  ┌───────────┐  ┌──────────────┐  │      │
    │   │  │ cold-start  │  │ bible.md  │  │ roadmap.md   │  │      │
    │   │  │   .md       │  │           │  │              │  │      │
    │   │  │             │  │ THE canon │  │ now / next / │  │      │
    │   │  │ Read FIRST  │  │ shape +   │  │ later / done │  │      │
    │   │  │ 2 min max   │  │ intent    │  │              │  │      │
    │   │  └─────────────┘  └───────────┘  └──────────────┘  │      │
    │   │                                                      │      │
    │   │  ┌─────────────┐  ┌───────────────────────────────┐ │      │
    │   │  │ runbook.md  │  │ glossary.md                   │ │      │
    │   │  │             │  │                               │ │      │
    │   │  │ Literal     │  │ Project-specific jargon only  │ │      │
    │   │  │ commands    │  │ (not "HTTP" — the words that  │ │      │
    │   │  │ start/stop/ │  │  make you stop and think)     │ │      │
    │   │  │ verify/fix  │  │                               │ │      │
    │   │  └─────────────┘  └───────────────────────────────┘ │      │
    │   └──────────────────────────────────────────────────────┘      │
    │                                                                 │
    │   ┌─────────────────────────────────────────────────────┐      │
    │   │                  SUBFOLDERS                           │      │
    │   │                                                      │      │
    │   │  ┌──────────────┐  ┌─────────────┐  ┌───────────┐  │      │
    │   │  │ assignments/ │  │ decisions/  │  │ conversa- │  │      │
    │   │  │              │  │             │  │  tions/   │  │      │
    │   │  │ ├── open/   │  │ One .md per │  │           │  │      │
    │   │  │ └── done/   │  │ choice made │  │ Saved     │  │      │
    │   │  │              │  │ (ADR-lite)  │  │ chats     │  │      │
    │   │  │ One .md per  │  │             │  │ (manual)  │  │      │
    │   │  │ task         │  │             │  │           │  │      │
    │   │  └──────────────┘  └─────────────┘  └───────────┘  │      │
    │   │                                                      │      │
    │   │  ┌──────────────────────────────────────────────┐   │      │
    │   │  │ references/                                   │   │      │
    │   │  │                                               │   │      │
    │   │  │ README.md — index of where context lives:     │   │      │
    │   │  │ skills, memories, code paths, other bibles    │   │      │
    │   │  └──────────────────────────────────────────────┘   │      │
    │   └──────────────────────────────────────────────────────┘      │
    └─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════


                        INSIDE bible.md — The Sections

    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │  ╔═ IDENTITY ═══════════════════════════════════════════════╗   │
    │  ║                                                          ║   │
    │  ║  Meta ─────────── status, dates, paths, owner            ║   │
    │  ║  Abstract ─────── 150-300 word conceptual overview       ║   │
    │  ║  Cold-start ───── 5-8 sentence operational summary       ║   │
    │  ║  Pulse ────────── 3-5 health metrics (hard numbers)      ║   │
    │  ║  Vital signs ──── 3 checks: healthy = looks like ___     ║   │
    │  ║  Intent ───────── want / need / wound / lie / truth      ║   │
    │  ║                                                          ║   │
    │  ╚══════════════════════════════════════════════════════════╝   │
    │                              │                                  │
    │                              ▼                                  │
    │  ╔═ ANATOMY ════════════════════════════════════════════════╗   │
    │  ║                                                          ║   │
    │  ║  Components ───── YAML: role, voice, depends, wound      ║   │
    │  ║  Structure ────── narrative: inciting → pivot → dark      ║   │
    │  ║                             night → climax → resolution   ║   │
    │  ║  Invariants ───── rules that hold everywhere             ║   │
    │  ║  Threads ──────── parallel workstreams + convergence      ║   │
    │  ║  Integration ──── connections to other projects (→ ← ↔) ║   │
    │  ║  World ────────── OS, ports, APIs, daily life            ║   │
    │  ║  Style/Voice ──── how the project talks                  ║   │
    │  ║                                                          ║   │
    │  ╚══════════════════════════════════════════════════════════╝   │
    │                              │                                  │
    │                              ▼                                  │
    │  ╔═ LAB NOTEBOOK (v4) ══════════════════════════════════════╗   │
    │  ║                                                          ║   │
    │  ║  Key Findings ─── discoveries that shaped the design     ║   │
    │  ║  Experiments ──── structured build results (the engine)  ║   │
    │  ║  Sparks ───────── ideas surfaced while building          ║   │
    │  ║  Nags ─────────── gaps, risks, honest limitations        ║   │
    │  ║  Kills ────────── things proved WRONG (credibility)      ║   │
    │  ║                                                          ║   │
    │  ╚══════════════════════════════════════════════════════════╝   │
    │                              │                                  │
    │                              ▼                                  │
    │  ╔═ SELF-AUDIT ═════════════════════════════════════════════╗   │
    │  ║                                                          ║   │
    │  ║  Honest Accounting ── correction log (Paper 467 pattern) ║   │
    │  ║  Known Drift ──────── bible says X, code says Y          ║   │
    │  ║  Open Questions ───── gaps that would change the bible   ║   │
    │  ║                                                          ║   │
    │  ╚══════════════════════════════════════════════════════════╝   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════


                 THE v4 ENGINE — Every Build Feeds Three Streams

                              Build something
                              Run an experiment
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │     RESPONSE ENTRY     │
                        │                        │
                        │  Date: YYYY-MM-DD      │
                        │  Result: CONFIRMED /   │
                        │   FALSIFIED / PARTIAL  │
                        │  What changed: ...     │
                        └───────────┬────────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     ▼              ▼              ▼
              ┌────────────┐ ┌────────────┐ ┌────────────┐
              │            │ │            │ │            │
              │   SPARKS   │ │    NAGS    │ │   KILLS    │
              │            │ │            │ │            │
              │  "What new │ │ "What gaps │ │ "What did  │
              │   ideas    │ │  or risks  │ │  we prove  │
              │   did this │ │  did this  │ │  WRONG?"   │
              │   surface?"│ │  reveal?"  │ │            │
              │            │ │            │ │            │
              │  Priority: │ │  Types:    │ │  Original  │
              │  HIGH      │ │  CRITICAL  │ │  claim     │
              │  MEDIUM    │ │  overclaim │ │     ↓      │
              │  LOW       │ │  untested  │ │  Killed by │
              │  FUTURE    │ │  math fact │ │     ↓      │
              │            │ │  lesson    │ │  What's    │
              │            │ │  learned   │ │  actually  │
              │            │ │            │ │  true      │
              └──────┬─────┘ └──────┬─────┘ └──────┬─────┘
                     │              │              │
                     ▼              ▼              ▼
              ┌────────────┐ ┌────────────┐ ┌────────────┐
              │   Future   │ │   Honest   │ │ Credibil-  │
              │   builds   │ │  Accounting│ │  ity       │
              │            │ │            │ │            │
              │ Feeds the  │ │ Correction │ │ "We test   │
              │ roadmap    │ │ log keeps  │ │  our own   │
              │            │ │ you honest │ │  claims"   │
              └────────────┘ └────────────┘ └────────────┘


═══════════════════════════════════════════════════════════════════════════════════


               READING ORDER — Which File Answers Which Question

     ┌──────────────────────────────────────────────────────────────────┐
     │                                                                  │
     │   "I just opened this project"                                  │
     │          │                                                       │
     │          ▼                                                       │
     │   ┌──────────────┐                                              │
     │   │ cold-start.md│──── 2 min triage: status, vitals, don'ts    │
     │   └──────┬───────┘                                              │
     │          │                                                       │
     │          ├───── "I need to RUN something"                       │
     │          │              │                                        │
     │          │              ▼                                        │
     │          │       ┌──────────────┐                               │
     │          │       │  runbook.md  │── literal commands, recovery  │
     │          │       └──────────────┘                               │
     │          │                                                       │
     │          ├───── "I need to UNDERSTAND this system"              │
     │          │              │                                        │
     │          │              ▼                                        │
     │          │       ┌──────────────┐                               │
     │          │       │   bible.md   │── full shape, intent, history │
     │          │       └──────────────┘                               │
     │          │                                                       │
     │          ├───── "What's PLANNED?"                               │
     │          │              │                                        │
     │          │              ▼                                        │
     │          │       ┌──────────────┐                               │
     │          │       │ roadmap.md   │── now / next / later / done   │
     │          │       └──────────────┘                               │
     │          │                                                       │
     │          └───── "What does that WORD mean?"                     │
     │                         │                                        │
     │                         ▼                                        │
     │                  ┌──────────────┐                               │
     │                  │ glossary.md  │── project jargon only         │
     │                  └──────────────┘                               │
     │                                                                  │
     └──────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════


                  UPDATE FREQUENCY — When Each File Changes

     ┌──────────────────┬────────────────────────────────────────────┐
     │                  │                                            │
     │  EVERY SESSION   │  cold-start.md    (status + vitals)       │
     │                  │  roadmap.md       (plan changes)          │
     │                  │                                            │
     ├──────────────────┼────────────────────────────────────────────┤
     │                  │                                            │
     │  EVERY BUILD     │  bible.md         (Findings, Sparks,      │
     │                  │                    Nags, Kills, Responses) │
     │                  │                                            │
     ├──────────────────┼────────────────────────────────────────────┤
     │                  │                                            │
     │  WHEN IT HAPPENS │  runbook.md       (ops/ports change)      │
     │                  │  glossary.md      (new term appears)      │
     │                  │  assignments/     (task opens/closes)      │
     │                  │  decisions/       (choice gets made)       │
     │                  │  references/      (new pointer found)      │
     │                  │                                            │
     ├──────────────────┼────────────────────────────────────────────┤
     │                  │                                            │
     │  RARE            │  bible.md         (shape changes only)     │
     │                  │  conversations/   (manual, worth keeping)  │
     │                  │                                            │
     └──────────────────┴────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════


                        TEMPLATE EVOLUTION — v1 → v4

     v1                  v2                  v3                  v4
     ┌────────────┐      ┌────────────┐      ┌────────────┐      ┌────────────┐
     │            │      │            │      │            │      │            │
     │ Intent     │      │ +Abstract  │      │ +Runbook   │      │ +Findings  │
     │ Components │─────▶│ +Cold-start│─────▶│ +Glossary  │─────▶│ +Sparks    │
     │ Structure  │      │  summary   │      │ +Cold-start│      │ +Nags      │
     │ Invariants │      │ +Vital     │      │  file      │      │ +Kills     │
     │ Threads    │      │  signs     │      │ +Honest    │      │ +Experiments│
     │            │      │            │      │  Accounting│      │ +Pulse     │
     │            │      │            │      │ +Known     │      │ +Integration│
     │            │      │            │      │  Drift     │      │  Map       │
     │            │      │            │      │ +YAML comps│      │            │
     ├────────────┤      ├────────────┤      ├────────────┤      ├────────────┤
     │ Narrative  │      │ Scannable  │      │ Operational│      │ Living lab │
     │ core       │      │            │      │ + self-    │      │ notebook   │
     │            │      │            │      │ auditing   │      │            │
     └────────────┘      └────────────┘      └────────────┘      └────────────┘


═══════════════════════════════════════════════════════════════════════════════════


                     WHEN TO MAKE A BIBLE

                     ✅  Long-running system
                     ✅  Non-obvious intent
                     ✅  Hard-won lessons across sessions

                     ❌  One-off scripts
                     ❌  Abandoned projects
                     ❌  Pure configuration
                     ❌  README already tells the whole story
```
