# Example CLAUDE.md — Memory + Bible + Biblion hooks

Add these sections to your `.claude/CLAUDE.md` (global) or project-level CLAUDE.md.

---

## Memory System

```markdown
# Memory System
Read `memory/MEMORY.md` at session start. It is the index for a file-based memory system.
Individual memory files are in the `memory/` folder. Load them when referenced or relevant.
Follow the governance rules in each memory file's frontmatter.
```

## Project Bibles

```markdown
# Project Bibles
Project documentation lives in `Desktop/Project Bibles/`. Each project has a bible (bible.md)
with architecture, decisions, sparks, and nags. Read the relevant bible before working on a project.
Thread bibles (e.g., Sola Threads) manage cross-project work — check them for routing and priorities.
```

## Biblion Search

```markdown
# Biblion
Before grepping across bibles or papers manually, use Biblion.
Local SQLite search engine at `~/biblion/`. Start: `node ~/biblion/server.js`
Search: http://localhost:3333/search?q=your+query
Browse: http://localhost:3333/bibles (all bibles), /papers (all papers)
Rescan: http://localhost:3333/rescan (rebuilds all databases from markdown)
```

---

## Notes

- Paths are examples — adjust to match your actual file locations
- The memory hook is the most important one — it gives Claude persistent context
- Bible and biblion hooks are optional but reduce wasted time searching
- On Windows, `~` is `C:\Users\<username>`
