# Conversations

Saved chats about this project. **Manual save only** — drop a file here when a chat is worth finding again.

## Why manual

Auto-saving every chat that mentions the project would pollute the folder with low-value sessions. The point of this folder is *findability*, not completeness. A chat belongs here if:

- It contains a decision (also write a `decisions/` entry).
- It contains design exploration that would be expensive to recreate.
- It surfaced a non-obvious lesson worth re-reading.
- It's the first session on a new thread of work.

## Format

Filename: `YYYY-MM-DD-short-slug.md`

Top of file: a one-line summary, then the chat content. The chat can be:
- **Raw** — pasted as-is.
- **Distilled** — Claude or you can summarize the key points and drop the noise.
- **Mixed** — distilled summary at top, full transcript below.

```markdown
# 2026-04-08 — design conversation about project bibles

> Brian and Claude designed the project bible case-file system. Decided on folder layout, defaults, and pilot order.

[chat content here]
```

## How to save a chat

Easiest: tell Claude *"save this chat to the {{project name}} bible as `<slug>`"* and it'll write the file. Or copy/paste manually — both work, no tooling needed.
