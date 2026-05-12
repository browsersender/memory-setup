# Biblion

Local documentation database. Scans markdown files in place, builds 5 small SQLite databases, serves a browser UI for browsing, searching, and cross-referencing.

No Docker. No server dependencies. One Node.js process.

## Quick start

```bash
npm install
node server.js
```

Open http://localhost:3900

## What it does

- Scans configured directories for markdown files
- Builds indexes: catalog, links, backlinks, full-text search
- Auto-links "Paper 726" and "Experiment 760" references
- Shows backlinks on every page
- Dark theme, sidebar navigation
- Databases are disposable — delete and rescan to rebuild

## Architecture

5 SQLite databases, each deletable and rebuildable:

| Database | What |
|---|---|
| catalog.db | Page metadata, headings, types |
| links.db | Forward links, backlinks, auto-links |
| search.db | FTS5 full-text search |
| connections.db | Cross-paper connections, experiments |
| git.db | Per-file commit history cache |

## Configuration

Edit `biblion.config.json` to set content roots and port. Missing roots are skipped gracefully.

## Dependencies

- Node.js
- better-sqlite3

That's it.
