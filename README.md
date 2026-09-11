# DEAD SIGNAL

A story-driven HackHub mod built with the official `@hotbunny/hackhub-content-sdk`.

## HackHub structure

This repository follows the official HackHub Content SDK project structure while keeping the locked DEAD SIGNAL Phase 10 architecture inside `src/`.

```text
.
├── src/
│   ├── index.ts          # HackHub Bootstrap entry point
│   ├── core/             # Framework-agnostic primitives and shared contracts
│   ├── domain/           # Canonical DEAD SIGNAL domain model and rules
│   ├── state/            # Canonical runtime state ownership
│   ├── application/      # Use cases and orchestration
│   ├── infrastructure/   # Persistence and external adapters
│   ├── presentation/     # Game/UI-facing adapters
│   └── debug/            # Development and diagnostic tooling
├── tests/                # Automated tests
├── dist/                 # Generated HackHub mod package
├── manifest.json         # HackHub mod metadata
├── esbuild.config.ts     # HackHub SDK build configuration
├── package.json
└── tsconfig.json
```

The HackHub runtime entry point is `src/index.ts`. It uses the required `Bootstrap` + `@RegisterModPackage` contract. DEAD SIGNAL runtime state remains owned by the internal architecture rather than by the entry point.

## Requirements

- Node.js 18+
- npm (or another supported package manager)
- HackHub - Ultimate Hacker Simulator on Steam

## Development

Install dependencies:

```bash
npm install
```

Type-check the mod:

```bash
npm run typecheck
```

Run the automated test suite:

```bash
npm test
```

Build the distributable HackHub package:

```bash
npm run build
```

The HackHub SDK build produces `dist/mod.js` and copies the manifest and supported assets into `dist/`.

## Permissions

The production manifest currently requests only the SDK permissions exercised by the production-facing integration: `events` and `shell`. Diagnostic Phase 12 harnesses may use additional SDK APIs such as `ui`, but those harnesses are not imported by the production bootstrap.

## Phase 12 integration audit

Phase 12 was validated in-game across quest/objective triggering, Terminal.Ping, Nmap command routing, SaveStorage, access grants, rewards, economy, ending resolution, and a full canonical-state regression. The diagnostic harnesses remain in `src/infrastructure/hackhub/` for repeatable testing but are intentionally excluded from the production bootstrap after Phase 12 lock.

Nmap integration uses the SDK's `Terminal.Command` quest trigger together with typed `Shell.addCommandData("nmap", ...)` response data. The `Terminal.NmapScan` event path is not part of the production contract because its runtime/type behavior was not reliable during Phase 12 validation.

## Architecture contract

The implementation continues to follow the locked Phase 10 decisions, including:

- `StateStore` as the canonical root state owner
- `FlagStore` as a typed facade over `StateStore.flags`
- `ConditionNode` as the canonical condition representation
- `EndingState` as the canonical ending state
- `AccessService` as the capability/access-grant owner
- `GameRuntime` owning `NarrativeStateService`, `EndingService`, `AccessService`, and `RewardService`
- save/load without event replay

HackHub-specific APIs are adapters around this domain architecture; they do not replace its ownership boundaries.
