# DEAD SIGNAL — Q01 Revised Implementation

Date: 2026-09-12
Status: **IMPLEMENTED — LYNX/SUBDOMAIN RECON; LIVE VALIDATION PENDING**

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
Apex Domain:   skynet-logistics.idx
```

Objective IDs, rewards, target IP, completion flag, and chapter placement remain unchanged.

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
lynx 203.0.113.42
        ↓
https://www.skynet-logistics.idx/
        ↓
subfinder -d skynet-logistics.idx
        ↓
4 subdomains
        ↓
security.skynet-logistics.idx
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

Objective 02 presents only `nmap`; the target IP is supplied in Adrian's audit material.

Objective 03 has no hint.

Objective 04 guides the player to discover the public host, enumerate subdomains, and inspect the authorized security surface.

Objective 05 requires the player to resolve `<COMPANY>` and `<PORTS>` from audit evidence.

## Service Scope

```text
22/tcp  CLOSE  ssh
80/tcp  CLOSE  http
443/tcp OPEN   https
```

Only 443/tcp is exposed for the web flow. Canonical HTTPS URLs omit `:443`.

## Web Subdomain Model

Exactly four subdomains are modeled:

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

The apex domain is the subdomain-enumeration root and is registered on the target network but intentionally has no Q01 Website page.

## Lynx

HackHub's typed `lynx` command is populated via `Shell.addCommandData()` with deterministic Q01 data. The official SDK documents `lynx` as a built-in command whose response can include `address` and `ips`. citeturn313821search0

Accepted inputs:

```text
lynx 203.0.113.42
lynx https://203.0.113.42/
```

Expected address:

```text
https://www.skynet-logistics.idx/
```

## Subfinder

HackHub does not document `subfinder` as a typed built-in command. Q01 therefore models it as a deterministic custom Shell command using the SDK's arbitrary command-data facility. The official SDK documents `Shell.addCommandData()` as the primary mechanism for injecting command responses. citeturn313821search0

Accepted command:

```text
subfinder -d skynet-logistics.idx
```

Expected result:

```text
portal.skynet-logistics.idx
security.skynet-logistics.idx
status.skynet-logistics.idx
www.skynet-logistics.idx
```

## Objective 04 — Browser Boundary

Objective 04 completes only after:

```text
nmap completed
lynx discovery completed
subfinder enumeration completed
```

and the player opens:

```text
https://security.skynet-logistics.idx/
```

The quest validates:

```text
protocol = https:
hostname = security.skynet-logistics.idx
pathname = /
```

Port 443 is enforced by the world network definition rather than by an undocumented Browser.Meta field.

## Website Presentation

`www.skynet-logistics.idx` uses a polished corporate logistics homepage without a direct link to the security subdomain.

`security.skynet-logistics.idx` uses a black/green terminal-style interface and exposes the evidence needed for the audit report.

`portal.skynet-logistics.idx` and `status.skynet-logistics.idx` use the 403 Forbidden surface.

## Report Submission

Adrian's email presents:

```text
Format report audit:
Subject: Security Audit — Jakarta

Target: <COMPANY>
Open Ports: <PORTS>

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

The canonical resolved body is:

```text
Target: Skynet Logistics
Open Ports: 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Literal placeholders are invalid.

## Cleanup

At completion or abandonment the quest removes:

```text
nmap command data
lynx command data
subfinder command data
apex/domain registrations
all four subdomain registrations
Q01 target network
```

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
Run nmap
        ↓
Verify 443/tcp OPEN; 22/80 CLOSED
        ↓
lynx 203.0.113.42
        ↓
Verify https://www.skynet-logistics.idx/
        ↓
subfinder -d skynet-logistics.idx
        ↓
Verify exactly four subdomains
        ↓
Verify portal/status = 403
        ↓
Open security.skynet-logistics.idx over HTTPS
        ↓
Verify Objective 04
        ↓
Resolve COMPANY + PORTS
        ↓
Submit Security Audit — Jakarta
        ↓
Verify Objective 05
        ↓
Verify completion flag + $200 + 80 XP
        ↓
Record PASS
```
