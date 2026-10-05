# 🎛️ Component Tokens & Implementation Patterns

> Practical design token mapping and copy-paste CSS / Tailwind component patterns for modern web apps using Wada Sanzo color harmonies.

---

## 1. Semantic Token Hierarchy

```css
:root {
  /* Authentic Wada Pigments (Preserved exactly from 1933 catalog) */
  --wada-primary: #1c4286;       /* e.g. Lyons Blue (Combination #127) */
  --wada-secondary: #f3a257;     /* e.g. Golden Yellow */
  --wada-accent: #0093a5;        /* Optional 3rd/4th accent */

  /* Neutral Monochrome Bridge (Guaranteed >15:1 WCAG Contrast) */
  --wada-surface-bg: #fcfbf9;    /* Washi Ivory canvas */
  --wada-surface-card: #ffffff;  /* Elevated card surface */
  --wada-surface-fg: #111314;    /* Sumi Carbon typography */
  --wada-border-subtle: #e7e5e4; /* Light stone divider */
  --wada-border-strong: #d6d3d1; /* Interactive input border */
}

/* Dark Mode Tokens */
[data-theme='dark'], .dark {
  --wada-surface-bg: #0f1011;    /* Deep Sumi canvas */
  --wada-surface-card: #181a1b;  /* Elevated charcoal card */
  --wada-surface-fg: #f7f6f2;    /* Bleached washi typography */
  --wada-border-subtle: #272a2d; /* Dark stone divider */
  --wada-border-strong: #3f4448; /* Interactive input border */
}
```

---

## 2. Component Token Mapping

### A. Primary Button
```html
<!-- Tailwind CSS Pattern -->
<button class="bg-[var(--wada-primary)] text-white hover:opacity-90 active:scale-[0.98] px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all focus:ring-2 focus:ring-[var(--wada-primary)]/40 focus:outline-none">
  Primary Action
</button>
```
*Contrast Rule*: If the luminance of `--wada-primary` is $> 0.4$, use `text-[var(--wada-surface-fg)]` instead of `text-white` to guarantee WCAG AA.

### B. Secondary Pill / Badge
```html
<!-- Tailwind CSS Pattern -->
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--wada-secondary)]/15 text-[var(--wada-surface-fg)] border border-[var(--wada-secondary)]/30">
  <span class="w-1.5 h-1.5 rounded-full bg-[var(--wada-secondary)]"></span>
  Curated Wada Palette
</span>
```

### C. Input Field / Form Control
```html
<!-- Tailwind CSS Pattern -->
<div class="relative">
  <input 
    type="text" 
    class="w-full bg-[var(--wada-surface-card)] text-[var(--wada-surface-fg)] border border-[var(--wada-border-strong)] rounded-lg px-4 py-2.5 focus:border-[var(--wada-primary)] focus:ring-2 focus:ring-[var(--wada-primary)]/20 focus:outline-none transition-all placeholder:text-stone-400"
    placeholder="Search Wada harmonies..."
  />
</div>
```

### D. Elevated Content Card
```html
<!-- Tailwind CSS Pattern -->
<div class="bg-[var(--wada-surface-card)] border border-[var(--wada-border-subtle)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
  <div class="h-1 w-12 rounded-full bg-[var(--wada-primary)] mb-4"></div>
  <h3 class="text-lg font-bold text-[var(--wada-surface-fg)] mb-2">Modern Minimalist Card</h3>
  <p class="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
    Harmonized with authentic 1930s Japanese color theory while maintaining strict modern accessibility standards.
  </p>
</div>
```

---

## 3. Tailwind CSS v4 Configuration (`@theme`)

```css
@import "tailwindcss";

@theme {
  --color-wada-primary: var(--wada-primary);
  --color-wada-secondary: var(--wada-secondary);
  --color-wada-accent: var(--wada-accent);
  --color-wada-surface-bg: var(--wada-surface-bg);
  --color-wada-surface-fg: var(--wada-surface-fg);
  --color-wada-surface-card: var(--wada-surface-card);
}
```
