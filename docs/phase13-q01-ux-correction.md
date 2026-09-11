# DEAD SIGNAL — Q01 UX Correction

Date: 2026-09-11
Status: **FINALIZED — LIVE VALIDATION PENDING**

## Problem Observed In-Game

During Q01 live testing, the objective list became too implementation-oriented and the player was asked to perform multiple variants of the same network scan. This made the opening mission feel mechanical instead of like a simple professional audit.

The UI also exposed overly long clue text, including an internal mod path. Hints should help the player without exposing implementation details.

## Locked Objective Names

The five objective names from Phase 8 are preserved exactly:

1. `Review audit scope`
2. `Scan 203.0.113.42`
3. `Identify exposed services`
4. `Perform basic vulnerability checks`
5. `Submit audit report`

The presentation may add concise terminal affordances or selective hints, but these names are not renamed.

## Final Player-Facing UX

```text
Review audit scope
Scan 203.0.113.42       [Terminal]
Identify exposed services [?]
Perform basic vulnerability checks
Submit audit report      [?]
```

Not every objective uses a hint.

- Terminal affordance is used for the concrete scan action.
- The service objective may expose a short clue showing the expected services.
- The basic-assessment objective is self-explanatory and does not need a second command or extra clue.
- The report objective may expose a short clue such as `Send your findings to Adrian.`

No internal mod path is shown to the player.

## Final Gameplay Model

Q01 is intentionally a simple opening mission. The player performs one network scan and reviews what it reveals.

```text
Review scope
    ↓
nmap 203.0.113.42
    ↓
Review exposed services / basic findings
    ↓
Submit audit report
```

The single valid Nmap result satisfies the three technical middle objectives in sequence:

```text
Scan 203.0.113.42
Identify exposed services
Perform basic vulnerability checks
```

This avoids forcing the player to repeat a scan or run unsupported/extra commands solely to move the objective list.

## Runtime Rule

A repeated Nmap command must not produce additional progress after objectives 2–4 are already complete.

## Source Boundary

The locked Phase 8 technical specification still contains certificate inspection as part of Q01's technical interaction. That evidence remains a narrative breadcrumb in the implementation notes; the live opening mission does not require an additional player command solely to expose it.

## General Rule for Future Quests

> Objective text should describe the player's task in natural language. Commands, icons, hints, and other affordances should support the task rather than replace it.

> Use a hint only when the player benefits from additional context. Do not turn every objective into a tooltip.

> Do not create a new player-facing command unless the exact command is supported and validated in the live HackHub runtime.

## Scope

This correction changes player-facing presentation and resolves the redundant-scan interaction. It does not reopen Phase 8 canon or change the five-objective Q01 structure.
