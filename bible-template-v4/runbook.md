# {{Project Name}} — Runbook

> **Literal commands for running and operating the system.** This is the "next person can actually run it" file. Sister to `bible.md` (shape and intent) and `cold-start.md` (state-of-the-world).
>
> **`[NEEDS VERIFICATION]`** marks recipes that haven't been tested end-to-end. Treat them as best-guess until verified. When you verify one, remove the marker and note the date.
>
> **See `runbook.example.md`** for a fully filled-in example from a real project if you're not sure what good looks like.

---

## Triage — first action on every session

> These few commands tell you the state of the world in 30 seconds. Run them before doing anything else. If anything's red, jump to "Recovery recipes" below.

```bash
# 1. Is the main service alive?
{{command to check}}

# 2. Is its work loop actually running (not just the process)?
{{command — check children, log size, last activity}}

# 3. Is the canary (the most-load-bearing piece) healthy?
{{command + expected output}}
```

---

## 1. Start the system from a stopped state

```bash
# Start the main process
{{command}}

# Verify it booted (look for X in the log within Y seconds)
{{command}}

# Verify it's actually serving / processing
{{command + expected output}}
```

---

## 2. Daily heartbeat — what should be alive at any given moment

| Check | Command | Expected |
|---|---|---|
| {{name}} | `{{command}}` | `{{expected output or state}}` |
| {{name}} | `{{command}}` | `{{expected}}` |

---

## 3. Service inventory — what runs on which port / where

| Port / location | Service | Owner / process | How to check it |
|---|---|---|---|
| {{port}} | {{name}} | {{owner}} | `{{command}}` |

---

## 4. Common operations

### {{Operation name}} (e.g. "Open a browser as a persona")

```bash
{{commands}}
```

### {{Operation name}} (e.g. "Run the daily test suite manually")

```bash
{{commands}}
```

(Repeat per common operation. Keep each one copy-pasteable.)

---

## 5. Recovery recipes

### 5a. {{Common failure mode 1}}

**Symptoms:** {{what you see when this is broken}}

**Diagnosis:** {{root cause}}

**Recovery:**
```bash
{{commands}}
```

**Real fix:** {{link to assignment or note that workaround is the fix}}

### 5b. {{Common failure mode 2}}

(Repeat per known failure mode. The first 3-5 are the most valuable — they're the ones that have actually happened. Add more as they come.)

---

## 6. Gotchas — things that have burned past sessions

1. **{{rule}}** — {{why it matters, what to do instead}}
2. **{{rule}}** — {{...}}
3. **{{rule}}** — {{...}}

(These are the "I wish someone had told me" items. Different from recovery recipes — gotchas are preventive, recipes are reactive.)

---

## 7. Open investigations (runbook gaps to close)

These are questions a complete runbook needs answered. Each one should become an assignment in `assignments/open/` once someone picks it up:

1. **{{Question that's still open}}** — {{why answering it matters}}
2. ...

✅ **Closed during recent sessions:**
- ~~{{question}}~~ → answered: {{answer}} (YYYY-MM-DD)

---

## 8. File map — where to find things

> Annotated tree of the project's key files. Not the complete `ls -R` — just the files a new reader will need to navigate to.

```
project-root/
├── {{important dir}}/          ← {{what lives here}}
│   ├── {{important file}}      ← {{what it does}}
│   └── ...
├── {{important dir}}/          ← {{what lives here}}
└── {{important file}}          ← {{what it does}}
```

---

## Update discipline

This file should be updated when:
- A new recovery recipe gets discovered (something broke and you found a fix — write it down)
- A `[NEEDS VERIFICATION]` recipe gets verified (remove the marker, note the date)
- A service is added or removed
- A port assignment changes
- A new gotcha gets uncovered
- An open investigation gets closed (strikethrough + answer)

This file should NOT be updated for:
- Daily status changes (those go in `cold-start.md`)
- Forward plans (those go in `roadmap.md`)
- Architecture decisions (those go in `decisions/`)
- Conceptual narrative (that goes in `bible.md`)
