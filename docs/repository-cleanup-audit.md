# DEAD SIGNAL — Repository Cleanup Audit

Date: 2026-09-12
Status: **CLEANUP EXECUTED — Q01 REVISED PATH ONLY**

## Production Entry Point

```text
src/index.ts
```

The production bootstrap registers the Q01 quest and Q01 Skynet Logistics website, then initializes the canonical runtime persistence boundary.

## Active Production HackHub Sources

```text
src/infrastructure/hackhub/runtime.ts
src/infrastructure/hackhub/save-storage-adapter.ts
src/infrastructure/hackhub/q01-quest.ts
src/infrastructure/hackhub/websites/q01-skynet-portal.ts
src/infrastructure/hackhub/websites/q01-home.html
src/infrastructure/hackhub/websites/q01-security.html
```

## Retained Development Tooling

The Q01 replay remains intentionally retained:

```text
dev/q01-replay-entry.ts
dev/q01-replay-quest.ts
scripts/build-q01-replay.ts
scripts/dev-watch.ts
docs/development-q01-replay.md
```

The replay is the repeatable Q01 live-validation fixture and remains isolated from production story state.

## Removed Obsolete SSH Diagnostics

The following are removed from the active repository because Q01 no longer uses native SSH as an acceptance mechanism:

```text
dev/ssh-full-scaffold-smoke-entry.ts
dev/ssh-full-scaffold-smoke-id.generated.ts
dev/ssh-full-scaffold-smoke-quest.ts
dev/ssh-native-random-smoke-id.generated.ts
dev/ssh-native-random-smoke-test-entry.ts
dev/ssh-native-random-smoke-test-quest.ts
dev/ssh-native-smoke-config.generated.ts
dev/ssh-native-smoke-id.generated.ts
dev/ssh-native-smoke-test-entry.ts
dev/ssh-native-smoke-test-quest.ts
scripts/build-ssh-full-scaffold-smoke.ts
scripts/build-ssh-native-random-smoke.ts
scripts/build-ssh-native-smoke.ts
docs/phase13-ssh-full-scaffold-smoke.md
docs/phase13-ssh-native-smoke-test.md
```

Their history remains recoverable through Git history; they are not part of the active implementation.

## Placeholder Cleanup

Redundant `.gitkeep` files are removed from directories that already contain tracked source:

```text
src/application/.gitkeep
src/core/.gitkeep
src/domain/.gitkeep
src/infrastructure/.gitkeep
src/state/.gitkeep
tests/.gitkeep
```

The empty placeholder-only directories `src/debug/` and `src/presentation/` are also removed by deleting their `.gitkeep` entries. They will not exist in the Git tree until real source is added.

## Package Scripts

The package retains:

```text
build
build:replay:q01
dev
typecheck
test
```

SSH-only smoke build scripts are removed.

## Client Rename

All active Q01 implementation/replay/report validation references use:

```text
Skynet Logistics
```

`Meridian Logistics` is retained only where historical source documents need to describe the pre-change state. Active gameplay source and current Q01 validation documentation use the revised client name.

## Production Permissions

The manifest remains:

```json
"permissions": ["events", "mail", "network", "shell"]
```

These cover the active Q01 integration and existing runtime boundaries.

## Cleanup Conclusion

```text
Obsolete SSH smoke tooling removed             ✅
SSH build scripts removed                      ✅
Q01 replay retained                            ✅
Q01 Website adapter retained                   ✅
Redundant .gitkeep placeholders removed        ✅
Q01 active client renamed to Skynet Logistics  ✅
Production Q01 remains isolated from replay    ✅
No downstream Q02–Q16 activation               ✅
```
