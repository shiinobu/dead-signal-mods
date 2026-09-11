# DEAD SIGNAL — Phase 13 Step 13.4

## Contract Gap Closure — Q14 Optional Objective Semantics

Date: 2026-09-11

## Status

**COMPLETE — Q14 OBJECTIVE CONTRACT IS SOURCE-BACKED AND OPTIONAL-OBJECTIVE SAFE**

Step 13.4 closes the Q14 objective-level source-to-runtime gaps discovered during Step 13.3. The correction is based on the locked Q14 artifact and the locked Phase 9/10 objective model. Full HackHub production registration remains a later integration step.

## Source findings

The locked Q14 artifact explicitly provides the authorization record for `AR-44192`, linked to session `A-77402`, approved by `M.REED`, and establishes the chain `M.REED → approved access → OVERRIDE_OPERATOR → A-77402`. It also explicitly states that this does not establish who physically operated the session. fileciteturn200file0L13-L41

The same source provides the Marcus dialogue in which he confirms he approved the access but did not use the session, and states that the identity was delegated. fileciteturn200file1L107-L117

The Q14 persistent state explicitly contains:

```text
dead_signal.q14.marcus_access_approval_confirmed
dead_signal.q14.operator_identity_unknown
```

as well as the other Q14 canonical state keys. fileciteturn205file1L49-L62

The locked Phase 9 objective model includes `SKIPPED` as a valid objective status, while Phase 8 explicitly distinguishes optional investigations from required objectives. fileciteturn210file0L106-L133 fileciteturn209file8L849-L878

## Corrections

### Q14 Objective 03

Previous mapping:

```text
SOURCE-TO-RUNTIME GAP
```

Resolved mapping:

```text
Q14 Objective 03 — FIND THE AUTHORIZATION
    ↓
dead_signal.q14.marcus_access_approval_confirmed == true
```

The source record itself establishes the access request, approver, approval status, and linked session. fileciteturn200file0L16-L41

### Q14 Objective 06

Previous mapping:

```text
SOURCE-TO-RUNTIME GAP
```

Resolved mapping:

```text
Q14 Objective 06 — ASK ABOUT THE SESSION
    ↓
dead_signal.q14.operator_identity_unknown == true
```

The source explicitly establishes that Marcus did not use the session and that the identity was delegated, preserving the authorization/operation distinction. fileciteturn200file1L107-L117

### Q14 Objective 07

The locked source describes the access justification as emergency operational maintenance and assigns an **optional +20 XP** reward. The objective therefore cannot be a completion prerequisite. fileciteturn202file0L34-L56

The runtime objective contract was extended with:

```ts
readonly optional?: boolean;
```

with required behavior remaining the default when the field is omitted.

`QuestService.areObjectivesComplete()` now evaluates only required objectives for quest completion. This implements the already-locked optional-investigation semantics rather than creating a new story rule.

## Q14 production-domain definition

A source-backed domain content definition was added:

```text
src/content/q14.ts
```

It represents all seven locked Q14 objectives using only existing `ConditionNode` constructs and source-backed state keys. Objective 07 is explicitly marked optional.

No new canonical flag was introduced.

No new condition representation was introduced.

No HackHub-specific event was invented.

No quest-specific engine was introduced.

## Test coverage

The Step 13.3 Q14 source-backed test was updated to consume the production-domain Q14 definition.

It now verifies:

1. Q14 is incomplete with no relevant state.
2. All required Q14 state boundaries are sufficient for objective completion.
3. Objective 07 does not block Q14 completion when its optional flag is absent.
4. Objective 07 remains valid when completed.
5. Explicit negative Marcus/operator states are never created.

Test file:

```text
tests/phase13-step13.3-q14-source-backed-slice.test.ts
```

## Ownership preservation

The implementation continues to follow the locked architecture:

```text
Q14 content
    ↓
ConditionNode
    ↓
ConditionEvaluator
    ↓
QuestService
    ↓
DomainStateAccess
    ↓
StateStore
```

`StateStore` remains the canonical root state owner and `ConditionNode` remains the single condition representation. Phase 10 also explicitly freezes the quest/objective semantics and forbids semantic reinterpretation of the Phase 8 rules. fileciteturn161file1L223-L241

## Remaining integration boundaries

### Q14 quest-completion story flag

The locked Q14 source requires:

```text
dead_signal.q14.completed = true
```

The current generic `QuestService` persists quest completion in `QuestState.completedQuestIds`, but it does not automatically write arbitrary story flags. A separate source-backed completion transition must therefore be wired at the application/content integration boundary rather than adding a hidden side effect to `QuestService`.

This remains **INTEGRATION-DEFERRED**, not source-ambiguous.

### Q15 Objective 04

Q15 Objective 04 — `RECONSTRUCT THE SESSION` remains unresolved at the dedicated state-key level because the locked Q15 persistent state names `operator_session_found` but does not define a separate exact completion key for the action timeline itself. Reusing that state would collapse two distinct source objectives into one completion boundary.

The source-backed timeline is:

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

This remains an explicit source-to-runtime gap.

## Step 13.4 acceptance criteria

- Q14 Objective 03 is source-backed and executable.
- Q14 Objective 06 is source-backed and executable.
- Q14 Objective 07 is optional and cannot block completion.
- Q14 content exists as reusable domain data rather than quest-specific engine logic.
- Existing required-objective behavior remains unchanged by default.
- No negative Q14 state is asserted.
- No locked Phase 9/10 ownership boundary is changed.
- Q14 completion-flag wiring is explicitly deferred to the application/content integration boundary.
- Q15 Objective 04 remains explicitly blocked rather than inferred.

## Disposition

**STEP 13.4 COMPLETE**

The next step may proceed to the Q14 production registration/integration boundary, including the explicit `dead_signal.q14.completed` transition, while Q15 Objective 04 remains separately tracked.
