# DEAD SIGNAL — Q01 Live Validation

Status: **REVISED — READY FOR LIVE VALIDATION**

## Preconditions

Use the development replay package for repeatable testing:

```powershell
npm run build:replay:q01
```

Install the complete `dist-replay/` contents into `HackHub/mods/dead-signal-dev/` and restart HackHub.

Use a fresh replay build after each code change. Each replay build receives a new quest identity.

## Live Scenario

1. Confirm `THE CONTRACT — DEV REPLAY` is visible in HackHub.
2. Accept the development quest.
3. Confirm Adrian's Q01 contract mail arrives.
4. Confirm the five locked objective names are presented in this order:

```text
Review audit scope
Scan 203.0.113.42
Identify exposed services
Perform basic vulnerability checks
Submit audit report
```

5. Confirm the client is **Skynet Logistics** and the target is `203.0.113.42`.
6. Open Terminal and run exactly once:

```bash
nmap 203.0.113.42
```

7. Confirm the result contains:

```text
22/tcp  OPEN  ssh
80/tcp  OPEN  http
443/tcp OPEN  https
```

8. Confirm Objectives 02 and 03 are satisfied.
9. Run the same Nmap command again. **Objective 04 must remain incomplete.**
10. Open the Skynet Logistics security surface in the FirebearBrowser using either:

```text
http://skynet-logistics.test/security
```

or:

```text
https://skynet-logistics.test/security
```

11. Confirm the page shows the Q01 audit findings, including the three exposed services and `No critical vulnerabilities identified.`
12. Confirm Objective 04 completes from the `Browser.Meta` interaction.
13. Submit the audit report with:

```text
Target: Skynet Logistics
Open Ports: 22, 80, 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

14. Confirm Objective 05 completes and the development quest finishes.
15. Confirm the replay build does not grant production XP/money and does not set:

```text
dead_signal.q01.completed
```

16. Confirm no Q14 or Phase 12 diagnostic content is exposed by the replay package.

## Objective 04 Boundary

Objective 04 must be satisfied only by the browser security-review interaction after service identification:

```text
Browser.Meta
  protocol: http: | https:
  hostname: skynet-logistics.test
  pathname: /security
```

Native SSH is not part of the Q01 acceptance path.

## Production Gate

Q01 is not considered production-PASS until the full scenario succeeds in the real HackHub runtime and the observed result is recorded in the Q01 final-lock document.
