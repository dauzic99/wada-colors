---
trigger: always_on
---

# 🏛️ Wada Colors Architecture Rules

Architectural design standards for the Wada Colors CLI, theming engine, and fashion catalog.

---

## 1. Directory Structure

```
d:\work\wada_color\
├── bin/
│   ├── cli.js                  ← CLI command dispatcher & interactive prompt engine
│   ├── fashion-catalog.js      ← 7-layer fashion taxonomy, modesty & occasion logic
│   └── theming-engine.js       ← Codebase scanner & token AST injector
├── data/
│   ├── wada_colors.json        ← 159 canonical colors with RGB, LAB, and Kanji names
│   └── wada_combinations.json  ← 348 2-color, 3-color, and 4-color palettes
├── scripts/
│   ├── validate-data.js        ← Integrity test for colors and palettes
│   ├── test-fashion-engine.js  ← Automated suite for fashion & CLI generation
│   ├── generate-markdown-refs.js ← Compiles palette-directory.md
│   └── bundle-web-data.js      ← Packages data for the web gallery
├── templates/                  ← Markdown templates for design, lookbook, and interior
├── web/                        ← Standalone browser-based color gallery
└── .agents/                    ← Unified workspace memory, rules, skills, and graph artifacts
```

---

## 2. CLI Architecture (`bin/cli.js`)
- Zero mandatory external runtime dependencies: all CLI parsing, math, HTTP serving, and file ops use native Node.js core modules (`fs`, `path`, `http`, `readline`).
- Commands:
  - `init`: Scaffold agent skills across Claude, Antigravity, Cursor, Windsurf, Roo, Copilot.
  - `palette [id]`: Look up combination, tokens, and multi-platform GenAI prompts.
  - `match <hex|file>`: Ingest brand assets and find nearest Wada combinations via CIELAB Delta-E.
  - `apply [id]`: Scan project (Tailwind, CSS variables, CSS-in-JS) and inject Wada tokens.
  - `fashion`: Generate a tailored 7-layer fashion lookbook with ensemble pieces.
  - `interior`: Generate an architectural interior space specification.
  - `serve`: Run local gallery server on port 3333.

---

## 3. Fashion & Garment Engine Architecture (`bin/fashion-catalog.js`)
- **7-Layer Taxonomy**:
  1. Base / Underlayer
  2. Main Garment (Top / Dress)
  3. Bottom / Lower Body
  4. Layering / Mid-Layer
  5. Outerwear
  6. Footwear
  7. Accent & Accessories
- **Adaptive Constraints**:
  - Modesty filters: automatically replace revealing items with modest silhouettes.
  - Climate filters: hot/tropical vs. cold/winter fabric and outerwear selection.
  - Occasion defaults: casual, business, gala/formal, streetwear, traditional/ceremonial.
- **Color Palette Widget**:
  - Every generated fashion lookbook and prompt MUST render a persistent bottom color palette widget displaying the exact Wada pigments with Kanji names, hex codes, and role allocations.
