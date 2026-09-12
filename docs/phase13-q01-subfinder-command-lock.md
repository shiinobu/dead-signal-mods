# DEAD SIGNAL — Q01 Subfinders Command Lock

Date: 2026-09-12
Status: **LOCKED — Q01 COMMAND FINALIZED**

## Scope

The Q01 `subfinders` interaction is finalized as a deterministic custom HackHub Shell command. No external subfinder binary or network enumeration is part of the Q01 runtime contract.

The command is registered as the default command owner:

```ts
@RegisterCommand({ default: true })
```

and is named:

```text
subfinders
```

The plural spelling is intentional. It avoids collision with HackHub's native `subfinder` executable while preserving the ProjectDiscovery terminal presentation.

## Accepted Target Forms

Equivalent target values remain accepted because formatting does not change the target identity:

```text
subfinders -d skynet-logistics.idx
subfinders -d www.skynet-logistics.idx
subfinders -d https://skynet-logistics.idx/
subfinders -d https://www.skynet-logistics.idx/
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

The terminal presentation is adapted from the current ProjectDiscovery Subfinder `dev` branch. The upstream source defines the banner, `projectdiscovery.io` attribution, current version line, enumeration log, and final found-count log. The upstream project is MIT licensed.

The Q01 command uses the current upstream version identifier:

```text
v2.16.0
```

The discovery output is streamed with a small deterministic delay between result lines so the HackHub terminal visibly behaves like an active enumeration rather than dumping all four hosts in one frame. This timing is presentation-only and does not alter the Q01 result.

Representative terminal sequence:

```text
<Subfinder banner>

        projectdiscovery.io

[INF] Current subfinder version v2.16.0
[INF] Enumerating subdomains for <normalized-target>
portal.skynet-logistics.idx
security.skynet-logistics.idx
status.skynet-logistics.idx
www.skynet-logistics.idx
[INF] Found 4 subdomains for <normalized-target> in <elapsed> milliseconds
```

The banner and log wording are adapted from ProjectDiscovery's `banners.go` and `enumerate.go` implementation. Q01 intentionally does not import or execute the upstream enumeration engine.

## Non-Q01 Targets

Unknown targets do not receive Q01 subdomains:

```text
[WRN] No subdomains found for <normalized-target>
```

## Runtime Observation

The production runtime previously rejected `subfinders` because the custom command was incorrectly registered as `subfinder`. That mismatch is corrected and locked as the plural Q01 command name.

## Final Disposition

`subfinders` is the **finalized Q01 gameplay command**. Future changes to command ownership, target normalization, result ordering, or terminal presentation require explicit Q01 change control.
