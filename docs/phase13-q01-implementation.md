# DEAD SIGNAL — Q01 Implementation

Date: 2026-09-11
Status: **IMPLEMENTATION COMPLETE — LIVE VALIDATION PENDING**

## Source

Q01 is implemented from the recovered Detailed Quest Design and the locked Phase 8 technical quest specification.

Canonical Q01:

- ID: `dead_signal.q01`
- Title: `THE CONTRACT`
- Chapter: `01 — DEAD SIGNAL`
- Location: Jakarta
- Primary: Adrian Cole
- Prerequisite: none
- Target: `203.0.113.42`
- Persistent completion state: `dead_signal.q01.completed = true`
- Money reward: `$200`
- XP maximum: `80`

## Player-Facing Flow

```text
HackHub feed / job offer
        ↓
Claim Q01
        ↓
Adrian email / audit scope
        ↓
Run nmap 203.0.113.42
        ↓
Confirm 22 / 80 / 443
        ↓
Open the generated HTTPS certificate record
        ↓
Submit the audit report
        ↓
Q01 complete
        ↓
$200 + 80 XP maximum
        ↓
Q02 becomes the next campaign target
```

## Technical Integration

### Email

Q01 sends the recovered Adrian contract text through HackHub's quest mail channel when the quest is first claimed.

The report is detected through the scoped `Mail.Sent` event. The implementation requires the source report subject and the essential report facts, including the target, ports, `No critical vulnerabilities identified.`, and the recommendation to perform further internal assessment.

### Nmap

The locked Phase 12 path is preserved:

```text
Terminal.Command
      ↓
Shell.getCommandData("nmap", target)
```

Q01 registers deterministic command data through `Shell.addCommandData("nmap", ...)` in `OnObjectivesStart()` so the interaction is available again after a game reload. The response contains:

```text
22/tcp  OPEN  ssh
80/tcp  OPEN  http
443/tcp OPEN  https
```

No direct `Terminal.NmapScan` dependency is introduced.

### Certificate / Basic Assessment

The recovered Q01 technical interaction explicitly includes certificate inspection, while the locked Phase 8 objective remains `Perform basic vulnerability checks`.

HackHub's built-in `openssl` command is **not** a TLS certificate inspection utility; in the in-game Handbook it is an encryption/decryption command. Therefore Q01 must not instruct the player to use `openssl s_client` or any other unsupported OpenSSL syntax.

Instead, after the successful Nmap/service-identification step, Q01 creates the following virtual filesystem record:

```text
~/meridian-443-certificate.txt
```

The player-facing Objective 04 tells the player exactly to open that file. Its content records the source-backed HTTPS inspection result:

```text
Target: 203.0.113.42
Port: 443/tcp
Service: HTTPS
Issuer: ARKA Secure Infrastructure
```

Objective 04 completes from the supported `Files.Open` event when that certificate record is opened. The record is created only after the Nmap/service-identification gate is reached, and its existence is checked again on reload so the objective remains playable after restart.

This is an implementation-level representation of the source-defined certificate inspection. It does not add a new story beat or a new persistent story flag.

### Canonical State

The player-facing objective progression is owned by HackHub's quest/objective state. The DEAD SIGNAL canonical runtime receives only the source-defined final completion flag:

```text
dead_signal.q01.completed = true
```

No additional persistent Q01 story flags were created.

### Rewards

The locked Phase 8 allocation is dispatched through the canonical application services:

```text
35 XP  — Complete external audit
20 XP  — Network/service enumeration
10 XP  — Basic vulnerability assessment
15 XP  — Submit correct report
--------------------------------
80 XP total
```

Money is dispatched through `EconomyService.applyMissionReward()` for `$200`.

All reward IDs are deterministic and idempotent through the existing reward/economy ownership model.

## Intentional Boundary

The recovered source says Q01 uses Relay for the short post-report Adrian response, but the currently available HackHub SDK reference exposes Email as the supported communication API and no native Relay API. The implementation therefore preserves the dialogue/content beat through a second quest email. This is an infrastructure adapter choice only; it does not introduce a new story system or change the canonical story event.

Q01 does not require vulnerability exploitation. The concrete basic-assessment action is the source-defined HTTPS certificate inspection, represented through the supported virtual filesystem and `Files.Open` event rather than an invented exploit command or unsupported `openssl` syntax.

## UX Correction — 2026-09-11

Initial implementation completed the basic-assessment objective from any valid Nmap event. During live testing, running Nmap a second time therefore advanced the quest unexpectedly and left the player unsure what action was required.

A second correction was required after validating the HackHub Handbook: `openssl` in the game supports encryption/decryption, not `s_client` TLS certificate inspection. The unsupported command has been removed completely.

The final objective boundaries are now:

```text
Nmap
  ├─ completes Scan Network
  └─ completes Identify Exposed Services

Open ~/meridian-443-certificate.txt
  └─ completes Basic Vulnerability Checks

Audit email/report
  └─ completes Submit Audit
```

This preserves the five locked Phase 8 objectives while giving each stage a concrete player action that is actually supported by HackHub.

## Validation Gate

This implementation is not marked production-locked yet.

Required next gate:

```text
npm run typecheck
npm test
npm run build
        ↓
Install dist/ into HackHub
        ↓
Live Q01 validation
        ↓
Reload validation
        ↓
Verify $200 / 80 XP maximum / q01.completed
        ↓
Record PASS
        ↓
Lock Q01
```

Only after Q01 live validation passes may Phase 13 advance to Q02.
