# DEAD SIGNAL — Q01 Revised Implementation

Date: 2026-09-12
Status: **IMPLEMENTED — REVISED METHOD, LIVE VALIDATION PENDING**

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
Run nmap 203.0.113.42
        ↓
Confirm 22/ssh, 80/http, 443/https
        ↓
Inspect Skynet Logistics web security surface
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

The five locked player-facing names remain exactly:

```text
01 Review audit scope
02 Scan 203.0.113.42
03 Identify exposed services
04 Perform basic vulnerability checks
05 Submit audit report
```

## Objective 04 — Revised Gameplay

The former SSH verification step is removed from the critical path because live native SSH testing did not provide a reliable completion path in the current HackHub environment.

The replacement uses the documented Website + Browser.Meta surface:

```text
Host:   skynet-logistics.test
Path:   /security
HTTP:   http://skynet-logistics.test/security
HTTPS:  https://skynet-logistics.test/security
```

The web page displays the external assessment findings without requiring exploitation:

```text
22/tcp — SSH
80/tcp — HTTP
443/tcp — HTTPS

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Objective 04 completes only after Objective 03 is complete and the player opens `/security` for the Skynet Logistics host over HTTP or HTTPS.

## Technical Interaction

### Nmap

Q01 keeps the validated Phase 12 terminal path:

```bash
nmap 203.0.113.42
```

The quest registers deterministic Nmap response data with `Shell.addCommandData("nmap", ...)` and listens for `Terminal.Command`. Repeating the scan never completes Objective 04.

### Network

At quest start the adapter provisions one router target:

```text
203.0.113.42
├── 22 / ssh
├── 80 / http
└── 443 / https
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
  /security  external security review
```

The website implementation is an infrastructure adapter and does not own canonical DEAD SIGNAL state.

### Browser Event

The quest listens to:

```text
Browser.Meta
```

and accepts only:

```text
protocol = http: OR https:
hostname = skynet-logistics.test
pathname = /security
```

This makes the gameplay deterministic without relying on the unreliable native SSH transport.

## Report

The final report must contain:

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
Nmap once
        ↓
Verify services
        ↓
Open /security over HTTP or HTTPS
        ↓
Verify Objective 04 completes
        ↓
Submit correct Skynet Logistics report
        ↓
Verify completion flag + $200 + 80 XP
        ↓
Record PASS
```
