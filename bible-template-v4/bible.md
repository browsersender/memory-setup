# {{Project Name}} — Project Bible

> One-sentence elevator: what this project is, in plain language. If you can't say it in one sentence, the project doesn't have a clear shape yet.

> **Need to actually run it?** → see [`runbook.md`](runbook.md) (literal commands, recovery recipes, service inventory). The bible explains *what & why*. The runbook explains *how to type things*.
>
> **Hit an unfamiliar term?** → see [`glossary.md`](glossary.md). Project-specific jargon lives there.

---

## Meta

- **Status:** active | dormant | archived
- **Started:** YYYY-MM-DD
- **Last shape change:** YYYY-MM-DD
- **Lives at:** primary code path(s) — absolute paths or repo URLs
- **Runs on:** where it's deployed (laptop / VPS / both / Desktop / Mobile / browser)
- **Owner:** Brian / Ender / shared

---

## Abstract

> **The back cover of the book.** ~150-300 words, self-contained prose. A reader should be able to understand what this project IS, what it solves, why it's interesting, and what state it's in by reading only this section. Different from cold-start summary (which is operational triage) and from intent (which is the "why"). Like a paper abstract: structured but flowing — what's the problem, what we built, what's interesting about it, what state it's in.
>
> Update only when the project's shape changes meaningfully. Rare.

(2-4 paragraphs of self-contained prose describing the project at the conceptual level)

<details>
<summary><b>Worked example — what a good Abstract looks like</b> (click to expand)</summary>

> **Silent Encryption Engine** — a zero-dependency white-box encryption engine that ships seal/unseal, AEAD, key derivation, three-channel concealment, steganographic key exchange, forward secrecy, post-quantum KEM readiness, Paillier homomorphic encryption, threshold decryption, and private aggregation — all in pure Node.js with no npm dependencies. The engine targets healthcare, finance, government, and defense verticals where homomorphic encryption (the closest competitor) is 10,000x slower.
>
> Started as a lattice-based seal/unseal primitive from Paper 6 (2025). Grew through Papers 121-131 (compress+encrypt), Paper 644 (ciphertext monitoring), Paper 797 (silent handshake), Paper 805 (three-channel cipher), Paper 810 (double ratchet), and Papers 813-876 (homomorphic, threshold, anamorphic, ZKP, garbled circuits, FHE bootstrapping, ORAM, and 30+ more). Today: 72 capabilities, 1887 tests, 70 test suites, zero external dependencies.
>
> The central insight is that encryption, computation, and compression can be the same operation — the lattice hashes itself, the channel IS the encryption. This makes the engine content-agnostic: it doesn't need to understand what it's encrypting to compute on it.

Notice what this Abstract does:
- **First sentence names what it IS and the market** (zero-dep encryption engine for healthcare/finance/defense)
- **Second paragraph tells the build history** (how it grew from one primitive to 72 capabilities)
- **Third paragraph captures the central insight** in one sentence
- **A reader who reads only this section can answer:** "what is it?", "why does it exist?", "what state is it in?", "what's interesting about it?"
</details>

---

## Cold-start summary

> **The most-read section after `cold-start.md`.** Tells a future reader (human or Claude) the whole story compressed into 5-8 sentences. If they only read this paragraph and nothing else, they should understand what the project is, what state it's in, what matters most, and what to be careful about. Different from the abstract (which is conceptual) — this one is operational and time-bound.

5-8 sentences max. Update whenever the bible's shape changes.

---

## Pulse

> **Running numbers.** The 3-5 metrics that tell you the project's health at a glance. Update after every build session. These are facts, not aspirations — if the test count is 47, write 47, not "~50."

| Metric | Value | As of |
|---|---|---|
| {{metric name}} (e.g. capabilities) | {{number}} | YYYY-MM-DD |
| {{metric name}} (e.g. tests passing) | {{number}} | YYYY-MM-DD |
| {{metric name}} (e.g. test suites) | {{number}} | YYYY-MM-DD |

<details>
<summary><b>Worked example</b> (click to expand)</summary>

| Metric | Value | As of |
|---|---|---|
| Capabilities | 72 | 2026-05-01 |
| Tests passing | 1887 | 2026-05-01 |
| Test suites | 70 | 2026-05-01 |
| npm dependencies | 0 | 2026-05-01 |
| Papers implemented | 876 - 797 = 79 | 2026-05-01 |

</details>

---

## Vital signs

> If you only check three things to know if the project is healthy, check these.

1. **{{name of metric/file/process}}** — `{{where to find it}}` — healthy = `{{what good looks like}}`
2. **{{name}}** — `{{where}}` — healthy = `{{what good looks like}}`
3. **{{name}}** — `{{where}}` — healthy = `{{what good looks like}}`

(These should mirror cold-start.md "If something's broken, check these first" and runbook.md "Triage." Same content, three audiences.)

---

## Intent

A short prose description of what this project is for and what it's actually trying to accomplish. 2-5 sentences. Lead with the practical purpose, not the philosophy.

> **Optional narrative scaffolding** (delete this whole subsection if you don't need it): some projects benefit from a `want / need / wound / lie / truth` framing. Keep it if it surfaces useful context. Drop it if it feels forced.
>
> - **Want** — surface goal
> - **Need** — deep goal
> - **Wound** — the pain that triggered building this
> - **Lie** — the wrong approach you tried first or that everyone else takes
> - **Truth** — what you learned that the lie hid

---

## Components — the characters

> Structured as YAML so any agent can parse mechanically. Use the `antagonist` field even when it feels forced — it surfaces the constraint that shaped the design.
>
> **Worked examples for `antagonist`:** "fingerprinting detection" / "rate limits" / "process death across cold starts" / "data freshness decay" / "context window limits" / "model drift" / "key rotation events"
>
> **The `verify` field** is a one-line shell command that, if it succeeds, proves the component is in the state the bible claims. Optional but recommended — lets the bible self-check against reality.

```yaml
components:
  - name: {{Component Name}}
    role: protagonist  # protagonist | supporting | antagonist | mentor | foil
    one_line: A single sentence telling a new reader what this component IS and why it exists. Read first.
    voice: how it talks — log style, error format, UI tone
    depends_on: [other-component-1, other-component-2]
    wound: the constraint or limit it carries
    antagonist: the thing it has to defeat (force-name one even if it feels weird)
    status: healthy  # healthy | flaky | deprecated | planned
    matches_code: yes  # yes | no | partial | unknown
    last_verified: YYYY-MM-DD
    verify: "{{shell command that proves this component is healthy, returns 0 on pass}}"

  - name: {{Component 2}}
    role: ...
```

---

## Structure — the beats (system *history*, not future)

> Forward plans live in `roadmap.md`. This section tells the **story of how the system got to where it is.** Future-you reading this should understand the journey, not just the destination. Prose, not YAML — narrative is the point.

- **Inciting incident:** what made you start building this — the day, the realization, the failure that triggered it
- **Midpoint shift:** the pivot — when the approach changed and why (often the most important entry)
- **Dark night:** when it broke worst, what was on fire, what you learned
- **Climax:** when it worked — the proof, the test pass, the first successful run
- **Resolution:** where it lives now, what it does today
- **Additional beats:** any other moments worth remembering — name them and date them

---

## Invariants — the rules that thread through

> Recurring rules and principles that show up across the system. Things that are true no matter which component you're in. Often these are scattered as feedback memories elsewhere — link to them.

```yaml
invariants:
  - rule: {{the rule itself}}
    why: {{the reason — usually a past incident}}
    where: {{scope — which components, which environments}}
    linked_memory: {{path to atomic feedback memory if it exists}}
```

---

## Threads — parallel workstreams

> Long-running parallel tracks within the project. Each thread has its own arc but they meet at convergence points.
>
> **Skip this section** if your project has fewer than 3 parallel tracks — for small projects threads are padding. Components carry the load.

```yaml
threads:
  - name: {{Thread name}}
    owner: {{component or person}}
    status: active  # active | paused | done
    convergence_points: [thread-2, thread-3]
    notes: brief description
```

---

## Integration Map

> **How this project connects to other projects.** Every non-trivial project touches other systems. This section makes those connections explicit so you don't accidentally break a downstream consumer or miss an upstream change.
>
> Direction: `→` = this project feeds into, `←` = this project consumes from, `↔` = bidirectional dependency.

| Connection | Direction | What flows | Status |
|---|---|---|---|
| {{other project name}} | → / ← / ↔ | {{what crosses the boundary — data, API calls, shared files, imports}} | active / planned / deprecated |

<details>
<summary><b>Worked example</b> (click to expand)</summary>

| Connection | Direction | What flows | Status |
|---|---|---|---|
| Ender OS | → | Engine imported as `require('silent-encryption-engine')`. Every signal encrypted by default. | active |
| Three-Channel Cipher | ← | `three-channel.js` depends on `codec.js` seal/unseal for content layer | active |
| Anamorphic Papers (IACR) | ← | Research findings feed into Findings section; implementations feed into capabilities | active |
| Publication Pipeline | → | Test counts, capability counts, and paper numbers cited in founding paper draft | active |
| Band-CUSUM | ↔ | Band-CUSUM could use encrypted counters; engine could use Band-CUSUM for ciphertext health | planned |

</details>

---

## World — operating environment

- **Where it runs:** OS, hardware, network constraints
- **What it touches:** external systems, APIs, databases, file paths, ports
- **Daily life:** what ordinary operation looks like — a normal day for this system
- **Power structure:** what controls what — orchestration, scheduling, who launches whom
- **Genre-specific:** language / runtime / deploy specifics, version constraints

---

## Style / voice

> How the project *talks* — in logs, in its UI, in its docs, in its error messages.
>
> **Skip this section** if your project doesn't have a voice (most tooling projects don't). The Influences sub-section is the one to keep regardless.

- **Adjectives:** 3-5 words describing the project's voice
- **Patterns:** sentence shapes, log formats, naming conventions
- **Anti-patterns:** what NOT to do — things the project has tried and rejected
- **Influences:** prior art, libraries, projects, or people whose approach shaped this

---

## Key Findings

> **Empirical results and theoretical discoveries that shape design decisions.** Not derivable from code. Not in commits. Not in test output. These are things you *learned* — from literature, from experiments, from incidents — that changed what you build or how you build it. A future reader should understand WHY the project is shaped this way, not just WHAT it does.
>
> Number findings sequentially. Never delete — if a finding is later disproved, mark it as such and cross-reference the kill. Each finding should name its source (paper, experiment, incident, observation).

### {{Domain or topic grouping}} (optional)

**Finding 1: {{One-line statement of what was discovered.}}**
Source: {{paper, experiment number, incident date, observation}}
{{2-4 sentences explaining the finding and its implications for the project. What does this mean for what we build or don't build?}}

**Finding 2: {{...}}**
Source: {{...}}
{{...}}

<details>
<summary><b>Worked example</b> (click to expand)</summary>

### Anamorphic Encryption (Papers 868-876, 17 IACR papers read)

**Finding 1: FROST/MuSig2/Sparkle/TRaccoon cannot support anamorphic sending.**
Source: Chu, Do, Hanzlik, Thyagarajan (IACR 2025/1044, Theorem 6).
The signature-preserving property of these threshold schemes makes the final signature unpredictable to honest signers. This is a fundamental impossibility — not a construction gap. We will never build anamorphic sending for these schemes.

**Finding 10: Basic randomness replacement (RRep) is broken under active dictator and active recipient.**
Source: Jaeger & Stracovsky (Asiacrypt 2024, IACR 2025/2123).
Two attacks: dictator forgeability and recipient forgeability. Fix: RRep* — bind public message into PRF/AEAD. Implemented in hardened-anamorphic-sigs.js (Paper 874).

</details>

---

## Experiments / Responses

> **Structured build and experiment results.** Each entry follows the same template so you can scan the project's empirical history at a glance. This is the lab notebook — what you tried, what happened, what it spawned.
>
> Update after every significant build or experiment. The template forces you to name sparks and nags, which feeds those sections below.

### Response Template
```
#### [Title]
**Date:** YYYY-MM-DD
**Result:** CONFIRMED | FALSIFIED | PARTIAL | NEW FINDING
**What changed:** (what was built, what was fixed, what was learned)
**Sparks fired:** (new ideas or capabilities identified — add to Sparks section)
**Nags raised:** (new concerns, risks, or limitations — add to Nags section)
**Kills:** (things proved wrong — add to Kills section)
```

#### {{Title of first response}}
**Date:** YYYY-MM-DD
**Result:** {{CONFIRMED | FALSIFIED | PARTIAL | NEW FINDING}}
**What changed:**
- {{bullet points: what was built, fixed, or learned}}
**Sparks fired:** {{ideas this work surfaced for future builds}}
**Nags raised:** {{concerns, risks, or honest limitations discovered}}
**Kills:** {{anything proved wrong about prior claims — or "None"}}

<details>
<summary><b>Worked example</b> (click to expand)</summary>

#### Silent Handshake Built — Paper 797
**Date:** 2026-04-29
**Result:** CONFIRMED (protocol works) + PARTIAL CORRECTION (observer detection numbers)
**What changed:**
- `silent-handshake.js` (416 lines) built and integrated. Zero npm deps.
- Differential encoding added (not in Paper 796 spec). Each bit encoded as +delta/-delta pair.
- 10/10 tests pass: knock detection, bit encoding, full handshake key agreement.
- Paper 796 §4.3 observer detection corrected: claimed 35% at δ=σ, actual ~97%.
**Sparks fired:** Three-channel unification now unblocked (all three layers built individually).
**Nags raised:** Observer detection at δ=σ is worse than claimed. Use δ=0.5σ (stealth mode).
**Kills:** The 35% observer detection number from Paper 796.

</details>

---

## Sparks

> **Ideas and future capabilities identified while building.** These emerge during work — while reading papers, fixing bugs, running experiments. They're not tasks (those go in `assignments/`). They're possibilities that deserve tracking so they don't get lost.
>
> Track priority. Strike through when built. Leave the completed entries — they're part of the project's story.

| Spark | Priority |
|---|---|
| {{description of idea or capability}} | HIGH / MEDIUM / LOW / FUTURE |
| ~~{{completed spark}}~~ — **DONE.** {{brief note on what was built}} | ~~PRIORITY~~ COMPLETE |

<details>
<summary><b>Worked example</b> (click to expand)</summary>

| Spark | Priority |
|---|---|
| ~~Silent handshake implementation~~ — **DONE.** Paper 797. `silent-handshake.js`, 10/10 tests. | ~~HIGH~~ COMPLETE |
| ~~Three-channel unification~~ — **DONE.** Paper 805. `three-channel.js`, 28/28 tests. | ~~HIGH~~ COMPLETE |
| Encrypted range proofs — prove a balance is non-negative without revealing it. Requires Bulletproofs or similar ZKP. | FUTURE |
| Multi-party computation (MPC) — general MPC beyond threshold decrypt. Garbled circuits or secret sharing. | FUTURE |
| Distinction on ciphertext as a product feature — "encrypted health monitoring" | MEDIUM |

</details>

---

## Nags

> **Known gaps, risks, overclaims, and honest limitations.** Every project has them. Listing them here means you can't pretend they don't exist, and future readers know what to watch for. Type-tag each one so you can filter by severity.
>
> **Types:** `CRITICAL gap` (could cause real damage), `overclaim risk` (saying more than is true), `untested` (no experiment yet), `mathematical fact` (inherent limitation, not fixable), `lesson learned` (already burned us), `gap (reduced)` (partially addressed).
>
> Strike through and mark RESOLVED when addressed. Leave the resolved entries.

| Nag | Type |
|---|---|
| {{description of the gap, risk, or limitation}} | {{type}} |
| ~~{{resolved nag}}~~ — **RESOLVED:** {{how it was fixed}} | ~~type~~ RESOLVED |

<details>
<summary><b>Worked example</b> (click to expand)</summary>

| Nag | Type |
|---|---|
| chp6 seed is ONE file. Loss = catastrophic. No backup protocol documented. | CRITICAL gap |
| 6 sealed papers still unreadable. The encryption works TOO well. | lesson learned |
| No formal reduction proof — AES/Blowfish/ChaCha20 don't have one either. 136 tests, Blowfish precedent. Becomes mandatory for FHE. | LOW gap (white-box) / HIGH gap (future FHE) |
| Paillier IND-CPA invalidates fraud detection on ciphertexts. Distributions are uniform regardless of plaintext. | mathematical fact |
| ~~"10,000x faster than FHE"~~ — **RESOLVED:** clarified white-box vs FHE distinction (Paper 804). | ~~overclaim risk~~ RESOLVED |
| ~~Algebraic ARX and related-key attacks~~ — **RESOLVED:** 19 tests across 8 categories (Paper 803). | ~~untested~~ RESOLVED |

</details>

---

## Kills

> **Things you proved WRONG about your own project.** Different from Nags (open concerns) and Honest Accounting (corrections to claims). Kills are experiments or analysis that FALSIFIED a hypothesis you held. This is your most powerful credibility tool — if you test your own claims and publish what fails, the surviving claims carry real weight.
>
> Each kill: what was claimed, when it was killed, how it was killed, and what replaced it (if anything).

### Kill 1: {{one-line description of what was proved wrong}}
- **Original claim (YYYY-MM-DD):** "{{what you originally believed or stated}}"
- **Killed by:** {{experiment, paper, analysis, incident — be specific}}
- **What's actually true:** {{the corrected understanding}}
- **Impact:** {{what changed in the project as a result — code removed, approach changed, claim narrowed}}

<details>
<summary><b>Worked example</b> (click to expand)</summary>

### Kill 1: Observer detection claimed at 35% — actual is ~97%
- **Original claim (2026-04-28):** "Paper 796 §4.3: observer detects timing channel only 35% of the time at δ=σ"
- **Killed by:** Building the actual handshake (Paper 797). Empirical measurement showed variance doubles when timing channel is active → F-test has near-perfect power.
- **What's actually true:** Observer detection is ~97% at δ=σ. At stealth mode δ=0.5σ with finite-sample baseline: ~40%.
- **Impact:** Operational recommendation changed to δ=0.5σ default. Duration doubles but stealth is real.

### Kill 2: Dual-stream claimed as compression — it's a privacy primitive
- **Original claim (2026-04-19):** "Compress + encrypt in one operation — output is SMALLER"
- **Killed by:** Paper 804 measurement. Ratio is fixed at 0.889x (12.5% expansion, not compression).
- **What's actually true:** Dual-stream is a privacy primitive that splits signal from absence. The "compression" framing was wrong.
- **Impact:** All marketing language corrected. bible.md, package.json description, README updated.

</details>

---

## Known drift — bible vs reality

> When the bible says one thing and the code says another. Each entry: what the bible claims, what's actually true, where the conflict lives, when noticed.

```yaml
drift:
  - claimed: {{what the bible/glossary says is true}}
    actually: {{what's actually true}}
    where: {{file or system where the conflict is}}
    noticed: YYYY-MM-DD
    status: open  # open | reconciled | accepted-as-aspirational
```

---

## Honest Accounting

> **A correction log.** Not a changelog (what shipped) — a correction log (what was CLAIMED and later narrowed/disproved/corrected). Future-you reads this before the rest of the bible so past-you's overclaims don't seduce them.
>
> **The Paper 467 pattern:** After Papers 459-466 claimed a "novel computational model," Paper 467 honestly admitted "we rediscovered 30-year-old heuristics and gave them a unified vocabulary." That correction is more valuable than any of the 8 papers that preceded it.

### Corrections

(none yet — the first real correction triggers the first entry)

<!--
Example entry format:

- **Claim (YYYY-MM-DD):** "(what we originally said)"
- **Correction (YYYY-MM-DD):** "(what's actually true, narrower)"
- **Why it narrowed:** (experiment, realization, outside feedback)
- **Still load-bearing?:** (what part of the original claim still holds)
-->

### Claim confidence tracking

Optional: for claims under active validation, track confidence over time.

```yaml
tracked_claims:
  - claim: "..."
    history:
      - date: YYYY-MM-DD
        confidence: 0.XX
        reason: "..."
    current_shape: UNKNOWN  # classified by claim-trajectory channel
    action: MONITOR  # TRUST | TEST | STOP | WRITE_META_PAPER | ARCHIVE
```

---

## Open questions / unresolved

> Conceptual gaps — things you don't know yet about the *project itself*. Different from `assignments/` (which are tasks). These are questions that, when answered, would change the bible.

- [ ] question
- [ ] question

---

## Adapter outputs

> Derived docs that should regenerate from this bible (manually or via prompt). The bible is the source of truth; these are surfaces.
>
> **Optional section** — most projects don't need it. Delete if you're not actually generating derived docs.

- **Onboarding doc** — for a new contributor
- **Status briefing** — for council / standup / weekly review
- **Troubleshooting guide** — common failure modes and fixes
- **Pitch / one-pager** — for outside readers
- (Add others as needed)
