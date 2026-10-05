---
type: memory_lessons
updated: 2026-10-06
---

# 📚 Self-Improvement & Lessons Learned

> **Mandate**: Every time an agent makes a mistake, is corrected by the user, or encounters an edge case, a rule or lesson MUST be documented here to permanently prevent recurrence.

---

## Lesson 1: Windows Command Execution & Path Separators
- **Problem**: When querying child items or recursive patterns on Windows PowerShell, depth and path separators (`\` vs `/`) can cause command timeouts or errors if run across huge unindexed node_modules.
- **Resolution**: Target specific subdirectories directly; avoid unbounded recursive searches on parent directories.

## Lesson 2: Git Tracking of Compressed Graph Artifacts
- **Problem**: Binary files like `.codebase-memory/graph.db.zst` can trigger merge conflicts in collaborative git workflows.
- **Resolution**: Always keep `.gitattributes` configured with `graph.db.zst merge=ours binary` so merge operations prioritize local generated versions.

## Lesson 3: Preserving Historical Color Accuracy
- **Problem**: AI models may naturally try to "lighten" or "harmonize" dark colors by applying mathematical tints, corrupting historical Wada palettes.
- **Resolution**: Enforce strict palette preservation in `.agents/rules/color-theory.md` and use neutral monochrome bridging instead of mutating palette pigments.

## Lesson 4: Mandatory Bottom Color Palette Widget in Lookbooks
- **Problem**: Fashion lookbooks generated without visual color swatches or hex identifiers make downstream styling and GenAI reproduction ambiguous.
- **Resolution**: Every lookbook generation must append the persistent bottom color palette widget displaying the exact Wada pigments, Kanji names, hex codes, and role allocations.

## Lesson 5: Modular Domain References in Agent Skills
- **Problem**: When agent skills bundle all domain-specific rules (Fashion, Interior, UI) into a single monolithic `SKILL.md`, agent context windows become crowded and token consumption spikes.
- **Resolution**: Break domain-specific rules into dedicated modular reference documents (`references/fashion-rules.md`, `references/interior-rules.md`, `references/component-tokens.md`) so agents can read only the domain they need on demand.
