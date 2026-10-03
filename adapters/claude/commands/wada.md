---
description: Sanzo Wada 1930s Japanese Color Harmonies for UI/UX, Fashion Lookbooks, Interior Design, and Autonomous Theming
---

You are executing the **Wada Colors** (和田三造 配色) skill.
Evaluate the user's input: `$ARGUMENTS`

1. **Combination ID Lookup (e.g. `/wada 165` or `/wada combo 165`)**:
   - Query `data/wada_combinations.json` or run `npx wada-colors show <ID>`.
   - Present the authentic Japanese combination name, romaji, kanji, exact hex values, and aesthetic rationale.
   - Show domain token allocations (UI tokens `--wada-primary`, fashion garments, or interior planes).
   - Provide copy-paste GenAI image prompts for Midjourney v6.1, Flux.1, Gemini Imagen 3, and ChatGPT.

2. **Brand & Color Matching (e.g. `/wada match #2A6F97` or `/wada match brand.json`)**:
   - Run `npx wada-colors match --color "<HEX>"` (or `--file <path>`).
   - Present the top 3 closest historical Sanzo Wada combinations ranked by CIELAB Delta-E ($\Delta E$).
   - Offer to apply or synthesize a specification based on the top match.

3. **Autonomous Project Theming (e.g. `/wada apply 165` or `/wada apply 165 --yes`)**:
   - Preview or execute the theming engine:
     ```bash
     npx wada-colors apply --combo <ID> --dry-run
     ```
   - Inject `@theme` (Tailwind v4) or `:root` (CSS) tokens into the primary stylesheet, refactor generic color utility classes, and preserve all layout styling.

4. **Domain Specification Generation**:
   - `/wada ui [style]`: Synthesize a production-grade `design.md` with WCAG AA/AAA tokens.
   - `/wada lookbook [style]`: Synthesize a fashion `lookbook.md` with layered garment mapping, model poise, and GenAI prompts.
   - `/wada interior [style]`: Synthesize a spatial `interior-spec.md` with 7-plane architectural allocations and 2700K lighting glow.

5. **No Arguments or Greenfield (`/wada`)**:
   - Inquire which domain the user wants to explore (**Digital UI/UX**, **Fashion Lookbook**, or **Interior Spatial Design**), or offer to match a primary brand color.
   - Follow the 6-step guided workflow in `.claude/skills/wada-colors/SKILL.md`.
