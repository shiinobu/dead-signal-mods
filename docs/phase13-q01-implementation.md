# DEAD SIGNAL — Q01 Implementation

Date: 2026-09-11
Status: **IMPLEMENTED — LIVE VALIDATION PENDING**

## Source

Q01 follows the recovered Detailed Quest Design and the locked Phase 8 technical quest specification.

Canonical Q01:

- ID: `dead_signal.q01`
- Title: `THE CONTRACT`
- Chapter: `01 — DEAD SIGNAL`
- Location: Jakarta
- Primary: Adrian Cole
- Prerequisite: none
- Target: `203.0.113.42`
- Persistent completion state: `dead_signal.q01.completed = true`
- Money reward: `$200`
- XP maximum: `80`

## Locked Player Objective Names

The five player-facing objective names remain exactly as locked in Phase 8:

1. `Review audit scope`
2. `Scan 203.0.113.42`
3. `Identify exposed services`
4. `Perform basic vulnerability checks`
5. `Submit audit report`

Supporting terminal actions and hints may be added without renaming these objectives.

## Final Player Flow

```text
HackHub feed / job offer
        ↓
Claim Q01
        ↓
Review the audit scope
        ↓
Run nmap 203.0.113.42
        ↓
Confirm 22 / ssh, 80 / http, 443 / https
        ↓
Connect to the authorized SSH audit account
        ↓
Perform basic vulnerability checks
        ↓
Submit the audit report
        ↓
Q01 complete
        ↓
$200 + up to 80 XP
        ↓
Q02 becomes the next campaign target
```

Q01 remains a simple opening mission: one reconnaissance action, one authorized service-verification action, then reporting.

## Objective UX

```text
Review audit scope
Scan 203.0.113.42
Identify exposed services
Perform basic vulnerability checks
Submit audit report
```

Supporting guidance:

- Terminal affordance for `nmap 203.0.113.42`.
- Short hint for the expected exposed services.
- Terminal affordance for `ssh -h audit@203.0.113.42`.
- Short hint that Adrian supplied an authorized audit account.
- Short hint for the report destination/action.

No internal mod paths are exposed in hints.

## Technical Interaction

### Reconnaissance

The player-facing scan remains:

```bash
nmap 203.0.113.42
```

Expected result:

```text
22/tcp  OPEN  ssh
80/tcp  OPEN  http
443/tcp OPEN  https
```

This satisfies only:

```text
Scan 203.0.113.42
Identify exposed services
```

Repeating Nmap does not satisfy Objective 04.

### Authorized SSH Verification

Q01 uses the minimal native SSH network pattern documented by HackHub: a Router target with the authorized audit user directly on that Router and an active SSH port 22. No child device or router-specific hacking route is required.

```text
203.0.113.42
├── 22 / ssh
│   └── user: audit
├── 80 / http
└── 443 / https
```

The player-facing SSH syntax follows the current HackHub Handbook:

```bash
ssh -h audit@203.0.113.42
```

The player does not pass a password as a terminal argument. The authorized password is stored on the virtual network user for the native SSH interaction.

Objective 04 is completed only after the native SSH connection event is received for `203.0.113.42` and username `audit`.

No `Shell.addCommandData("ssh", ...)` response is used for completion, because that path produced false positives while the native terminal still displayed `Connection could not be established.` during live testing.

## Completion

The final objective is completed by a valid audit report sent to Adrian using the source-defined facts.

Required report facts include:

```text
Target: Meridian Logistics
Open Ports: 22, 80, 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

The canonical completion state is:

```text
dead_signal.q01.completed = true
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

The temporary Nmap command data is removed when Q01 completes or is abandoned. The target network is destroyed at the same boundary.

## Boundary

Q01 does not require exploitation, credential attacks, data extraction, or internal access. The SSH interaction is an authorized service-verification step inside the virtual target network.

## Validation Gate

Q01 is **not** production-locked until the full live scenario passes in HackHub.

Required gate:

```text
npm run typecheck
npm test
npm run build
        ↓
Install production build
        ↓
Live Q01 from clean/replay state
        ↓
Verify one-scan flow
        ↓
Verify Nmap cannot complete Objective 04
        ↓
Verify `ssh -h audit@203.0.113.42` produces a real successful SSH connection
        ↓
Verify Objective 04 completes
        ↓
Verify report completion
        ↓
Verify reward/state
        ↓
Record PASS
        ↓
Lock Q01
```

Only after Q01 passes may Phase 13 move to Q02.
