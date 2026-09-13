# ENTITY RESOLUTION — Historical Q01 Subfinder Lock

Status: **SUPERSEDED**

This historical document described the temporary Q01-specific `subfinders` command and its ProjectDiscovery-inspired presentation.

That design is no longer canonical.

The reconnaissance capability has been promoted into the shared Data Surveillance System architecture and is now owned by `ReconService` under `DSS / OpsRuntime`.

Canonical command:

```text
recon -d <domain>
```

Canonical architecture and reusable tool contract:

```text
DSS
    ↓
OpsRuntime
    ↓
ReconService
    ↓
ReconProfile
```

Q01 supplies profile `q01`; other quests may register additional profiles without creating separate command implementations.

See `docs/dss-recon-tool-lock.md` for the active contract.
