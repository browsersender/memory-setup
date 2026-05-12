# Biblion — Roadmap

## Phase 1 — Foundation (DONE)
- [x] db.js — SQLite helper with 5 database schemas
- [x] scanner.js — walk dirs, extract metadata, build indexes
- [x] renderer.js — markdown to HTML with auto-linking
- [x] server.js — HTTP server with all routes
- [x] views — dashboard, page, browse, search
- [x] biblion.config.json — content roots
- [x] Git repo initialized

## Phase 2 — Structure
- [ ] Parse BIBLE-GLOSSARY.md to extract category groupings
- [ ] Better bible detection (look for bible.md in parent dirs)
- [ ] Breadcrumb navigation based on folder hierarchy
- [ ] Table of contents sidebar improvements

## Phase 3 — Links & Search (Enhanced)
- [ ] Resolve relative links to absolute paths
- [ ] Bible name auto-linking (not just Paper NNN)
- [ ] Search result ranking by type (bibles > papers > memory)
- [ ] Search suggestions / autocomplete

## Phase 4 — Gold Indices
- [ ] Parser for CONNECTION-INDEX.md → connections table
- [ ] Parser for EXPERIMENT-INDEX.md → experiments table
- [ ] Parser for FOLLOW-UP-INDEX.md → follow_ups table
- [ ] Cross-reference: paper pages show their experiments and connections
- [ ] Status code filtering (C/F/P/U/T/O) on connections view
- [ ] Result filtering (CONFIRMED/FALSIFIED/PARTIAL) on experiments view

## Phase 5 — Git
- [ ] git log cache per content root → git.db
- [ ] History panel on every page (last N commits touching this file)
- [ ] /timeline view — recent commits across all roots
- [ ] Incremental git cache rebuild (only new commits)

## Phase 6 — Graph & Stale
- [ ] Graph data extraction from links.db
- [ ] Canvas-based force-directed graph (no D3)
- [ ] Stale detection: page links to changed content → flagged
- [ ] /stale view with fix suggestions

## Phase 7 — Polish
- [ ] Keyboard shortcuts (/ for search, j/k navigation)
- [ ] File watcher mode (auto-rescan on file changes)
- [ ] Performance: batch inserts, prepared statement caching
- [ ] Static export option (HTML snapshot of entire site)
