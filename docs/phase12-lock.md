# DEAD SIGNAL — Phase 12 Lock

Date: 2026-09-11

## Status

**LOCKED**

Phase 12 is the in-game HackHub integration and runtime validation phase. Its exit criteria have been satisfied by the validated in-game smoke tests, the full runtime regression, and the final production-bootstrap cleanup.

## Locked validation

| Area | Status |
|---|---|
| Mod loading / Bootstrap | PASS |
| Quest registration / UI | PASS |
| Terminal.Ping objective | PASS |
| Nmap integration | PASS |
| Terminal.NmapScan direct event | NOT USED |
| SaveStorage | PASS |
| AccessService | PASS |
| RewardService | PASS |
| EconomyService | PASS |
| EndingService | PASS |
| Full runtime regression | PASS |
| Production bootstrap isolation | PASS |

## Nmap integration contract

DEAD SIGNAL does not depend on the unreliable `Terminal.NmapScan` direct-event path discovered during Phase 12. The validated integration uses the supported `Terminal.Command` objective path for `nmap` together with typed command data through the SDK Shell API.

The Nmap smoke quest remains a diagnostic artifact and is not part of the production bootstrap.

## Production boundary

Phase 12 diagnostic and regression harnesses remain available in `src/infrastructure/hackhub/` for future regression use, but the production `src/index.ts` contains only the HackHub bootstrap registration and lifecycle hooks.

## Verification baseline

The final local validation must remain:

```text
npm run typecheck   PASS
npm test            PASS (115/115 at Phase 12 regression checkpoint)
npm run build       PASS
```

A fresh HackHub restart with the cleaned production bootstrap must not emit Phase 12 diagnostic notifications.

## Lock rule

No Phase 12 architecture changes are permitted during Phase 13 unless a new defect is demonstrated against the locked acceptance criteria. New story implementation must consume the locked runtime contracts instead of modifying them opportunistically.

## Next phase

Phase 13 — Story Implementation.
