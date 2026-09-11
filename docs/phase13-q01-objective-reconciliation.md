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

The executable Q01 interaction is now mapped as:

```text
203.0.113.42
  ↓
Nmap
  ↓
22 / 80 / 443
  ↓
Service identification
  ↓
Authorized SSH service verification
```

Objective 04 remains the locked player-facing objective `Perform basic vulnerability checks`. Its runtime completion boundary is the actual SSH connection event to `203.0.113.42` using the authorized `audit` account supplied by Adrian.

The current HackHub Handbook syntax is:

```bash
ssh -h audit@203.0.113.42 -p 22
```

The `-h` argument contains `username@ip` without the port; the port is supplied separately with `-p`.

## Target Topology

The target is implemented directly as a `Network.Type.Device` with the public IP and the audit user attached to that device. No Router, child device, router model, recovery mechanic, or internal hop is required for Q01.

```text
203.0.113.42
├── 22 / ssh
│   └── audit
├── 80 / http
└── 443 / https
```

## Resulting Player Flow

```text
01  Review audit scope
02  Run nmap 203.0.113.42
03  Confirm 22 / 80 / 443
04  Connect to the authorized SSH audit account
05  Submit audit report
```

## Runtime Constraint

The previous Router + child-device experiment did not establish SSH connectivity in the live game. The implementation is therefore aligned with the simpler direct-device network shape described by the Handbook's `Network.Type.Device` example.

This is an implementation correction, not a change to Q01 story canon.

## Regression Rules

The implementation must never complete Objective 04 from a repeated Nmap action.

An Nmap result may only satisfy the scan/service objectives. Objective 04 requires the target SSH connection event.

## Canon Boundary

This document does not modify Phase 8 canon. It records the executable runtime mapping used to reconcile the locked five-objective structure with the Q01 security-assessment gameplay.
