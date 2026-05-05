# Antidetect Engine — Runbook (worked example)

> **This is a FROZEN EXAMPLE from a real project.** Shipped alongside `runbook.md` (the template) so new bible owners can see what "good" looks like. Delete this file from your project's folder if you don't want it lingering.

---

## Triage — first action on every session

```bash
# 1. Is the big engine alive?
curl -s http://127.0.0.1:3500/health
# → {"status":"ok","timestamp":"...","version":"1.0.0"}

# 2. Is the mini engine alive?
curl -s http://127.0.0.1:4600/health
# → {"success":true,"data":{"status":"ok","engine":"mini",...}}

# 3. Is the latest Golden 17 score healthy?
cat data/golden17-latest.json | head -5
# → both engines golden6: 98, golden17: 17/17 pass
```

---

## 1. Start the system from a stopped state

```bash
# Start big engine on :3500 (in its own shell, leave running)
cd C:/Users/jennb/browser-sender/antidetect-engine
ENCRYPTION_KEY=local-dev-encryption-key-min-32-chars-xxxx npm start
# → watch for "Server listening at http://0.0.0.0:3500"
# → ignore Redis ECONNREFUSED spam — Redis isn't running on laptop, harmless

# Start mini engine on :4600 (in a second shell, leave running)
cd C:/Users/jennb/browser-sender/lib/dna-engine/mini-engine
PORT=4600 API_KEY=mini-engine-key node server.mjs
# → watch for "[mini-engine] Listening on http://localhost:4600"

# Verify both
curl -s http://127.0.0.1:3500/health && echo
curl -s http://127.0.0.1:4600/health && echo

# Run Golden 17 to confirm scores (~5 minutes)
node C:/Users/jennb/browser-sender/scripts/golden17-daily.cjs
# → Should report 17/17 PASS for both, Golden 6 = 98/100
```

---

## 2. Daily heartbeat

| Check | Command | Expected |
|---|---|---|
| Big engine health | `curl -s http://127.0.0.1:3500/health` | `{"status":"ok"}` |
| Mini engine health | `curl -s http://127.0.0.1:4600/health` | `{"success":true,"engine":"mini"}` |
| Golden 17 latest | `head -5 data/golden17-latest.json` | Both engines `golden6: 98` |
| Plugin index freshness | `head -5 plugins/INDEX.md` | "Last regenerated:" within 24h of any plugin.json edit |

---

## 3. Service inventory

| Port | Service | Owner | How to check |
|---|---|---|---|
| 3500 | Big antidetect engine | `antidetect-engine/dist/index.js` | `curl http://127.0.0.1:3500/health` |
| 4600 | Mini antidetect engine | `lib/dna-engine/mini-engine/server.mjs` | `curl http://127.0.0.1:4600/health` |
| 8888 | Go TLS proxy (opt-in via `TLS_PROXY=true`) | `antidetect-engine/bin/tls-proxy` | Usually OFF on laptop. Don't start unless you know why. |
| 11434 | Ollama (content gen) | System service | `curl http://127.0.0.1:11434/api/tags` |

---

## 4. Common operations

### Open a browser as a specific persona (the RIGHT way — mini engine)

```bash
node -e "
(async () => {
  const fs = require('fs');
  const persona = JSON.parse(fs.readFileSync('C:/Users/jennb/browser-sender/data/account-identity/registry.json','utf8'))['bonerloptes'];
  const r = await fetch('http://127.0.0.1:4600/browser/launch', {
    method: 'POST',
    headers: {'Content-Type':'application/json','x-api-key':'mini-engine-key'},
    body: JSON.stringify({
      headless: false,
      os: 'windows',
      proxy: { ...persona.proxy, protocol: 'http' },
      location: { city: 'Dallas', state: 'TX' },
      sessionId: persona.id,
    }),
  });
  console.log(await r.json());
})();
"
```

### Open a browser for testing (big engine, no persona)

```bash
curl -s -X POST http://127.0.0.1:3500/browser/browser/launch \
  -H "Content-Type: application/json" -H "x-api-key: desktop" \
  -d '{"headless":false}'
```

### Find a plugin action by intent

```bash
grep -i "reddit\|signup" plugins/INDEX.md
```

### Run a single Golden 17 test

```bash
node C:/tmp/golden-17-big.cjs creepjs       # just creepjs
node C:/tmp/golden-17-big.cjs tier1          # just tier 1
node C:/tmp/golden-17-big.cjs recaptcha-v3-score  # just reCAPTCHA v3
```

---

## 5. Recovery recipes

### 5a. "Page.navigate broken — BINDINGS: mandatory field missing at position 50"

**Symptoms:** Every navigate call fails. `about:blank` included.

**Diagnosis:** chp6 sealed channel is wrapping request bodies in `{sealed: <base64>}` but the engine has no unseal middleware. `request.body.url` arrives as `undefined`.

**Recovery:**
```bash
# Verify the guard is present in secure-engine-channel.mjs line ~60:
grep "isDesktop" lib/dna-engine/sleeves/secure-engine-channel.mjs
# Should show: if (codec && ENGINE_SEED && !isDesktop) {
# If the guard is missing, re-add it. If present, check your caller's apiKey.
```

**Real fix:** Already landed — `secure-engine-channel.mjs` skips chp6 when `apiKey === 'desktop'`.

### 5b. "Every HTTPS site fails with ERR_SSL_PROTOCOL_ERROR"

**Symptoms:** `about:blank` works, every `https://` URL fails.

**Diagnosis:** Go TLS proxy on :8888 is default-on and mangling handshakes (chrome120 profile vs Chrome 146).

**Recovery:**
```bash
# Check manager.js line 31 — should be opt-in:
grep "TLS_PROXY" antidetect-engine/dist/browser/manager.js | head -1
# Should show: TLS_PROXY === 'true'  (NOT: TLS_PROXY !== 'false')
# If wrong, fix the line. Then restart big engine.
```

### 5c. "Persona browser opens at wrong size — Google flags as new device"

**Symptoms:** Browser visible but not 1366×768. Google forces "Verify it's you" on every login.

**Recovery:**
```bash
# Verify the lock is intact in fingerprint-lite.mjs:
grep "PHYSICAL_SCREEN" lib/dna-engine/mini-engine/core/fingerprint-lite.mjs
# Should show: { width: 1366, height: 768 }
# Then restart mini and verify from inside the page:
# (launch a browser, evaluate screen.width + screen.height, must be 1366 + 768)
```

---

## 6. Gotchas

1. **Don't use big engine for persona work.** Big `:3500` doesn't accept inline `fingerprint`/`location`. Persona browsers always go through mini `:4600`.
2. **Don't pass `windowSize` or `fingerprint` from registry.json.** The registry has stale data (1440×900 macOS defaults in Windows persona records). Pass only `os: 'windows'` and let mini's locked defaults apply.
3. **Don't write scripts when a plugin or skill exists.** `grep -i <intent> plugins/INDEX.md` first. 604 actions across 363 plugins.
4. **Don't trust `registry.json` field-by-field.** Cross-check `screenWidth`, `chromeVersion`, `timezone` against engine defaults before any launch.
5. **Don't seed or run `antidetect-engine/workflows/account-creation/reddit.json`.** Wrong flow (email form, not Google OAuth). Executor crashes. Dead code.

---

## 7. Open investigations

1. **VPS deployment procedure** — how to get the engines running under PM2 on the prod box with `TLS_PROXY=true`
2. **Backup/restore for `registry.json`** — losing this file = losing all 136 personas forever
3. **The dashboard UI** — what URL, what auth, how to invoke a card from the browser

✅ **Closed during recent sessions:**
- ~~What causes "Page.navigate broken"?~~ → answered: chp6 sealed channel mangling bodies (2026-04-07)
- ~~Why do all HTTPS sites fail?~~ → answered: Go TLS proxy default-on with chrome120 profile (2026-04-07)
- ~~Why does Google flag every persona login as "new device"?~~ → answered: wrong screen size from stale registry data (2026-04-07)

---

## 8. File map

```
browser-sender/
├── antidetect-engine/                      ← BIG ENGINE
│   ├── src/                                ← TypeScript source (8 locked fixes)
│   ├── dist/                               ← compiled, what :3500 runs
│   └── .env                                ← needs ENCRYPTION_KEY (32+ chars)
│
├── lib/dna-engine/mini-engine/             ← MINI ENGINE
│   ├── server.mjs                          ← HTTP server, no build step
│   └── core/fingerprint-lite.mjs           ← PHYSICAL_SCREEN 1366×768 lock
│
├── lib/dna-engine/sleeves/
│   └── secure-engine-channel.mjs           ← chp6 sealing wrapper (desktop bypass)
│
├── plugins/                                ← 368 PLUGINS, 604 ACTIONS
│   └── INDEX.md                            ← auto-generated map (grep this first)
│
├── scripts/
│   ├── golden17-daily.cjs                  ← daily test runner (5 AM cron)
│   ├── generate-plugin-index.mjs           ← regenerates INDEX.md
│   └── phase-runner.mjs                    ← persona lifecycle conductor
│
├── data/
│   ├── account-identity/registry.json      ← 136 personas (source of truth, with known drift)
│   ├── proxy-marriages.json                ← married proxies (immutable)
│   ├── golden17-history.jsonl              ← all test runs (append-only)
│   └── golden17-latest.json                ← latest snapshot (oracle reads this)
│
└── login-results/<persona>/cookies.json    ← latest cookie snapshot per persona
```
