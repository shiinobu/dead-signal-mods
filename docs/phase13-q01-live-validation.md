# DEAD SIGNAL — Q01 Live Validation

Status: **READY FOR LIVE TEST — UX CORRECTION PENDING VALIDATION**

## Preconditions

Use a fresh/cleared DEAD SIGNAL save for the first Q01 run. Do not use a save containing superseded Q14 development state.

Build the current repository with:

```powershell
npm run typecheck
npm test
npm run build
```

Install the generated `dist/` package into the HackHub `mods/` directory and restart HackHub.

## Live Scenario

1. Confirm `DEAD SIGNAL` loads without diagnostic Phase 12 notifications.
2. Open HackHub feed and locate the Adrian Cole Q01 job post.
3. Claim `THE CONTRACT`.
4. Confirm Adrian's `Security Audit — Jakarta` email arrives.
5. Confirm the five Q01 objectives are presented in their intended order.
6. Review the Meridian Logistics scope and target `203.0.113.42`.
7. Open Terminal and run:

```bash
nmap 203.0.113.42
```

8. Confirm the result contains:

```text
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
```

9. Confirm the scan and exposed-service objectives advance. Re-running the same Nmap command must **not** complete the certificate/basic-assessment objective.
10. Perform the basic security check by inspecting the HTTPS certificate on port 443:

```bash
openssl s_client -connect 203.0.113.42:443
```

11. Confirm the certificate/basic-assessment objective completes and the report objective becomes the next actionable step.
12. Submit the audit report using the source-defined report facts, including:

```text
Target: Meridian Logistics
Open Ports: 22, 80, 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

13. Confirm the audit-report objective completes.
14. Confirm Q01 completes and Q02 becomes the next campaign target.
15. Confirm the player receives `$200` and `80 XP` maximum according to the locked Phase 8 allocation.
16. Restart/reload and confirm the completed Q01 state persists.
17. Confirm no Q14 or Phase 12 diagnostic content is exposed by the production package.

## Objective UX Contract

```text
01  Review audit scope
02  Run nmap against 203.0.113.42
03  Confirm exposed services: 22 / 80 / 443
04  Inspect HTTPS certificate on 443
05  Submit the completed audit report
```

Objective 04 is the implementation-level realization of the locked `basic vulnerability checks` objective and the source technical interaction's certificate inspection. The concrete terminal command is an implementation mapping chosen to make that action explicit to the player; the story canon remains the inspection itself, not the command syntax.

## Expected Canonical State

```text
dead_signal.q01.completed = true
```

No additional persistent Q01 story flags are required by the recovered source.

## PASS Gate

Q01 may be marked **PASS / LOCKED** only when the full scenario succeeds in the real HackHub game and the result is recorded. Typecheck, tests, and build success alone are not sufficient.
