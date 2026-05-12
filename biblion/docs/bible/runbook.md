# Biblion — Runbook

## Start the server
```bash
cd C:\tmp\biblion
node server.js
```

## Rescan content (without restart)
Visit http://localhost:3900/rescan or restart the server.

## Check stats
Visit http://localhost:3900/api/stats for JSON output.

## Search
Visit http://localhost:3900/search?q=your+query or use the search box in the sidebar.

## Reset all databases
```bash
cd C:\tmp\biblion
rm data/*.db data/*.db-wal data/*.db-shm
node server.js
```

## Add a new content root
Edit `biblion.config.json`, add a new entry to `roots[]`:
```json
{ "path": "C:\\path\\to\\your\\files", "domain": "domain-name" }
```
Restart the server.

## Move to another machine
1. Copy the entire `C:\tmp\biblion\` folder
2. Edit `biblion.config.json` to update paths for the new machine
3. Run `npm install` (rebuilds native SQLite binding for the platform)
4. Run `node server.js`

The .db files are gitignored and will rebuild automatically on the new machine.

## Git operations
```bash
cd C:\tmp\biblion
git log --oneline -10       # recent commits
git status                  # uncommitted changes
git add -A && git commit -m "description"
```

## Verify health
1. Dashboard shows stat cards with non-zero counts
2. Search returns results
3. Clicking a page renders markdown with auto-links
4. Backlinks appear on pages that are referenced
