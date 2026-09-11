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

## HackHub Command Constraint

The in-game Handbook defines `openssl` as an encryption/decryption utility:

```text
openssl -enc [text]
openssl -dec [text]
```

It does not provide `openssl s_client`. Therefore the earlier `openssl s_client -connect ...` mapping was invalid and has been removed.

## Corrected Player Flow

```text
Review audit scope
        ↓
Run nmap 203.0.113.42
        ↓
Confirm 22 / 80 / 443
        ↓
Open ~/meridian-443-certificate.txt
        ↓
Submit audit report
```

The certificate record is created in HackHub's virtual filesystem after the successful service-identification step and contains the source-backed HTTPS inspection result, including the ARKA issuer breadcrumb.

## Completion Trigger Contract

```text
nmap target
  → Scan Network
  → Identify Exposed Services

Files.Open on ~/meridian-443-certificate.txt
  → Basic Vulnerability Checks

valid audit report
  → Submit Audit
```

A repeated Nmap command must not complete the basic-assessment objective.

## Regression Rule

For all future DEAD SIGNAL quests:

> An objective must not be completed by repeating an earlier objective's action unless the story specification explicitly defines that behavior.

Additionally:

> Never map a DEAD SIGNAL objective to a command syntax that is not actually supported by the HackHub build being targeted.

## Scope

This is a runtime/UX correction only. It does not reopen Phase 8 canon or change the locked five-objective Q01 structure.
