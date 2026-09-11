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

A third attempt used a mod-defined `certcheck` command through `Shell.addCommandData()`. The live HackHub runtime rejected `certcheck` as `Command not found`. Although the current SDK documentation describes arbitrary command names as accepted by `addCommandData`, the live runtime behavior available to this project does not expose such a command as an executable terminal command. The project therefore treats live runtime behavior as authoritative for this implementation.

## Source Reconciliation

The recovered Q01 source defines five required objectives in Phase 8:

1. Review audit scope
2. Scan `203.0.113.42`
3. Identify exposed services
4. Perform basic vulnerability checks
5. Submit audit report

The same locked technical interaction includes certificate inspection, and the Q01 gameplay source explicitly states that the mission does not require exploitation.

Therefore the implementation needs a concrete, supported read-only action for the basic-assessment objective without inventing an unsupported command.

## Corrected Player Flow

```text
Review audit scope
        ↓
Run nmap 203.0.113.42
        ↓
Confirm 22 / 80 / 443
        ↓
Run nmap 203.0.113.42 -sV
        ↓
Submit audit report
```

The current implementation uses the built-in Nmap service/version scan as the basic-assessment action because that command variant has been validated in the real HackHub terminal. The command syntax is implementation detail; the source canon remains the basic security assessment/certificate-inspection beat and the ARKA certificate breadcrumb.

## Completion Trigger Contract

```text
plain nmap target
  → Scan Network
  → Identify Exposed Services

nmap target -sV
  → Basic Vulnerability Checks

valid audit report
  → Submit Audit
```

A repeated plain Nmap command must not complete the basic-assessment objective.

## Regression Rule

For all future DEAD SIGNAL quests:

> An objective must not be completed by repeating an earlier objective's action unless the story specification explicitly defines that behavior.

Also:

> Do not use a general-purpose OS command or syntax merely because the command exists outside HackHub; validate the exact in-game command contract first.

And:

> A documented SDK capability is not considered production-usable until the exact behavior is validated in the live game runtime used by the project.

## Scope

This is a runtime/UX correction only. It does not reopen Phase 8 canon or change the locked five-objective Q01 structure.
