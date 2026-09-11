# DEAD SIGNAL — Q01 Objective Reconciliation

Date: 2026-09-11
Status: **RECONCILED — PHASE 8 REMAINS AUTHORITY**

## Source Difference

The earlier Detailed Quest Design for Q01 described four objectives:

1. Accept the contract
2. Review the target
3. Scan the network
4. Submit the audit

The later Phase 8 final technical quest specification locked five required objectives:

1. Review audit scope
2. Scan `203.0.113.42`
3. Identify exposed services
4. Perform basic vulnerability checks
5. Submit audit report

Phase 8 is the immutable technical quest source of truth for Q01–Q16, so the five-objective structure is retained for implementation.

## Technical Mapping

The Phase 8 Q01 technical interaction includes:

```text
203.0.113.42
  ↓
Nmap
  ↓
22 / 80 / 443
  ↓
Service identification
  ↓
Certificate inspection
```

The recovered gameplay source also states that Q01 does not require exploitation.

Therefore Objective 04 is implemented as an explicit HTTPS certificate inspection step:

```bash
openssl s_client -connect 203.0.113.42:443
```

This is an implementation-level action mapping. The story canon is the basic security assessment and certificate inspection, not the command syntax.

## Resulting Player Flow

```text
01  Review audit scope
02  Run nmap 203.0.113.42
03  Confirm 22 / 80 / 443
04  Inspect HTTPS certificate on 443
05  Submit audit report
```

## Regression Rule

The implementation must never complete Objective 04 from a repeated Nmap action. A repeated Nmap command may only satisfy the scan/service objectives that it is designed to satisfy.

## Canon Boundary

This document does not modify Phase 8 canon. It records how the earlier four-objective design and later five-objective technical specification are reconciled for runtime implementation.
