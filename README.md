# DEAD SIGNAL Mods

TypeScript foundation for the DEAD SIGNAL mod SDK and runtime.

## Architecture

The repository follows the locked Phase 10 implementation contract:

- `src/core` — framework-agnostic primitives and shared contracts
- `src/domain` — canonical domain model and domain rules
- `src/state` — canonical runtime state ownership
- `src/application` — use cases and orchestration
- `src/infrastructure` — persistence and external adapters
- `src/presentation` — UI/game-facing adapters
- `src/debug` — development and diagnostic tooling
- `tests` — automated tests

`src/index.ts` is the public SDK boundary. Runtime state must not be owned by the public entry point.

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
```

Implementation is being introduced incrementally during Phase 11. The repository intentionally starts from a clean baseline rather than carrying legacy code.
