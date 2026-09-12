# DEAD SIGNAL — Q01 Source Gate

Date: 2026-09-12
Status: **REVISED IMPLEMENTATION LOCK — LIVE VALIDATION PENDING**

## Source Authority

Q01 remains `dead_signal.q01` and keeps the locked five-objective structure and Phase 8 reward allocation. The explicit project revision for this implementation changes the client name from `Meridian Logistics` to `Skynet Logistics`, replaces the unreliable SSH gameplay dependency with HTTPS web-surface inspection, and narrows the live service scope to HTTPS on port 443.

The client-name change is an explicit change-control decision recorded by the project owner. It does not add a new character, flag, dependency, reward, or objective.

## Canonical Q01 Contract

- ID: `dead_signal.q01`
- Title: `THE CONTRACT`
- Chapter: `01 — DEAD SIGNAL`
- Location: Jakarta
- Primary: Adrian Cole
- Prerequisite: none
- Target: `203.0.113.42`
- Client: `Skynet Logistics`
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

## Revised Objective 04 Method

Objective 04 is satisfied by inspecting the authorized Skynet Logistics HTTPS audit surface:

```text
Host:   skynet-logistics.test
Path:   /security
URL:    https://skynet-logistics.test/security
```

Player-facing hint:

```text
Inspect web service and review the security findings.
```

The HackHub adapter registers the web surface with `@RegisterWebsite` and listens to the documented `Browser.Meta` event. The objective completes only when the player opens the exact security-review path over HTTPS after Objective 03 is complete.

No SSH command, SSH user, password, `Shell.addCommandData("ssh", ...)`, child SSH device, or `Terminal.SSH.Connected` event is required by Q01.

## Security-Assessment Semantics

The web page is an evidence surface for a basic, non-exploitative external assessment. It records the revised facts:

- target is `203.0.113.42`;
- 22/tcp is closed;
- 80/tcp is closed;
- 443/tcp is open and provides HTTPS;
- no critical vulnerabilities were identified during the basic assessment;
- further internal assessment is recommended.

Q01 still does not require exploitation, credential attacks, data extraction, or internal access.

## Report Contract

The report is valid only when the sent subject and plain-text body match:

```text
Subject: Security Audit — Jakarta

Target: Skynet Logistics
Open Ports: 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Canonical recipient:

```text
adrian.cole@deadsignal.lock
```

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

This document locks the revised implementation method, client-name revision, service scope, and email submission contract. **Production Q01 is not declared live-PASS until the revised five-step scenario succeeds in a clean HackHub run and the result is recorded.**
