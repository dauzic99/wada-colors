# 📋 Tasks & Sprint Todo

## Current Initiative: Codebase Memory MCP & `.agents` Knowledge Consolidation

- [x] Index codebase into `codebase-memory-mcp` (755 nodes, 1033 edges)
- [x] Relocate codebase memory artifacts to `.agents/codebase-memory/`
- [x] Create `.agents/mcp_config.json` and root `.mcp.json`
- [x] Set up `.agents/rules/` (`tools-mandate.md`, `color-theory.md`, `architecture.md`, `coding-standards.md`, `restrictions.md`)
- [x] Consolidate `wada-colors` skill into `.agents/skills/wada-colors/`
- [x] Set up `.agents/docs/` (`codebase-memory.md`, `system-design.md`, `design-system.md`, `glossary.md`)
- [x] Write `ADR-001` in `.agents/adr/`
- [x] Set up Persistent Memory Vault in `.agents/memory/`
- [x] Create root `AGENTS.md` and `CLAUDE.md` (and mirrored copies in `.agents/`)
- [x] Update `.gitignore` for `.agents/` and graph artifacts
- [x] Enrich skill references:
  - [x] `references/fashion-rules.md` (7-layer taxonomy, climate/modesty, bottom widget)
  - [x] `references/interior-rules.md` (7-plane allocations, lighting Kelvin, materiality)
  - [x] `references/component-tokens.md` (Tailwind v4 `@theme`, CSS vars, accessible components)
- [x] Validate codebase and verify test suite (`npm test` 100% passing)

## Initiative: Mobile Smartphone Mockup & Global Site-Wide Theme Synchronization
- [x] Plan interactive mobile smartphone chassis & expanded component sandbox (`mobile_web_mockup_plan.md`)
- [x] Add viewport switcher (`[ 💻 Desktop Web | 📱 Mobile App ]`) to `web/index.html`
- [x] Implement realistic smartphone chassis with dynamic island, status bar, app bar, KPI grid, search, toggle, and bottom nav in `web/index.html`
- [x] Expand desktop preview with KPI metrics row, focusable inputs with glow rings, toggle switches, and status pills in `web/index.html`
- [x] Style all chassis, dynamic island, device bar, KPI metrics, and components in `web/style.css`
- [x] Implement `setGlobalTheme(mode)` in `web/app.js` to synchronously toggle entire website (`data-theme`) and canvas between Washi Light and Sumi Dark
- [x] Implement `syncDeviceView()` in `web/app.js` with domain-aware visibility
- [x] Wire all micro-interactions in `web/app.js` (desktop tabs, mobile nav, interactive toggle switches)
- [x] Run full verification suite (`node -c`, `npm test`)

