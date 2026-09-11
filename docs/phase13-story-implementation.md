# DEAD SIGNAL — Phase 13 Story Implementation

Date: 2026-09-11

## Status

**STEP 13.4 COMPLETE — Q14 DOMAIN CONTENT CONTRACT CLOSED**

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

Step 13.2 maps recovered locked story content onto the canonical runtime contracts before executable quest wiring is introduced.

Artifact:

`docs/phase13-step13.2-quest-implementation-map.md`

Current recovered implementation coverage at Step 13.2:

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

Step 13.2 originally tracked three source-to-runtime gaps in Q14/Q15. Those findings were subsequently re-audited against the complete locked Q14/Q15 artifacts during Step 13.4.

Status: **COMPLETE FOR RECOVERED CONTENT**

## Step 13.3 — Source-Backed Executable Slice Validation

Step 13.3 validated the smallest safe implementation slice from the recovered Q14 source before production content wiring.

Artifact:

`docs/phase13-step13.3-source-backed-executable-slice.md`

Test fixture:

`tests/phase13-step13.3-q14-source-backed-slice.test.ts`

The fixture established the source-backed boundary and protected the negative Marcus/operator states.

Status: **COMPLETE — SOURCE-BACKED EXECUTION GATE ESTABLISHED**

## Step 13.4 — Contract Gap Closure

Step 13.4 re-audited the Q14 objective mappings against the complete locked Q14 artifact and the locked Phase 9 objective semantics.

Artifact:

`docs/phase13-step13.4-contract-gap-closure.md`

### Q14 corrections

The previously reported Q14 Objective 03 gap is closed by:

```text
Q14 Objective 03 — FIND THE AUTHORIZATION
    ↓
dead_signal.q14.marcus_access_approval_confirmed == true
```

The source explicitly records `AR-44192`, its approved status, the approver `M.REED`, and its link to `A-77402`. fileciteturn200file0L16-L41

The previously reported Q14 Objective 06 gap is closed by:

```text
Q14 Objective 06 — ASK ABOUT THE SESSION
    ↓
dead_signal.q14.operator_identity_unknown == true
```

The source explicitly records that Marcus did not use the session and that the identity was delegated. fileciteturn200file1L107-L117

Q14 Objective 07 is an optional investigation and grants optional +20 XP; it therefore must not block quest completion. fileciteturn202file0L34-L56

### Runtime correction

`QuestObjective` now supports:

```ts
readonly optional?: boolean;
```

When omitted, the objective remains required. `QuestService.areObjectivesComplete()` ignores objectives explicitly marked optional while continuing to require every non-optional objective.

This implements the optional-investigation semantics already present in the locked quest design rather than introducing a new story rule. Phase 9 explicitly includes `SKIPPED` among objective statuses and Phase 8 distinguishes optional investigations from required objectives. fileciteturn210file0L106-L133 fileciteturn209file8L849-L878

### Q14 content definition

A reusable source-backed domain definition now exists at:

`src/content/q14.ts`

It contains all seven Q14 objectives, uses only canonical `ConditionNode` constructors, uses only source-backed flags, and marks Objective 07 as optional.

It is **not yet registered directly with HackHub**. This keeps SDK transport concerns separate from the domain story contract and preserves the Phase 12 production-bootstrap boundary.

### Q15 remaining gap

Q15 Objective 04 — `RECONSTRUCT THE SESSION` remains explicitly unresolved at the dedicated state-key level.

The source provides the action timeline, but the persistent state only names `dead_signal.q15.operator_session_found`, which already represents Objective 02. Reusing that same state for Objective 04 would collapse two distinct source objectives into one completion boundary. The timeline is therefore retained as source-backed content until an exact canonical completion boundary is established.

Source timeline:

```text
LOGIN
OPEN relationship-policy
VIEW policy version
CONFIGURATION_OVERRIDE
SAVE
VALIDATE
RELOAD
OPEN COM-07 configuration
VIEW resolver configuration
LOGOUT
```

fileciteturn200file2L145-L158

## Implementation direction after Step 13.4

```text
Recovered locked story
          ↓
Step 13.1 source audit
          ↓
Step 13.2 implementation mapping
          ↓
Step 13.3 source-backed execution gate
          ↓
Step 13.4 Q14 contract gap closure      ✅
          ↓
Q14 HackHub production registration
          ↓
Q14 focused in-game validation
          ↓
Q15 contract closure / next source-backed slice
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
- Optional objectives must not silently become required objectives.

## Phase 14 handoff

Phase 14 is reserved for full end-to-end integration, release validation, regression, and final production audit after the story implementation is complete.
