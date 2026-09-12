# DEAD SIGNAL — Q01 Revised Implementation

Date: 2026-09-12
Status: **IMPLEMENTED — LIVE VALIDATION PENDING**

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
```

The client rename from Meridian Logistics to Skynet Logistics is an explicit change-control request. Objective IDs, rewards, target IP, completion flag, and chapter placement remain unchanged.

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
Open Skynet Logistics web security surface over HTTPS
        ↓
Perform basic vulnerability checks
        ↓
Submit audit report
        ↓
Q01 complete
        ↓
$200 + up to 80 XP
        ↓
Q02 is the next campaign target
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

## Service Scope

Q01 now focuses on the HTTPS service only:

```text
22/tcp  CLOSED  ssh
80/tcp  CLOSED  http
443/tcp OPEN    https
```

The closed SSH and HTTP ports remain part of the scan evidence but are not gameplay requirements.

## Objective 04 — Revised Gameplay

The former SSH verification step is removed from the critical path.

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

Required web surface:

```text
Host:   skynet-logistics.test
Path:   /security
URL:    https://skynet-logistics.test/security
```

Objective 04 completes only after Objective 03 is complete and `Browser.Meta` reports:

```text
protocol = https:
hostname = skynet-logistics.test
pathname = /security
```

## Technical Interaction

### Nmap

The objective exposes only:

```text
nmap
```

The player must discover the target from the audit material and run the scan against the authorized target. The replay supports both the bare `nmap` interaction and the explicit target form for compatibility with the current terminal runtime.

The expected scan evidence is:

```text
22/tcp  CLOSED  ssh
80/tcp  CLOSED  http
443/tcp OPEN    https
```

### Network

At quest start the adapter provisions one router target:

```text
203.0.113.42
├── 22 / ssh   CLOSED
├── 80 / http  CLOSED
└── 443 / https OPEN
domain: skynet-logistics.test
```

No child device, SSH account, SSH response data, or `Network.openPort()` call is required by the revised Q01 method.

### Website

A registered Website is provided for the external audit surface:

```text
SiteName: Skynet Logistics
Host:     skynet-logistics.test
Pages:
  /          operations portal
  /security  external HTTPS security review
```

The security page reports the closed SSH/HTTP services, the open HTTPS service, and the basic assessment finding.

### Browser Event

The quest listens to:

```text
Browser.Meta
```

and accepts only:

```text
protocol = https:
hostname = skynet-logistics.test
pathname = /security
```

This keeps Objective 04 deterministic without relying on the unreliable native SSH transport.

## Report Submission

The final report contract is canonical and non-random:

```text
To:      adrian.cole@deadsignal.lock
Subject: Security Audit — Jakarta

Target: Skynet Logistics
Open Ports: 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Objective 05 completes only when the sent email subject and plain-text body match this canonical report contract. The player should use the report text supplied in Adrian's email rather than retyping or inventing the content.

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
Review email and target IP
        ↓
Run nmap
        ↓
Verify 22/ssh CLOSED, 80/http CLOSED, 443/https OPEN
        ↓
Open https://skynet-logistics.test/security
        ↓
Verify Objective 04 completes
        ↓
Send exact Security Audit — Jakarta subject/body
        ↓
Verify Objective 05 completes
        ↓
Verify completion flag + $200 + 80 XP
        ↓
Record PASS
```
