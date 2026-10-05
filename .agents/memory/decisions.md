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
