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
Nmap
  ↓
22 / 80 / 443
  ↓
Service identification
  ↓
Authorized SSH audit check
```

Objective 04 remains the locked player-facing objective `Perform basic vulnerability checks`.

## Player-facing SSH Interaction

The current HackHub Handbook syntax used by the quest is:

```bash
ssh -h audit@203.0.113.42
```

The `-h` argument contains `username@ip`; no password is passed as a command argument.

## Hybrid Runtime Mapping

The modded network did not establish the SSH session reliably during live validation. Q01 therefore keeps the native `ssh` command as the player action and supplies a scoped successful response through `Shell.addCommandData()`.

```text
Player command
    ↓
ssh -h audit@203.0.113.42
    ↓
Q01 scoped SSH response
    ↓
203.0.113.42 / OPEN
    ↓
Perform basic vulnerability checks = complete
```

A real `Terminal.SSH.Connected` event is also accepted when the game runtime emits it. The command path is limited to the exact Q01 target and authorized account.

## Target Topology

The target remains a direct `Network.Type.Device` with the contracted services and audit user:

```text
203.0.113.42
├── 22 / ssh
│   └── audit
├── 80 / http
└── 443 / https
```

No router-hacking, child-device hop, exploit, or credential-attack mechanic is required for Q01.

## Resulting Player Flow

```text
01  Review audit scope
02  Run nmap 203.0.113.42
03  Confirm 22 / 80 / 443
04  Run the authorized SSH audit check
05  Submit audit report
```

## Regression Rules

The implementation must never complete Objective 04 from a repeated Nmap action.

An Nmap result may only satisfy the scan/service objectives. Objective 04 requires the expected SSH player interaction and a scoped `OPEN` response.

## Canon Boundary

This document does not modify Phase 8 canon. It records the executable runtime mapping used to reconcile the locked five-objective structure with Q01 security-assessment gameplay.
