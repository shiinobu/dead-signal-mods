# DEAD SIGNAL — Phase 13 Sequential Campaign Execution Lock

Date: 2026-09-11
Status: **LOCKED**

## Purpose

Phase 13 implementation is now executed strictly in canonical campaign order:

```text
Q01 → Q02 → Q03 → Q04 → Q05 → Q06 → Q07 → Q08
→ Q09 → Q10 → Q11 → Q12 → Q13 → Q14 → Q15 → Q16
```

The objective is to validate the real playable campaign incrementally, not to prove isolated downstream content out of order.

## Relationship to Earlier Locks

This lock changes only the **implementation execution strategy** of Phase 13. It does not change the locked canon or technical contracts from Phases 1–12.

Phase 8 remains the source of truth for Q01–Q16 technical quest behavior, objectives, dependencies, evidence, rewards, XP allocation, state changes, character knowledge, and ending logic.

Phase 9–10 remain the locked SDK/technical architecture baseline. In particular, Q01–Q16 use the common SDK/runtime and no quest-specific subsystem engines are introduced.

## Sequential Execution Rule

A quest becomes the active implementation target only after the previous quest has passed its live in-game validation gate.

For every quest `Qn`, the mandatory gate is:

```text
1. Source validation
2. Quest implementation mapping
3. Domain/content implementation
4. Automated unit/contract/integration tests
5. Typecheck
6. Build
7. Production package install in HackHub
8. Focused live in-game validation
9. Persistence/reload validation when applicable
10. Validation result recorded
11. Quest marked PASS/LOCKED
12. Only then advance to Q(n+1)
```

A failed gate blocks progression to the next quest.

## No Dependency Bypass

The production campaign must never bypass a locked prerequisite merely to expose a downstream quest for testing.

Examples:

```text
Q14 must not bypass Q13.
Q13 must not bypass Q12.
Q12 must not bypass Q11.
```

Development fixtures may be used only in tests and must never become production story state.

## Canon / Runtime Boundary

No implementation may invent missing story semantics merely to make a quest executable.

When a quest's detailed source is incomplete, implementation stops at the source gate and records the exact missing material.

The following remain forbidden:

- new canonical flags created only for implementation convenience;
- alternate condition representations outside `ConditionNode`;
- quest-specific engines such as `Q01Engine` through `Q16Engine`;
- direct canonical state mutation from quest/dialogue/hack code outside the approved service/application ownership boundary;
- dependency bypasses;
- silently converting optional objectives into required objectives.

## Live Validation Policy

The canonical validation target is the real HackHub game path.

A quest is not considered live-validated merely because TypeScript tests pass or the bundle builds successfully.

The intended progression is:

```text
Q01 implementation
    ↓
Q01 live PASS
    ↓
Q02 implementation
    ↓
Q02 live PASS
    ↓
...
    ↓
Q16 live PASS
    ↓
Full Campaign Regression
```

## Q14 Status Change

Q14 was previously implemented as an early downstream slice during Phase 13 exploration. That work is now **superseded as the active production path** by this sequential execution lock.

The Q14 implementation artifacts are preserved in Git history and historical Phase 13 documentation, but Q14 is not registered in the current production bootstrap while Q01–Q13 remain unimplemented.

## Current Target — Q01

The current implementation target is:

```text
Q01 — THE CONTRACT
```

Currently verified from the readable Phase 8 source:

```text
Maximum XP: 80

Complete external audit         35 XP
Network/service enumeration     20 XP
Basic vulnerability assessment  10 XP
Submit correct report           15 XP
```

No optional XP exists for Q01.

The exact Q01 objective/event/state/dialogue/technical interaction details must come from the locked Phase 1–8 source. Where those details are not presently readable, implementation must stop at source recovery rather than infer them.

## Phase 13 Completion Condition

Phase 13 is complete only when:

```text
Q01 PASS
Q02 PASS
Q03 PASS
...
Q16 PASS

and

Full campaign live validation PASS
```

Only after that does the project proceed to Phase 14 full integration/release audit.
