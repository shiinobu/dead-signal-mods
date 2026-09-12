# DEAD SIGNAL — Q01 Recon Promotion Amendment

Date: 2026-09-13
Status: **ACTIVE AMENDMENT**

This amendment supersedes Q01's temporary command-specific reconnaissance implementation.

## Canonical Command

Q01 no longer owns a `subfinders` or `subfinder` command.

The canonical player command is:

```text
recon -d <domain>
```

## Shared Ownership

Reconnaissance is now a reusable DSS capability owned by:

```text
DEAD-SIGNAL
    ↓
OpsRuntime
    ↓
ReconService
```

Q01 registers the `q01` `ReconProfile`. Future quests may register additional profiles without creating additional command implementations.

## Q01 Dependency

Q01 listens for the canonical `recon` terminal command and validates the target through the shared recon profile. The objective flow remains unchanged: Lynx discovers the public host, Recon discovers the four modeled hosts, and the player inspects the authorized security host.

## Presentation

Animation timing, spinner frames, source sequencing, progress-bar formatting, candidate counts, unique-host counts, and result streaming are owned by the shared `ReconService`.

The HackHub command adapter only renders service events.

The terminal output is append-only. It does not call `CommandTools.clear()` and does not emit ANSI cursor-control sequences, preserving the player's existing terminal history.

## Active Q01 Result

```text
portal.skynet-logistics.idx
security.skynet-logistics.idx
status.skynet-logistics.idx
www.skynet-logistics.idx
```

## Historical Documents

Earlier Q01 documents may contain the former `subfinder` terminology because they describe the pre-DSS promotion implementation. This amendment is the active command/ownership correction for the current repository state.
