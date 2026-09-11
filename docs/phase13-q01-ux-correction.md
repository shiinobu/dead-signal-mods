# DEAD SIGNAL — Q01 UX Correction

Date: 2026-09-11
Status: **IMPLEMENTED — LIVE VALIDATION PENDING**

## Problem Observed In-Game

During Q01 live testing, the quest progressed from the third objective to the fourth objective after the player simply ran `nmap 203.0.113.42` a second time.

The player-facing result was ambiguous because:

- the objective `Perform basic vulnerability checks` did not name a concrete action;
- the implementation completed that objective from the same Nmap event used by the previous objectives;
- repeating a previous action could therefore advance the quest unexpectedly.

A subsequent attempt used `openssl s_client`, but HackHub's built-in `openssl` command is an encryption/decryption utility and rejected the TLS inspection syntax. A follow-up attempt using `Open <file>` was also invalid because `Open` is not a HackHub terminal command; `Files.Open` is an SDK event, not a shell command.

## Source Reconciliation

The recovered Q01 source defines five required objectives in Phase 8:

1. Review audit scope
2. Scan `203.0.113.42`
3. Identify exposed services
4. Perform basic vulnerability checks
5. Submit audit report

The same locked technical interaction includes certificate inspection, and the Q01 gameplay source explicitly states that the mission does not require exploitation.

Therefore the ambiguity is resolved by mapping the basic-assessment objective to the source-defined HTTPS certificate inspection through a mod-provided read-only terminal command.

## Corrected Player Flow

```text
Review audit scope
        ↓
Run nmap 203.0.113.42
        ↓
Confirm 22 / 80 / 443
        ↓
Run certcheck 203.0.113.42:443
        ↓
Review certificate output
        ↓
Submit audit report
```

Concrete certificate-inspection action:

```bash
certcheck 203.0.113.42:443
```

`certcheck` is a DEAD SIGNAL command implemented through HackHub's supported custom-command response-data path. The command name and syntax are implementation details; the story canon remains the HTTPS certificate inspection and the evidence it reveals.

## Completion Trigger Contract

```text
nmap target
  → Scan Network
  → Identify Exposed Services

certcheck target:443
  → Basic Vulnerability Checks

valid audit report
  → Submit Audit
```

A repeated Nmap command must not complete the basic-assessment objective.

## Regression Rule

For all future DEAD SIGNAL quests:

> An objective must not be completed by repeating an earlier objective's action unless the story specification explicitly defines that behavior.

Also:

> Do not use a general-purpose OS command or syntax merely because the command exists outside HackHub; validate the exact in-game command contract first.

## Scope

This is a runtime/UX correction only. It does not reopen Phase 8 canon or change the locked five-objective Q01 structure.
