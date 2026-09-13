# ENTITY RESOLUTION — Q01 Live Validation

Status: **REVISED — READY FOR LIVE VALIDATION**

## Preconditions

Use the development replay package for repeatable testing:

```powershell
npm run build:replay:q01
```

Install the complete `dist-replay/` contents into `HackHub/mods/entity-resolution-dev/` and restart HackHub.

Use a fresh replay build after each code change. Each replay build receives a new quest identity.

## Live Scenario

1. Confirm `THE CONTRACT — DEV REPLAY` is visible in HackHub.
2. Accept the development quest.
3. Confirm Adrian's Q01 contract mail arrives from:

```text
adrian.cole@entityresolution.lock
```

4. Confirm the five locked objective names are presented in this order:

```text
Review audit scope
Scan the ip target
Identify exposed services
Perform basic vulnerability checks
Submit audit report
```

5. Confirm the audit mail provides target `203.0.113.42` but does **not** provide the public web URL, company answer, or open-port answer in the report template.
6. Open Terminal and run the scan command from Objective 02:

```bash
nmap
```

The implementation also accepts `nmap 203.0.113.42` for compatibility with the terminal runtime.

7. Confirm the result contains:

```text
22/tcp  CLOSE  ssh
80/tcp  CLOSE  http
443/tcp OPEN   https
```

8. Confirm Objectives 02 and 03 are satisfied.
9. Run the Nmap command again. **Objective 04 must remain incomplete.**
10. Discover the canonical public web host from the target IP:

```bash
lynx 203.0.113.42
```

The implementation also accepts:

```bash
lynx https://203.0.113.42/
```

11. Confirm the Lynx response exposes:

```text
https://www.skynet-logistics.idx/
```

12. Enumerate the domain discovered from Lynx:

```bash
subfinder -d skynet-logistics.idx
```

13. Confirm exactly four subdomains are returned:

```text
portal.skynet-logistics.idx
security.skynet-logistics.idx
status.skynet-logistics.idx
www.skynet-logistics.idx
```

14. Open the discovered hosts in the FirebearBrowser:

```text
https://www.skynet-logistics.idx/
https://portal.skynet-logistics.idx/
https://status.skynet-logistics.idx/
https://security.skynet-logistics.idx/
```

15. Confirm `www` is the public homepage, `portal` and `status` return `403 FORBIDDEN`, and `security` is the only real audit surface.
16. Confirm the `security` page uses the black/green terminal-style presentation and shows the audit findings, including 443/tcp as OPEN and the basic assessment conclusion.
17. Confirm Objective 04 completes only from the HTTPS `Browser.Meta` interaction against:

```text
https://security.skynet-logistics.idx/
```

18. Verify that HTTP does not provide a Q01 audit path because port 80 is closed.
19. Submit the audit report using Adrian's supplied format:

```text
Format report audit:
Subject: Security Audit — Jakarta

Target: <COMPANY>
Open Ports: <PORTS>

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

20. Replace `<COMPANY>` and `<PORTS>` with the discovered values and send the normal in-game mail/reply.
21. Confirm Objective 05 completes only for the resolved canonical values, while literal placeholders do not complete the objective.
22. Confirm the development quest finishes and Adrian replies.
23. Confirm the replay build does not grant production XP/money and does not set:

```text
entity_resolution.q01.completed
```

24. Confirm no Q14 or Phase 12 diagnostic content is exposed by the replay package.

## Objective 04 Boundary

Objective 04 requires the following completed discovery chain before the final browser interaction:

```text
nmap
  ↓
lynx 203.0.113.42
  ↓
https://www.skynet-logistics.idx/
  ↓
subfinder -d skynet-logistics.idx
  ↓
security.skynet-logistics.idx
  ↓
Browser.Meta
```

The final browser interaction must use:

```text
protocol: https:
hostname: security.skynet-logistics.idx
pathname: /
port: 443 when supplied by the runtime
```

Native SSH is not part of the Q01 acceptance path.

## Web Boundary

Exactly four Q01 subdomains are modeled:

```text
www.skynet-logistics.idx
portal.skynet-logistics.idx
status.skynet-logistics.idx
security.skynet-logistics.idx
```

Behavior:

```text
www      → public homepage
portal   → 403 FORBIDDEN
status   → 403 FORBIDDEN
security → audit target
```

The apex domain is the enumeration root and is not registered as a Website. The canonical public host is discovered through Lynx.

## Open-Port Boundary

The Q01 target exposes only:

```text
22/tcp  CLOSE
80/tcp  CLOSE
443/tcp OPEN  https
```

Canonical HTTPS URLs omit `:443`. Where Browser.Meta supplies an explicit port, Q01 accepts only port `443` for the audit target.

## Email Boundary

Adrian's sender identity is canonical and must never be randomized:

```text
character.adrian.cole
adrian.cole@entityresolution.lock
```

Submission values are discovered rather than supplied directly:

```text
recipient = adrian.cole@entityresolution.lock
subject   = Security Audit — Jakarta
body      = resolved report using the supplied template
```

## Production Gate

Q01 is not considered production-PASS until the full scenario succeeds in the real HackHub runtime and the observed result is recorded in the Q01 final-lock documentation.
