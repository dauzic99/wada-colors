# 🤖 AGENTS.md — Project Agent Rules & Architecture

> **MANDATORY**: Every AI agent working on this codebase MUST follow this file. No exceptions.

---

## 🛠️ Mandatory Tool Usage Rules

### 1. Codebase Navigation & Architecture: `codebase-memory-mcp`
- **ALWAYS query `codebase-memory-mcp`** (`search_graph`, `trace_path`, `get_code_snippet`, `query_graph`, `get_architecture`) for discovering code, tracing callers/callees, and analyzing structure before resorting to grep/glob.
- Do NOT perform blind grep searches across the project when the knowledge graph contains the symbols and relationships.

### 2. Framework & Library Documentation: `context7`
- **ALWAYS query `context7`** to fetch up-to-date, official documentation and code examples before writing or modifying code involving external libraries or runtime APIs.
- Do NOT guess API signatures or use outdated deprecated patterns.

---

## 📚 Workspace Structure (`.agents/`)

All workspace intelligence, customizations, memory, and rules are located under `.agents/`:

```
.agents/
├── mcp_config.json               ← Workspace MCP servers (codebase-memory-mcp, context7)
├── codebase-memory/              ← Persistent Knowledge Graph database index & caches
│   ├── .gitattributes            ← Binary merge driver
│   ├── artifact.json             ← Commit and schema metadata
│   └── graph.db.zst              ← Compressed graph database
├── skills/                       ← Workspace Agent Skills
│   └── wada-colors/              ← Primary Wada color & creative studio skill
│       ├── SKILL.md
│       └── references/           ← Contrast rules, mood matrix, palette directory
├── adr/                          ← Architecture Decision Records
│   └── ADR-001-codebase-memory-and-agents-knowledge.md
├── rules/                        ← Mandatory Agent Rules
│   ├── tools-mandate.md          ← Mandatory tool rules (context7 & codebase-memory-mcp)
│   ├── color-theory.md           ← Authentic Wada Sanzo 1930s preservation & WCAG rules
│   ├── architecture.md           ← CLI, fashion engine, and theming AST architecture
│   ├── coding-standards.md       ← Node.js / JavaScript CommonJS standards
│   └── restrictions.md           ← Hard constraints & security rules
├── docs/                         ← System Documentation
│   ├── system-design.md          ← Engine architecture & CIELAB Delta-E math
│   ├── design-system.md          ← UI token system & component class rules
│   ├── codebase-memory.md        ← Knowledge graph CLI & query guide
│   └── glossary.md               ← Japanese aesthetic & color terminology
└── memory/                       ← Persistent Knowledge & Session Vault
    ├── index.md                  ← Vault root with [[wikilinks]]
    ├── context.md                ← Active cross-session working state
    ├── lessons.md                ← Self-improvement loop / failure recovery notes
    ├── decisions.md              ← Strategic engineering decision log
    └── tasks/                    ← Task tracking & sprint plans
```

---

## 🧠 Persistent Memory & Obsidian Vault

This project uses Obsidian-flavored markdown for agent memory and documentation.

### Rules:
- Use `[[wikilinks]]` to connect related tasks, lessons, and code concepts.
- Maintain Obsidian properties (frontmatter) in memory notes.
- Use callouts `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]` for critical details.
- Read `[[.agents/memory/context|context.md]]` at the start of complex tasks.
- Record any user correction or recovered failure in `[[.agents/memory/lessons|lessons.md]]`.

---

## ⚡ Boris Cherny Workflow

This project adheres to the Boris Cherny workflow for disciplined, high-quality engineering:

### 1. Workflow Orchestration
- **Plan Mode Default**: Plan for ANY non-trivial task (3+ steps or architectural changes). STOP and re-plan if sideways. Write specs upfront.
- **Subagent Strategy**: Use subagents liberally. Offload research, exploration, or validation.
- **Self-Improve Loop**: Update `tasks/lessons.md` / `.agents/memory/lessons.md` after any correction. Write rules to prevent same mistakes.
- **Verification Before Done**: Prove it works. Run `npm test`. Verify behavior against specs.
- **Demand Elegance**: Pause and ask "is there a more elegant way?". Avoid hacky fixes.
- **Autonomous Bug Fixing**: Resolve issues thoroughly through root causes, logs, and tests.

### 2. Task Management
1. **Plan First**: Write plan to `tasks/todo.md`.
2. **Verify Plan**: Check in before implementation.
3. **Track Progress**: Mark items complete as executed.
4. **Capture Lessons**: Update `tasks/lessons.md` upon completion.

---

## 🌸 Domain Rules (Wada Colors)

1. **Strict Authentic Wada Preservation**: NEVER alter, lighten, or hue-shift the authentic 159 Wada colors or 348 palettes.
2. **Neutral Monochrome Bridge**: Always bridge surfaces and typography with clean monochromes (`#fcfbf9` washi ivory or `#111314` sumi carbon) to achieve $\ge 15:1$ contrast.
3. **Perceptual Delta-E**: Color distance matching must strictly use CIELAB Delta-E ($\Delta E^*$). Naive Euclidean RGB distance is prohibited.
4. **Mandatory Bottom Widget**: Every generated fashion lookbook must include the bottom color palette widget displaying the exact Wada pigments with Kanji names, hex codes, and role allocations.
