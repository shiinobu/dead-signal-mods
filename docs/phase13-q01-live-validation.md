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
3. Confirm Adrian's Q01 contract mail arrives from:

```text
adrian.cole@deadsignal.lock
```

4. Confirm the five locked objective names are presented in this order:

```text
Review audit scope
Scan the ip target
Identify exposed services
Perform basic vulnerability checks
Submit audit report
```

5. Confirm the client is **Skynet Logistics** and the target is `203.0.113.42` in the audit mail.
6. Open Terminal and run the scan command from Objective 02:

```bash
nmap
```

The implementation also accepts `nmap 203.0.113.42` for compatibility with the terminal runtime.

7. Confirm the result contains:

```text
22/tcp  CLOSED  ssh
80/tcp  CLOSED  http
443/tcp OPEN    https
```

8. Confirm Objectives 02 and 03 are satisfied.
9. Run the same Nmap command again. **Objective 04 must remain incomplete.**
10. Open the Skynet Logistics security surface in the FirebearBrowser using:

```text
https://skynet-logistics.test/security
```

11. Confirm the page shows the Q01 audit findings, including the two closed services, the exposed HTTPS service, and `No critical vulnerabilities identified.`
12. Confirm Objective 04 completes from the `Browser.Meta` interaction.
13. Submit the audit report using the canonical mail contract:

```text
To: adrian.cole@deadsignal.lock
Subject: Security Audit — Jakarta

Target: Skynet Logistics
Open Ports: 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

The exact report text is included in Adrian's contract mail. The player uses the normal in-game mail compose/reply flow.

14. Confirm Objective 05 completes when the sent subject and plain-text body match the canonical report contract, then confirm the development quest finishes.
15. Confirm the replay build does not grant production XP/money and does not set:

```text
dead_signal.q01.completed
```

16. Confirm no Q14 or Phase 12 diagnostic content is exposed by the replay package.

## Objective 04 Boundary

Objective 04 must be satisfied only by the HTTPS security-review interaction after service identification:

```text
Browser.Meta
  protocol: https:
  hostname: skynet-logistics.test
  pathname: /security
```

Native SSH is not part of the Q01 acceptance path.

## Email Boundary

Adrian's sender identity is canonical and must never be randomized:

```text
character.adrian.cole
adrian.cole@deadsignal.lock
```

Quest-critical submission values are canonical:

```text
recipient = adrian.cole@deadsignal.lock
subject   = Security Audit — Jakarta
body      = Q01_REPORT_BODY
```

Objective 05 is not completed from arbitrary content: the sent subject and plain-text body must match the canonical contract.

## Production Gate

Q01 is not considered production-PASS until the full scenario succeeds in the real HackHub runtime and the observed result is recorded in the Q01 final-lock document.
