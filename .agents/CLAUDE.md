## Setup & Workflow

### New Device Setup
If you just pulled this repository on a new device:
1. Ensure the `codebase-memory-mcp` server is configured and running in your MCP settings (see `.mcp.json` or `.agents/mcp_config.json`).
2. The indexer will automatically build or load the persistent graph artifact from `.agents/codebase-memory/graph.db.zst`.
3. Run `npm test` to verify dataset integrity and the fashion engine.

---

## codebase-memory-mcp

This project relies on `codebase-memory-mcp` by DeusData for fast, token-efficient codebase structure navigation, symbol discovery, and call-graph analysis.

Rules:
- For complex logic or architecture queries, utilize `search_graph`, `trace_path`, or `get_code_snippet` to identify related components.
- Do not check or commit local static search files to the repository.
- Persistent graph artifacts reside in `.agents/codebase-memory/`.

---

## Persistent Memory & Obsidian Vault

This project uses an Obsidian-flavored Markdown vault for persistent agent memory, task planning, and lessons.

Rules:
- Use `[[wikilinks]]` to connect related tasks, lessons, and code concepts.
- Maintain Obsidian properties (YAML frontmatter) in memory notes.
- Use callouts `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]` for critical details.
- At start of session: Consult `.agents/memory/context.md` for current sprint goals.
- If using `claude-mem`: Session observations automatically align with `.agents/memory/` and `tasks/lessons.md`.

---

## Boris Cherny Workflow

This project follows the Boris Cherny workflow for disciplined, high-quality engineering:

### Workflow Orchestration
- **Plan Mode Default**: Plan for ANY non-trivial task (3+ steps/architectural). STOP and re-plan if sideways. Write specs upfront.
- **Subagent Strategy**: Use subagents liberally. Offload research/exploration. One task per subagent.
- **Self-Improve Loop**: Update `tasks/lessons.md` after any correction. Write rules to prevent same mistakes.
- **Verification Before Done**: Prove it works. Run `npm test`. Verify against specs.
- **Demand Elegance (Balanced)**: Pause and ask "is there a more elegant way?". Avoid hacky fixes.
- **Autonomous Bug Fixing**: Just fix it. Resolve via logs/errors/tests.

### Task Management
1. **Plan First**: Write plan to `tasks/todo.md`.
2. **Verify Plan**: Check in before implementation.
3. **Track Progress**: Mark items complete.
4. **Explain Changes**: High-level summary at each step.
5. **Document Results**: Add review section to `tasks/todo.md`.
6. **Capture Lessons**: Update `tasks/lessons.md` and `.agents/memory/lessons.md`.

### Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Only touch what's necessary.
- **Authentic Wada Preservation**: Never alter or hue-shift the 159 historical Wada colors or 348 combinations.
