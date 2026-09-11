# DEAD SIGNAL — Q01 Live Validation

Status: **READY FOR LIVE TEST**

## Preconditions

Use the development replay package for repeatable Q01 testing:

```powershell
npm run build:replay:q01
```

Install `dist-replay/` into `HackHub/mods/dead-signal-dev/` and restart HackHub.

Use a fresh replay build after each code change. Each replay build receives a new quest identity.

## Live Scenario

1. Confirm `THE CONTRACT — DEV REPLAY` is visible in HackHub.
2. Apply the development quest.
3. Confirm Adrian's Q01 contract mail arrives.
4. Confirm the five locked objective names are presented in this order:

```text
Review audit scope
Scan 203.0.113.42
Identify exposed services
Perform basic vulnerability checks
Submit audit report
```

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

8. Confirm objectives 2–3 are satisfied by the valid Nmap result.
9. Run the same Nmap command again. **Objective 04 must remain incomplete.**
10. For the development replay, run the Q01-scoped SSH audit command:

```bash
ssh-audit -h audit@203.0.113.42
```

11. Confirm the terminal returns the Q01 deterministic audit result without invoking HackHub's engine-owned native `ssh` transport.
12. Confirm Objective 04 completes only after the Q01 SSH-audit command returns the expected `203.0.113.42 / OPEN` result.
13. Submit the audit report using the source-defined facts, including:

```text
Target: Meridian Logistics
Open Ports: 22, 80, 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

14. Confirm the audit-report objective completes and the development quest finishes.
15. Confirm the replay build does not grant production XP/money and does not set `dead_signal.q01.completed`.
16. Confirm no Q14 or Phase 12 diagnostic content is exposed by the development package.

## Objective UX Contract

The main objective text follows the locked Phase 8 names. Supporting affordances remain selective:

```text
Review audit scope
Scan 203.0.113.42       [Terminal]
Identify exposed services [?]
Perform basic vulnerability checks [Terminal]
Submit audit report      [?]
```

Hints provide short contextual help and must never expose internal mod paths.

## Runtime Interaction Detail

Q01 Nmap and SSH-audit interactions use quest-scoped `Shell.addCommandData()` responses. The built-in `ssh` command is engine-owned and, in the current live HackHub runtime, can report `Connection could not be established` even when a modded target advertises port 22 as OPEN. The replay therefore uses the distinct `ssh-audit` command so the Q01 validation path is deterministic and does not rely on native SSH transport.

The SSH-audit command data is scoped to:

```text
command: ssh-audit
host: audit@203.0.113.42
response: 203.0.113.42 / OPEN
```

The production adapter uses the same deterministic command-data contract until native modded SSH transport is proven functional in the target HackHub runtime.

## Expected Canonical State (production only)

```text
dead_signal.q01.completed = true
```

The development replay must not set this production flag.

## PASS Gate

Q01 may be marked **PASS / LOCKED** only when the full scenario succeeds in the real HackHub game and the result is recorded. Typecheck, tests, and build success alone are not sufficient.
