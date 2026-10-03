# 🎨 Design System: {{APP_NAME}}
> **Color Architecture**: Wada Sanzo (和田三造) — Combination #{{WADA_ID}}  
> **Japanese**: {{WADA_NAME_JP}} ({{WADA_NAME_ROMAJI}})  
> **English**: {{WADA_NAME_EN}}  
> **Aesthetic Mood**: {{WADA_MOOD}}  
> **Palette Philosophy**: {{WADA_PHILOSOPHY}}

---

## 1. Wada Sanzo Palette (Strict Preservation)

The authentic 1930s color harmony by Sanzo Wada is strictly preserved for brand character and focal accents:

| Token | Wada Pigment | Hex | RGB | Role in UI |
|---|---|---|---|---|
{{WADA_COLOR_ROWS}}

> **Design Principle**: Authentic Wada Sanzo colors are never mathematically shifted or desaturated. They provide the core identity, brand recognition, and interactive warmth of the application.

---

## 2. Neutral Monochrome Bridge (WCAG Accessibility)

To guarantee readability and clean hierarchy without clashing with the Wada harmony, the application uses an authentic neutral monochrome bridge:

### Light Mode Surfaces & Typography
- **Canvas / Background**: `{{LIGHT_BG}}` (Soft Washi Ivory / Pure White)
- **Card / Surface**: `{{LIGHT_SURFACE}}` (Clean Elevated Surface)
- **Subtle Border**: `{{LIGHT_BORDER}}` (1px structure divider)
- **Primary Text**: `{{LIGHT_TEXT_PRIMARY}}` (Deep Ink — **Contrast Ratio: >14:1 AAA**)
- **Secondary / Muted Text**: `{{LIGHT_TEXT_MUTED}}` (Readable Slate — **Contrast Ratio: >5.5:1 AA**)

### Dark Mode Surfaces & Typography
- **Canvas / Background**: `{{DARK_BG}}` (Deep Carbon / Obsidian)
- **Card / Surface**: `{{DARK_SURFACE}}` (Elevated Panel)
- **Subtle Border**: `{{DARK_BORDER}}` (Muted Boundary)
- **Primary Text**: `{{DARK_TEXT_PRIMARY}}` (Crisp Off-White — **Contrast Ratio: >13:1 AAA**)
- **Secondary / Muted Text**: `{{DARK_TEXT_MUTED}}` (Soft Slate — **Contrast Ratio: >5.0:1 AA**)

---

## 3. WCAG Accessibility & Contrast Grid

Verified contrast ratings against canvas surfaces:

| Element Pair | Foreground | Background | Contrast Ratio | WCAG Compliance |
|---|---|---|---|---|
{{CONTRAST_ROWS}}

---

## 4. UI Component Application Guidelines

### Buttons & Interactive Elements
- **Primary Action**: Solid `{{COLOR_PRIMARY_HEX}}` with high-contrast text (`{{PRIMARY_BTN_TEXT}}`). On hover, subtle elevation shadow and 5% brightness shift.
- **Secondary Action**: Bordered with `{{COLOR_SECONDARY_HEX}}` or `{{LIGHT_BORDER}}`, text in `{{COLOR_SECONDARY_HEX}}` or primary text.
- **Ghost / Tertiary**: Transparent background with hover fill using 10% opacity of `{{COLOR_ACCENT_HEX}}`.

### Navigation & Headers
- **Light Mode**: `{{LIGHT_SURFACE}}` with subtle `{{LIGHT_BORDER}}` bottom border. Active link indicated by `{{COLOR_PRIMARY_HEX}}` indicator bar or text.
- **Dark Mode**: `{{DARK_SURFACE}}` with subtle `{{DARK_BORDER}}` border.

### Cards & Elevated Panels
- Clean monochrome surface (`{{LIGHT_SURFACE}}` / `{{DARK_SURFACE}}`).
- Visual accentuation achieved through subtle top-border highlight or tag badges using `{{COLOR_ACCENT_HEX}}`.

### Badges & Status Indicators
- **Wada Accent Pill**: Background 15% opacity of Wada color, text solid Wada color.
- **Semantic Feedback**:
  - Success: `#2e7d32` / `#4caf50`
  - Warning: `#ed6c02` / `#ff9800`
  - Danger: `#d32f2f` / `#f44336`
  - Info: Wada Primary Accent

---

## 5. Implementation Code

### CSS Custom Properties (`theme.css`)
```css
:root {
  /* Wada Sanzo Authentic Colors */
{{CSS_VARS_ROOT}}

  /* Light Theme Surfaces & Text */
  --bg-canvas: {{LIGHT_BG}};
  --bg-surface: {{LIGHT_SURFACE}};
  --border-subtle: {{LIGHT_BORDER}};
  --text-primary: {{LIGHT_TEXT_PRIMARY}};
  --text-muted: {{LIGHT_TEXT_MUTED}};
}

[data-theme='dark'],
.dark {
  /* Dark Theme Surfaces & Text */
  --bg-canvas: {{DARK_BG}};
  --bg-surface: {{DARK_SURFACE}};
  --border-subtle: {{DARK_BORDER}};
  --text-primary: {{DARK_TEXT_PRIMARY}};
  --text-muted: {{DARK_TEXT_MUTED}};
}
```

### Tailwind CSS v4 `@theme`
```css
@theme {
{{TAILWIND_V4_TOKENS}}
}
```

### Tailwind CSS v3 `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        wada: {
{{TAILWIND_V3_TOKENS}}
        }
      }
    }
  }
}
```
