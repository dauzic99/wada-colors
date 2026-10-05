# ADR-001: Migration to `.agents` Unified Architecture & Codebase Memory Graph

- **Status**: Accepted
- **Date**: 2026-10-06
- **Authors**: Antigravity & Engineering Team

---

## Context
As the `wada-colors` system expanded to support multiple AI coding environments (Antigravity IDE, Claude Code, Cursor, Windsurf, Roo Code), agent instructions, domain rules, and skill definitions became fragmented across disparate directories (`adapters/`, `templates/`, `skills/`). Furthermore, agents lacked persistent knowledge across multiple sessions, leading to redundant discovery.

---

## Decision
1. **Unified Agent Root (`.agents/`)**:
   Establish `.agents/` as the single source of truth for all AI agent intelligence:
   - Rules in `.agents/rules/` (`tools-mandate.md`, `color-theory.md`, `architecture.md`, `coding-standards.md`, `restrictions.md`).
   - Skills in `.agents/skills/` (`wada-colors` skill and reference tables).
   - Documentation in `.agents/docs/`.
   - Architectural records in `.agents/adr/`.
2. **Codebase Memory MCP Integration**:
   - Index the repository into `codebase-memory-mcp` knowledge graph.
   - House persistent graph database artifacts in `.agents/codebase-memory/` (`graph.db.zst`, `artifact.json`, `.gitattributes`).
   - Configure workspace MCP server definitions in `.agents/mcp_config.json` and `.mcp.json`.
3. **Hybrid Persistent Memory**:
   - Implement an Obsidian-compatible Markdown knowledge vault in `.agents/memory/` and `tasks/` (`todo.md`, `lessons.md`, `decisions.md`, `context.md`).
   - Support `claude-mem` and Boris Cherny self-improvement loops.
4. **Canonical Agent Entry Points**:
   - Provide root-level and `.agents/`-level `AGENTS.md` and `CLAUDE.md`.

---

## Consequences
- **Positive**:
  - Zero context loss across sessions and tools.
  - Multi-agent parity: Antigravity, Claude Code, Cursor, and Windsurf all share the exact same rules and knowledge graph.
  - 100% git-tracked memory; no reliance on closed cloud databases.
- **Negative / Maintenance**:
  - Changes to code structure require running `detect_changes` or `index_repository` to refresh the graph.
