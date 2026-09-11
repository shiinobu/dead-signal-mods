# DEAD SIGNAL — Phase 13 Story Implementation

Date: 2026-09-11
Status: **SEQUENTIAL CAMPAIGN EXECUTION LOCKED — Q01 IMPLEMENTED, LIVE VALIDATION PENDING**

## Purpose

Phase 13 turns the locked DEAD SIGNAL story/design outputs from Phases 1–8 into concrete game content while preserving the locked runtime contracts established by Phases 9–12.

The execution strategy is explicitly sequential: **Q01 → Q16**, with live HackHub validation as the gate between quests.

## Cross-phase verification baseline

Before story implementation, the project was re-audited across Phases 1–12 using the exported conversation histories as historical source evidence, together with repository implementation history and lock artifacts.

Audit artifact:

`docs/phase01-12-cross-phase-audit.md`

The audit establishes:

- Phase 1–8 lock status is verified from exported project history.
- Phase 8 is the locked technical quest source of truth for Q01–Q16.
- Phase 9 and Phase 10 locks are directly auditable from exported history and repository implementation.
- Phase 11 runtime implementation is supported by exported history and Git history.
- Phase 12 is verified and locked, including production-bootstrap isolation.
- Detailed source gaps are tracked separately from phase lock status.
- No earlier story canon is reconstructed from runtime behavior.
- Existing Phase 9–12 contracts remain locked while Phase 13 consumes recovered story content.

This audit does not reopen or rewrite any previously locked project decision.

## Implementation Design Workflow — LOCKED

The original Phase Implementation Design workflow remains unchanged:

1. Full Story Audit Q01–Q16
2. Quest Dependency Map
3. Character & Relationship Matrix
4. Global State / Flag System
5. Dialogue Flow
6. Gameplay / Hack Interaction Design
7. Economy & Progression
8. Complete implementation design output

This design sequence is not replaced by the sequential execution strategy below.

## Phase 13 Execution Strategy — LOCKED

The implementation campaign proceeds strictly in canonical quest order:

```text
Q01 → Q02 → Q03 → Q04 → Q05 → Q06 → Q07 → Q08
→ Q09 → Q10 → Q11 → Q12 → Q13 → Q14 → Q15 → Q16
```

For each quest, implementation follows the same gate:

```text
Source validation
      ↓
Implementation mapping
      ↓
Domain/content implementation
      ↓
Automated tests
      ↓
Typecheck
      ↓
Build
      ↓
HackHub package install
      ↓
Live in-game validation
      ↓
Persistence/reload validation where applicable
      ↓
Record PASS
      ↓
Lock quest
      ↓
Advance to next quest
```

A failed validation blocks the next quest. No downstream quest is used to hide or bypass a missing upstream dependency.

Formal lock:

`docs/phase13-sequential-campaign-lock.md`

## Phase 13 Guardrails

The following remain mandatory:

- Phase 1–8 story/design remains canonical.
- Phase 8 remains immutable unless explicit change-control is requested.
- Phase 9–12 architecture and semantics remain locked.
- Q01–Q16 use common SDK/runtime services; no Q-specific engine is introduced.
- StateStore remains the canonical root state owner.
- FlagStore remains the typed facade over `StateStore.flags`.
- ConditionNode remains the single canonical condition representation.
- Access/capability ownership remains in AccessService.
- Ending ownership remains in EndingService / EndingState.
- Production adapters do not become canonical state owners.
- Save/load does not replay gameplay events.
- Optional objectives do not silently become required objectives.
- Missing story detail is surfaced as a source gate; it is never invented.

## Previous Phase 13 Work — Historical / Superseded as Active Path

Q14 was previously implemented as an early downstream slice during Phase 13 exploration. That work is preserved in Git history and historical documentation, but it is not the active execution path. Q14 must not be reintroduced into production before the campaign reaches it in sequence.

## Step 13.1 — Story Source & Repository Audit

Artifact:

`docs/phase13-step13.1-story-source-audit.md`

Status: **COMPLETE**

## Step 13.2 — Quest Implementation Mapping

Artifact:

`docs/phase13-step13.2-quest-implementation-map.md`

Status: **COMPLETE FOR RECOVERED CONTENT**

The earlier Q14-first execution recommendation is superseded by the sequential campaign lock.

## Q01 — THE CONTRACT

Implementation artifact:

`docs/phase13-q01-implementation.md`

Source gate artifact:

`docs/phase13-q01-source-gate.md`

Implementation status:

**IMPLEMENTED — LIVE VALIDATION PENDING**

Recovered source and Phase 8 establish:

```text
ID:            dead_signal.q01
Title:         THE CONTRACT
Chapter:       01 — DEAD SIGNAL
Location:      Jakarta
Primary:       Adrian Cole
Prerequisite:  none
Target:        203.0.113.42
State:         dead_signal.q01.completed = true
Money:         $200
Maximum XP:    80
```

Player-facing objectives:

```text
01  Review audit scope
02  Scan 203.0.113.42
03  Identify exposed services
04  Perform basic vulnerability checks
05  Submit audit report
```

Expected Nmap result:

```text
22/tcp  OPEN  ssh
80/tcp  OPEN  http
443/tcp OPEN  https
```

Implementation files:

```text
src/content/q01.ts
src/content/index.ts
src/infrastructure/hackhub/q01-quest.ts
src/index.ts
manifest.json
```

The implementation uses `Terminal.Command` plus `Shell.addCommandData("nmap", ...)`, consistent with the validated Phase 12 terminal integration boundary. It does not depend on direct `Terminal.NmapScan` handling.

The canonical persistent story state is limited to the recovered `dead_signal.q01.completed` flag. Player-facing objective state remains in HackHub's quest state.

The locked Phase 8 XP allocation is dispatched through the canonical reward ownership chain as 35 + 20 + 10 + 15 = 80 XP, and the money reward is dispatched through `EconomyService` as `$200`.

The implementation has not been declared live-validated or production-locked yet.

## Q02–Q16

Not active. No downstream quest may be implemented or registered into the production campaign until Q01 passes its live validation gate.

## Phase 13 Completion Condition

Phase 13 is complete only when the real campaign has passed live validation in order:

```text
Q01 PASS
 ↓
Q02 PASS
 ↓
...
 ↓
Q16 PASS
 ↓
Full Campaign Live Validation PASS
```

Only after that does the project proceed to Phase 14 full integration/release audit.
