# DEAD SIGNAL — Phase 13 Story Implementation

Date: 2026-09-11

## Status

**STEP 13.2 COMPLETE FOR RECOVERED CONTENT — EXECUTION BLOCKED ONLY BY EXPLICIT SOURCE/RUNTIME GAPS**

Phase 13 begins after Phase 12 has been locked. The purpose of this phase is to turn the locked DEAD SIGNAL story/design outputs from Phases 1–8 into concrete game content while preserving the locked runtime contracts established by Phases 9–12.

## Cross-phase verification baseline

Before continuing story implementation, the project was re-audited across Phases 1–12 against the currently recoverable source artifacts, repository history, and locked runtime/integration documents.

Audit artifact:

`docs/phase01-12-cross-phase-audit.md`

The cross-phase audit establishes:

- Phase 1–8 historical provenance is incomplete in the current environment because the original shared conversations cannot be independently retrieved here.
- Recoverable story artifacts such as the Q01–Q16 flowchart and locked Q14/Q15 specifications remain valid implementation inputs.
- Phase 9–12 runtime architecture and integration contracts are strongly verified by repository implementation/history and the Phase 12 lock.
- No earlier story canon is to be reconstructed from runtime behavior.
- Existing Phase 12 contracts remain locked while Phase 13 consumes recovered story content.

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

## Step 13.2 — Quest Implementation Mapping

Step 13.2 maps the recovered locked story content onto the canonical runtime contracts before executable quest wiring is introduced.

Artifact:

`docs/phase13-step13.2-quest-implementation-map.md`

Current recovered implementation coverage:

```text
Q14 — THE OWNER       mapped
Q15 — THE EVIDENCE    mapped
Q01–Q13               SOURCE-GAP
Q16                   SOURCE-GAP
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
- Detailed quest sources for Q01–Q13 and Q16 are unavailable.

Therefore Step 13.2 does **not** introduce placeholder canon, invented flags, or guessed HackHub event dependencies merely to make every quest compile.

## Implementation direction after Step 13.2

```text
Recovered locked story
          ↓
Step 13.2 implementation map
          ↓
Smallest fully source-backed executable quest slice
          ↓
Canonical StateStore / application services
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

## Phase 14 handoff

Phase 14 is reserved for full end-to-end integration, release validation, regression, and final production audit after the story implementation is complete.
