# DEAD SIGNAL — Q01 Live Validation

Status: **READY FOR LIVE TEST — BASIC-ASSESSMENT FLOW CORRECTION PENDING VALIDATION**

## Preconditions

Use the development replay package for repeatable Q01 testing:

```powershell
npm run build:replay:q01
```

Install `dist-replay/` into `HackHub/mods/dead-signal-dev/` and restart HackHub.

Use a fresh replay build after each code change. Do not use an older replay package because every replay build intentionally receives a new quest identity.

## Live Scenario

1. Confirm `THE CONTRACT — DEV REPLAY` is visible in HackHub.
2. Apply the development quest.
3. Confirm Adrian's Q01 contract mail arrives.
4. Confirm the five Q01 objectives are presented in their intended order.
5. Review the Meridian Logistics scope and target `203.0.113.42`.
6. Open Terminal and run:

```bash
nmap 203.0.113.42
```

7. Confirm the result contains:

```text
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
```

8. Confirm the scan and exposed-service objectives advance.
9. Run the same plain Nmap command again. **The basic-assessment objective must not complete.**
10. Run the supported service/version check:

```bash
nmap 203.0.113.42 -sV
```

11. Confirm the basic-assessment objective completes and the report objective becomes the next actionable step.
12. Submit the audit report using the source-defined report facts, including:

```text
Target: Meridian Logistics
Open Ports: 22, 80, 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

13. Confirm the audit-report objective completes and the development quest finishes.
14. Confirm the replay build does not grant production XP/money and does not set `dead_signal.q01.completed`.
15. Confirm no Q14 or Phase 12 diagnostic content is exposed by the development package.

## Objective UX Contract

```text
01  Review audit scope
02  Run nmap against 203.0.113.42
03  Confirm exposed services: 22 / 80 / 443
04  Run nmap 203.0.113.42 -sV for the basic security/service check
05  Send the completed audit report to Adrian
```

Objective 04 is the implementation-level realization of the locked `basic vulnerability checks` objective. The recovered story/technical source includes certificate inspection, but HackHub's built-in `openssl` command does not provide TLS inspection and custom terminal command registration has not been validated in the live runtime. The current Q01 implementation therefore uses the supported `nmap -sV` service/version scan as the concrete, read-only assessment action. No exploitation is required.

## Expected Canonical State (production only)

```text
dead_signal.q01.completed = true
```

The development replay must not set this production flag.

## PASS Gate

Q01 may be marked **PASS / LOCKED** only when the full scenario succeeds in the real HackHub game and the result is recorded. Typecheck, tests, and build success alone are not sufficient.
