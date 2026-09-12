# DEAD SIGNAL — Q01 Source Gate

Date: 2026-09-12
Status: **REVISED IMPLEMENTATION LOCK — LIVE VALIDATION PENDING**

## Source Authority

Q01 remains `dead_signal.q01` and keeps the locked five-objective structure and Phase 8 reward allocation. The current project-owner revision changes the public web host to `skynet-logistics.idx`, adds a richer public homepage, keeps `/security` as the only registered audit page, and changes Adrian's report email from an answer-bearing body to a player-completed report format.

The revision does not add a new character, persistent flag, dependency, reward, or objective.

## Canonical Q01 Contract

- ID: `dead_signal.q01`
- Title: `THE CONTRACT`
- Chapter: `01 — DEAD SIGNAL`
- Location: Jakarta
- Primary: Adrian Cole
- Prerequisite: none
- Target: `203.0.113.42`
- Client: `Skynet Logistics`
- Public host: `skynet-logistics.idx`
- Completion: audit report submitted
- Persistent completion state: `dead_signal.q01.completed = true`
- Reward: `$200`, up to `80 XP`

## Locked Player Objectives

1. `Review audit scope`
2. `Scan the ip target`
3. `Identify exposed services`
4. `Perform basic vulnerability checks`
5. `Submit audit report`

Objective IDs remain unchanged:

```text
q01.objective.01
q01.objective.02
q01.objective.03
q01.objective.04
q01.objective.05
```

Objective 02 presents only the terminal command `nmap`; the target IP is supplied by the audit material rather than displayed in the objective command text.

Objective 03 intentionally has no hint.

## Revised Service Enumeration

```text
22/tcp  CLOSED  ssh
80/tcp  CLOSED  http
443/tcp OPEN    https
```

Port 443/HTTPS is the only exposed gameplay service used by the revised Q01 flow. SSH and HTTP remain scan evidence as closed ports but are not interaction requirements.

## Revised Web Surface

Canonical public homepage:

```text
https://skynet-logistics.idx/
```

Canonical security-review page:

```text
https://skynet-logistics.idx/security
```

The Q01 Website registers only:

```text
/          public company homepage
/security  external HTTPS security review
```

No other Q01 pages are registered. This intentionally limits the active web surface while allowing the root homepage and the single audit page to exist. In URL terminology, `/security` is a path under the host rather than a DNS subdomain; the requested gameplay URL form is retained exactly.

## Revised Objective 04 Method

Objective 04 is satisfied by inspecting the authorized Skynet Logistics HTTPS audit surface:

```text
Host:   skynet-logistics.idx
Path:   /security
URL:    https://skynet-logistics.idx/security
```

Player-facing hint:

```text
Inspect web service and review the security findings.
```

The HackHub adapter registers the web surface with `@RegisterWebsite` and listens to the `Browser.Meta` event. The objective completes only when the player opens the exact security-review path over HTTPS after Objective 03 is complete.

No SSH command, SSH user, password, `Shell.addCommandData("ssh", ...)`, child SSH device, or `Terminal.SSH.Connected` event is required by Q01.

## Security-Assessment Semantics

The web page is an evidence surface for a basic, non-exploitative external assessment. It records the revised facts:

- target is `203.0.113.42`;
- 22/tcp is closed;
- 80/tcp is closed;
- 443/tcp is open and provides HTTPS;
- no critical vulnerabilities were identified during the basic assessment;
- further internal assessment is recommended.

The homepage separately establishes `Skynet Logistics` as the client identity, while the security page exposes the port evidence.

Q01 still does not require exploitation, credential attacks, data extraction, or internal access.

## Report Contract

Adrian's email now provides the player-facing report format:

```text
Format report audit:
Subject: Security Audit — Jakarta

Target: <COMPANY>
Open Ports: <PORTS>

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Canonical recipient:

```text
adrian.cole@deadsignal.lock
```

The player must discover the company name and open port value from the audit surfaces. For the current Q01 world state, the resolved accepted body is:

```text
Target: Skynet Logistics
Open Ports: 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Literal `<COMPANY>` and `<PORTS>` placeholders are not accepted by the quest validator.

## XP Authority

```text
Complete external audit             35 XP
Network/service enumeration         20 XP
Basic vulnerability assessment     10 XP
Submit correct report              15 XP
----------------------------------------
Total                               80 XP
```

## State Boundary

Only the recovered canonical completion flag is persisted:

```text
dead_signal.q01.completed = true
```

Web interaction state is transient quest data owned by the HackHub quest instance. No new persistent story flags are introduced.

## Production Lock Boundary

This document locks the revised `.idx` web host, root homepage, single `/security` audit page, terminal-style security presentation, and player-completed report template. **Production Q01 is not declared live-PASS until the revised five-step scenario succeeds in a clean HackHub run and the result is recorded.**
