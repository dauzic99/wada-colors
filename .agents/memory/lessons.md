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

## Lesson 6: Unified Global Theming vs. Isolated Specimen Canvas Scoping
- **Problem**: Scoping appearance toggles solely to an inner modal canvas causes visual dissonance, leaving the background page in one theme while the specimen preview is in another.
- **Resolution**: Route all theme toggling controls (header button and modal canvas toggles) through a single centralized `setGlobalTheme(mode)` pipeline that synchronously updates `document.documentElement[data-theme]`, syncs localStorage, updates button active states, and recalibrates canvas colors simultaneously.

## Lesson 7: Surface Elevation Hierarchy & Contrast-Safe Dynamic Color Bridges
- **Problem**: Defaulting UI cards or segmented controls to generic `rgba(125, 125, 125, ...)` produces muddy, unstyled surfaces against warm washi paper backgrounds. Furthermore, directly applying raw primary palette colors (`c1.hex`) as tab or title text can force low-contrast light text on light backgrounds (e.g. pale ivory on white) or dark text on dark backgrounds.
- **Resolution**:
  1. Elevate cards onto crisp `#ffffff` surfaces with subtle warm borders `rgba(45, 35, 25, 0.08)` and soft drop shadows in light mode, and rich charcoal `#191816` surfaces in dark mode.
  2. Implement `getReadableAccentOnSurface(accentHex, surfaceHex, isLight)` to test contrast before setting text colors; if contrast against the container is $< 3.6:1$, fall back to high-contrast ink (`#1c1916` / `#f6f4ee`) to guarantee WCAG compliance across all 348 authentic palettes.
  3. Style segmented controls with warm stone backgrounds (`#ece8dd` / `#eae6db`) and high-contrast inactive text (`#4a443c` / `#575147`) so tabs never default to grey or wash out.
## Lesson 8: Strict Prohibition of Tinted/Muddy Fills Inside Elevated White Panels
- **Problem**: Styling inner card items (such as `.sandbox-toggle-row`, inputs, or progress tracks) with dark/khaki off-white fills like `#f7f5ef`, `#ece8dd`, or `#f0ece1` inside an already elevated `#ffffff` container creates an unsightly, dirty grey-box appearance.
- **Resolution**: Inner interactive items and inputs within white panels must remain pure crisp `#ffffff` with subtle borders (`rgba(45, 35, 25, 0.1)`) and soft micro-shadows, or transparent with clean hairline dividers. Never use dirty beige, olive-khaki, or muddy grey fills.

## Lesson 9: Tab Container Purity — Pure White Bars with Wada Accent Active Pills
- **Problem**: Styling segmented control pill bars (`.desktop-nav-tabs`, `.domain-selector-bar`, etc.) with dark stone/khaki fills like `#f1eee5`, `#ece8dd`, or `#eae6db` creates a muddy grey track where unselected tabs sit on a dull background.
- **Resolution**: Tab and segmented control containers must be pure crisp `#ffffff` with a delicate hairline border (`rgba(45, 35, 25, 0.12)`) and micro-shadow. Inactive tabs must be clean text (`#635d53`), and the active tab must be a solid, vibrant pill filled with the active Wada primary pigment (`c1.hex` / `var(--accent-wada)`) with calculated high-contrast text (`getContrastColor(c1.hex)`).

