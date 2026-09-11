# DEAD SIGNAL — Phase 13 Q01 Source Gate

Date: 2026-09-11
Status: **SOURCE RECOVERED — IMPLEMENTATION IN PROGRESS**

## Source Authority

Q01 is fully specified in the recovered Chapter 1 / Phase 8 source history. The source defines `dead_signal.q01`, THE CONTRACT, Jakarta, Adrian Cole, no prerequisite, and the Q01 technical flow.

## Canonical Story Contract

- Trigger: player receives/accepts the contract from Adrian.
- Target: `203.0.113.42`.
- Required player objectives:
  1. Review audit scope.
  2. Scan `203.0.113.42`.
  3. Identify exposed services.
  4. Perform basic vulnerability checks.
  5. Submit audit report.
- Expected exposed services: TCP 22/SSH, 80/HTTP, 443/HTTPS.
- ARKA certificate issuer is a non-required breadcrumb.
- Completion: audit report submitted.
- Persistent story state: `dead_signal.q01.completed = true`.
- Reward: `$200`, up to `80 XP`.

## Phase 8 XP Authority

The locked Phase 8 allocation is authoritative:

| XP component | XP |
|---|---:|
| Complete external audit | 35 |
| Network/service enumeration | 20 |
| Basic vulnerability assessment | 10 |
| Submit correct report | 15 |
| **Total** | **80** |

## Implementation Boundary

The player-facing objective state remains in HackHub's quest/objective lifecycle. The canonical DEAD SIGNAL state receives only the source-defined completion flag; no new persistent Q01 story flags are invented.

The source does not define a dedicated vulnerability-exploitation command for Q01. The gameplay audit explicitly says Q01 does not require vulnerability exploitation. Objective 04 is therefore implemented as an authorized SSH service-verification action using HackHub's native SSH command and network simulation, rather than as an exploit or artificial custom command.

The player-facing SSH syntax follows the current HackHub Handbook:

```bash
ssh -h audit@203.0.113.42 -p 22
```

The temporary audit account is attached directly to the virtual target device. Objective 04 completes only after the real `Terminal.SSH.Connected` event for `203.0.113.42`.

HackHub's current native communication surface provides Email but no native `Relay` API in the available SDK reference. The source's short post-report Adrian response is therefore represented through the existing in-game mail channel as an implementation adapter detail; the narrative content itself is unchanged.

## Production Files

- `src/content/q01.ts`
- `src/content/index.ts`
- `src/infrastructure/hackhub/q01-quest.ts`
- `src/index.ts`
- `manifest.json`

## Validation Status

Automated verification must pass before the live in-game gate. Q01 is not marked production-locked until the real HackHub campaign path has been played successfully and the result is recorded under the Phase 13 sequential campaign lock.
