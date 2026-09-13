# ENTITY RESOLUTION — Q01 Web Boundary Amendment

Date: 2026-09-12
Status: **CHANGE CONTROL — APPLIED; LIVE VALIDATION PENDING**

## Scope

This amendment applies only to the Q01 web-discovery presentation and route boundary. The five-objective sequence, Q01 target, HTTPS Objective 04 method, report subject, resolved report values, completion flag, and rewards remain unchanged.

## Web Boundary

The root domain remains the public homepage:

```text
https://skynet-logistics.idx/
```

The Q01 site defines a maximum of four non-root web surfaces:

```text
/security  authorized audit target
/admin     FORBIDDEN
/portal    FORBIDDEN
/api       FORBIDDEN
```

Only `/security` is the intended audit surface.

The public homepage no longer contains a direct Security Review button or direct `/security` navigation. The player must discover the audit surface through the available assessment evidence rather than being handed a clickable route.

Restricted surfaces are registered with a shared `403 FORBIDDEN` page. The current HackHub Website page model exposes page paths rather than a dedicated DNS-subdomain primitive, so these are represented as non-root web surfaces within the Q01 host.

## Objective 04 Contract

Objective 04 remains bound to:

```text
protocol = https:
hostname = skynet-logistics.idx
pathname = /security
```

No other web surface can satisfy Objective 04.

## Validation

A fresh live run must verify:

```text
root homepage loads
Security Review button absent
/security loads the terminal-style audit page
/admin displays 403/FORBIDDEN
/portal displays 403/FORBIDDEN
/api displays 403/FORBIDDEN
Objective 04 completes only at /security
```

Local typecheck/test execution was not performed in this environment because outbound GitHub DNS resolution is unavailable. The source-level web-boundary regression test has been added at:

```text
tests/phase13-q01-web-boundary.test.ts
```
