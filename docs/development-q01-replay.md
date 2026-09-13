# ENTITY RESOLUTION — Development Q01 Replay

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

The replay build is emitted to `dist-replay/` and uses the development mod id `entity-resolution-dev`.

Replay remains intentionally isolated from the canonical `entity_resolution.q01` completion flag and production rewards.

## Fresh Replay Rule

Each replay build generates a fresh native quest identity so previously completed or partially completed replay state does not interfere with another test run.

The production quest id remains:

```text
entity_resolution.q01
```

## Revised Q01 Gameplay

The replay follows the revised reconnaissance flow. Native SSH is not part of Q01.

```text
Apply
  ↓
Review audit scope
  ↓
nmap
  ↓
Identify exposed services
  ↓
lynx 203.0.113.42
  ↓
https://www.skynet-logistics.idx/
  ↓
subfinder -d skynet-logistics.idx
  ↓
4 subdomains
  ↓
security.skynet-logistics.idx
  ↓
Perform basic vulnerability checks
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
HackHub/mods/entity-resolution-dev/
```

Copy the complete contents of `dist-replay/` into that folder.

4. Restart HackHub.

5. Open `THE CONTRACT — DEV REPLAY` and accept it.

6. Review Adrian's audit mail and complete the objectives in order.

### Objective 02

Run:

```bash
nmap
```

The target IP is provided in Adrian's audit material rather than in the objective text. The replay also accepts `nmap 203.0.113.42` for compatibility with the current terminal runtime.

Expected service state:

```text
22/tcp  CLOSE  ssh
80/tcp  CLOSE  http
443/tcp OPEN   https
```

### Objective 03

Identify the exposed HTTPS service on port 443. There is intentionally no objective hint.

### Objective 04 — Reconnaissance

Discover the canonical public host from the target IP:

```bash
lynx 203.0.113.42
```

The replay also accepts:

```bash
lynx https://203.0.113.42/
```

Expected canonical address:

```text
https://www.skynet-logistics.idx/
```

Then enumerate the apex domain:

```bash
subfinder -d skynet-logistics.idx
```

Expected four subdomains:

```text
portal.skynet-logistics.idx
security.skynet-logistics.idx
status.skynet-logistics.idx
www.skynet-logistics.idx
```

Open the discovered hosts:

```text
https://www.skynet-logistics.idx/
https://portal.skynet-logistics.idx/
https://status.skynet-logistics.idx/
https://security.skynet-logistics.idx/
```

Expected behavior:

```text
www      → public homepage
portal   → 403 FORBIDDEN
status   → 403 FORBIDDEN
security → Q01 audit target
```

The security-review page uses the black/green terminal-style presentation. Objective 04 completes only when the `security` host is opened over HTTPS after the discovery chain is complete.

HTTP is not an accepted audit transport because Q01 only exposes 443/tcp.

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

Replace the placeholders using the discovered values, then send the normal in-game reply to Adrian.

For the current Q01 world state:

```text
Target: Skynet Logistics
Open Ports: 443
```

Literal placeholders do not satisfy Objective 05.

## Web and Port Boundary

Q01 models exactly four subdomains:

```text
www.skynet-logistics.idx
portal.skynet-logistics.idx
status.skynet-logistics.idx
security.skynet-logistics.idx
```

The network exposes only:

```text
443/tcp OPEN https
```

and keeps 22/tcp and 80/tcp closed.

Canonical HTTPS URLs omit `:443`. Explicit wrong-port requests are outside the accepted Q01 audit boundary.

## Development Isolation

The replay fixture:

- grants no production XP;
- grants no production money;
- does not set `entity_resolution.q01.completed`;
- does not register Q02–Q16;
- does not import historical SSH smoke-test fixtures.

## Current Replay Tooling

The maintained replay tool is:

```text
scripts/build-q01-replay.ts
```
