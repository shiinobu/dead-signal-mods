# DEAD SIGNAL — Q01 Final Lock

Date: 2026-09-12
Status: **FINAL LOCK — REVISED DESIGN & IMPLEMENTATION METHOD; LIVE VALIDATION PENDING**

## Lock Scope

This document is the final implementation lock for Q01 after the explicit project-owner methodology revision.

The lock preserves the recovered story contract while changing only the explicitly approved client name, service scope, Objective 02 presentation, Objective 04 gameplay method, and canonical email/report contract.

## Canonical Identity

```text
ID:            dead_signal.q01
Title:         THE CONTRACT
Chapter:       01 — DEAD SIGNAL
Location:      Jakarta
Primary:       Adrian Cole
Prerequisite:  none
Client:        Skynet Logistics
Target:        203.0.113.42
Completion:    audit report submitted
State:         dead_signal.q01.completed = true
Money:         $200
Maximum XP:    80
```

## Locked Objectives

```text
01 Review audit scope
02 Scan the ip target
03 Identify exposed services
04 Perform basic vulnerability checks
05 Submit audit report
```

Objective IDs remain:

```text
q01.objective.01
q01.objective.02
q01.objective.03
q01.objective.04
q01.objective.05
```

Objective 02 exposes only the terminal command `nmap`; the target IP is not shown in the objective text.

Objective 03 has no hint.

Objective 04 uses the player-facing hint:

```text
Inspect web service and review the security findings.
```

## Locked Service Facts

```text
22/tcp  CLOSED  ssh
80/tcp  CLOSED  http
443/tcp OPEN    https
```

The Q01 gameplay path focuses on HTTPS over port 443.

## Locked Objective 04 Method

Native SSH is **removed from the Q01 critical path**.

The canonical method is:

```text
Identify exposed services
        ↓
Open Skynet Logistics security web service
        ↓
HTTPS Browser.Meta interaction
        ↓
Basic vulnerability assessment complete
```

Required web surface:

```text
Host:   skynet-logistics.test
Path:   /security
URL:    https://skynet-logistics.test/security
```

Objective 04 completes only when Objective 03 is complete and `Browser.Meta` reports:

```text
protocol = https:
hostname = skynet-logistics.test
pathname = /security
```

HTTP is not an accepted Objective 04 protocol.

## Security-Assessment Boundary

The Q01 assessment is deliberately non-exploitative.

The quest does not require:

```text
credential attacks
internal access
data extraction
remote-code execution
SQL injection
SSH access
```

## Locked Character Email Contract

Adrian Cole has a canonical, non-random identity:

```text
character.adrian.cole
adrian.cole@deadsignal.lock
```

Future recurring character identities must be defined in the content layer and must not be randomly generated.

## Locked Q01 Report Submission Contract

```text
To:      adrian.cole@deadsignal.lock
Subject: Security Audit — Jakarta

Target: Skynet Logistics
Open Ports: 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Objective 05 completes only when the sent email subject and plain-text body match the canonical contract. The intended player flow is to select the supplied report subject/template and send it without manually inventing the quest-critical wording.

## Rewards

```text
35 XP  — Complete external audit
20 XP  — Network/service enumeration
10 XP  — Basic vulnerability assessment
15 XP  — Submit correct report
--------------------------------
80 XP total

$200
```

## Runtime Ownership

No Phase 9–12 ownership boundary changes are introduced.

```text
StateStore            canonical root state
FlagStore             state facade
ConditionNode         canonical condition representation
QuestService          quest lifecycle
NarrativeStateService narrative state
AccessService         capabilities/access
RewardService         XP
EconomyService        cash
EndingService         endings
HackHub adapters      SDK/game integration only
```

## Replay Tooling

The maintained Q01 replay tool remains:

```text
scripts/build-q01-replay.ts
```

Replay builds remain isolated from production completion state and rewards.

## Production Validation Status

This remains a **final implementation lock**, not a false live-PASS declaration.

The live production gate is:

```text
build
 ↓
install clean production package
 ↓
accept Q01
 ↓
complete objectives 01–03
 ↓
verify 22/ssh CLOSED, 80/http CLOSED, 443/https OPEN
 ↓
open /security over HTTPS
 ↓
complete Objective 04
 ↓
send canonical Security Audit — Jakarta subject/body
 ↓
complete Objective 05
 ↓
verify Q01 completion + $200 + 80 XP
 ↓
record PASS
```

Until that real-game gate is observed, Q02 must not be activated in production.

## Final Disposition

**Q01 REVISED IMPLEMENTATION LOCKED.**

The story sequence is preserved. The client is `Skynet Logistics`. The Q01 service scope is HTTPS-only for gameplay, native SSH is outside the critical path, Objective 02 hides the target IP from its player-facing command text, Objective 03 has no hint, Objective 04 uses the concise web-service hint, and Objective 05 is gated by the canonical email subject/body. Further changes require explicit change control after this lock.
