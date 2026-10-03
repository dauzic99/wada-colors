---
name: wada-colors
description: Generate or update design.md for any application using Sanzo Wada's 1930s "A Dictionary of Color Combinations" (Haishoku Sōkan). Supports brand asset/hex ingestion, strict authentic palette preservation, WCAG AA/AAA contrast verification, and multi-platform token export (CSS, Tailwind, JSON).
---

# 🌸 Wada Colors (Claude Code Edition)

When invoked, Claude proactively guides the user to create or update `design.md` with Sanzo Wada's authentic 1930s color harmonies.

## Execution Rules for Claude Code

1. **Brand / Asset Ingestion**:
   - If the user provides a hex code (e.g. `#2A6F97`) or points to a brand file (`brand.json`, `logo.svg`, `tailwind.config.js`, `theme.css`), Claude reads the file, calculates CIELAB distance to find the nearest Wada pigments from the 159 catalog, and identifies 3 Wada combinations that anchor or complement the brand color.
2. **Greenfield Profiling**:
   - If no brand color is provided, Claude asks 4 quick questions: App Archetype, Aesthetic Vibe, Palette Size (2, 3, or 4 colors), and Theme Priority (Light or Dark first).
3. **Showcase**:
   - Claude prints 3 curated candidates with Wada #ID, Japanese Kanji/Romaji, English names, color hex swatches, and UI role rationale.
4. **Strict Preservation**:
   - Claude preserves the exact Wada hex values for brand and action tokens, and introduces neutral monochromes (washi ivory `#fcfbf9` or white `#ffffff`, carbon `#111314`, slate `#64748b`) for backgrounds and body text to ensure WCAG AA/AAA contrast.
5. **Synthesis**:
   - Claude writes or updates `design.md` using the canonical template.
   - Claude offers to write the corresponding `theme.css` or Tailwind config directly to the project.
