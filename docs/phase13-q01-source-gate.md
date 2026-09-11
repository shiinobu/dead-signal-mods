# DEAD SIGNAL — Q01 Source-Backed Implementation Gate

Date: 2026-09-11
Status: **OPEN — Q01 IS CURRENT TARGET**

## Quest

`dead_signal.q01`

Title: **Q01 — THE CONTRACT**

High-level story position:

```text
Chapter 1 — DEAD SIGNAL
Q01 → Q02 → Q03 → Q04
```

Q01 is the campaign entry point and starts the audit around ARKA.

## Verified Source Facts

The readable Phase 8 history establishes the Q01 XP contract:

```text
Complete external audit         35 XP
Network/service enumeration     20 XP
Basic vulnerability assessment  10 XP
Submit correct report           15 XP
Maximum                         80 XP
Optional XP                      0 XP
```

These values are locked and must not be rebalanced during implementation.

## Architecture Constraints

Q01 must use the shared DEAD SIGNAL runtime/SDK architecture.

It must not introduce:

- a Q01-specific engine;
- a second state/flag owner;
- a second condition model;
- direct canonical state mutation outside the approved service/application boundary;
- diagnostic-only bootstrap behavior;
- invented prerequisites or downstream dependency shortcuts.

## Source Gate

The current readable source set does **not** expose the complete Q01 technical quest definition required to safely implement production behavior.

Not yet source-backed at the required granularity:

```text
Exact objective definitions
Exact objective completion triggers/events
Exact evidence/files/data to create or expose
Exact persistent Q01 state/flag keys
Exact dialogue/event sequence
Exact technical interaction details
Exact reward dispatch behavior beyond the locked XP allocation
Exact Q01 → Q02 completion transition state
```

The high-level flow and XP matrix are not sufficient evidence to invent these semantics.

## Gate Decision

```text
Q01 is the active implementation target        ✅
Q01 production implementation may be invented  ❌
Q01 source recovery is required                ✅
Q02 production implementation                  ❌ BLOCKED BY SEQUENCE
Q14 production implementation                  ❌ DEFERRED
```

## Required Next Input

Recover the locked Phase 1–8 Q01 detail from the original story/design source before creating production Q01 objectives or event handlers.

Once the missing Q01 detail is available, implementation must follow:

```text
Q01 source recovery
      ↓
Q01 implementation mapping
      ↓
Q01 domain/content implementation
      ↓
automated tests
      ↓
typecheck + build
      ↓
HackHub installation
      ↓
focused live Q01 test
      ↓
PASS
      ↓
LOCK Q01
      ↓
start Q02
```

No downstream quest is permitted to bypass this gate.
