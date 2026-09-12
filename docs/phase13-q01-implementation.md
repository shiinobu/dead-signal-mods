# DEAD SIGNAL — Q01 Revised Implementation

Date: 2026-09-12
Status: **IMPLEMENTED — REVISED WEB/REPORT FLOW; LIVE VALIDATION PENDING**

## Identity

```text
ID:            dead_signal.q01
Title:         THE CONTRACT
Chapter:       01 — DEAD SIGNAL
Location:      Jakarta
Primary:       Adrian Cole
Prerequisite:  none
Client:        Skynet Logistics
Target:        203.0.113.42
State:         dead_signal.q01.completed = true
Money:         $200
Maximum XP:    80
Public Host:   skynet-logistics.idx
```

The client rename and revised web/report flow are explicit project-owner changes. Objective IDs, rewards, target IP, completion flag, and chapter placement remain unchanged.

## Player Flow

```text
HackHub post / Adrian
        ↓
Accept THE CONTRACT
        ↓
Review audit scope
        ↓
Scan the ip target
        ↓
Identify exposed services
        ↓
Open Skynet Logistics public home
        ↓
Open /security over HTTPS
        ↓
Perform basic vulnerability checks
        ↓
Discover company + open ports
        ↓
Fill Adrian's report format
        ↓
Submit audit report
        ↓
Q01 complete
        ↓
$200 + up to 80 XP
```

## Objectives

The five locked player-facing objectives remain:

```text
01 Review audit scope
02 Scan the ip target
03 Identify exposed services
04 Perform basic vulnerability checks
05 Submit audit report
```

Objective 02 presents only the terminal action `nmap`; the target IP is not embedded in the objective text.

Objective 03 has no hint.

Objective 04 uses the text:

```text
Inspect web service and review the security findings.
```

Objective 05 still points the player to Adrian and the canonical subject, but the report values must be filled from evidence found during the audit.

## Service Scope

Q01 focuses on the HTTPS service:

```text
22/tcp  CLOSED  ssh
80/tcp  CLOSED  http
443/tcp OPEN    https
```

The closed SSH and HTTP ports remain scan evidence but are not gameplay requirements.

## Web Surface

The canonical public site is now:

```text
https://skynet-logistics.idx/
```

The only additional registered page is:

```text
https://skynet-logistics.idx/security
```

The Website adapter registers exactly two pages:

```text
/          operations portal
/security  external HTTPS security review
```

No other Q01 pages are registered. The root page uses a polished logistics-company presentation. The security page intentionally uses a black/green terminal aesthetic.

## Objective 04 — Revised Gameplay

The former SSH verification step remains outside the critical path.

The canonical implementation method is:

```text
Identify exposed services
        ↓
Open Skynet Logistics security surface
        ↓
HTTPS Browser.Meta interaction
        ↓
Basic vulnerability assessment complete
```

Required Browser.Meta interaction:

```text
protocol = https:
hostname = skynet-logistics.idx
pathname = /security
```

The root page is available at `/` but does not complete Objective 04. HTTP is not accepted.

## Technical Interaction

### Nmap

The objective exposes only:

```text
nmap
```

The player must discover the target from the audit material and run the scan against the authorized target. The replay supports both the bare `nmap` interaction and the explicit target form for compatibility with the current terminal runtime.

### Network

At quest start the adapter provisions one router target:

```text
203.0.113.42
├── 22 / ssh   CLOSED
├── 80 / http  CLOSED
└── 443 / https OPEN
domain: skynet-logistics.idx
```

No child device, SSH account, SSH response data, or SSH gameplay call is required by the revised Q01 method.

### Website

A registered Website is provided for the external audit surface:

```text
SiteName: Skynet Logistics
Host:     skynet-logistics.idx
Pages:
  /          public operations homepage
  /security  external HTTPS security review
```

The homepage provides the client identity naturally. The security page provides the assessment evidence needed to determine the open port value.

### Browser Event

The quest listens to:

```text
Browser.Meta
```

and accepts only:

```text
protocol = https:
hostname = skynet-logistics.idx
pathname = /security
```

This keeps Objective 04 deterministic without relying on the unreliable native SSH transport.

## Report Submission

Adrian's email presents the player-facing format instead of the resolved answers:

```text
Format report audit:
Subject: Security Audit — Jakarta

Target: <COMPANY>
Open Ports: <PORTS>

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

The canonical recipient remains:

```text
adrian.cole@deadsignal.lock
```

For the current Q01 world state, the resolved body expected by the quest validator is:

```text
Target: Skynet Logistics
Open Ports: 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Submitting the literal placeholders is invalid. The player must discover and replace `<COMPANY>` and `<PORTS>` with the values supported by the audit evidence.

## Rewards

```text
35 XP  — Complete external audit
20 XP  — Network/service enumeration
10 XP  — Basic vulnerability assessment
15 XP  — Submit correct report
--------------------------------
80 XP total
```

Money reward:

```text
$200
```

## Cleanup

At completion or abandonment:

```text
remove Nmap command data
remove registered web domain
remove Q01 target network
```

No production flag is created by the development replay.

## Validation Gate

Required before production PASS:

```text
npm run typecheck
npm test
npm run build
        ↓
Install production build
        ↓
Clean Q01 run
        ↓
Accept contract
        ↓
Review Adrian's mail
        ↓
Run nmap
        ↓
Verify 22/ssh CLOSED, 80/http CLOSED, 443/https OPEN
        ↓
Open https://skynet-logistics.idx/
        ↓
Confirm Skynet Logistics identity
        ↓
Open https://skynet-logistics.idx/security
        ↓
Verify Objective 04 completes
        ↓
Fill COMPANY and PORTS in the supplied report format
        ↓
Submit Security Audit — Jakarta
        ↓
Verify Objective 05 completes
        ↓
Verify completion flag + $200 + 80 XP
        ↓
Record PASS
```
