# 🎨 Design System & Token Specification

Specification for translating Sanzo Wada palettes into modern digital design tokens (CSS variables, Tailwind CSS, and Figma tokens).

---

## 1. Token Taxonomy

When a Wada combination is applied to a digital product, colors are assigned according to semantic hierarchy:

| Token | Role | Usage |
|---|---|---|
| `--color-primary` | Dominant Wada Pigment | Brand identity, primary CTAs, active states |
| `--color-secondary` | Harmonizing Wada Pigment | Badges, secondary actions, supporting cards |
| `--color-accent` | Focal Accent (3/4-color palettes) | Highlights, notification pips, focal points |
| `--color-surface-bg` | Neutral Washi Bridge | Backgrounds (`#fcfbf9` light / `#0f1011` dark) |
| `--color-surface-fg` | Neutral Sumi Bridge | Text (`#111314` light / `#f7f6f2` dark) |
| `--color-muted` | Muted Border / Divider | Subtle borders and disabled elements |

---

## 2. Tailwind CSS Integration
The `wada-colors apply` engine generates and injects Tailwind configurations:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        wada: {
          primary: 'var(--wada-primary)',
          secondary: 'var(--wada-secondary)',
          accent: 'var(--wada-accent)',
          subtle: 'var(--wada-subtle)',
        }
      }
    }
  }
}
```

---

## 3. WCAG Contrast Rules
- Primary CTAs must use contrasting text (either white `#ffffff` or dark charcoal `#111314`) depending on the luminance $L$ of the Wada color:
  - If $L \ge 0.5$ in CIELAB space, use dark text (`#111314`).
  - If $L < 0.5$, use light text (`#ffffff`).
