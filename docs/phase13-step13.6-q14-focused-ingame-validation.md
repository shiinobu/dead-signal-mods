# DEAD SIGNAL — Phase 13 Step 13.6

## Focused In-Game Validation — Q14

Date: 2026-09-11

## Status

**VALIDATION GATE PREPARED — LIVE EXECUTION REQUIRED**

Step 13.6 is the focused runtime validation gate for the production Q14 HackHub adapter introduced in Step 13.5.

This step does not redesign Q14, modify locked story canon, or add new gameplay semantics. It validates the already-implemented production path against the real HackHub runtime.

## Validation source of truth

The validation must preserve:

- Phase 8 locked Q14 story/technical quest specification.
- Phase 9 canonical runtime ownership.
- Phase 10 locked integration invariants.
- Phase 12 production-bootstrap isolation.
- Phase 13 Steps 13.1–13.5 implementation decisions.

Q14 remains:

```text
Q13 completed
   ↓
Q14 — THE OWNER
   ↓
access registry
   ↓
access window / A-77402
   ↓
AR-44192 authorization
   ↓
M.REED / Marcus Reed
   ↓
Marcus authority context
   ↓
operator identity remains unknown
```

## Pre-flight repository validation

Before launching HackHub:

```text
npm install
npm run typecheck
npm test
npm run build
```

Expected repository-side result:

```text
TYPECHECK  PASS
TESTS      PASS
BUILD      PASS
```

The build must produce a fresh `dist/` package containing the current production mod.

Official HackHub documentation requires `npm run build` and installing the contents of `dist/` into `mods/{mod-id}/`. The local folder name must match the manifest `id`.

Reference:
https://docs.hotbunny.dev/hackhub/guides/building.html

## Installation validation

Install the freshly built package into:

```text
HackHub/
└── mods/
    └── dead-signal/
        ├── mod.js
        └── manifest.json
```

Restart HackHub after copying the build.

Verify the mod is shown as enabled/loaded and that there is no startup exception from the DEAD SIGNAL production bootstrap.

## Live validation matrix

### V01 — Production bootstrap

Action:

1. Start/restart HackHub with the freshly built `dead-signal` mod.
2. Observe the developer console/mod status.

Expected:

- DEAD SIGNAL loads successfully.
- No Phase 12 diagnostic PASS notification is emitted from startup.
- No Q14 quest is force-started without its prerequisite.

Failure classification:

```text
BOOT / PRODUCTION-ISOLATION DEFECT
```

### V02 — Q13 → Q14 dependency gate

Precondition:

```text
Q13 completed in the active save.
```

Action:

Open the quest feed/journal and inspect the DEAD SIGNAL storyline.

Expected:

```text
Q14 becomes available only after Q13 is complete.
```

Failure classification:

```text
QUEST DEPENDENCY DEFECT
```

### V03 — Q14 claim and data initialization

Action:

Claim Q14 when it becomes available.

Expected:

- Quest title is `THE OWNER`.
- Quest identity is `dead_signal.q14`.
- Quest group is `storyline`.
- Six required objectives appear in the expected order.
- Q14 evidence files are created in the player filesystem.

Expected file tree:

```text
/exports/operations/dead-signal/q14/
├── authorizations/
│   ├── access-registry.txt
│   ├── AR-44192.txt
│   └── AR-44192-justification.txt
├── sessions/
│   └── A-77402.session
└── identity/
    └── M-REED.txt
```

Failure classification:

```text
QUEST-DATA / FILE-SEEDING DEFECT
```

### V04 — Objective 01

Action:

Open:

```text
/exports/operations/dead-signal/q14/authorizations/access-registry.txt
```

Expected state:

```text
dead_signal.q14.override_access_registry_found = true
dead_signal.q14.delegated_access_confirmed = true
```

Expected gameplay result:

```text
Objective 01 = COMPLETED
Objective 02 = AVAILABLE
```

The event must be accepted through the Q14-scoped `Files.Open` listener.

The SDK's authoritative Event Map lists `Files.Open` with typed `FileOpenEvent` payloads.

Reference:
https://docs.hotbunny.dev/hackhub/reference/event-map.html

### V05 — Objective 02

Action:

Open:

```text
/exports/operations/dead-signal/q14/sessions/A-77402.session
```

Expected state:

```text
dead_signal.q14.access_window_found = true
dead_signal.q14.override_session_found = true
```

Expected gameplay result:

```text
Objective 02 = COMPLETED
Objective 03 = AVAILABLE
```

### V06 — Objective 03

Action:

Open:

```text
/exports/operations/dead-signal/q14/authorizations/AR-44192.txt
```

Expected state:

```text
dead_signal.q14.marcus_access_approval_confirmed = true
```

Expected gameplay result:

```text
Objective 03 = COMPLETED
Objective 04 = AVAILABLE
```

The document must establish:

```text
AR-44192
OVERRIDE_OPERATOR
APPROVED
M.REED
A-77402
```

### V07 — Objective 04 / Marcus discovery

Action:

Open:

```text
/exports/operations/dead-signal/q14/identity/M-REED.txt
```

Expected state:

```text
dead_signal.q14.marcus_reed_confirmed = true
dead_signal.marcus_introduced = true
```

Expected gameplay result:

- Objective 04 completes.
- Marcus dialogue starts.
- Objective 05 remains pending until the dialogue callback runs.

### V08 — Objective 05 / authority distinction

Action:

Complete the Marcus dialogue normally.

Expected state after the authority confirmation callback:

```text
dead_signal.marcus_authority_confirmed = true
```

Expected gameplay result:

```text
Objective 05 = COMPLETED
Objective 06 = AVAILABLE
```

Critical invariant:

```text
Marcus approved the access
        !=
Marcus operated the session
```

The following negative states must remain absent/false:

```text
dead_signal.q14.marcus_operated_account
dead_signal.q14.marcus_created_false_connection
dead_signal.q14.marcus_manipulated_cri
dead_signal.q14.marcus_targeted_rizky
dead_signal.q14.marcus_malicious_intent
dead_signal.q14.operator_person_identified
```

### V09 — Objective 06 / unknown operator boundary

Action:

Finish the final Marcus exchange asking who used the delegated identity/session.

Expected state:

```text
dead_signal.q14.operator_identity_unknown = true
dead_signal.q14.delegated_access_confirmed = true
```

Expected gameplay result:

```text
Objective 06 = COMPLETED
Q14 = COMPLETED
```

Q14 completion must reconcile through the internal `QuestService` rather than bypassing canonical quest state.

### V10 — Optional investigation

Action:

Open:

```text
/exports/operations/dead-signal/q14/authorizations/AR-44192-justification.txt
```

Expected state:

```text
dead_signal.q14.exception_access_found = true
```

Expected reward:

```text
+10 XP optional
```

The optional investigation must not be required for Q14 completion.

Therefore two valid playthrough paths exist:

```text
Path A:
required objectives only
→ Q14 completes
→ 130 XP
```

```text
Path B:
required objectives + optional investigation
→ Q14 completes
→ 140 XP
```

No alternative cash reward is introduced by Q14.

## Reload / persistence validation

### V11 — Reload during Q14

Precondition:

Reach a state where at least one Q14 objective is complete but Q14 is not finished.

Action:

1. Save the current game.
2. Exit/reload the game.
3. Return to the Q14 quest.

Expected:

- Completed objectives remain completed.
- Source-backed flags remain present.
- Q14 evidence files remain available.
- `Files.Open` listeners work again after reload.
- Remaining objectives can continue progressing.

The listener reattachment must rely on `OnObjectivesStart()`, which the HackHub quest lifecycle runs again on game reload.

Reference:
https://docs.hotbunny.dev/hackhub/guides/quests.html

### V12 — Reload after completion

Action:

1. Complete Q14.
2. Save.
3. Reload the game.
4. Inspect progression and Q14 state.

Expected:

```text
Q14 remains completed.
130 XP base remains granted.
Optional +10 XP remains granted only when earned.
No duplicate XP is granted by reload.
```

## Payload compatibility check

The authoritative Event Map currently documents:

```text
Files.Open → FileOpenEvent
```

The general Events page also documents the event system and scoped quest listeners, while its simplified file-event table does not enumerate `Files.Open`. Because the Event Map is the typed authoritative source, Step 13.6 treats live payload compatibility as a mandatory runtime test instead of assuming field layout from static code alone.

Reference:
https://docs.hotbunny.dev/hackhub/reference/event-map.html
https://docs.hotbunny.dev/hackhub/api/events.html

The current adapter accepts either:

```text
payload.id
payload.fileId
payload.path
```

and matches against the generated file ID/path.

If the game emits a different payload shape, this is classified as an integration defect and corrected without changing Q14 story semantics.

## Validation evidence to capture

For each failed V01–V12 case, record:

```text
Validation ID:
Game version:
SDK version:
Save state:
Action performed:
Expected result:
Observed result:
Developer-console error:
Screenshot/log:
```

Do not use a new save for every test unless isolation is necessary; preserve the save used for the relevant failure so the issue is reproducible.

## Defect correction rules

Allowed without reopening canon:

- SDK API adaptation.
- Event payload adaptation.
- File path/file creation implementation fixes.
- Lifecycle listener fixes.
- Quest data persistence fixes.
- Reward duplication/idempotency fixes.
- UI-only wording/layout corrections.

Not allowed without explicit change-control:

- Changing Q14 objective semantics.
- Changing Q13 → Q14 dependency.
- Changing Marcus from approver to operator.
- Identifying the operator in Q14.
- Adding malicious-intent state for Marcus.
- Changing the Phase 8 XP allocation.
- Moving canonical state ownership away from `StateStore` / `FlagStore`.

## Acceptance criteria

- [ ] Repository typecheck passes.
- [ ] Repository tests pass.
- [ ] Production build passes.
- [ ] Mod loads in the real HackHub runtime.
- [ ] Q13 → Q14 dependency works.
- [ ] Q14 evidence tree is created.
- [ ] `Files.Open` payload is compatible with the adapter.
- [ ] Objectives 01 → 06 progress in order.
- [ ] Marcus dialogue starts after Objective 04.
- [ ] Marcus authority state completes Objective 05.
- [ ] Unknown operator state completes Objective 06.
- [ ] Optional investigation grants +10 XP and does not block completion.
- [ ] Q14 completes through canonical `QuestService`.
- [ ] Save/reload preserves the Q14 state.
- [ ] No duplicate reward occurs after reload.
- [ ] Phase 12 diagnostics remain absent from production startup.

## Disposition

**STEP 13.6 — LIVE EXECUTION PENDING.**

This document is the validation gate. Step 13.6 is complete only after the live HackHub matrix is executed and all failures are either fixed as non-semantic integration defects or explicitly escalated through change-control.
