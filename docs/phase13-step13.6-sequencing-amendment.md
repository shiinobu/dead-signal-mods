# ENTITY RESOLUTION — Phase 13 Step 13.6 Amendment

Date: 2026-09-11

## Purpose

This amendment corrects the execution order in:

`docs/phase13-step13.6-q14-focused-ingame-validation.md`

No Q14 story, state, objective, dependency, or reward semantics are changed.

## Correct live-test order

The optional access-justification check must be executed **before Q14 completes**.

Correct sequence:

```text
V01  Production bootstrap
 ↓
V02  Q13 → Q14 dependency
 ↓
V03  Q14 claim / file seeding
 ↓
V04  Objective 01
 ↓
V05  Objective 02
 ↓
V06  Objective 03
 ↓
V07  Objective 04 / Marcus discovery
 ↓
V08  Objective 05 / authority distinction
 ↓
V10  OPTIONAL justification investigation
 ↓
V09  Objective 06 / unknown operator boundary / Q14 completion
 ↓
V11  Reload during Q14
 ↓
V12  Reload after completion
```

## Why

Q14 uses `this.Events` scoped to the quest. HackHub automatically cleans scoped listeners when the quest completes or is abandoned. Therefore the `Files.Open` listener that detects the optional justification file is no longer available after Q14 completion.

The optional path must therefore be tested while Q14 is still active:

```text
Open AR-44192-justification.txt
        ↓
entity_resolution.q14.exception_access_found = true
        ↓
finish Objective 06
        ↓
Q14 completion
        ↓
base 130 XP + optional 10 XP
```

The non-optional path remains:

```text
skip justification
        ↓
finish Objective 06
        ↓
Q14 completion
        ↓
130 XP
```

This amendment supersedes only the **execution order** of V09/V10 in the Step 13.6 checklist. All other acceptance criteria remain unchanged.
