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

### Phase 12 diagnostic / smoke files — removed from production source tree

The following Phase 12 validation artifacts were confirmed to be outside the production import graph and have now been removed:

```text
src/infrastructure/hackhub/dead-signal-smoke-quest.ts
src/infrastructure/hackhub/dead-signal-nmap-smoke-quest.ts
src/infrastructure/hackhub/ending-smoke-test.ts
src/infrastructure/hackhub/phase12-runtime-regression.ts
src/infrastructure/hackhub/runtime-services-smoke-test.ts
src/infrastructure/hackhub/save-storage-smoke-test.ts
```

They were historical Phase 12 validation/diagnostic artifacts, not production dependencies. The Phase 12 integration audit remains the historical evidence for the validated behavior they covered.

Disposition:

```text
PRODUCTION USE:        NONE
HISTORICAL VALUE:      YES
SOURCE-TREE STATUS:    REMOVED
AUDIT EVIDENCE:        RETAINED
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
STATUS:                NOT REMOVED IN THIS CLEANUP
```

The following remain as empty-directory placeholders and are optional housekeeping rather than functional code:

```text
src/debug/.gitkeep
src/presentation/.gitkeep
```

Removing them would also remove those empty directories from Git. Keep them only if the project intentionally wants those directories pre-created.

## Important distinction

The six Phase 12 smoke/regression files were useful historical validation artifacts, but retaining them under the production source tree added noise after Phase 12 was locked. Their removal does not remove the audit evidence; the Phase 12 integration/lock documents remain in `docs/`.

The cleanup intentionally did **not** alter:

- production bootstrap behavior;
- Q14 content implementation;
- runtime services;
- SaveStorage adapter;
- automated tests;
- development watcher;
- Phase 12 audit/lock documentation.

## Audit conclusion

```text
Phase 12 smoke/regression harnesses outside production import graph  ✅ CONFIRMED
Phase 12 smoke/regression harnesses removed from source tree       ✅ DONE
Phase 12 historical audit evidence retained                        ✅ CONFIRMED
Production runtime files                                            ✅ KEEP
Development watcher                                                 ✅ KEEP
Automated tests                                                      ✅ KEEP
Six redundant .gitkeep files                                        🟡 NOT REMOVED
Two empty placeholder .gitkeep files                                🟡 OPTIONAL
```
