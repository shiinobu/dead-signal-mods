# DEAD SIGNAL — DSS Recon Tool Lock

Date: 2026-09-13
Status: **LOCKED — SHARED DSS TOOL CONTRACT**

## Identity

The reconnaissance capability is a shared DEAD SIGNAL System (DSS) tool, not a Q01-specific implementation.

```text
Desktop application: DEAD-SIGNAL
System abbreviation: DSS // Dead Signal System
Tool:               Recon
Command:            recon
Canonical usage:    recon -d <domain>
```

## Ownership

```text
DEAD-SIGNAL / OpsRuntime
    ↓
ReconService
    ↓
ReconProfile
```

The `ReconService` owns target normalization, profile resolution, source sequencing, progress calculations, candidate/unique counters, animation timing, spinner frames, and result streaming.

HackHub command code is an adapter only. It must not own Q01-specific source data or animation timing.

## Profiles

Quest content registers a deterministic `ReconProfile` with the shared `ReconService`.

Q01 currently registers profile `q01` with:

```text
Target root:
skynet-logistics.idx

Accepted equivalent host:
www.skynet-logistics.idx

Sources: 5
Candidates: 8
Unique hosts: 4
```

Q01 result order is:

```text
portal.skynet-logistics.idx
security.skynet-logistics.idx
status.skynet-logistics.idx
www.skynet-logistics.idx
```

Future quests may register additional recon profiles without adding quest-specific command implementations.

## Presentation

The visible command branding is original DSS branding. Third-party Subfinder branding is not part of the player-facing command.

Shared animation configuration lives in `ReconService`:

```text
sourceDurationMs: 1000
resultDelayMs:    90
spinnerFrames:    braille frame sequence
progressBarWidth: 24
```

The command adapter renders discrete source events. It does not call `CommandTools.clear()` and does not emit ANSI control sequences.

This preserves the player's native HackHub terminal history.

## Service / Presentation Separation

```text
ReconService
    ├── ReconStartedEvent
    ├── ReconProgress
    ├── ReconResult
    └── animation configuration

ReconCommand
    └── maps service events to HackHub terminal output

Future ReconView
    └── consumes the same service contract for DSS desktop UI
```

The same recon behavior can therefore be surfaced in Terminal+, the DSS desktop application, or future quest-specific views without duplicating scan logic or animation timing.

## Final Disposition

`ReconService` is the canonical reusable reconnaissance capability for DEAD SIGNAL. Q01 is one profile consumer, not the owner of the tool.
