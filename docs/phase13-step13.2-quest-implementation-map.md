# ENTITY RESOLUTION — Phase 13 Step 13.2 Quest Implementation Map

Date: 2026-09-11

## Status

**COMPLETE FOR RECOVERED CONTENT — EXECUTION BLOCKED ONLY WHERE SOURCE OR RUNTIME CONTRACT IS INSUFFICIENT**

Step 13.2 maps the recovered locked story content onto the existing ENTITY RESOLUTION runtime contracts. This document does not invent missing Q01–Q13 or Q16 canon and does not introduce a parallel story-state or condition model.

## Governing rule

The recovered story artifacts remain the source of truth. The implementation layer may translate those requirements into the existing runtime model, but it must not create new canon to compensate for missing Phase 1–8 artifacts.

The canonical implementation boundaries are:

```text
Story requirement
      ↓
Quest / investigation / evidence definition
      ↓
ConditionNode for evaluable completion conditions
      ↓
Canonical StateStore-backed service
      ↓
HackHub adapter
```

`StateStore` remains the canonical root state owner. `FlagStore` remains the flag facade. `ConditionNode` remains the only condition representation. `AccessService`, `RewardService`, `EconomyService`, `NarrativeStateService`, and `EndingService` retain their existing ownership boundaries.

## Runtime mapping matrix

| Story concern | Canonical runtime owner | Mapping rule |
|---|---|---|
| Quest lifecycle | `QuestService` + `QuestState` | Quest activation/completion/failure is persisted in canonical domain state. |
| Objective conditions | `ConditionNode` + `ConditionEvaluator` | Use `flagEquals`, `flagExists`, `all`, `any`, or `not`; do not create another condition format. |
| Story flags | `FlagStore` → `StateStore.flags` | Persist exact story state keys when the locked artifact names them. |
| Narrative chapter/scene | `NarrativeStateService` | Use `setChapter`, `setScene`, `completeChapter`. |
| Dialogue runtime state | `NarrativeStateService` + `DialogueState` | Dialogue execution must persist through the canonical state boundary. |
| Investigation leads | `Investigation` / `InvestigationLead` / `InvestigationState` | Use existing investigation structures for discoverable investigation facts. |
| Evidence collection | `Evidence` / `EvidenceState` | Model recovered evidence as typed evidence records; discovery persists through canonical state. |
| Character discovery | `Character` / `CharacterState` | Use only source-backed character identities; no inferred characters. |
| Access/capability | `AccessService` + `AccessState` | Capability ownership stays in `AccessService`. |
| XP rewards | `RewardService` + `RewardState` / progression | Use `RewardKind = experience`; claims must remain idempotent. |
| Cash rewards | `EconomyService` + mission reward transaction model | Use `QUEST_REWARD` / mission reward semantics; do not extend `RewardKind` solely for cash. |
| Ending state | `EndingService` + `EndingState` | Ending resolution remains a persisted one-way state transition. |
| HackHub transport | `src/infrastructure/hackhub/` adapters | SDK-specific events/data remain adapter concerns and must not become canonical state owners. |

## Q14 — THE OWNER

### Source identity

`entity_resolution.q14`

Chapter: `Chapter 4 — THE OVERRIDE`

Previous quest: `Q13 — THE OPERATOR`

Next quest: `Q15 — THE EVIDENCE`

### Narrative contract

Q14 establishes that `OVERRIDE_OPERATOR` is a delegated/shared privileged identity and that Marcus Reed approved the relevant privileged access. The story must preserve the distinction:

```text
authorization ≠ operation ≠ intent
```

Marcus must not be represented as the physical operator solely because he approved `AR-44192`.

### Objective mapping

| Objective | Locked story outcome | Runtime mapping | Status |
|---|---|---|---|
| 01 — Find the access registry | `OVERRIDE_OPERATOR` registry discovered | Story flag `entity_resolution.q14.override_access_registry_found` | **DIRECT** |
| 02 — Trace the access window | session `A-77402` found | Story flag `entity_resolution.q14.access_window_found` and/or `override_session_found` | **DIRECT** |
| 03 — Find the authorization | `AR-44192` linked to `A-77402` | No dedicated exact state key is named in the locked artifact | **SOURCE-TO-RUNTIME GAP** |
| 04 — Resolve the approver | Marcus Reed resolved as approver | `entity_resolution.q14.marcus_reed_confirmed` | **DIRECT** |
| 05 — Speak to Marcus | Marcus confirms approval and authority context | `entity_resolution.marcus_introduced`, `entity_resolution.marcus_authority_confirmed` | **DIRECT-ISH; objective semantics should remain adapter-driven** |
| 06 — Ask about the session | Marcus denies operating it; delegated identity remains | No dedicated exact completion flag is named | **SOURCE-TO-RUNTIME GAP** |
| 07 — Check the access justification | emergency operational maintenance / temporary relationship-policy access | `entity_resolution.q14.exception_access_found` | **DIRECT** |

### Q14 evidence records

The implementation should model the recovered records as evidence facts rather than as invented world state:

```text
OVERRIDE_OPERATOR
AR-44192
A-77402
relationship-policy
Marcus Reed
```

Where evidence discovery is needed, the target owner is `EvidenceState` and its existing `discoveredEvidenceIds` collection.

### Q14 persistent state

The following source-backed flags are canonical and should be preserved exactly:

```text
entity_resolution.q14.completed
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
```

### Q14 explicit negative states

These states must not be produced by the implementation unless a future locked source explicitly changes the canon:

```text
entity_resolution.q14.marcus_operated_account
entity_resolution.q14.marcus_created_false_connection
entity_resolution.q14.marcus_manipulated_cri
entity_resolution.q14.marcus_targeted_rizky
entity_resolution.q14.marcus_malicious_intent
entity_resolution.q14.operator_person_identified
```

### Q14 rewards

Optional reward:

```text
+20 XP
```

Runtime target:

```text
RewardService.claim(experience reward)
```

No cash reward is defined by the locked Q14 artifact.

## Q15 — THE EVIDENCE

### Source identity

`entity_resolution.q15`

Chapter: `Chapter 4 — THE OVERRIDE`

Previous quest: `Q14 — THE OWNER`

Next quest: `Q16 — THE DECISION`

### Narrative contract

Q15 establishes that the operator did **not** directly edit Rizky's final CRI score. The operator changed upstream relationship-eligibility conditions, allowing a relationship to be accepted without mandatory human review.

The implementation must therefore preserve this causal chain:

```text
configuration override
        ↓
relationship eligibility changes
        ↓
COM-07 relationship accepted
        ↓
CRI receives relationship
        ↓
classification
```

It must not simplify this into "operator changed Rizky's score".

### Objective mapping

| Objective | Locked story outcome | Runtime mapping | Status |
|---|---|---|---|
| 01 — Retrieve primary audit export | forensic export accessed | `entity_resolution.q15.primary_audit_accessed` | **DIRECT** |
| 02 — Reconstruct session A-77402 | operator session reconstructed | `entity_resolution.q15.operator_session_found` | **DIRECT** |
| 03 — Trace user reference | identity hash traced | `entity_resolution.q15.operator_identity_hash_found` | **DIRECT** |
| 04 — Reconstruct the session | action timeline reconstructed | No dedicated exact state key named for this step | **SOURCE-TO-RUNTIME GAP** |
| 05 — Compare policy versions | relationship policy changed | `entity_resolution.q15.policy_change_reconstructed` + `relationship_policy_modified` | **DIRECT** |
| 06 — Trace Rizky through pipeline | COM-07 → entity resolution → accepted relationship → CRI classification | `entity_resolution.q15.rizky_processing_chain_reconstructed` and `com07_policy_path_confirmed` | **DIRECT** |
| Optional — Check previous policy | confidence unchanged, review behavior changed | `entity_resolution.q15.before_after_policy_verified`, `review_behavior_changed_confirmed` | **DIRECT** |
| 07 — Correlate operator identity | operator reference `ARKA-OPS-0441` correlated, name still restricted | `entity_resolution.q15.operator_identity_correlated`, `operator_identity_restricted`, `operator_employment_arka` | **DIRECT** |

### Q15 policy values

The implementation must preserve the exact before/after values from the locked artifact:

```text
Previous
relationship_review_mode = REQUIRED
approved_source_bypass = DISABLED
uncertain_match = REVIEW_REQUIRED

Modified
relationship_review_mode = CONDITIONAL
approved_source_bypass = ENABLED
uncertain_match = AUTO_ACCEPT_IF_SOURCE_APPROVED
```

The artifact explicitly records that there is no direct `risk_score` override, manual score edit, or subject modification.

### Q15 evidence package

The locked story identifies eight pieces of forensic evidence:

```text
01 — COM-07 SOURCE
02 — ENTITY RESOLUTION
03 — POLICY VERSION CHANGE
04 — OVERRIDE_OPERATOR SESSION
05 — CONFIGURATION_OVERRIDE
06 — RIZKY PROCESSING CHAIN
07 — ACCESS AUTHORIZATION, AR-44192
08 — OPERATOR IDENTITY REFERENCE, ARKA-OPS-0441
```

These are compatible with the existing typed `Evidence` model. The exact evidence IDs and presentation records should be introduced only when the content adapter implementation is ready; this mapping does not invent identifiers beyond source-provided references.

### Q15 persistent state

The following source-backed flags are canonical:

```text
entity_resolution.q15.completed
entity_resolution.q15.primary_audit_accessed
entity_resolution.q15.operator_session_found
entity_resolution.q15.operator_identity_hash_found
entity_resolution.q15.operator_identity_correlated
entity_resolution.q15.policy_change_reconstructed
entity_resolution.q15.relationship_policy_modified
entity_resolution.q15.com07_policy_path_confirmed
entity_resolution.q15.rizky_processing_chain_reconstructed
entity_resolution.q15.before_after_policy_verified
entity_resolution.q15.review_behavior_changed_confirmed
entity_resolution.q15.operator_identity_restricted
entity_resolution.q15.operator_employment_arka
entity_resolution.evidence_chain_complete
entity_resolution.operator_identity_known_to_system
```

### Q15 explicit negative states

These states must remain absent unless future locked canon changes them:

```text
entity_resolution.q15.operator_identity_revealed
entity_resolution.q15.operator_intent_confirmed
entity_resolution.q15.operator_targeted_rizky
entity_resolution.q15.operator_created_false_connection
entity_resolution.q15.marcus_ordered_manipulation
entity_resolution.q15.marcus_operated_account
entity_resolution.q15.arka_institutional_manipulation_confirmed
entity_resolution.q15.cri_manually_manipulated
```

### Q15 rewards

Locked rewards:

```text
Main cash: $700
Main XP: +90 XP
Optional XP: +25 XP
Maximum XP: 115 XP
```

Runtime mapping:

```text
$700   → EconomyService.applyMissionReward(..., QUEST_REWARD)
+90XP  → RewardService.claim(experience reward)
+25XP  → RewardService.claim(optional experience reward)
```

The cash mapping is an implementation translation of an already-supported economy boundary; it does not change the story reward.

## Narrative and dialogue mapping

Q14 and Q15 dialogue is recovered and therefore eligible for implementation. The runtime representation is:

```text
NarrativeStateService
  ├─ setChapter("04")
  ├─ setScene(...)
  └─ DialogueState
       ├─ startDialogue(...)
       ├─ advanceDialogue(...)
       └─ endDialogue()
```

The exact dialogue IDs/node IDs are content implementation identifiers and are not created here because the recovered artifacts do not define them as canonical runtime IDs.

## HackHub adapter mapping

Phase 12 established that the production package must keep SDK behavior behind the infrastructure boundary. The existing production bootstrap is intentionally minimal, while diagnostic quest adapters remain under `src/infrastructure/hackhub/`.

For Q14/Q15, the story interactions are primarily investigation/data reconstruction rather than a new dependency on the unreliable `Terminal.NmapScan` path. No new undocumented HackHub event is introduced by this Step 13.2 mapping.

## SOURCE-GAP registry

The following are not executable from the recovered material alone:

1. Exact objective completion mapping for Q14 Objective 03.
2. Exact objective completion mapping for Q14 Objective 06.
3. Exact objective completion mapping for Q15 Objective 04.
4. Exact Phase 1–8 dialogue runtime IDs for Q14/Q15.
5. Full Q01–Q13 implementation content.
6. Full Q16 implementation content and final ending prerequisites.
7. Complete story-wide dependency and flag semantics beyond recovered content.

These are explicit source gaps, not implementation defects.

## Acceptance criteria for Step 13.2

Step 13.2 is considered successful for the recovered content when:

- Q14 and Q15 source facts are mapped without semantic distortion.
- Every evaluable condition is represented through `ConditionNode`.
- Story flags write through `FlagStore`/`StateStore`.
- Narrative state uses `NarrativeStateService`.
- Evidence uses `EvidenceState`.
- Rewards use existing `RewardService` / `EconomyService` boundaries.
- No negative/not-created Q14/Q15 state is accidentally asserted.
- No story content is fabricated for unrecovered quests.
- HackHub remains an adapter boundary.

## Step 13.2 disposition

**READY FOR IMPLEMENTATION SUB-STEPS ON RECOVERED CONTENT.**

The next implementation action should target the smallest executable slice whose story completion conditions are fully source-backed, while keeping all SOURCE-GAP items explicitly blocked rather than inferred.
