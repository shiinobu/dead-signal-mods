# DEAD SIGNAL — Q01 Live Validation

Status: **READY FOR LIVE TEST — NOT YET PASSED**

## Preconditions

Use a fresh/cleared DEAD SIGNAL save for the first Q01 run. Do not use a save containing the superseded Q14 development state.

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
5. Confirm the Q01 objective list exposes the audit flow.
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

9. Confirm the scan and exposed-service objectives advance.
10. Submit the audit report using the source-defined report facts, including:

```text
Target: Meridian Logistics
Open Ports: 22, 80, 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

11. Confirm the basic-assessment and report objectives complete.
12. Confirm Q01 completes and Q02 becomes the next campaign target.
13. Confirm the player receives `$200` and `80 XP` maximum according to the locked Phase 8 allocation.
14. Restart/reload and confirm the completed Q01 state persists.
15. Confirm no Q14 or Phase 12 diagnostic content is exposed by the production package.

## Expected Canonical State

```text
dead_signal.q01.completed = true
```

No additional persistent Q01 story flags are required by the recovered source.

## PASS Gate

Q01 may be marked **PASS / LOCKED** only when the full scenario succeeds in the real HackHub game and the result is recorded. Typecheck, tests, and build success alone are not sufficient.
