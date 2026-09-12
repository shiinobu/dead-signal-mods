# DSS UI Layout Lock

## Status

LOCKED — September 13, 2026.

## Decision

The DSS desktop application uses a fixed internal workspace canvas with a minimum supported layout of 1180×740 CSS pixels and a default HackHub window size of 1220×800.

The native DSS window also declares `MinSize = { width: 1180, height: 740 }` so the host window cannot be resized below the supported workspace boundary. This mirrors the native minimum-window behavior used by other HackHub Desktop Apps.

The UI does not use responsive breakpoints that collapse the sidebar, tool workspace, or two-column investigation panels. The initial navigator remains a 250px sidebar, while the main content keeps its desktop-oriented grid structure.

Typography, navigator controls, form controls, source rows, statistics, and terminal output are intentionally scaled above the first foundation iteration for desktop readability.

## HackHub Boundary

`DefaultSize` controls the initial native window size. `MinSize` is used for the native minimum window boundary. The public SDK documentation does not currently list `MinSize`, so the property is locked based on validated HackHub app behavior and a working community app implementation using the same SDK.

The internal HTML canvas retains its own 1180×740 minimum so the workspace remains stable at the native floor. No responsive breakpoint is allowed to collapse the DSS workspace when the window is at that floor.

## Non-negotiables

- App identity remains `dss` / `DSS`.
- Replay changes the Q01 quest instance only; DSS identity and UI remain stable.
- Native DSS `MinSize` remains 1180×740 unless the supported workspace contract is intentionally revised.
- No responsive `@media` breakpoint is allowed to collapse the initial DSS workspace.
- Future tool views must respect the minimum desktop canvas instead of adding mobile breakpoints.
