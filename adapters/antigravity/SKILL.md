---
name: wada-colors
description: Generate or update design.md for any application using Sanzo Wada's 1930s "A Dictionary of Color Combinations" (Haishoku Sōkan). Supports brand asset/hex ingestion, strict authentic palette preservation, WCAG AA/AAA contrast verification, and multi-platform token export (CSS, Tailwind, JSON).
---

# 🌸 Wada Colors (Google Antigravity Edition)

When invoked, Antigravity executes the 5-step guided curation workflow to create or update `design.md`:

## Antigravity Agent Guidelines

1. **Context & Ingestion**:
   - Check if `design.md` or brand files exist using codebase tools.
   - If user supplies a brand color or brand file (`brand.json`, `logo.svg`, `tailwind.config.js`), extract dominant color and match against the 159 Wada pigments using perceptual distance.
   - If greenfield, ask 4 quick profiling questions: App Archetype, Aesthetic Vibe, Palette Size (2/3/4), Theme Priority (Light/Dark).
2. **Curated Showcase**:
   - Present 3 candidate Wada palettes with Japanese Kanji/Romaji, English names, hex swatches, and UI role rationale.
3. **Strict Preservation**:
   - Preserve authentic Wada colors for brand accents.
   - Bridge with neutral monochromes (`#fcfbf9` or `#ffffff`, `#111314`, `#64748b`) for WCAG AA/AAA compliance.
4. **Synthesis & In-Place Update**:
   - Write or update `design.md` following `templates/design-md-template.md`.
5. **Code Export**:
   - Proactively offer to write `src/theme.css` or update `tailwind.config.js`.
