---
type: memory_decisions
updated: 2026-10-06
---

# ⚖️ Strategic Engineering Decisions

Log of key decisions and rationale:

---

- **2026-10-06**: **Consolidation into `.agents/`**: Migrated all agent rules, skills, MCP configuration, and codebase graph database into `.agents/` as the single source of truth across Antigravity, Claude Code, Cursor, and Windsurf.
- **2026-10-06**: **Hybrid Persistent Memory**: Adopted an Obsidian-compatible Markdown vault inside `.agents/memory/` and `tasks/` combined with `codebase-memory-mcp` graph persistence.
- **2026-10-06**: **Zero External Dependencies**: Retained vanilla CommonJS architecture for CLI and color engines to guarantee instantaneous global execution via `npx`.
- **2026-10-06**: **Dual-View UI Specimen Studio & Global Theme Synchronization**: Integrated an authentic smartphone device mockup (chassis, dynamic island, bottom nav, mobile KPIs) alongside the desktop preview. Unified the modal canvas theme toggle with the global site appearance (`data-theme`) via `setGlobalTheme()`, ensuring the entire web application and specimen view synchronously transition between Washi Light and Sumi Dark.
- **2026-10-06**: **Elevated Surface Architecture & Contrast-Guarded Dynamic Theming**: Replaced all generic/muddy `rgba(125, 125, 125, ...)` card backgrounds with elevated `#ffffff` surfaces in light mode and rich `#191816` surfaces in dark mode across web and mobile previews. Added `getReadableAccentOnSurface()` to guarantee that dynamic Wada primary accents on tabs and hero titles never force low-contrast light text onto light backgrounds.


