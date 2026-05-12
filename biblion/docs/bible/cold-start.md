# Biblion — Cold Start

## First Time Setup

```bash
cd C:\tmp\biblion
npm install
node server.js
```

Open http://localhost:3900

## What Happens on Startup

1. Reads `biblion.config.json` for content roots
2. Skips any root that doesn't exist (thumb drive unplugged = fine)
3. Walks each root recursively for .md files
4. For each file: extracts title, headings, type, paper number, links
5. Builds catalog.db, links.db, search.db
6. Computes backlinks from forward links
7. Starts HTTP server on configured port (default 3900)

## If Databases Are Missing

They rebuild automatically on startup. Delete any or all .db files in data/, restart, everything comes back.

## If Thumb Drive Is Plugged In

Restart the server (Ctrl+C, then `node server.js`). It will pick up the D: drive roots and scan thousands more files.

Or visit http://localhost:3900/rescan to trigger a rescan without restart.

## Expected Numbers

| Source | Files |
|---|---|
| Desktop Project Bibles | ~8 |
| Memory system | ~264 |
| D:\Bibles (thumb drive) | ~200+ |
| D:\Papers (thumb drive) | ~867+ |
| D:\projects (thumb drive) | ~1000+ |
| **Total with thumb drive** | **~15,000+** |

## Port Conflicts

If port 3900 is taken, edit `biblion.config.json` and change the port.

## Common Issues

- **"Cannot find module better-sqlite3"** — Run `npm install`
- **"SQLITE_ERROR: no such table"** — Delete data/*.db and restart
- **Blank dashboard** — No content roots found. Check paths in config.
