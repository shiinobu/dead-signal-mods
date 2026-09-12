# DEAD SIGNAL

A story-driven HackHub mod built with the official `@hotbunny/hackhub-content-sdk`.

## HackHub structure

```text
.
├── src/
│   ├── index.ts          # HackHub Bootstrap entry point
│   ├── core/             # Framework-agnostic primitives and shared contracts
│   ├── domain/           # Canonical DEAD SIGNAL domain model and rules
│   ├── state/            # Canonical runtime state ownership
│   ├── application/      # Use cases and orchestration
│   ├── infrastructure/   # Persistence, HackHub, and website adapters
│   ├── presentation/     # Reserved UI/presentation boundary
│   └── debug/            # Reserved development boundary
├── dev/                  # Development-only replay fixtures
├── tests/                # Automated tests
├── public/               # Static mod assets
├── manifest.json         # HackHub mod metadata
├── esbuild.config.ts     # HackHub SDK build configuration
├── package.json
└── tsconfig.json
```

The production runtime entry point is `src/index.ts`. DEAD SIGNAL canonical state remains owned by the internal architecture rather than by the HackHub entry point.

## Requirements

- Node.js 18+
- npm
- HackHub - Ultimate Hacker Simulator on Steam

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

The HackHub SDK build produces the distributable `dist/` package.

## Q01 — THE CONTRACT

Q01 is the first mission in the locked sequential campaign and keeps its five player-facing objectives:

```text
Review audit scope
Scan 203.0.113.42
Identify exposed services
Perform basic vulnerability checks
Submit audit report
```

The current Q01 client is **Skynet Logistics**. The target remains `203.0.113.42`, the chapter is Jakarta, Adrian Cole is the primary contact, the completion flag is `dead_signal.q01.completed`, the cash reward is `$200`, and the maximum XP is `80`.

Expected service enumeration:

```text
22/tcp  OPEN  ssh
80/tcp  OPEN  http
443/tcp OPEN  https
```

Objective 04 no longer depends on native SSH. The revised gameplay uses the registered Skynet Logistics website:

```text
http://skynet-logistics.test/security
https://skynet-logistics.test/security
```

Opening `/security` over HTTP or HTTPS after service identification produces the `Browser.Meta` interaction that completes the basic-vulnerability-assessment objective. The assessment remains non-exploitative.

## Q01 Replay

Use the maintained development replay for repeatable live testing:

```bash
npm run build:replay:q01
```

Install the complete `dist-replay/` package into `HackHub/mods/dead-signal-dev/` and restart HackHub. Each build receives a fresh development quest identity.

Replay is isolated from production completion state and production rewards.

Detailed validation instructions are in:

```text
docs/development-q01-replay.md
docs/phase13-q01-live-validation.md
docs/phase13-q01-final-lock.md
```

## Phase 13 Campaign

The implementation campaign remains strictly sequential:

```text
Q01 → Q02 → Q03 → Q04 → Q05 → Q06 → Q07 → Q08
→ Q09 → Q10 → Q11 → Q12 → Q13 → Q14 → Q15 → Q16
```

No downstream quest is activated before the preceding quest passes its live validation gate.

## Architecture contract

The locked Phase 9–12 boundaries remain in force:

- `StateStore` is the canonical root state owner.
- `FlagStore` is the typed facade over `StateStore.flags`.
- `ConditionNode` is the canonical condition representation.
- `QuestService` owns quest lifecycle/orchestration.
- `NarrativeStateService` owns narrative state.
- `AccessService` owns capability/access grants.
- `RewardService` owns XP rewards.
- `EconomyService` owns cash/mission rewards.
- `EndingService` owns ending state.
- HackHub APIs remain infrastructure adapters and do not become canonical state owners.

## Permissions

The production manifest requests:

```json
"permissions": ["events", "mail", "network", "shell"]
```

Only permissions exercised by the active production integration are requested.

## Cleanup Policy

Development smoke tests that were created only to diagnose native SSH are not part of the active source tree. The maintained Q01 replay remains the supported repeatable validation tool.
