# DEAD SIGNAL — Phase 13 Story Implementation

Date: 2026-09-11
Status: **SEQUENTIAL CAMPAIGN EXECUTION LOCKED — CURRENT TARGET Q01**

## Purpose

Phase 13 turns the locked DEAD SIGNAL story/design outputs from Phases 1–8 into concrete game content while preserving the locked runtime contracts established by Phases 9–12.

The execution strategy is now explicitly sequential: **Q01 → Q16**, with live HackHub validation as the gate between quests.

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

Steps 13.1–13.6 previously explored Q14 as an early executable slice. That exploration remains preserved in Git history and documentation for auditability, but it is no longer the active execution path.

Q14 was implemented before Q01–Q13 existed in production, which made it impossible to validate through the real campaign dependency chain. The sequential lock therefore supersedes that execution strategy.

The previous Q14 production implementation has been removed from the current production source tree. It can be recovered from Git history when the campaign reaches Q14 in sequence.

Historical Phase 13 artifacts remain available for provenance:

- `docs/phase13-step13.1-story-source-audit.md`
- `docs/phase13-step13.2-quest-implementation-map.md`
- `docs/phase13-step13.2-amendment.md`
- `docs/phase13-step13.3-source-backed-executable-slice.md`
- `docs/phase13-step13.4-contract-gap-closure.md`
- `docs/phase13-step13.5-production-hackhub-integration.md`
- `docs/phase13-step13.6-q14-focused-ingame-validation.md`
- `docs/phase13-step13.6-sequencing-amendment.md`
- `docs/phase13-step13.6-validation-blocker-q13.md`

These documents are historical records, not current implementation instructions.

## Step 13.1 — Story Source & Repository Audit

Artifact:

`docs/phase13-step13.1-story-source-audit.md`

Status: **COMPLETE**

The step established the recoverable locked story/source inventory and distinguished canonical source facts from implementation inference.

## Step 13.2 — Quest Implementation Mapping

Artifact:

`docs/phase13-step13.2-quest-implementation-map.md`

Status: **COMPLETE FOR RECOVERED CONTENT**

The step mapped recovered story content to the canonical runtime ownership boundaries. Its Q14-first execution recommendation is now superseded by the sequential campaign lock.

## Current Implementation Target — Q01

```text
Q01 — THE CONTRACT
```

Verified Phase 8 XP contract:

```text
Complete external audit         35 XP
Network/service enumeration     20 XP
Basic vulnerability assessment  10 XP
Submit correct report           15 XP
Maximum                         80 XP
Optional XP                      0 XP
```

Source evidence establishes these XP components and the Q01 title, but the complete Q01 objective/event/state/dialogue/technical-interaction specification is not currently represented in the readable repository or recovered source artifacts. It must be recovered before creating executable production semantics.

Therefore **Q01 is the current target, but implementation must not invent missing behavior**.

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
