# 🧠 Codebase Knowledge Graph Guide (`codebase-memory-mcp`)

This project uses `codebase-memory-mcp` to maintain a persistent, high-performance graph index of all CLI modules, color algorithms, fashion engines, and theming adapters.

---

## 🛠️ Tool Discovery Commands

| Goal | MCP Tool | Example |
|---|---|---|
| Find a Function / Command | `search_graph` | `search_graph(name_pattern=".*deltaE.*")` |
| Trace Callers/Callees | `trace_path` | `trace_path(function_name="runApplyTheme", direction="inbound")` |
| Read Symbol Source | `get_code_snippet` | `get_code_snippet(qualified_name="bin/cli.rgbToXyz")` |
| High-Level Architecture | `get_architecture` | `get_architecture()` |
| Re-index Repository | `index_repository` | `index_repository(repo_path="d:/work/wada_color", persistence=true)` |
| Check Index Status | `index_status` | `index_status()` |
| Detect Unindexed Changes | `detect_changes` | `detect_changes()` |

---

## 📁 Storage & Artifacts

- **Unified Agent Root**: `.agents/`
- **Knowledge Graph Data & Cache**: `.agents/codebase-memory/`
  - `.gitattributes` — Git binary merge driver (`graph.db.zst merge=ours binary`).
  - `artifact.json` — Commit hash and schema version metadata.
  - `graph.db.zst` — Compressed binary graph database persisted for cross-device memory.
- **Workspace MCP Configuration**: `.agents/mcp_config.json`
- **Claude Code CLI MCP Configuration**: `.mcp.json`
- **Rules & Policies**: `.agents/rules/`
- **Documentation & Design System**: `.agents/docs/`
- **Persistent Vault Memory**: `.agents/memory/`
