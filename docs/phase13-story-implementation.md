# DEAD SIGNAL — Phase 13 Story Implementation

Date: 2026-09-11

## Status

**STEP 13.3 COMPLETE — SOURCE-BACKED EXECUTION GATE ESTABLISHED**

Phase 13 begins after Phase 12 has been locked. The purpose of this phase is to turn the locked DEAD SIGNAL story/design outputs from Phases 1–8 into concrete game content while preserving the locked runtime contracts established by Phases 9–12.

## Cross-phase verification baseline

Before continuing story implementation, the project was re-audited across Phases 1–12 using the four exported conversation histories as the directly readable historical source chain, together with repository implementation history and lock artifacts.

Audit artifact:

`docs/phase01-12-cross-phase-audit.md`

The cross-phase audit establishes:

- Phase 1–8 lock status is verified from exported project history.
- Phase 8 is the locked technical quest source of truth for Q01–Q16.
- Phase 9 and Phase 10 locks are directly auditable from exported history and repository implementation.
- Phase 11 runtime implementation is supported by exported history and Git history.
- Phase 12 is verified and locked, including production-bootstrap isolation.
- Detailed source gaps are tracked separately from phase lock status.
- No earlier story canon is reconstructed from runtime behavior.
- Existing Phase 9–12 contracts remain locked while Phase 13 consumes recovered story content.

This audit does **not** reopen or rewrite any previously locked project decision.

## Implementation boundary

Phase 13 must consume the locked story/design decisions from Phases 1–8 as the source of truth. It must not silently rewrite story canon, quest dependencies, character relationships, global-state semantics, dialogue flow, gameplay interactions, economy/progression rules, or ending logic that were previously locked.

The technical baseline consumed by Phase 13 is the locked runtime architecture and the Phase 12 in-game integration baseline.

## Locked Phase 13 workflow

The existing Phase Implementation Design workflow remains unchanged. Phase 13 implementation must proceed from the locked design outputs in their established order:

1. Full Story Audit Q01–Q16
2. Quest Dependency Map
3. Character & Relationship Matrix
4. Global State / Flag System
5. Dialogue Flow
6. Gameplay / Hack Interaction Design
7. Economy & Progression
8. Complete implementation design output from the locked Phase 1–8 workflow

No new workflow may replace this sequence without an explicit roadmap change.

## Step 13.1 — Story Source & Repository Audit

Before implementing gameplay content, establish the exact set of locked Phase 1–8 story/design artifacts available to the implementation. Verify:

- the canonical story questions and answers Q01–Q16;
- quest identities, dependencies, and progression order;
- character and relationship definitions relevant to implemented content;
- canonical flags/state transitions used by story logic;
- dialogue nodes and branching requirements;
- gameplay/hacking interactions required by each quest;
- economy/reward expectations;
- ending prerequisites and story-to-runtime mappings.

The audit must distinguish source-backed canon from implementation inference. Missing source material must be surfaced rather than reconstructed silently.

Artifact:

`docs/phase13-step13.1-story-source-audit.md`

Status: **COMPLETE — SOURCE INVENTORY ESTABLISHED WITH PARTIAL COVERAGE**

## Step 13.2 — Quest Implementation Mapping

Step 13.2 maps the recovered locked story content onto the canonical runtime contracts before executable quest wiring is introduced.

Artifact:

`docs/phase13-step13.2-quest-implementation-map.md`

Current recovered implementation coverage:

```text
Q14 — THE OWNER       mapped
Q15 — THE EVIDENCE    mapped
Q01–Q13               SOURCE DETAIL GAP
Q16                   SOURCE DETAIL GAP
```

The mapping preserves the following ownership boundaries:

```text
Story condition     → ConditionNode / ConditionEvaluator
Story flag          → FlagStore / StateStore
Quest lifecycle     → QuestService / QuestState
Narrative/dialogue  → NarrativeStateService
Evidence            → Evidence / EvidenceState
Capabilities        → AccessService / AccessState
XP rewards          → RewardService
Cash rewards        → EconomyService
Ending state        → EndingService / EndingState
HackHub behavior    → infrastructure adapters
```

Q14 and Q15 source-backed state keys are recorded exactly. Explicit negative/not-created states are also recorded and must not be asserted accidentally.

The remaining execution gaps are explicit rather than inferred:

- Q14 Objective 03 has no exact dedicated completion state named by the locked story artifact.
- Q14 Objective 06 has no exact dedicated completion state named by the locked story artifact.
- Q15 Objective 04 has no exact dedicated completion state named by the locked story artifact.
- Exact runtime dialogue IDs for Q14/Q15 are not defined by the recovered locked sources.
- Detailed quest sources for Q01–Q13 and Q16 are not currently reproduced in the readable source set.

Therefore Step 13.2 does **not** introduce placeholder canon, invented flags, or guessed HackHub event dependencies merely to make every quest compile.

Status: **COMPLETE FOR RECOVERED CONTENT — EXECUTION BLOCKED ONLY WHERE SOURCE OR RUNTIME CONTRACT IS INSUFFICIENT**

## Step 13.3 — Source-Backed Executable Slice Validation

Step 13.3 validates the smallest safe implementation slice from the recovered Q14 source before any production quest registration is introduced.

The slice uses only source-backed Q14 state boundaries:

```text
Q14 Objective 01 → dead_signal.q14.override_access_registry_found
Q14 Objective 02 → dead_signal.q14.override_session_found
Q14 Objective 04 → dead_signal.q14.marcus_reed_confirmed
Q14 Objective 05 → dead_signal.marcus_introduced
                    + dead_signal.marcus_authority_confirmed
Q14 Objective 07 → dead_signal.q14.exception_access_found
```

The unresolved Q14 objectives remain explicit blocking boundaries:

```text
Q14 Objective 03 → unresolved completion state
Q14 Objective 06 → unresolved completion state
```

A test-only fixture was added:

`tests/phase13-step13.3-q14-source-backed-slice.test.ts`

The fixture verifies:

- direct Q14 objective conditions use canonical `ConditionNode` constructors;
- completion is evaluated through `ConditionEvaluator` and `QuestService`;
- unresolved objectives remain blocking rather than being guessed;
- negative Marcus/operator states remain absent;
- no production bootstrap registration is introduced.

This is a validation fixture, not a second story engine and not a new canonical state owner.

Artifact:

`docs/phase13-step13.3-source-backed-executable-slice.md`

Status: **COMPLETE — SAFE TO PROCEED TO THE NEXT IMPLEMENTATION STEP**

## Implementation direction after Step 13.3

```text
Recovered locked story
          ↓
Step 13.1 source audit
          ↓
Step 13.2 implementation mapping
          ↓
Step 13.3 source-backed executable slice
          ↓
Close remaining content/runtime contract gaps
          ↓
Canonical production quest registration
          ↓
HackHub adapter integration
          ↓
Focused in-game validation
          ↓
Phase 13 regression
          ↓
Phase 14 full integration / release audit
```

## Phase 13 guardrails

- Do not bypass `StateStore` as the canonical root state owner.
- Do not introduce a second condition representation outside `ConditionNode`.
- Do not move capability ownership out of `AccessService`.
- Do not move ending ownership out of `EndingService` / `EndingState`.
- Do not make Save/Load replay gameplay events.
- Do not reintroduce Phase 12 diagnostic execution into production bootstrap.
- Do not use undocumented HackHub event behavior as a required story dependency when a validated SDK boundary exists.
- Do not fabricate missing Phase 1–8 story artifacts.
- Test-only story fixtures must not become production content by accident.
- Semantic changes to locked contracts require explicit change-control.

## Phase 14 handoff

Phase 14 is reserved for full end-to-end integration, release validation, regression, and final production audit after the story implementation is complete.
