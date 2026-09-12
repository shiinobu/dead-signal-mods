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

The terminal presentation is adapted from the current ProjectDiscovery Subfinder `dev` branch and matched against the supplied HackHub reference capture. The upstream source provides the banner and `projectdiscovery.io` attribution; Q01 also reproduces the warning block visible in the reference capture and uses a braille spinner for the enumeration wait state. The upstream project is MIT licensed.

The Q01 command uses the current upstream version identifier internally:

```text
v2.16.0
```

The player-facing flow is:

```text
<Subfinder banner>

        projectdiscovery.io

[WRN] Use with caution. You are responsible for your actions.
[WRN] Developers assume no liability and are not responsible for any misuse or damage.
[WRN] By using subfinder, you also agree to the terms of the APIs used.

[INF] Enumerating subdomains for <normalized-target>
⠋
```

The spinner uses the braille sequence:

```text
⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏
```

The frame is updated in place with ANSI cursor-up, clear-line, and carriage-return control sequences. It runs for a fixed presentation duration of 2400 ms before the deterministic Q01 results are streamed.

The final flow is:

```text
[INF] Enumerating subdomains for <normalized-target>
<animated spinner>
portal.skynet-logistics.idx
security.skynet-logistics.idx
status.skynet-logistics.idx
www.skynet-logistics.idx
[INF] Found 4 subdomains for <normalized-target> in <elapsed> milliseconds
```

The animation is presentation-only and does not alter the Q01 result.

## Non-Q01 Targets

Unknown targets do not receive Q01 subdomains:

```text
[WRN] No subdomains found for <normalized-target>
```

## Runtime Observation

The production runtime previously rejected `subfinders` because the custom command was incorrectly registered as `subfinder`. That mismatch is corrected and locked as the plural Q01 command name.

## Final Disposition

`subfinders` is the **finalized Q01 gameplay command**. Future changes to command ownership, target normalization, result ordering, warning text, spinner behavior, or terminal presentation require explicit Q01 change control.
