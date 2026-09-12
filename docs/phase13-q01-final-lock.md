# DEAD SIGNAL — Q01 Final Lock

Date: 2026-09-12
Status: **FINAL LOCK — REVISED WEB SURFACE & REPORT DISCOVERY; LIVE VALIDATION PENDING**

## Lock Scope

This document is the current implementation lock for Q01 after the project-owner revision to the public web surface, audit-page presentation, and report-submission discovery flow.

The lock preserves the recovered story sequence, five objectives, canonical runtime state, rewards, and non-exploitative assessment boundary.

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

## Locked Web Surface

Canonical public home:

```text
https://skynet-logistics.idx/
```

Canonical audit page:

```text
https://skynet-logistics.idx/security
```

The Website registration intentionally contains only two pages:

```text
/          public company homepage
/security  external security review
```

No other web paths are registered by Q01, so unlisted paths do not have Q01 pages. The project-owner wording of "sub-domain" is preserved as a gameplay-facing web-surface concept; `/security` remains an HTTP path under the requested host rather than a separate DNS hostname.

The homepage is intentionally more polished and corporate so the player can discover the client identity naturally. The security page uses a black/green terminal-style visual treatment and exposes the assessment evidence needed to complete Q01.

## Locked Objective 04 Method

Native SSH is outside the Q01 critical path.

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

Objective 04 completes only when Objective 03 is complete and `Browser.Meta` reports:

```text
protocol = https:
hostname = skynet-logistics.idx
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

## Locked Q01 Report Discovery Contract

Adrian's email no longer supplies the answer values directly. It supplies the format the player must complete from the audit evidence:

```text
Format report audit:
Subject: Security Audit — Jakarta

Target: <COMPANY>
Open Ports: <PORTS>

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

The report recipient remains the canonical Adrian address and is still surfaced by the Objective 05 hint:

```text
adrian.cole@deadsignal.lock
```

The player is expected to discover:

```text
COMPANY = the audited client identity
PORTS   = the open external port(s) observed during the audit
```

For Q01's canonical world state the resolved submission is:

```text
Target: Skynet Logistics
Open Ports: 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Objective 05 completes only when the sent subject and plain-text body match the resolved canonical values. The placeholders are not accepted as a valid submission.

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

Replay builds remain isolated from production completion state and rewards, but they now use the same revised `.idx` web host and report-discovery template.

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
open https://skynet-logistics.idx/security
 ↓
complete Objective 04
 ↓
discover COMPANY and PORTS from the audit surfaces
 ↓
send Security Audit — Jakarta using the resolved report values
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

The story sequence is preserved. The client is `Skynet Logistics`. The canonical public host is `skynet-logistics.idx`. The homepage is `/`, the only registered audit page is `/security`, and other paths are intentionally unregistered. Objective 04 remains HTTPS-only on `/security`. Adrian's report email now supplies a format with `<COMPANY>` and `<PORTS>` placeholders so the player must derive the values from the audit evidence before submission. Further changes require explicit change control after this lock.
