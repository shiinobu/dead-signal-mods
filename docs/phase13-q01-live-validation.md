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

5. Confirm the audit mail provides target `203.0.113.42` but does **not** directly provide the company name in the report template.
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
10. Open the public Skynet Logistics home page:

```text
https://skynet-logistics.idx/
```

11. Confirm the homepage identifies **Skynet Logistics** and provides the public security-review route.
12. Open the security-review surface in the FirebearBrowser using:

```text
https://skynet-logistics.idx/security
```

13. Confirm the page uses a black/green terminal-style presentation and shows the Q01 audit findings, including the two closed services, the exposed HTTPS service, and `No critical vulnerabilities identified.`
14. Confirm Objective 04 completes from the `Browser.Meta` interaction.
15. Submit the audit report using Adrian's supplied format. The incoming email must contain:

```text
Format report audit:
Subject: Security Audit — Jakarta

Target: <COMPANY>
Open Ports: <PORTS>

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

16. Replace `<COMPANY>` and `<PORTS>` with the values discovered during the audit and send the normal in-game mail/reply.
17. Confirm Objective 05 completes only for the resolved canonical values, while literal placeholders do not complete the objective.
18. Confirm the development quest finishes and Adrian replies.
19. Confirm the replay build does not grant production XP/money and does not set:

```text
dead_signal.q01.completed
```

20. Confirm no Q14 or Phase 12 diagnostic content is exposed by the replay package.

## Objective 04 Boundary

Objective 04 must be satisfied only by the HTTPS security-review interaction after service identification:

```text
Browser.Meta
  protocol: https:
  hostname: skynet-logistics.idx
  pathname: /security
```

Native SSH is not part of the Q01 acceptance path.

## Web Boundary

The production website intentionally registers only two pages:

```text
/
/security
```

The root homepage is the public discovery surface. `/security` is the only audit page. Other paths are not registered by Q01 and therefore do not have Q01 pages.

## Email Boundary

Adrian's sender identity is canonical and must never be randomized:

```text
character.adrian.cole
adrian.cole@deadsignal.lock
```

Submission values are discovered rather than supplied directly:

```text
recipient = adrian.cole@deadsignal.lock
subject   = Security Audit — Jakarta
body      = resolved report using the supplied template
```

The resolved Q01 world-state values are:

```text
Target: Skynet Logistics
Open Ports: 443
```

Objective 05 is not completed from arbitrary content or from literal placeholders.

## Production Gate

Q01 is not considered production-PASS until the full scenario succeeds in the real HackHub runtime and the observed result is recorded in the Q01 final-lock document.
