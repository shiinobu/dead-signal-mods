# DEAD SIGNAL — Native SSH Smoke Test

Status: **READY FOR LIVE TEST**

## Purpose

This smoke test isolates HackHub native SSH from the DEAD SIGNAL Q01 implementation.

The fixture intentionally follows the structure of the FULL `npm create hackhub-mod` scaffold and the HackHub SDK 0.21.0 SSH example:

```text
HackHubPost
    ↓
player accepts post
    ↓
OnStart()
    ↓
Network.createSubnetNetwork()
    ↓
Router
├── TCP 22 / ssh
├── admin user
└── children: []
    ↓
Terminal.SSH.Connected
    ↓
connect objective complete
```

No Q01 content is imported. The fixture does not register `Shell.addCommandData("ssh", ...)`, does not create child devices, does not call `Network.openPort()`, and does not listen for `Terminal.Command`.

## Build

Set the SSH password from the original FULL scaffold in the current PowerShell session:

```powershell
$env:SSH_SMOKE_PASSWORD = "<FULL-SCAFFOLD-PASSWORD>"
```

Build the isolated package:

```powershell
npm run build:smoke:ssh
```

The build generates a fresh quest identity and writes:

```text
dist-ssh-smoke/
├── mod.js
└── manifest.json
```

Install the complete directory as:

```text
HackHub/mods/dead-signal-ssh-smoke/
```

Restart HackHub.

## Live Test

1. Confirm `SSH NATIVE SMOKE TEST` appears as a HackHub post.
2. Accept the post using the normal HackHubPost flow.
3. Confirm the `connect` objective appears.
4. Open Terminal.
5. Use HackHub's native SSH syntax for the target:

```bash
ssh -h admin@45.33.32.156
```

6. Enter the password shown in the accepted smoke-test post when prompted.
7. Expected result:

```text
Terminal.SSH.Connected
connect objective = complete
```

## Interpretation

### PASS

Native SSH establishes a connection and Objective `connect` completes.

This proves the minimal FULL-scaffold pattern works in the user's current HackHub runtime. We can then port only the proven pattern into Q01.

### FAIL

The terminal reports:

```text
Connection could not be established.
```

and `connect` remains incomplete.

This proves the failure is reproducible without Q01's code, custom command data, quest-specific state, or child-device topology. The next investigation target is therefore the HackHub game/runtime or the SDK/game compatibility surface, not DEAD SIGNAL Q01.

## Scope Boundary

This smoke test is diagnostic only. It must not:

- set `dead_signal.q01.completed`;
- grant production XP or money;
- import Q01;
- import Q14;
- run the Phase 12 diagnostic harness;
- modify canonical DEAD SIGNAL state.
