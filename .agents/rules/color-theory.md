---
trigger: always_on
---

# 🌸 Color Theory & Authentic Wada Preservation Rules

Rules governing Sanzo Wada's 1933 *Haishoku Sōkan* (A Dictionary of Color Combinations) and accessibility standards.

---

## 1. Strict Authentic Wada Preservation
- **NEVER** alter, desaturate, mathematically lighten/darken, or hue-shift authentic Wada Sanzo colors in palettes.
- The 159 colors defined in `data/wada_colors.json` and the 348 curated palettes in `data/wada_combinations.json` represent historical cultural artifacts and must remain exact.
- Authentic Wada colors are reserved for:
  - Brand accents and key interactions in UI/UX.
  - Garment focus, layer contrasts, and accessory accents in Fashion.
  - Wall treatments, textile upholstery, and accent decor in Interior Architecture.

---

## 2. Neutral Monochrome Bridge (Guaranteed WCAG AA/AAA)
- Historical 1930s palettes were created for printing on washi paper and textiles, not backlit digital screens.
- **Never** place two colored Wada pigments directly against each other as body text and background without contrast verification.
- **Always Bridge with Monochromes**:
  - Light mode surfaces: `#fcfbf9` (Washi Ivory) or `#ffffff` with `#111314` (Sumi Carbon) text.
  - Dark mode surfaces: `#0f1011` / `#161819` with `#f7f6f2` text.
- Verify minimum contrast ratios:
  - Normal body text: $\ge 4.5:1$ (WCAG AA), $\ge 7:1$ (WCAG AAA).
  - Large headings & UI controls: $\ge 3:1$ (WCAG AA).

---

## 3. Perceptual Color Math Standards
- Color distance matching must strictly use **CIELAB Delta-E ($\Delta E^*$)**:
  $$\text{RGB} \xrightarrow{\text{sRGB Companding}} \text{XYZ (D65 Ref)} \xrightarrow{} \text{CIELAB} \xrightarrow{} \Delta E^* = \sqrt{\Delta L^{*2} + \Delta a^{*2} + \Delta b^{*2}}$$
- Never use naive Euclidean RGB distance $(\Delta R^2 + \Delta G^2 + \Delta B^2)$ as it fails human perceptual uniformity.
- Matching interpretation:
  - $\Delta E^* < 1.0$: Imperceptible to human eye.
  - $\Delta E^* < 3.0$: Close perceptual match.
  - $\Delta E^* < 6.0$: Harmonious tonal match.
