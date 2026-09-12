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

The replay follows the revised HTTPS audit flow. Native SSH is not part of Q01.

```text
Apply
  ↓
Review audit scope
  ↓
nmap
  ↓
Identify exposed services
  ↓
Open https://skynet-logistics.idx/
  ↓
Open https://skynet-logistics.idx/security
  ↓
Perform basic vulnerability checks
  ↓
Discover company + open ports
  ↓
Fill the audit report format
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

Run the displayed terminal action:

```bash
nmap
```

The target IP is provided in Adrian's audit material rather than in the objective text. The replay also accepts `nmap 203.0.113.42` for compatibility with the current terminal runtime.

Expected service state:

```text
22/tcp  CLOSED  ssh
80/tcp  CLOSED  http
443/tcp OPEN    https
```

### Objective 03

Identify the exposed HTTPS service on port 443. There is intentionally no objective hint.

### Objective 04

Open the public home page first:

```text
https://skynet-logistics.idx/
```

Use the homepage to discover the client identity and follow its security-review link to:

```text
https://skynet-logistics.idx/security
```

The security review page displays the basic external-assessment findings. The quest completes Objective 04 from the matching `Browser.Meta` interaction only after Objective 03 is complete.

HTTP is not accepted for Objective 04.

### Objective 05

Adrian supplies the report format without the answer values:

```text
Format report audit:
Subject: Security Audit — Jakarta

Target: <COMPANY>
Open Ports: <PORTS>

No critical vulnerabilities identified.
Further internal assessment is recommended.
```

Replace the placeholders using the values discovered during the audit, then send the normal in-game reply to Adrian.

For the current Q01 world state the resolved values are:

```text
Target: Skynet Logistics
Open Ports: 443
```

Literal placeholders do not satisfy Objective 05.

## Web Surface Boundary

Only the following Q01 pages are registered:

```text
/
/security
```

Other web paths are intentionally not registered and do not have Q01 pages.

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
