# DEAD SIGNAL — Q01 Live Validation

Status: **READY FOR LIVE TEST — CERTIFICATE FLOW CORRECTION PENDING VALIDATION**

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
9. Run the same Nmap command again. **The certificate/basic-assessment objective must not complete.**
10. After the scan, open the generated virtual filesystem record:

```text
~/meridian-443-certificate.txt
```

11. Confirm the record contains the HTTPS certificate inspection details, including:

```text
Target: 203.0.113.42
Port: 443/tcp
Service: HTTPS
Issuer: ARKA Secure Infrastructure
```

12. Confirm the certificate/basic-assessment objective completes and the report objective becomes the next actionable step.
13. Submit the audit report using the source-defined report facts, including:

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

```text
01  Review audit scope
02  Run nmap against 203.0.113.42
03  Confirm exposed services: 22 / 80 / 443
04  Inspect the HTTPS certificate record for port 443
05  Send the completed audit report to Adrian
```

Objective 04 is the implementation-level realization of the locked `basic vulnerability checks` objective and the source technical interaction's certificate inspection. The HackHub `openssl` command is not used here because the in-game command is an encryption/decryption utility, not a TLS certificate inspection tool. The certificate inspection is therefore represented through the supported virtual filesystem and `Files.Open` event.

## Expected Canonical State (production only)

```text
dead_signal.q01.completed = true
```

The development replay must not set this production flag.

## PASS Gate

Q01 may be marked **PASS / LOCKED** only when the full scenario succeeds in the real HackHub game and the result is recorded. Typecheck, tests, and build success alone are not sufficient.
