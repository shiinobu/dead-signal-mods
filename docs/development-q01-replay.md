# DEAD SIGNAL — Development Q01 Replay

Purpose: provide a repeatable in-game Q01 test loop without changing production quest state or production quest registration.

## Production vs Development

Production remains built with:

```text
npm run build
```

The replay fixture is built separately with:

```text
npm run build:replay:q01
```

The replay build is emitted to `dist-replay/` and its manifest is rewritten to the development mod id:

```text
dead-signal-dev
```

The production mod is not modified at runtime by the replay fixture.

## Why the replay id changes

HackHub persists native quest progress by quest identity. A completed or partially completed Q01 cannot safely be reset by clearing only DEAD SIGNAL's own `SaveStorage`, because that would not guarantee that the native quest/objective state is reset.

Each replay build therefore generates a unique quest identity:

```text
dead_signal.dev.q01.r<run>-<timestamp>
```

This guarantees a fresh native quest instance for every replay build while keeping the production quest id unchanged:

```text
dead_signal.q01
```

## Workflow

1. Build a fresh replay package:

```powershell
npm run build:replay:q01
```

2. Remove/replace the local development mod folder:

```text
HackHub/mods/dead-signal-dev/
```

Copy the complete contents of `dist-replay/` into that folder.

3. Restart HackHub.

4. Open the development Q01 post:

```text
THE CONTRACT — DEV REPLAY
```

5. Run the Q01 sequence:

```text
Apply
  ↓
Review audit scope
  ↓
nmap 203.0.113.42
  ↓
Confirm 22 / 80 / 443
  ↓
openssl s_client -connect 203.0.113.42:443
  ↓
Submit the audit report
```

## Important

The replay fixture intentionally does not grant production XP/money and does not set:

```text
dead_signal.q01.completed
```

This keeps development repetition isolated from the canonical campaign state.

## Live Validation Goal

Use the replay fixture whenever Q01 needs another full in-game test after a code change. A replay build does not replace the final production Q01 validation; it only makes repeated validation cheap and deterministic.
