# DEAD SIGNAL — Q01 UX Correction

Date: 2026-09-12
Status: **REVISED — READY FOR LIVE VALIDATION**

## Locked Objective Names

The five Phase 8 objective names remain exactly:

1. `Review audit scope`
2. `Scan 203.0.113.42`
3. `Identify exposed services`
4. `Perform basic vulnerability checks`
5. `Submit audit report`

The explicit client-name revision changes `Meridian Logistics` to `Skynet Logistics`.

## Revised Player-Facing UX

```text
Review audit scope
Scan 203.0.113.42       [Terminal]
Identify exposed services [?]
Perform basic vulnerability checks [?]
Submit audit report      [?]
```

The fourth objective now has a concise web-audit hint rather than an SSH command:

```text
Inspect http://skynet-logistics.test/security or https://skynet-logistics.test/security and review the security findings.
```

No internal source path is exposed.

## Revised Gameplay Model

Q01 remains a simple opening external audit:

```text
Review scope
    ↓
nmap 203.0.113.42
    ↓
Identify 22/80/443
    ↓
Open the Skynet Logistics security review page
    ↓
Perform basic vulnerability checks
    ↓
Submit the audit report
```

Nmap still completes only the scan/service-identification portion. A repeated Nmap command never completes Objective 04.

## Runtime Rule

Objective 04 is completed only by a `Browser.Meta` event matching:

```text
protocol = http: | https:
hostname = skynet-logistics.test
pathname = /security
```

The web page is a deterministic evidence surface for the basic assessment and requires no exploit, credential attack, data extraction, or internal access.
