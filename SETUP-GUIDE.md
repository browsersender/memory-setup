# Claude Code Memory System — Setup Guide

## What this is

A file-based, tiered memory system for Claude Code. No databases, no embeddings, no vectors. Just structured markdown files with a human-governed lifecycle.

Claude reads the index (MEMORY.md) at the start of every conversation. That index points to individual memory files. Claude loads the ones that are relevant.

## How to install

### Step 1 — Create the folder structure

Copy the `memory-template/` folder to:

```
~/.claude/projects/<YOUR-PROJECT-KEY>/memory/
```

The project key is based on your working directory. To find yours:
1. Open Claude Code in your project
2. Run: `/config` and look for the project settings path
3. The `memory/` folder goes inside that project folder

For a **global** memory (applies to all projects), put it in:
```
~/.claude/memory/
```

On Windows, `~` is `C:\Users\<username>`.

### Step 2 — Add the CLAUDE.md hook

Add this line to your CLAUDE.md (global or project-level):

```markdown
# Memory System
Read `memory/MEMORY.md` at session start. It is the index for a file-based memory system.
Individual memory files are in the `memory/` folder. Load them when referenced or relevant.
Follow the governance rules in each memory file's frontmatter.
```

### Step 3 — Start using it

Tell Claude: "Remember that I prefer X" — it saves a feedback memory.
Tell Claude: "Forget that" — it removes the memory.
Or manually create files using the templates below.

## Folder structure

```
memory/
├── MEMORY.md              ← Master index (always loaded, <200 lines)
├── warm/                  ← Categorized sub-indexes
│   ├── projects.md
│   ├── sessions.md
│   ├── references.md
│   ├── feedback.md
│   └── protocols.md
├── archive/               ← Cold tier (demoted memories)
│   └── (moved here when stale)
├── _templates/            ← Copy these to create new memories
│   ├── user.md
│   ├── feedback.md
│   ├── project.md
│   └── reference.md
└── (your memory files live here)
```

## The four memory types

| Type | What it stores | When to save |
|------|---------------|--------------|
| **user** | Who you are, your role, preferences, expertise | When Claude learns about you |
| **feedback** | Rules for how Claude should behave | When you correct Claude or confirm an approach |
| **project** | Active work state, goals, decisions | When context about ongoing work is established |
| **reference** | Pointers to external systems/resources | When you mention where info lives outside the repo |

## Governance rules

- **Save**: when you say "remember X" or it matches a save trigger
- **Never save**: code patterns, git history, debugging recipes, ephemeral task details
- **Verify**: before acting on any recalled memory, check it's still current
- **Promote**: cold → warm → hot if accessed often
- **Demote**: hot → warm → cold if stale or unused
- **Delete**: when you say "forget X" or memory is confirmed obsolete
