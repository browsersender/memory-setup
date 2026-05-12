# Biblion — Glossary

## Biblion
The documentation database system. Scans markdown in place, builds SQLite indexes, serves a browser UI. Named for the Greek root meaning "book."

## Content Root
A directory that Biblion scans for markdown files. Configured in biblion.config.json. Missing roots are skipped gracefully (thumb drive unplugged = no error).

## Domain
A label assigned to each content root (e.g., "bibles", "papers", "memory"). Used for filtering and display grouping.

## Catalog (catalog.db)
The page registry. Every scanned markdown file gets an entry with path, title, type, domain, paper number, content hash, and headings.

## Links Database (links.db)
Forward links (what this page links to), backlinks (what links to this page), and auto-links (pattern-matched references like "Paper 726").

## Search Index (search.db)
FTS5 full-text search with porter stemming. Supports phrase queries, boolean logic. Rebuilds from markdown.

## Connections Database (connections.db)
Parsed from the gold INDEX files: CONNECTION-INDEX.md (181 cross-paper connections), EXPERIMENT-INDEX.md (854 experiments), FOLLOW-UP-INDEX.md.

## Git Database (git.db)
Cached per-file commit history. Expensive to compute from git log, so cached and incrementally updated.

## Auto-linking
Pattern matching that turns "Paper 726" or "Experiment 760" in running text into clickable links without the author adding explicit markdown links.

## Backlinks
Reverse link index. When page A links to page B, page B's view shows "Linked from: A." Computed from links.db during scan.

## Hash-based Skip
Scanner stores MD5 hash of each file's content. On rescan, unchanged files (same hash) are skipped. Makes incremental scans fast.

## Gold INDEX Files
Brian's hand-curated index files: CONNECTION-INDEX.md, EXPERIMENT-INDEX.md, FOLLOW-UP-INDEX.md. These are structured data in markdown form. Biblion parses them into connections.db for querying.

## Stale Detection
When a page links to content that has changed since the page was last modified, it's flagged as potentially stale. Phase 6 feature.

## Page Type
Classification assigned by the scanner based on file path and content: bible, paper, experiment, glossary, roadmap, runbook, cold-start, handoff, memory, index, document.
