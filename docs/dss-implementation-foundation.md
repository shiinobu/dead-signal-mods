# DEAD SIGNAL — DSS Implementation Foundation

Date: 2026-09-13
Status: **IMPLEMENTED — FOUNDATION; LIVE DESKTOP VALIDATION PENDING**

## Scope

This document records the first implementation slice of the locked DEAD-SIGNAL / DSS desktop architecture.

The implementation establishes:

```text
DEAD-SIGNAL Desktop App
    ↓
OpsRuntime
    ├── ReconService
    ├── OpsSessionStore
    └── OpsToolRegistry
          ↓
    HackHub Event boundary
```

## Desktop Application

Canonical identity:

```text
AppName: dss
Title: DEAD-SIGNAL
Brand: DSS // Dead Signal System
```

The app is a single HackHub Desktop App with a left tool navigator and active workspace.

Initial navigator entries:

```text
Terminal+   FOUNDATION
Recon       READY
Wireshark+  FOUNDATION
```

`Terminal+` and `Wireshark+` are intentionally not represented as complete implementations yet. Their entries establish the canonical workspace boundary without pretending that native HackHub application embedding is available.

## Recon Integration

The existing shared `ReconService` remains the sole owner of deterministic reconnaissance behavior and timing.

The DSS Desktop App exposes:

```text
getToolCatalog()
getSession()
startRecon(target)
```

Recon execution emits structured DSS events:

```text
DSS.Recon.Started
DSS.Recon.SourceStarted
DSS.Recon.SourceCompleted
DSS.Recon.HostDiscovered
DSS.Recon.Completed
DSS.Recon.Failed
```

The started event includes the complete source catalog so the UI does not duplicate Q01 source definitions.

## Investigation Session

`OpsSessionStore` is a dedicated application-level context for the operations workspace. It is deliberately separate from quest/narrative state.

Current session fields:

```text
status
target
profileId
totalSources
completedSources
candidatesFound
uniqueHostsFound
discoveredHosts
lastElapsedMs
```

Persistent save ownership is not introduced in this foundation slice. The session is runtime-local until the persistence boundary is explicitly designed.

## Tool Registry

`OpsToolRegistry` is the central initial tool catalog. New DSS tools should be added here before they are exposed through the desktop workspace.

Each tool definition contains:

```text
id
name
description
status
capability (optional)
```

## UI Boundary

`src/infrastructure/hackhub/apps/dead-signal.html` is presentation-only.

It consumes DSS exports and events and does not directly mutate GameRuntime, quests, flags, rewards, or narrative state.

Recon progress animations are UI-local and are driven by service events. The persistent HackHub terminal is not cleared, and no ANSI cursor-control sequence is required by the DSS workspace.

## Validation Requirements

Before promoting this foundation beyond development:

```text
npm run typecheck
npm test
npm run build
        ↓
Install production package
        ↓
Open DEAD-SIGNAL from HackHub desktop
        ↓
Verify navigator and workspace rendering
        ↓
Run Recon from the DSS UI
        ↓
Verify source-by-source progress
        ↓
Verify four Q01 hosts
        ↓
Verify native terminal history remains unaffected
```

## Next Slice

The next implementation slice is `Terminal+` as a real DSS command workbench built on the already locked command/service boundary. It must not attempt to embed or clone the native HackHub terminal.
