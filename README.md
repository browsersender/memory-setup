# Memory Setup

Complete knowledge management for Claude Code — memory, documentation, cross-project management, and search.

## What's in here

| Tool | What it does |
|---|---|
| **memory-template/** | File-based persistent memory across Claude Code conversations |
| **bible-template-v4/** | Structured project documentation — one bible per project |
| **thread-bible-template/** | Cross-project manager — routes ideas from multiple bibles into convergent themes |
| **biblion/** | Local SQLite search engine — indexes all your bibles, papers, and memory files |

## Quick start

1. Copy `memory-template/` to `~/.claude/projects/<YOUR-PROJECT>/memory/`
2. Copy `bible-template-v4/` for each project you want to document
3. Copy `thread-bible-template/` when you have 3+ bibles with overlapping work
4. Copy `biblion/` anywhere, run `npm install && node server.js`
5. Add the hooks from `claude-md-example.md` to your CLAUDE.md

Full instructions in [SETUP-GUIDE.md](SETUP-GUIDE.md).

## How the pieces connect

```
Claude Code reads MEMORY.md at session start
    → loads relevant memory files
    → reads project bibles for context
    → thread bibles route work across projects

Biblion indexes everything (bibles + papers + memory)
    → full-text search via browser
    → backlinks show what references what
    → connection tracking across papers/experiments
```

Memory is markdown files (Claude reads these directly).  
Biblion is SQLite on top of those same files (you search via browser).  
Both work offline. No Docker. No cloud dependency.
