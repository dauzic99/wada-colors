---
name: wada-colors
description: Generate or update design.md for any application using Sanzo Wada's 1930s "A Dictionary of Color Combinations" (Haishoku Sōkan). Supports brand asset/hex ingestion, strict authentic palette preservation, WCAG AA/AAA contrast verification, and multi-platform token export (CSS, Tailwind, JSON).
---

# 🌸 Wada Colors Skill (和田三造 配色)

This skill guides AI agents in creating or updating a comprehensive, production-grade `design.md` for any web, mobile, or desktop application using authentic color harmonies from **Sanzo Wada's 1930s classic *Haishoku Sōkan* (A Dictionary of Color Combinations)**.

## Core Directives

1. **Strict Palette Preservation**:
   Never mathematically shift, desaturate, or morph the chosen authentic Wada Sanzo colors. Use them in their pure 1930s historical values for brand anchors, key action accents, focal highlights, and borders.
2. **Neutral Monochrome Bridge**:
   Bridge the Wada palette with neutral monochromes (washi ivory `#fcfbf9` or white `#ffffff`, deep carbon `#111314`, slate `#64748b`) for backgrounds and body text to guarantee **WCAG AA/AAA compliance**.
3. **Dual Entry Flow**:
   Support both **Brand-Informed / Asset Ingestion** (user provides a hex color or brand files like `brand.json`, `logo.svg`, CSS) and **Greenfield Exploration** (user asks for a fresh vibe or archetype).

---

## The 5-Step Execution Workflow

```
[ Step 1: Profiling & Ingestion ] ──► [ Step 2: 3-Candidate Showcase ] ──► [ Step 3: Strict Token Mapping ]
                                                                                   │
[ Step 5: Companion Code Export ] ◄── [ Step 4: design.md Synthesis ] ◄───────────┘
```

### Step 1: Profiling & Ingestion (Dual-Path)

Check if the user provided an existing brand color, logo, or brand guidelines file:

#### Path A: Brand & Asset Ingestion Flow
If the user provides a hex/RGB color (e.g. `#2A6F97`) OR points to a file (`brand.json`, `logo.svg`, `tailwind.config.js`, `theme.css`, `brand-guidelines.md`):
1. **Extract Dominant Color**: Read the primary brand color value.
2. **Compute Perceptual Distance (CIELAB Delta-E)**:
   Compare the brand color against the 159 Wada pigments (`data/wada_colors.json` or `references/palette-directory.md`).
3. **Identify Matching Wada Harmonies**:
   - **Anchor Match**: Find Wada combinations that contain the closest historical pigment to the brand color, giving the user authentic 1930s Japanese companion accents.
   - **Harmonic Complement**: Find Wada combinations that form an authentic Japanese triad or contrast pair with the brand color.

#### Path B: Greenfield / Exploratory Flow
If no brand color or file is specified, inspect `package.json`, existing styles, or ask the user 4 quick profiling questions:
1. **App Archetype**: (e.g., Developer Tools, SaaS Dashboard, Luxury / Fashion, Coffee / Lifestyle, Fintech, Health & Wellness).
2. **Aesthetic Vibe**: (e.g., Zen / Wabi-Sabi, Nostalgic Showa, Botanical Serenity, Melancholic Elegance, Crisp Modernist).
3. **Palette Density**: 2-color (minimalist duo), 3-color (balanced trio), or 4-color (rich quad).
4. **Theme Priority**: Light-first, Dark-first, or Adaptive dual-mode.

---

### Step 2: Curated 3-Candidate Showcase

Query `data/wada_combinations.json` (or reference tables in `skills/wada-colors/references/`) and present **exactly 3 curated candidates** to the user.

Format each candidate clearly:

```markdown
### 1. Combination #[ID]: [Japanese Kanji] ([Romaji]) — [English Name]
- **Palette Size**: [2/3/4]-color | **Temperature**: [Warm / Cool / Balanced]
- **Colors**:
  - `[HEX_1]` [Name 1] (Role: Primary Brand / Hero Action)
  - `[HEX_2]` [Name 2] (Role: Secondary Accent / Active Pill)
  - `[HEX_3]` [Name 3] (Role: Highlight / Subtle Border)
- **Aesthetic Rationale**: [Explain why this specific harmony elevates the user's app archetype or harmonizes with their brand color].
- **Contrast Check**: Verified against light canvas ([Ratio]:1) and dark canvas ([Ratio]:1).
```

Ask the user to select Candidate 1, 2, 3, or specify a custom Wada #ID (1–348).

---

### Step 3: Strict Token Mapping & Accessibility Bridge

Once the user selects a combination:
1. **Preserve Wada Hex Values**: Assign each Wada color to UI roles:
   - Primary Wada: Brand hero, primary button background, key active states.
   - Secondary Wada: Tag badges, secondary button borders, tabs, icons.
   - Tertiary/Quaternary Wada: Subtle cards, notification accents, avatars.
2. **Bridge with Neutral Monochromes**:
   - Light Canvas: `#fcfbf9` or `#ffffff`
   - Light Text Primary: `#111314` (AAA compliant)
   - Light Text Muted: `#64748b` (AA compliant)
   - Dark Canvas: `#111314` or `#181a1b`
   - Dark Card Surface: `#1f2326`
   - Dark Text Primary: `#f5f5f7` (AAA compliant)
   - Dark Text Muted: `#94a3b8` (AA compliant)
3. **Button Contrast Inversion Rule**:
   - If Wada background luminance $< 0.25$ $\rightarrow$ Button text `#ffffff`.
   - If Wada background luminance $> 0.40$ $\rightarrow$ Button text `#111314`.

---

### Step 4: `design.md` Synthesis or In-Place Update

Create or update `design.md` in the project root following `templates/design-md-template.md`:
- Document Wada Sanzo provenance (Combination #ID, Japanese Kanji & Romaji, English Name).
- Detail the Strict Wada Color Matrix and Neutral Monochrome Bridge.
- Include the WCAG Accessibility & Contrast Grid.
- Provide explicit UI Component Application Guidelines (buttons, nav, cards, badges, inputs).
- Provide copy-paste code blocks:
  - CSS Custom Properties (`:root` / `.dark`)
  - Tailwind CSS v4 `@theme` block
  - Tailwind CSS v3 `tailwind.config.js` snippet

---

### Step 5: Companion Code Tokens Export (Optional)

After `design.md` is created or updated, ask the user if they would like the tokens written directly into their codebase:
- Write to `src/theme.css` or `src/styles/wada-tokens.css`
- Or update their `tailwind.config.js` / `globals.css` with the generated tokens.

---

## Reference Palette Quick Lookup

- **2-Color Combinations**: #1 to #120 (Minimalist, Developer Tools, Portfolios)
- **3-Color Combinations**: #121 to #240 (Standard SaaS, Dashboards, Mobile)
- **4-Color Combinations**: #241 to #348 (Rich Editorial, E-Commerce, Lifestyle)

For the full catalog of all 348 combinations and tags, see [palette-directory.md](file:///d:/work/wada_color/skills/wada-colors/references/palette-directory.md) and [mood-matrix.md](file:///d:/work/wada_color/skills/wada-colors/references/mood-matrix.md).
