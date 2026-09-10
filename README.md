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

Build the distributable HackHub package:

```bash
npm run build
```

The HackHub SDK build produces `dist/mod.js` and copies the manifest and supported assets into `dist/`.

## Permissions

The manifest currently declares no gated SDK permissions. Permissions will be added only when DEAD SIGNAL actually uses a gated API, following HackHub's least-privilege guidance.

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
