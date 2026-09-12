# DEAD SIGNAL — Development Q01 Replay

Purpose: provide a repeatable in-game Q01 test loop without changing production quest state or production campaign progression.

## Production vs Development

Production is built with:

```powershell
npm run build
```

The replay fixture is built separately with:

```powershell
npm run build:replay:q01
```

The replay build is emitted to `dist-replay/` and uses the development mod id `dead-signal-dev`.

Replay remains intentionally isolated from the canonical `dead_signal.q01` completion flag and production rewards.

## Replay Package Layout

```text
dist-replay/
├── mod.js
├── manifest.json
└── assets/
    └── adrian-cole.png
```

## Fresh Replay Rule

Each replay build generates a fresh native quest identity so previously completed or partially completed replay state does not interfere with another test run.

The production quest id remains:

```text
dead_signal.q01
```

## Revised Q01 Gameplay

The replay now follows the revised HTTP/HTTPS audit flow. Native SSH is no longer part of Q01.

```text
Apply
  ↓
Review audit scope
  ↓
nmap 203.0.113.42
  ↓
Confirm 22 / ssh, 80 / http, 443 / https
  ↓
Open the Skynet Logistics security review page
  ↓
Perform basic vulnerability checks
  ↓
Submit the audit report
```

## Workflow

1. Pull the latest repository and install dependencies.

```powershell
git pull
npm install
```

2. Build a fresh replay package.

```powershell
npm run build:replay:q01
```

3. Remove/replace the local development mod folder:

```text
HackHub/mods/dead-signal-dev/
```

Copy the complete contents of `dist-replay/` into that folder.

4. Restart HackHub.

5. Open `THE CONTRACT — DEV REPLAY` and accept it.

6. Review Adrian's audit mail and complete the objectives in order.

### Objective 02

Run:

```bash
nmap 203.0.113.42
```

Expected:

```text
22/tcp  OPEN  ssh
80/tcp  OPEN  http
443/tcp OPEN  https
```

### Objective 03

Identify the three exposed services. Re-running Nmap must not complete Objective 04.

### Objective 04

Open either:

```text
http://skynet-logistics.test/security
```

or:

```text
https://skynet-logistics.test/security
```

The security review page displays the basic external-assessment findings. The quest completes Objective 04 from the matching `Browser.Meta` interaction only after Objective 03 is complete.

### Objective 05

Send the audit report containing:

```text
Target: Skynet Logistics
Open Ports: 22, 80, 443

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

## Development Isolation

The replay fixture:

- grants no production XP;
- grants no production money;
- does not set `dead_signal.q01.completed`;
- does not register Q02–Q16;
- does not import historical SSH smoke-test fixtures.

## Current Replay Tooling

The maintained replay tool is:

```text
scripts/build-q01-replay.ts
```

The old SSH-only diagnostic builders are intentionally removed after the Q01 methodology revision.
