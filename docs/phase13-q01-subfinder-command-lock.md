# DEAD SIGNAL — Q01 Subfinder Command Lock

Date: 2026-09-12
Status: **LOCKED — Q01 COMMAND FINALIZED**

## Scope

The Q01 `subfinder` interaction is finalized as a deterministic custom HackHub Shell command. No external subfinder binary or network enumeration is part of the Q01 runtime contract.

The command is registered as the default command owner:

```ts
@RegisterCommand({ default: true })
```

and is named:

```text
subfinder
```

## Accepted Target Forms

Equivalent target values remain accepted because formatting does not change the target identity:

```text
subfinder -d skynet-logistics.idx
subfinder -d www.skynet-logistics.idx
subfinder -d https://skynet-logistics.idx/
subfinder -d https://www.skynet-logistics.idx/
```

The normalized target must resolve to either:

```text
skynet-logistics.idx
www.skynet-logistics.idx
```

## Q01 Result

For either canonical target form, the command returns exactly:

```text
portal.skynet-logistics.idx
security.skynet-logistics.idx
status.skynet-logistics.idx
www.skynet-logistics.idx
```

The result order is deterministic and is the authoritative Q01 enumeration output.

## Presentation Contract

The command deliberately resembles the ProjectDiscovery subfinder terminal presentation while remaining a game fixture:

```text
                   __    _____           __
      _______  __/ /_  / __(_)___  ____/ /__  _____
     / ___/ / / / __ \\/ /_/ / __ \\/ __  / _ \\/ ___/
    (__  ) /_/ / /_/ / __/ / / / / /_/ /  __/ /
   /____/\\__,_/_.___/_/ /_/_/ /_/\\__,_/\\___/_/

    projectdiscovery.io

[INF] Current subfinder version v2.15.0
[INF] Enumerating subdomains for <normalized-target>
```

The banner is presentation-only. Q01 gameplay depends on the four returned hostnames, not on banner text or version parsing.

## Non-Q01 Targets

Unknown targets do not receive Q01 subdomains:

```text
[WRN] No subdomains found for <normalized-target>
```

## Final Disposition

`subfinder` is now a **finalized Q01 gameplay command**. Future changes to command ownership, target normalization, result ordering, or terminal presentation require explicit Q01 change control.
