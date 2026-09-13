# ENTITY RESOLUTION — Phase 13 Step 13.5

## Production HackHub Integration — Q14

Date: 2026-09-11

## Status

**IMPLEMENTATION COMPLETE — IN-GAME VALIDATION PENDING**

Step 13.5 moves the source-backed Q14 domain content into the production HackHub registration path while preserving the locked Phase 9–12 ownership boundaries.

## Source and contract basis

Q14 — THE OWNER is locked and establishes the following facts:

- `OVERRIDE_OPERATOR` is a delegated/shared privileged identity.
- `AR-44192` authorizes privileged access and is linked to `A-77402`.
- `M.REED` / Marcus Reed is the approver, not the physical operator.
- The operator identity remains unknown at the end of Q14.
- Q14 persistent state includes the access-registry, access-window, authorization, Marcus, unknown-operator, and primary-audit requirements.
- Q14 base XP is 130 with an optional investigation component; the Phase 8 final XP matrix is authoritative and fixes the optional component at +10 for a 140 XP maximum.

The Phase 9 implementation plan requires data-driven quest content, scoped event listeners, generic objectives, deterministic state, and no quest-specific engine. Phase 10 preserves the same ownership model and freezes Phase 8 quest semantics.

## Production registration

The production adapter is:

```text
src/infrastructure/hackhub/q14-quest.ts
```

It uses the HackHub SDK:

```ts
@RegisterQuest
export class EntityResolutionQ14Quest extends HackHubQuest<Q14QuestData>
```

Registration is imported by the production bootstrap:

```text
src/index.ts
    ↓
src/infrastructure/hackhub/q14-quest.ts
```

Diagnostic Phase 12 smoke/regression artifacts remain separate and are not imported by the production bootstrap.

## Quest identity and dependency

```text
Name:          entity_resolution.q14
Title:         THE OWNER
Group:         storyline
AutoStart:     false
AutoComplete:  true
Prerequisite:  entity_resolution.q13
```

The `entity_resolution.q13` prerequisite is intentionally retained because Q13 → Q14 is part of the locked campaign dependency chain. Q13 production content is not implemented in this step, so Q14 is registered but not independently force-started outside its canonical dependency.

## Q14 production objectives

The required HackHub objective chain is:

```text
01 Find the access registry
        ↓
02 Trace the access window
        ↓
03 Find the authorization
        ↓
04 Resolve the approver
        ↓
05 Speak to Marcus / authority context
        ↓
06 Ask about the session
```

The optional source objective:

```text
07 Check the access justification
```

is intentionally handled as an optional side investigation rather than a required HackHub objective because the current HackHub objective-definition contract has no canonical `optional` field. The internal ENTITY RESOLUTION domain model already represents the objective as optional, and `QuestService` excludes optional objectives from the completion barrier.

This preserves the source rule that optional investigation must never block Q14 completion.

## HackHub interaction mapping

Q14 uses the built-in file interaction path:

```text
Files.create / Files.write
        ↓
Files.Open
        ↓
Q14 adapter
        ↓
source-backed flag mutation
        ↓
HackHub objective completion
```

The adapter creates a namespaced in-game file tree:

```text
/exports/operations/entity-resolution/q14/
├── authorizations/
│   ├── access-registry.txt
│   ├── AR-44192.txt
│   └── AR-44192-justification.txt
├── sessions/
│   └── A-77402.session
└── identity/
    └── M-REED.txt
```

The file contents reproduce only facts explicitly present in the locked Q14 source artifact. They are not used as a second canonical state store; the files are gameplay-facing presentation/interaction data.

## Event handling

Event listeners are attached in:

```text
OnObjectivesStart()
```

rather than `OnStart()`.

This follows the SDK lifecycle boundary established earlier: quest event listeners are runtime-scoped and must be reattached whenever objectives start after load/reload.

The production adapter uses scoped `Files.Open` handling and matches the generated file identity/path before mutating state.

No undocumented terminal event or `Terminal.NmapScan` dependency is introduced.

## State ownership

The production integration follows:

```text
HackHub event
      ↓
Q14 adapter
      ↓
FlagStore
      ↓
StateStore
```

The adapter never becomes a canonical state owner.

The following source-backed Q14 states are written through `FlagStore`:

```text
entity_resolution.q14.override_access_registry_found
entity_resolution.q14.delegated_access_confirmed
entity_resolution.q14.access_window_found
entity_resolution.q14.override_session_found
entity_resolution.q14.marcus_access_approval_confirmed
entity_resolution.q14.marcus_reed_confirmed
entity_resolution.q14.operator_identity_unknown
entity_resolution.q14.exception_access_found
entity_resolution.q14.primary_audit_system_required
entity_resolution.marcus_introduced
entity_resolution.marcus_authority_confirmed
entity_resolution.q14.completed
```

Explicitly forbidden negative states remain untouched.

## Narrative / dialogue integration

The Marcus conversation is implemented through the HackHub quest dialog definition and uses the recovered dialogue wording required for Q14's authority distinction.

Dialogue callbacks update only source-backed flags and complete the appropriate Q14 objective. They do not directly mutate canonical state outside `FlagStore`.

The final dialogue state establishes:

```text
Marcus approved the access
        ≠
Marcus operated the session
```

and leaves:

```text
entity_resolution.q14.operator_identity_unknown = true
```

## Runtime completion

Q14 completion is coordinated through the internal runtime first:

```text
HackHub OnComplete()
        ↓
GameRuntime.quest.complete(Q14_THE_OWNER)
        ↓
StateStore quest completion
        ↓
source-backed q14.completed flag
```

If the canonical internal runtime refuses completion, the adapter throws rather than silently diverging from the ENTITY RESOLUTION state model.

## Rewards

Phase 8 final XP allocation is authoritative:

```text
Base:      130 XP
Optional:   10 XP
Maximum:   140 XP
Cash:        $0
```

The adapter exposes the main 130 XP on the HackHub quest and records progression through the canonical `RewardService`.

The optional +10 XP is claimed through `RewardService` only when the optional access-justification state is actually discovered.

This preserves the rule that optional investigation does not become a prerequisite.

A conflicting `+20 XP` line exists in the standalone Q14 v1.0 artifact. That line is not adopted because Phase 8 explicitly became the immutable technical quest source of truth and its final Q14 allocation is 130 + 10 = 140 XP.

## Persistence

Production runtime persistence uses:

```text
HackHub SaveStorage
        ↓
SaveStorageAdapter
        ↓
SaveLoadService
        ↓
StateStore
```

HackHub SaveStorage is a transport layer only. It does not replace the canonical ENTITY RESOLUTION state owner.

Save/load continues to restore canonical state directly and does not replay gameplay events.

## Permissions

The production manifest now requests:

```json
"permissions": [
  "events",
  "filesystem",
  "shell"
]
```

`filesystem` is required by the Q14 in-game evidence file creation and file interaction path. `shell` remains from the Phase 12 production contract, while `events` remains required for event-driven integration.

## Production bootstrap boundary

`src/index.ts` remains a minimal bootstrap:

```text
Bootstrap
   ↓
load canonical state
   ↓
HackHub registered content
```

It does not run the Phase 12 diagnostic regression harness.

This preserves the Phase 12 production-isolation lock.

## Validation status

Repository/static integration has been completed and the final repository tree contains:

```text
src/content/q14.ts
src/infrastructure/hackhub/runtime.ts
src/infrastructure/hackhub/q14-quest.ts
src/index.ts
manifest.json
```

The production path has not yet been executed in the actual HackHub game in this environment. Therefore the following remain pending external runtime validation:

- Q13 → Q14 dependency visibility in the live quest feed.
- Creation and display of the Q14 evidence files.
- `Files.Open` event payload compatibility in the live build.
- Objective progression 01 → 06.
- Marcus dialog invocation and callback completion.
- Optional Objective 07 reward behavior.
- Q14 final completion and XP application in-game.
- Save/reload persistence of Q14 state.

No claim of live in-game success is made by this step.

## Step 13.5 acceptance criteria

- [x] Q14 is registered through the production HackHub quest path.
- [x] Q14 retains its canonical Q13 prerequisite.
- [x] Required objectives are ordered according to the locked story flow.
- [x] Files/Open interaction is scoped to Q14-generated evidence files.
- [x] Source-backed state is written through `FlagStore`/`StateStore`.
- [x] Q14 completion is reconciled through `QuestService`.
- [x] XP is coordinated through `RewardService` using the Phase 8 allocation.
- [x] Optional investigation does not block completion.
- [x] Production bootstrap excludes diagnostic regression execution.
- [x] No new canonical condition/state owner is introduced.
- [ ] Live HackHub execution validation.

## Disposition

**STEP 13.5 — IMPLEMENTATION COMPLETE; IN-GAME VALIDATION PENDING.**

The next step should validate Q14 end-to-end in the real HackHub runtime and use the result to correct only integration defects, without changing locked story semantics.
