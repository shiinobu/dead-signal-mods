# DEAD SIGNAL — Repository Cleanup Audit

Date: 2026-09-11

## Scope

Audit the repository for source files that are no longer part of the production execution path, with particular attention to Phase 12 smoke/diagnostic harnesses, deferred Phase 13 Q14 implementation artifacts, and empty placeholder files.

## Production entrypoint

The production build uses:

```text
src/index.ts
```

as the esbuild entry point. The current bootstrap loads the shared runtime bridge only; no downstream quest is registered before the sequential campaign reaches it.

## Removed obsolete production-tree artifacts

The following historical Phase 12 diagnostic files were removed from `src/infrastructure/hackhub/` because they are not production dependencies:

```text
src/infrastructure/hackhub/dead-signal-smoke-quest.ts
src/infrastructure/hackhub/dead-signal-nmap-smoke-quest.ts
src/infrastructure/hackhub/ending-smoke-test.ts
src/infrastructure/hackhub/phase12-runtime-regression.ts
src/infrastructure/hackhub/runtime-services-smoke-test.ts
src/infrastructure/hackhub/save-storage-smoke-test.ts
```

These files remain recoverable through Git history and Phase 12 audit documentation.

## Deferred Q14 implementation cleanup

Q14 had previously been implemented early during Phase 13 exploration. After locking the sequential Q01 → Q16 execution strategy, those premature production artifacts were removed from the active source tree:

```text
src/infrastructure/hackhub/q14-quest.ts
src/content/q14.ts
src/content/index.ts
tests/phase13-step13.3-q14-source-backed-slice.test.ts
```

Reason:

```text
Q01–Q13 are not yet production-validated
        ↓
Q14 must not be registered/executed early
        ↓
remove deferred implementation from active source tree
        ↓
recover from Git history when Q14 becomes the active quest
```

This is an execution-order cleanup, not a loss of project history.

## Current production HackHub source

The active `src/infrastructure/hackhub/` tree now contains only:

```text
runtime.ts
save-storage-adapter.ts
```

Quest-specific HackHub adapters are added only when their sequential quest gate is reached.

## Current production permissions

Because the deferred Q14 filesystem integration is no longer active, the current manifest uses the minimal permissions required by the shared production runtime:

```json
"permissions": ["events", "shell"]
```

Filesystem permission must be reintroduced only when a later active quest actually requires it and the requirement is source-backed.

## Development tooling — keep

```text
scripts/dev-watch.ts
```

The package `dev` script explicitly executes this watcher.

## Tests — keep

The repository's automated test suite remains under `tests/`. Generic domain/application/integration tests remain part of the regression barrier for sequential quest implementation.

## Placeholder `.gitkeep` files

The following are functionally redundant because their directories contain tracked source files:

```text
src/application/.gitkeep
src/core/.gitkeep
src/domain/.gitkeep
src/infrastructure/.gitkeep
src/state/.gitkeep
tests/.gitkeep
```

They may be removed during a later housekeeping pass.

The following remain as optional empty-directory placeholders:

```text
src/debug/.gitkeep
src/presentation/.gitkeep
```

## Historical distinction

Removed source files are not equivalent to deleted history. Their implementations remain available in Git history and can be recovered when justified by the sequential implementation roadmap.

Production source should contain only the currently active implementation path.

## Audit conclusion

```text
Phase 12 smoke/regression harnesses removed from active source tree   ✅
Deferred Q14 production artifacts removed from active source tree    ✅
Current HackHub production tree contains only active adapters        ✅
Production bootstrap no longer registers Q14                        ✅
Current manifest permissions reduced to active requirements           ✅
Development watcher retained                                         ✅
Generic automated tests retained                                     ✅
Redundant .gitkeep cleanup                                            🟡 OPTIONAL
```
