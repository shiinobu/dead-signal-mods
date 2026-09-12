# DSS UI Layout Lock

## Status

LOCKED — September 13, 2026.

## Decision

The DSS desktop application uses a fixed internal workspace canvas with a minimum supported layout of 1180×740 CSS pixels and a default HackHub window size of 1220×800.

The UI does not use responsive breakpoints that collapse the sidebar, tool workspace, or two-column investigation panels. The initial navigator remains a 250px sidebar, while the main content keeps its desktop-oriented grid structure.

Typography, navigator controls, form controls, source rows, statistics, and terminal output are intentionally scaled above the first foundation iteration for desktop readability.

## HackHub Boundary

HackHub SDK 0.21.0 does not expose a documented public property on `App` for disabling native window resizing. Therefore this lock applies to the **DSS content canvas and responsive behavior**, not to the host window manager itself.

If a player resizes the native window below the supported canvas, DSS must not switch to a mobile/single-column layout or silently shrink its typography to compensate.

## Non-negotiables

- App identity remains `dss` / `DSS`.
- Replay changes the Q01 quest instance only; DSS identity and UI remain stable.
- No responsive `@media` breakpoint is allowed to collapse the initial DSS workspace.
- Future tool views must respect the minimum desktop canvas instead of adding mobile breakpoints.
