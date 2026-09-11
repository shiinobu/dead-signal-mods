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

The five player-facing objective names are kept exactly as locked in Phase 8:

1. `Review audit scope`
2. `Scan 203.0.113.42`
3. `Identify exposed services`
4. `Perform basic vulnerability checks`
5. `Submit audit report`

The implementation may add terminal actions, hints, and supporting UI data, but it does not rename these objectives.

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
Review the returned result
        ↓
Objectives 2–4 are satisfied by the same audit interaction
        ↓
Submit the audit report
        ↓
Q01 complete
        ↓
$200 + up to 80 XP
        ↓
Q02 becomes the next campaign target
```

Q01 is intentionally a simple opening mission. The player performs one reconnaissance action and reviews its result instead of being asked to repeat multiple variants of the same scan.

## Objective UX

Main objective text is concise and player-oriented:

```text
Review audit scope
Scan 203.0.113.42
Identify exposed services
Perform basic vulnerability checks
Submit audit report
```

Supporting guidance is used selectively:

- Terminal affordance for the scan objective.
- A short hint for the service result (`22/ssh`, `80/http`, `443/https`).
- A short hint for the report destination/action.
- No hint is added where the objective is already self-explanatory.

No internal mod paths are exposed in hints.

## Technical Interaction

The supported player-facing terminal interaction is:

```bash
nmap 203.0.113.42
```

The exact Nmap result used by Q01 is:

```text
22/tcp  OPEN  ssh
80/tcp  OPEN  http
443/tcp OPEN  https
```

The first valid result completes:

```text
Scan 203.0.113.42
Identify exposed services
Perform basic vulnerability checks
```

Repeating the same Nmap command does not change progress after those objectives are complete.

No `openssl s_client`, custom `certcheck`, shell `Open ...`, or second Nmap command is required by the player.

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

The locked Phase 8 allocation remains:

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

## Boundary

Q01 does not require exploitation. The certificate/ARKA detail remains a narrative breadcrumb in the story source, while the playable opening mission stays focused on routine reconnaissance and reporting.

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
Verify report completion
        ↓
Verify reward/state
        ↓
Record PASS
        ↓
Lock Q01
```

Only after Q01 passes may Phase 13 move to Q02.
