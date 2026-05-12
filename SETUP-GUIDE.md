# Claude Code Memory System — Setup Guide

## What this is

A complete knowledge management system for Claude Code projects. Three tools, no databases, no embeddings, no external dependencies:

1. **Memory system** — file-based persistent memory across conversations
2. **Project Bible v4** — structured documentation template for any project
3. **Thread Bible** — cross-project manager that routes sparks into convergent themes
4. **Biblion** — local SQLite search engine that indexes all your bibles, papers, and docs

## Quick start

### 1. Memory system

Copy `memory-template/` to your Claude Code project settings:

```
~/.claude/projects/<YOUR-PROJECT-KEY>/memory/
```

To find your project key:
1. Open Claude Code in your project
2. Run: `/config` and look for the project settings path
3. The `memory/` folder goes inside that project folder

For a **global** memory (applies to all projects):
```
~/.claude/memory/
```

On Windows, `~` is `C:\Users\<username>`.

Add this to your CLAUDE.md (global or project-level):

```markdown
# Memory System
Read `memory/MEMORY.md` at session start. It is the index for a file-based memory system.
Individual memory files are in the `memory/` folder. Load them when referenced or relevant.
Follow the governance rules in each memory file's frontmatter.
```

### 2. Project Bible v4

Copy `bible-template-v4/` to start a new project bible:

```
cp -r bible-template-v4/ "Desktop/Project Bibles/My New Project/"
```

Fill in the template — start with Meta, Abstract, and Cold-start. The rest fills in as the project develops.

### 3. Thread Bible

Copy `thread-bible-template/` when you need a cross-project manager:

```
cp -r thread-bible-template/ "Desktop/Project Bibles/My Thread Bible/"
```

Thread bibles connect multiple project bibles. They route sparks (ideas from project bibles) into convergent themes, track cross-project commits, and maintain a journal + memory layer. Use when you have 3+ project bibles with overlapping concerns.

**Key concepts:**
- **Sparks** — ideas from project bibles, routed into threads by product outcome
- **Threads** — convergent themes that span multiple projects
- **Journal** — chronological session log (raw ground truth)
- **Memory** — distilled decisions, patterns, and warnings from the journal
- **Commits** — cross-project commit log organized by thread

### 4. Biblion

Copy `biblion/` wherever you want and install dependencies:

```
cp -r biblion/ ~/biblion/
cd ~/biblion
npm install
```

Configure your content roots in `biblion.config.json`:

```json
{
  "roots": [
    { "path": "Desktop/Project Bibles", "domain": "bibles" },
    { "path": "Desktop/Papers", "domain": "papers" }
  ],
  "port": 3333
}
```

Start the server:

```
node server.js
```

Browse to `http://localhost:3333`. Full-text search across all your bibles and papers. 5 SQLite databases, all disposable — delete any or all and `/rescan` rebuilds from markdown.

## Folder structure

```
memory-setup/
├── memory-template/           ← Persistent memory for Claude Code
│   ├── MEMORY.md              ← Master index (always loaded, <200 lines)
│   ├── warm/                  ← Categorized sub-indexes
│   ├── archive/               ← Cold tier (demoted memories)
│   └── _templates/            ← Copy these to create new memories
│
├── bible-template-v4/         ← Project bible template
│   ├── bible.md               ← The bible itself
│   ├── cold-start.md          ← Quick-start summary
│   ├── glossary.md            ← Project-specific jargon
│   ├── roadmap.md             ← Future work
│   ├── runbook.md             ← How to run things
│   ├── assignments/           ← Task tracking
│   ├── conversations/         ← Session logs
│   ├── decisions/             ← Decision records
│   └── references/            ← External references
│
├── thread-bible-template/     ← Cross-project manager template
│   └── bible.md               ← Thread bible with Journal, Memory, Commits
│
├── biblion/                   ← Local search engine
│   ├── server.js              ← HTTP server (~280 lines)
│   ├── scanner.js             ← Markdown scanner (~210 lines)
│   ├── renderer.js            ← Markdown → HTML (~160 lines)
│   ├── db.js                  ← SQLite wrapper (~120 lines)
│   ├── biblion.config.json    ← Content roots config
│   ├── views/                 ← Dashboard, browse, search UI
│   └── docs/bible/            ← Biblion's own project bible
│
├── SETUP-GUIDE.md             ← This file
└── PROJECT-BIBLE-DIAGRAM.md   ← Visual diagram of the system
```

## The four memory types

| Type | What it stores | When to save |
|------|---------------|--------------|
| **user** | Who you are, your role, preferences, expertise | When Claude learns about you |
| **feedback** | Rules for how Claude should behave | When you correct Claude or confirm an approach |
| **project** | Active work state, goals, decisions | When context about ongoing work is established |
| **reference** | Pointers to external systems/resources | When you mention where info lives outside the repo |

## Bible vs Thread Bible

| | Project Bible | Thread Bible |
|---|---|---|
| **Scope** | One project | Multiple projects |
| **Manages** | Code, architecture, decisions | Themes, convergence, routing |
| **Sparks** | Raw ideas from this project | Routed ideas from multiple bibles |
| **Unique sections** | Runbook, Assignments | Journal, Memory, Commits |
| **When to use** | Every project | When 3+ bibles have overlapping concerns |

## Governance rules

- **Save**: when you say "remember X" or it matches a save trigger
- **Never save**: code patterns, git history, debugging recipes, ephemeral task details
- **Verify**: before acting on any recalled memory, check it's still current
- **Promote**: cold → warm → hot if accessed often
- **Demote**: hot → warm → cold if stale or unused
- **Delete**: when you say "forget X" or memory is confirmed obsolete
