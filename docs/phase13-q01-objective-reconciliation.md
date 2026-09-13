# ENTITY RESOLUTION — Q01 Objective Reconciliation

Date: 2026-09-12
Status: **REVISED — PHASE 8 OBJECTIVE STRUCTURE PRESERVED**

## Source Difference

The recovered Phase 8 technical quest specification locks five required objectives:

1. Review audit scope
2. Scan `203.0.113.42`
3. Identify exposed services
4. Perform basic vulnerability checks
5. Submit audit report

Phase 8 remains the authority for these player-facing objective names and ordering.

## Change-Control Revision

The client name is explicitly revised from `Meridian Logistics` to `Skynet Logistics`.

The former Objective 04 SSH interaction is replaced because native SSH did not establish reliably in the current HackHub runtime. The replacement preserves the same story meaning: an authorized, basic external vulnerability assessment without exploitation.

## Revised Technical Mapping

```text
203.0.113.42
  ↓
Nmap response
  ↓
22 / 80 / 443
  ↓
Service identification
  ↓
HTTP/HTTPS security-surface inspection
  ↓
Basic vulnerability assessment
  ↓
Audit report
```

## Objective Mapping

| Objective | Player action | Completion boundary |
|---|---|---|
| 01 — Review audit scope | Accept/review Adrian's contract | Q01 scope reviewed |
| 02 — Scan 203.0.113.42 | `nmap 203.0.113.42` | Expected typed Nmap response |
| 03 — Identify exposed services | Interpret 22/80/443 | Expected service set identified |
| 04 — Perform basic vulnerability checks | Open `http://skynet-logistics.test/security` or `https://skynet-logistics.test/security` | `Browser.Meta` matches host + `/security` + HTTP/HTTPS |
| 05 — Submit audit report | Send correct report to Adrian | Report accepted after Objective 04 |

## Objective 04 Runtime Contract

The web audit surface is:

```text
Host:   skynet-logistics.test
Path:   /security
HTTP:   http://skynet-logistics.test/security
HTTPS:  https://skynet-logistics.test/security
```

The quest listens to the documented `Browser.Meta` event and requires:

```text
protocol  = http: | https:
hostname  = skynet-logistics.test
pathname  = /security
```

Repeated Nmap commands never satisfy Objective 04.

No SSH command, SSH credentials, child SSH device, SSH command-data response, or `Terminal.SSH.Connected` event participates in Q01 completion.

## Canon Boundary

This revision changes only the explicitly change-controlled client name and the implementation method for the already-locked basic-assessment objective. No new persistent story flag, prerequisite, reward, chapter, or objective ID is introduced.
