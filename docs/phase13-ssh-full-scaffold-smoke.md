# DEAD SIGNAL — FULL Scaffold SSH Smoke Test

## Purpose

This smoke test is a clean diagnostic based on the `InvestigationQuest` from the FULL `npm create hackhub-mod` scaffold provided in `dd.rar`.

The test deliberately does **not** create a virtual network. It observes the game's normal remote-connection flow against the scaffold's existing target.

## Contract

```text
HackHubPost
    ↓
player accepts post
    ↓
OnStart()
    └── sendMail()
    ↓
OnObjectivesStart()
    ├── RemoteConnection.Established  ← completion boundary, same as FULL scaffold
    └── Terminal.SSH.Connected        ← diagnostic logging only
```

There is no:

- `Network.createSubnetNetwork()`;
- `Network.createUser()`;
- `Network.openPort()`;
- `Shell.addCommandData("ssh", ...)`;
- child device;
- synthetic SSH response;
- Q01 import.

## Build

```powershell
npm run build:smoke:ssh-full
```

Install the generated package:

```text
HackHub/mods/dead-signal-ssh-full-smoke/
```

Restart HackHub.

## Live test

1. Find the `SSH FULL SCAFFOLD SMOKE TEST` HackHub post.
2. Accept the post.
3. Open Terminal.
4. Use the target from the post:

```bash
ssh -h admin@45.33.32.156
```

You may also test the same command without `-p` and with `-p 22`; the purpose is only to determine whether the connection itself is established.

## Expected diagnostic signals

When native SSH succeeds, at least one of these should appear in the HackHub log:

```text
[DEAD SIGNAL SSH FULL SMOKE] RemoteConnection.Established ip=45.33.32.156 service=ssh
```

or:

```text
[DEAD SIGNAL SSH FULL SMOKE] Terminal.SSH.Connected ip=45.33.32.156
```

The objective is completed from `RemoteConnection.Established`, matching the FULL scaffold's event path.

## Interpretation

### PASS

SSH establishes a remote connection and the objective completes.

This demonstrates that the native SSH/remote-connection path works when the quest follows the FULL scaffold observation model.

### FAIL

The game reports:

```text
Connection to the remote server could not be established.
```

with the objective still incomplete.

At that point the failure is reproduced with the FULL scaffold's observation architecture and without DEAD SIGNAL network provisioning. Investigation should move to the HackHub runtime/game behavior rather than Q01.
