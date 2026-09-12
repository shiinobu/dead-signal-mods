# DEAD SIGNAL — DSS Implementation Foundation

Date: 2026-09-13
Status: **IMPLEMENTED — FOUNDATION; LIVE DESKTOP VALIDATION PENDING**

## Scope

This document records the first implementation slice of the locked DEAD-SIGNAL / DSS desktop architecture.

The implemented foundation establishes:

```text
DEAD-SIGNAL Desktop App
    ↓
OpsRuntime
    ├── OpsCommandRegistry
    ├── OpsCommandRouter
    ├── OpsEventBus
    ├── ReconService
    ├── OpsSessionStore
    └── OpsToolRegistry
          ↓
    HackHub adapters / UI
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

`DEAD-SIGNAL` does not embed or replace native HackHub applications.

## Command Architecture

`OpsCommandRegistry` is the canonical metadata registry for DSS-native commands.

`OpsCommandRouter` is the application-level execution boundary. The first executable command is:

```text
recon -d <domain>
```

The native HackHub `recon` command and the DSS Terminal+ command console both route through the same `OpsRuntime.runRecon()` path.

## Recon Integration

The existing shared `ReconService` remains the sole owner of deterministic reconnaissance behavior and timing.

The DSS Desktop App exposes:

```text
getToolCatalog()
getCommandCatalog()
getSession()
startRecon(target)
executeCommand(commandLine)
```

Recon execution emits both internal typed Ops events and HackHub custom events for the HTML surface:

```text
DSS.Recon.Started
DSS.Recon.SourceStarted
DSS.Recon.SourceCompleted
DSS.Recon.HostDiscovered
DSS.Recon.Completed
DSS.Recon.Failed
```

The started event includes the complete source catalog so UI surfaces do not duplicate Q01 source definitions.

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

`OpsToolRegistry` is the central initial tool catalog. New DSS tools are added here before exposure through the desktop workspace.

Initial tools:

```text
Terminal+   FOUNDATION
Recon       READY
Wireshark+  FOUNDATION
```

Each tool definition contains:

```text
id
name
description
status
capability (optional)
```

## Terminal+

`Terminal+` is now a functional DSS command workbench. It has:

```text
command input
command history/output
command catalog
shared recon execution
shared DSS recon event stream
```

It does not attempt to embed or clone the native HackHub terminal.

## Wireshark+

`Wireshark+` remains a foundation surface only. Its packet model, capture service, filters, packet detail renderer, and HackHub network/event adapters are not yet implemented.

The native HackHub Wireshark application remains independent.

## UI Boundary

`src/infrastructure/hackhub/apps/dead-signal.html` is presentation-only.

It consumes DSS exports and events and does not directly mutate GameRuntime, quests, flags, rewards, or narrative state.

Recon animations and progress transitions run in the HTML workspace, while the deterministic scan behavior remains in `ReconService`.

The persistent HackHub terminal is not cleared, and no ANSI cursor-control sequence is used by DSS.

## Validation Requirements

Before promoting this foundation beyond development:

```text
npm run typecheck
npm test
npm run build
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
Run recon from Terminal+
        ↓
Verify identical shared results
        ↓
Verify native terminal history remains unaffected
```

## Next Slice

The next implementation slice is `Wireshark+` as a real DSS forensic workspace, beginning with a framework-agnostic packet domain contract and deterministic packet-capture service before adding filters and detailed rendering.
