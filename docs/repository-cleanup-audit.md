# DEAD SIGNAL — Repository Cleanup Audit

Date: 2026-09-11

## Scope

Audit the current repository for source files that are no longer part of the production execution path, with particular attention to Phase 12 smoke/diagnostic harnesses and empty placeholder files.

## Production entrypoint

The build uses:

```text
src/index.ts
```

as the sole esbuild entry point. The current production bootstrap imports only the Q14 HackHub quest adapter and the shared runtime bridge.

Therefore a source file under `src/` is part of the production bundle only when reachable from that import graph.

## Findings

### Phase 12 diagnostic / smoke files — not used by production

The following files are present under `src/infrastructure/hackhub/` but are not imported by the production bootstrap:

```text
src/infrastructure/hackhub/dead-signal-smoke-quest.ts
src/infrastructure/hackhub/dead-signal-nmap-smoke-quest.ts
src/infrastructure/hackhub/ending-smoke-test.ts
src/infrastructure/hackhub/phase12-runtime-regression.ts
src/infrastructure/hackhub/runtime-services-smoke-test.ts
src/infrastructure/hackhub/save-storage-smoke-test.ts
```

These are historical Phase 12 validation/diagnostic artifacts. They are not production dependencies.

The Phase 12 integration audit explicitly records that smoke and regression harnesses were retained as reusable diagnostics while being excluded from the production bootstrap.

Disposition:

```text
PRODUCTION USE:        NONE
HISTORICAL VALUE:      YES
SAFE TO REMOVE:        YES, after retaining the Phase 12 audit evidence
ALTERNATIVE:            Move under a non-production diagnostics/tooling tree
```

### Production files — keep

```text
src/infrastructure/hackhub/q14-quest.ts
src/infrastructure/hackhub/runtime.ts
src/infrastructure/hackhub/save-storage-adapter.ts
src/index.ts
```

These remain part of the current production integration path.

### Development tooling — keep

```text
scripts/dev-watch.ts
```

The package `dev` script explicitly executes this watcher, so it is still used.

### Tests — keep

The repository's automated test suite remains under `tests/`. The package exposes `npm test`, and the Phase 13 source-backed test is part of that suite.

No current test file was classified as unused from this audit.

### Empty-directory `.gitkeep` files

The following `.gitkeep` files are redundant because their directories already contain tracked source files:

```text
src/application/.gitkeep
src/core/.gitkeep
src/domain/.gitkeep
src/infrastructure/.gitkeep
src/state/.gitkeep
tests/.gitkeep
```

Disposition:

```text
FUNCTIONAL VALUE:      NONE
SAFE TO REMOVE:        YES
```

The following remain as empty-directory placeholders and are optional housekeeping rather than functional code:

```text
src/debug/.gitkeep
src/presentation/.gitkeep
```

Removing them would also remove those empty directories from Git. Keep them only if the project intentionally wants those directories pre-created.

## Important distinction

"Not used by production" does not mean "never useful". The six Phase 12 smoke/regression files document and preserve previously validated integration paths. Their retention is currently a repository-organization choice, not a runtime requirement.

No source file was deleted as part of this audit.

## Recommended cleanup

Preferred clean-production layout:

```text
Production source:
    src/**
    └── only active runtime/content implementation

Historical diagnostics:
    either remove after preserving audit evidence
    or move to a non-production diagnostics/tooling location
```

Do not re-import the Phase 12 diagnostic harnesses into `src/index.ts` or any production content registration path.

## Audit conclusion

```text
Phase 12 smoke/regression harnesses not in production     ✅ CONFIRMED
Phase 12 smoke/regression harnesses historically useful  ✅ CONFIRMED
Six redundant .gitkeep files                             ✅ CONFIRMED
Two empty placeholder .gitkeep files                     🟡 OPTIONAL
Production runtime files                                 ✅ KEEP
Development watcher                                      ✅ KEEP
Automated tests                                           ✅ KEEP

No files deleted by this audit.
```
