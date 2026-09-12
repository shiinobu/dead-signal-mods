# DEAD SIGNAL — Q01 Source Gate

Date: 2026-09-12
Status: **REVISED IMPLEMENTATION LOCK — LIVE VALIDATION PENDING**

## Source Authority

Q01 remains `dead_signal.q01` and keeps the locked five-objective structure and Phase 8 reward allocation. The explicit project revision for this implementation changes the client name from `Meridian Logistics` to `Skynet Logistics` and replaces the unreliable SSH gameplay dependency with an HTTP/HTTPS web-surface inspection.

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
2. `Scan 203.0.113.42`
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

## Expected Service Enumeration

```text
22/tcp  OPEN  ssh
80/tcp  OPEN  http
443/tcp OPEN  https
```

The SSH service remains an observed exposed service and remains part of the report facts. It is no longer the required completion mechanism for Objective 04.

## Revised Objective 04 Method

Objective 04 is now satisfied by inspecting the authorized Skynet Logistics web audit surface:

```text
Host:   skynet-logistics.test
Path:   /security
HTTP:   http://skynet-logistics.test/security
HTTPS:  https://skynet-logistics.test/security
```

The HackHub adapter registers the web surface with `@RegisterWebsite` and listens to the documented `Browser.Meta` event. The objective completes only when the player opens the exact security-review path over HTTP or HTTPS after Objective 03 is complete.

No SSH command, SSH user, password, `Shell.addCommandData("ssh", ...)`, child SSH device, or `Terminal.SSH.Connected` event is required by Q01.

## Security-Assessment Semantics

The web page is an evidence surface for a basic, non-exploitative external assessment. It records the already-locked facts:

- target is `203.0.113.42`;
- exposed services are 22/80/443;
- no critical vulnerabilities were identified during the basic assessment;
- further internal assessment is recommended.

Q01 still does not require exploitation, credential attacks, data extraction, or internal access.

## Report Contract

The report is valid only when it contains:

```text
Target: Skynet Logistics
Open Ports: 22, 80, 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
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

This document locks the revised implementation method and client-name revision. **Production Q01 is not declared live-PASS or production-locked until the revised five-step scenario succeeds in a clean HackHub run and the result is recorded.**
