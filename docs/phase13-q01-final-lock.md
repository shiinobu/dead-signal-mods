# DEAD SIGNAL — Q01 Final Lock

Date: 2026-09-12
Status: **FINAL LOCK — REVISED DESIGN & IMPLEMENTATION METHOD; LIVE PRODUCTION VALIDATION PENDING**

## Lock Scope

This document is the final implementation lock for Q01 after the explicit project-owner methodology revision.

The lock preserves the recovered story contract while changing only the explicitly approved client name and the gameplay method used for Objective 04.

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

The Phase 8 five-objective structure remains unchanged:

```text
01 Review audit scope
02 Scan 203.0.113.42
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

## Locked Service Facts

```text
22/tcp  OPEN  ssh
80/tcp  OPEN  http
443/tcp OPEN  https
```

These facts remain report evidence. The existence of the SSH service does not make SSH a required gameplay interaction.

## Locked Objective 04 Method

Native SSH is **removed from the Q01 critical path**.

The canonical Q01 implementation method for Objective 04 is:

```text
Identify exposed services
        ↓
Open Skynet Logistics web security surface
        ↓
HTTP/HTTPS Browser.Meta interaction
        ↓
Basic vulnerability assessment complete
```

Required web surface:

```text
Host:   skynet-logistics.test
Path:   /security
HTTP:   http://skynet-logistics.test/security
HTTPS:  https://skynet-logistics.test/security
```

The adapter registers the website through the official Website API and completes Objective 04 only when `Browser.Meta` reports:

```text
protocol = http: OR https:
hostname = skynet-logistics.test
pathname = /security
```

Objective 04 additionally requires Objective 03 to already be complete.

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

The web page is an evidence surface for the basic external assessment.

## Report Contract

A valid report contains:

```text
Target: Skynet Logistics
Open Ports: 22, 80, 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

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
StateStore          canonical root state
FlagStore           state facade
ConditionNode       canonical condition representation
QuestService        quest lifecycle
NarrativeStateService narrative state
AccessService       capabilities/access
RewardService       XP
EconomyService      cash
EndingService       endings
HackHub adapters    SDK/game integration only
```

## Replay Tooling

The maintained Q01 replay tool remains:

```text
scripts/build-q01-replay.ts
```

Replay builds remain isolated from:

```text
dead_signal.q01.completed
production XP
production cash
Q02–Q16 registration
```

## Cleanup Lock

The following obsolete SSH-only smoke-test tooling is removed from the active repository:

```text
dev/ssh-full-scaffold-smoke-*
dev/ssh-native-smoke-*
scripts/build-ssh-full-scaffold-smoke.ts
scripts/build-ssh-native-smoke.ts
scripts/build-ssh-native-random-smoke.ts
docs/phase13-ssh-full-scaffold-smoke.md
docs/phase13-ssh-native-smoke-test.md
```

The active replay fixture is retained.

## Production Validation Status

This is a **final implementation lock**, not a false live-PASS declaration.

The live production gate remains:

```text
build
 ↓
install clean production package
 ↓
accept Q01
 ↓
complete objectives 01–03
 ↓
open /security over HTTP or HTTPS
 ↓
complete Objective 04
 ↓
submit correct Skynet Logistics report
 ↓
verify Q01 completion + $200 + 80 XP
 ↓
record PASS
```

Until that real-game gate is observed, Q02 must not be activated in production.

## Final Disposition

**Q01 REVISED IMPLEMENTATION LOCKED.**

The story sequence is preserved. The client is now `Skynet Logistics`. Objective 04 uses HTTP/HTTPS web inspection instead of the unreliable native SSH path. Further changes require explicit change control after this lock.
