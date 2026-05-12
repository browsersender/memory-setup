# Biblion — Project Bible

## What It Is

Local documentation database that scans markdown files in place and builds 5 small SQLite databases for browsing, searching, and cross-referencing. No Docker. No server dependencies. One Node.js process.

## Why It Exists

Qdrant vector database on VPS (3.4M vectors, 34 collections) keeps going down because Docker. 16 of 34 collections are empty. When the container dies, everything dies. The knowledge that matters — 70+ project bibles, 867+ papers, 854 experiments, 181 connections, 264 memory files — is all markdown on disk already. It just needs a local index and a browser face.

Biblion doesn't replace Qdrant. It replaces the dependency on Qdrant for YOUR documentation. Feed data (arXiv, market bars) stays in Qdrant when it's up. Your knowledge lives in SQLite that runs anywhere.

## Architecture

```
C:\tmp\biblion\           (portable — copy anywhere)
├── server.js             HTTP server (~280 lines)
├── scanner.js            Markdown scanner, builds databases (~210 lines)
├── renderer.js           Markdown → HTML, auto-linking (~160 lines)
├── db.js                 SQLite open/migrate/close (~120 lines)
├── biblion.config.json   Content roots and port
├── views/
│   ├── layout.js         HTML shell (dark theme)
│   ├── dashboard.js      Stats, recent changes, bible index
│   ├── page.js           Page view with backlinks + TOC
│   ├── browse.js         Bibles, papers, connections, experiments
│   └── search.js         Full-text search results
├── data/                 (gitignored)
│   ├── catalog.db        Page metadata, headings
│   ├── links.db          Forward links, backlinks, auto-links
│   ├── search.db         FTS5 full-text search
│   ├── connections.db    CONNECTION-INDEX, EXPERIMENT-INDEX, FOLLOW-UP-INDEX
│   └── git.db            Per-file commit history cache
└── docs/bible/           This bible
```

## 5 Databases

| Database | What | Deletable? |
|---|---|---|
| catalog.db | Every page: path, title, domain, type, paper#, hash, headings | Yes — rescan rebuilds |
| links.db | Forward links, backlinks, auto-link matches | Yes — rescan rebuilds |
| search.db | FTS5 full-text index with porter stemming | Yes — rescan rebuilds |
| connections.db | Parsed from gold INDEX files (connections, experiments, follow-ups) | Yes — rescan rebuilds |
| git.db | Per-file git log cache | Yes — rescan rebuilds |

Every database is disposable. Delete any or all, restart the server, they rebuild from markdown in seconds.

## Content Roots

Configured in `biblion.config.json`. Scanner skips roots that don't exist (thumb drive unplugged = no error, just fewer pages).

| Root | Domain | What |
|---|---|---|
| D:\Bibles | bibles | 70+ project bibles |
| D:\Papers | papers | 867+ papers |
| D:\projects | projects | Active project dirs |
| Desktop\Project Bibles | desktop-bibles | Desktop bible copies |
| Desktop\Project Merlino | merlino | Merlino system docs |
| .claude\memory | memory | 264 memory files |

## Routes

| Path | What |
|---|---|
| / | Dashboard: stats cards, recent changes, bible index by category |
| /bibles | All bibles grouped by parent directory |
| /papers | All papers sorted by number (newest first) |
| /papers/:number | Single paper with backlinks |
| /connections | CONNECTION-INDEX parsed into table |
| /experiments | EXPERIMENT-INDEX parsed into table |
| /search?q= | FTS5 full-text search |
| /recent | 50 most recently modified pages |
| /stale | Pages referencing changed content (Phase 6) |
| /page?path= | Any indexed page with rendered markdown + backlinks + TOC |
| /rescan | Re-scan all roots and rebuild databases |
| /api/stats | JSON stats endpoint |

## Key Behaviors

- **Auto-linking**: "Paper 726" and "Experiment 760" in any page become clickable links
- **Backlinks**: Every page shows what links TO it
- **Hash-based skip**: Unchanged files aren't re-processed on rescan
- **Graceful degradation**: Unplugged thumb drive = fewer pages, not an error
- **Dark theme**: Matches existing dashboards (collab, mission control)

## Dependencies

- Node.js (any recent version)
- better-sqlite3 (single npm dependency — native SQLite binding)
- That's it

## How to Run

```bash
cd C:\tmp\biblion
npm install              # first time only
node server.js           # scans all roots, starts at localhost:3900
```

## Build Phases

| Phase | What | Status |
|---|---|---|
| 1. Foundation | db, scanner, renderer, server, views | Done |
| 2. Structure | Bible/paper type extraction, categories from BIBLE-GLOSSARY | Planned |
| 3. Links & Search | Link extraction, backlinks, auto-linker, FTS5 | Done (basic) |
| 4. Gold Indices | Parse CONNECTION-INDEX, EXPERIMENT-INDEX, FOLLOW-UP-INDEX | Planned |
| 5. Git | Init repos on content roots, auto-commit, history panel | Planned |
| 6. Graph & Stale | Canvas graph from links.db, stale detection | Planned |
| 7. Polish | Keyboard shortcuts, performance, watcher mode | Planned |

## What This Does NOT Do

- Copy or move any files
- Modify source markdown
- Require Docker
- Require a database server
- Need internet access
- Replace the folder structure
