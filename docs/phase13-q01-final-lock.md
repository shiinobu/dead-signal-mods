# DEAD SIGNAL — Q01 Final Lock

Date: 2026-09-12
Status: **FINAL LOCK — LYNX/SUBDOMAIN RECON; LIVE VALIDATION PENDING**

## Lock Scope

This document is the current implementation lock for Q01 after the approved Lynx/subdomain reconnaissance amendment.

The story intent, client, target, five objectives, canonical completion state, rewards, and non-exploitative assessment boundary remain unchanged. The web discovery model is now genuinely subdomain-based.

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

Objective 02 exposes only `nmap`; the target IP is supplied by Adrian's audit material.

Objective 03 has no hint.

Objective 04 directs the player toward discovery and inspection of the web security surface without directly naming the target host.

## Locked Service Facts

```text
22/tcp  CLOSE  ssh
80/tcp  CLOSE  http
443/tcp OPEN   https
```

Only HTTPS on port 443 is exposed for the Q01 web flow. Canonical HTTPS URLs omit the explicit `:443`.

## Locked Web Discovery Contract

Apex domain:

```text
skynet-logistics.idx
```

Exactly four subdomains exist:

```text
www.skynet-logistics.idx
portal.skynet-logistics.idx
status.skynet-logistics.idx
security.skynet-logistics.idx
```

Behavior:

```text
www      → public operations homepage
portal   → 403 FORBIDDEN
status   → 403 FORBIDDEN
security → Q01 audit target
```

The apex hostname is the subdomain-enumeration root and is not registered as a Website.

## Lynx Discovery Contract

The canonical public web identity is discovered from the target IP using the HackHub Shell `lynx` fixture:

```text
lynx 203.0.113.42
```

Compatibility input:

```text
lynx https://203.0.113.42/
```

Expected `lynx` address:

```text
https://www.skynet-logistics.idx/
```

The implementation uses the HackHub SDK's typed `lynx` response shape and `address` field. citeturn313821search0

## Subfinder Contract

The Q01 Shell fixture accepts:

```text
subfinder -d skynet-logistics.idx
```

and returns exactly the four locked subdomains.

`subfinder` is implemented as a deterministic Q01 command fixture through `Shell.addCommandData()` rather than as an external network dependency. The HackHub SDK documents `Shell.addCommandData()` as the mechanism for injecting command response data; custom command names may use arbitrary input/data. citeturn313821search0

## Objective 04 Method

The canonical method is:

```text
Identify exposed services
        ↓
lynx 203.0.113.42
        ↓
https://www.skynet-logistics.idx/
        ↓
subfinder -d skynet-logistics.idx
        ↓
security.skynet-logistics.idx
        ↓
HTTPS Browser inspection
```

Objective 04 completes only after the discovery chain has completed and `Browser.Meta` reports:

```text
protocol = https:
hostname = security.skynet-logistics.idx
pathname = /
```

The actual network model exposes only 443/tcp for HTTPS, so HTTP/80 is outside the accepted audit transport.

## Security-Assessment Boundary

The Q01 assessment remains non-exploitative.

The quest does not require:

```text
credential attacks
internal access
data extraction
remote-code execution
SQL injection
SSH access
```

## Character Email Contract

Adrian Cole remains canonical:

```text
character.adrian.cole
adrian.cole@deadsignal.lock
```

The incoming email does not expose the web audit URL, company answer, or open-port answer.

## Report Submission Contract

```text
Format report audit:
Subject: Security Audit — Jakarta

Target: <COMPANY>
Open Ports: <PORTS>

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

For the canonical Q01 world state, the resolved report is:

```text
Target: Skynet Logistics
Open Ports: 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Objective 05 accepts only the resolved canonical body, not the literal placeholders.

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

Replay remains isolated from production state and production rewards while using the same reconnaissance contract.

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
verify 22/ssh CLOSE, 80/http CLOSE, 443/https OPEN
 ↓
lynx 203.0.113.42
 ↓
verify www.skynet-logistics.idx
 ↓
subfinder -d skynet-logistics.idx
 ↓
verify exactly four subdomains
 ↓
verify portal/status = 403
 ↓
open security.skynet-logistics.idx over HTTPS
 ↓
complete Objective 04
 ↓
discover COMPANY and PORTS
 ↓
send resolved Security Audit — Jakarta report
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

The Q01 target is now a genuine subdomain discovered through Lynx and Subfinder. The four required subdomains are `www`, `portal`, `status`, and `security`; only `security` is the audit target, while `portal` and `status` are forbidden surfaces. Adrian's email omits the direct web URL and report answers. Further changes require explicit change control after this lock.
