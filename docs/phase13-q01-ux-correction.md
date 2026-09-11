# DEAD SIGNAL — Q01 UX Correction

Date: 2026-09-11
Status: **IMPLEMENTED — LIVE VALIDATION PENDING**

## Problem Observed In-Game

During Q01 live testing, the quest progressed from the third objective to the fourth objective after the player simply ran `nmap 203.0.113.42` a second time.

The player-facing result was ambiguous because:

- the objective `Perform basic vulnerability checks` did not name a concrete action;
- the implementation completed that objective from the same Nmap event used by the previous objectives;
- repeating a previous action could therefore advance the quest unexpectedly.

## Source Reconciliation

The recovered Q01 source defines five required objectives in Phase 8:

1. Review audit scope
2. Scan `203.0.113.42`
3. Identify exposed services
4. Perform basic vulnerability checks
5. Submit audit report

The same locked technical interaction also includes certificate inspection, and the Q01 gameplay source explicitly states that the mission does not require exploitation.

Therefore the ambiguity is resolved by mapping the basic-assessment objective to the source-defined HTTPS certificate inspection rather than inventing an exploit mechanic.

## Corrected Player Flow

```text
Review audit scope
        ↓
Run nmap 203.0.113.42
        ↓
Confirm 22 / 80 / 443
        ↓
Inspect HTTPS certificate on 443
        ↓
Submit audit report
```

Concrete certificate-inspection action:

```bash
openssl s_client -connect 203.0.113.42:443
```

The command syntax is an implementation mapping. The story canon remains the certificate inspection itself.

## Completion Trigger Contract

```text
nmap target
  → Scan Network
  → Identify Exposed Services

openssl s_client -connect target:443
  → Basic Vulnerability Checks

valid audit report
  → Submit Audit
```

A repeated Nmap command must not complete the basic-assessment objective.

## Regression Rule

For all future DEAD SIGNAL quests:

> An objective must not be completed by repeating an earlier objective's action unless the story specification explicitly defines that behavior.

## Scope

This is a runtime/UX correction only. It does not reopen Phase 8 canon or change the locked five-objective Q01 structure.
