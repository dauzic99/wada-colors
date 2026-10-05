---
trigger: always_on
---

# 🛠️ Mandatory Tool Usage Rules: Context7 & Codebase-Memory-MCP

Every AI agent working on this codebase MUST follow these tool usage rules and restrictions.

---

## 1. 🧠 Codebase Discovery: codebase-memory-mcp (MANDATORY)

The `codebase-memory-mcp` knowledge graph is the **primary** mechanism for discovering and understanding this codebase.

### Priority Order
1. `search_graph` — Find functions, classes, CLI commands, and color processing modules by pattern.
2. `trace_path` — Trace call hierarchies (who calls a function or what a function calls).
3. `get_code_snippet` — Read specific function/class source code directly.
4. `query_graph` — Execute Cypher queries for architectural and relationship patterns.
5. `get_architecture` — Retrieve high-level project summary and layer structure.
6. `detect_changes` — Check structural drift or unindexed modifications.

### 🚫 Codebase Navigation Restrictions
- **NO blind grep/glob searches** for code structures, functions, or component usage when the knowledge graph can resolve them.
- Grep/glob is ONLY permitted for non-code files (e.g., JSON color datasets, Markdown docs, HTML/CSS assets) or exact error string literals.
- Always verify the project index is fresh (`index_status` / `index_repository`).

---

## 2. 📚 Library & API Documentation: Context7 (MANDATORY)

Before implementing, modifying, or refactoring features that rely on external libraries or frameworks, you **MUST query Context7** to retrieve up-to-date, version-accurate documentation and code examples.

### When to Query Context7:
- When working with UI libraries or frameworks (React, Vue, Tailwind CSS, etc.).
- When configuring CLI tooling, argument parsers, or Node.js runtime features.
- When generating styling integration templates or code transformations.

### 🚫 API Guessing Restrictions
- **NO guessing API signatures**: Do not guess method parameters, configuration options, or deprecated interfaces. Check Context7 first.
- **NO outdated patterns**: Always verify current APIs through Context7 to avoid hallucinating deprecated interfaces.
