# DEAD SIGNAL — Q01 Objective Reconciliation

Date: 2026-09-11
Status: **RECONCILED — PHASE 8 REMAINS AUTHORITY**

## Source Difference

The earlier Detailed Quest Design for Q01 described four objectives:

1. Accept the contract
2. Review the target
3. Scan the network
4. Submit the audit

The later Phase 8 final technical quest specification locked five required objectives:

1. Review audit scope
2. Scan `203.0.113.42`
3. Identify exposed services
4. Perform basic vulnerability checks
5. Submit audit report

Phase 8 remains the immutable technical quest source of truth for Q01–Q16, so the five-objective structure is retained.

## Technical Mapping

The executable Q01 interaction is mapped as:

```text
203.0.113.42
  ↓
Nmap response
  ↓
22 / 80 / 443
  ↓
Service identification
  ↓
Authorized SSH command interaction
```

Objective 04 remains the locked player-facing objective `Perform basic vulnerability checks`.

## Player-facing SSH Interaction

The current HackHub Handbook syntax used by the quest is:

```bash
ssh -h audit@203.0.113.42 -p 22
```

The `-h` argument contains `username@ip`; the port is supplied separately with `-p`. No password is passed as a command argument.

## Hybrid Runtime Mapping

Live testing showed that a declared HackHub network target could expose the Nmap result while the native SSH network connection still failed. Q01 therefore keeps the native `ssh` command as the player action and supplies a scoped successful response through `Shell.addCommandData()`.

```text
Player command
    ↓
ssh -h audit@203.0.113.42 -p 22
    ↓
Q01 scoped SSH response
    ↓
203.0.113.42 / OPEN
    ↓
Perform basic vulnerability checks = complete
```

A real `Terminal.SSH.Connected` event is also accepted when the game runtime emits it.

## Runtime Boundary

Q01 no longer creates a `Network` object. This prevents the game's native SSH transport from attempting a real connection that conflicts with the quest-scoped SSH response data.

## Resulting Player Flow

```text
01  Review audit scope
02  Run nmap 203.0.113.42
03  Identify exposed services
04  Perform basic vulnerability checks
05  Submit audit report
```

## Regression Rules

The implementation must never complete Objective 04 from a repeated Nmap action.

An Nmap response may only satisfy the scan/service objectives. Objective 04 requires the expected SSH player interaction and a scoped `OPEN` response.

## Canon Boundary

This document does not modify Phase 8 canon. It records the executable runtime mapping used to reconcile the locked five-objective structure with Q01 security-assessment gameplay.
