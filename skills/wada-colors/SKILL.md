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

## 🎨 Embedded Core Wada Palette Catalog

Use these verified palettes for immediate recommendations across archetypes:

### 1. Developer Tools & Terminal / CLI Apps (High Contrast, Disciplined)
- **#001**: 弁柄赤・碧天 (*Bengara-aka & Hekiten* / English Red & Cerulian Blue)
  - Colors: `#d96629` (Rust Red) + `#0093a5` (Cerulian Blue) | 2-Color Duo
- **#028**: 弁柄色・孔雀青 (*Bengarairo & Kujaku-ao* / Brick Red & Peacock Blue)
  - Colors: `#a84222` (Brick Red) + `#00939b` (Peacock Cyan) | 2-Color Duo
- **#241**: 墨色・青碧・クリーム黄・茶色 (*Sumiiro, Seiheki, Kurīmuki, Chairo*)
  - Colors: `#34454c` (Slate) + `#00978d` (Benzol Green) + `#fdbf68` (Cream Gold) + `#7c4226` (Brown) | 4-Color Quad

### 2. SaaS Dashboards & Enterprise Systems (Balanced, High Readability)
- **#121**: 緑青・銀鼠・象牙色 (*Rokushō, Ginnezumi, Zōgeiro* / Green Blue, Neutral Gray & Ivory Buff)
  - Colors: `#099197` (Green Blue) + `#b6bfc1` (Silver Gray) + `#ebd3a2` (Warm Ivory) | 3-Color Trio
- **#127**: 紺碧・山吹色・胡粉白 (*Konpeki, Yamabukiiro, Gofunshiro* / Deep Lyons Blue, Golden Yellow & White)
  - Colors: `#1c4286` (Lyons Blue) + `#f3a257` (Golden Amber) + `#ffffff` (Pure White) | 3-Color Trio
- **#165**: 紅梅色・尖晶石紅・深湖紅 (*Kōbai-iro, Senshōsekikō, Shinkokō* / Cameo Pink, Spinel Red & Vistoris Lake)
  - Colors: `#e0b3b6` (Cameo Pink) + `#f27291` (Spinel Coral) + `#6d4145` (Deep Lake Wine) | 3-Color Trio

### 3. Coffee, Artisan & Lifestyle E-Commerce (Warm, Earthy, Wabi-Sabi)
- **#014**: 黄土色・石盤橄欖 (*Ōdoiro & Sekiban-kanran* / Raw Sienna & Deep Slate Olive)
  - Colors: `#bb7125` (Raw Sienna) + `#253122` (Deep Slate Olive) | 2-Color Duo
- **#161**: 茶色・肉桂色・露草色 (*Chairo, Nikkeiiro, Tsuyukusairo* / Brown, Pinkish Cinnamon & Helvetia Blue)
  - Colors: `#7c4226` (Rich Brown) + `#eeb480` (Cinnamon Peach) + `#005b8d` (Helvetia Blue) | 3-Color Trio
- **#305**: 焦茶・鶯茶・生成色・烏賊墨色 (*Kogecha, Uguisucha, Kinari-iro, Ikazumiiro*)
  - Colors: `#ae5224` (Burnt Sienna) + `#d6b43e` (Olive Ochre) + `#c2ae93` (Warm Ecru) + `#644b1e` (Sepia) | 4-Color Quad

### 4. Luxury, Fashion & Editorial (Poetic, Refined)
- **#009**: 曙色・淡灰橄欖 (*Akebonoiro & Tankai-kanran* / Eosine Pink & Light Grayish Olive)
  - Colors: `#f37f94` (Eosine Pink) + `#848061` (Muted Sage Olive) | 2-Color Duo
- **#176**: 肉色・鉄紺・灰桜 (*Nikuiro, Tetsukon, Haizakura* / Hermosa Pink, Dark Tyrian Blue & Warm Gray)
  - Colors: `#f9c1ce` (Hermosa Blossom) + `#12354e` (Deep Iron Navy) + `#a1a39a` (Warm Ash Gray) | 3-Color Trio
- **#281**: 淡檸檬黄・青碧・薄碧・藍色 (*Tanremonki, Seiheki, Usuheki, Aiiro*)
  - Colors: `#ffefae` (Pale Lemon) + `#00978d` (Benzol Green) + `#96d1aa` (Cobalt Mint) + `#007190` (Antwarp Indigo) | 4-Color Quad

### 5. Fintech & Modern Finance (Trustworthy, Distinct)
- **#124**: 露草色・杏黄 (*Tsuyukusairo & Anzuiro-ki* / Helvetia Blue & Apricot Yellow)
  - Colors: `#005b8d` (Helvetia Navy) + `#ffdd00` (Apricot Gold) | 2-Color Duo
- **#130**: 鉄紺・珊瑚朱 (*Tetsukon & Sangoshu* / Dark Tyrian Blue & Coral Red)
  - Colors: `#12354e` (Deep Iron Navy) + `#f58e84` (Coral Vermillion) | 2-Color Duo
- **#215**: 藍色・鶯茶・利休鼠 (*Aiiro, Uguisucha, Rikyūnezumi* / Antwarp Blue, Olive Ocher & Mineral Gray)
  - Colors: `#007190` (Antwarp Blue) + `#d6b43e` (Olive Ocher) + `#a2b0ad` (Mineral Gray) | 3-Color Trio

---

## 📝 Canonical `design.md` Structure

```markdown
# 🎨 Design System: [App Name]
> **Color Architecture**: Sanzo Wada (和田三造) — Combination #[ID]  
> **Japanese**: [Kanji] ([Romaji]) | **English**: [English Title]  
> **Mood & Vibe**: [Aesthetic Tags]  
> **Philosophy**: A timeless 1930s Showa-era harmony balancing authentic Japanese elegance with production-grade accessibility.

---

## 1. Authentic Wada Sanzo Palette (Strict Preservation)

| Token | Japanese Name | English Name | Hex Code | RGB | UI Application Role |
|---|---|---|---|---|---|
| `--wada-primary` | [Kanji 1] | [Name 1] | `#[HEX_1]` | RGB(...) | Brand Primary / Primary CTA Button |
| `--wada-secondary`| [Kanji 2] | [Name 2] | `#[HEX_2]` | RGB(...) | Active Tabs / Secondary Pill Badges |
| `--wada-accent`   | [Kanji 3] | [Name 3] | `#[HEX_3]` | RGB(...) | Highlight Borders / Subtle Accents |

*Rule*: Authentic Wada Sanzo colors are never mathematically shifted or desaturated.

---

## 2. Neutral Monochrome Bridge (WCAG Accessibility)

### Light Mode Surfaces & Typography
- **Canvas Background**: `#fcfbf9` (Japanese Washi Ivory)
- **Card Surface**: `#ffffff` (Elevated White)
- **Subtle Border**: `#e5e7eb` (1px Divider)
- **Primary Text**: `#111314` (Sumi Carbon — **>15:1 AAA**)
- **Muted Text**: `#64748b` (Slate — **>5.2:1 AA**)

### Dark Mode Surfaces & Typography
- **Canvas Background**: `#111314` (Deep Carbon)
- **Card Surface**: `#1a1e24` (Elevated Obsidian)
- **Subtle Border**: `#2d3238` (Muted Divider)
- **Primary Text**: `#f5f5f7` (Crisp Off-White — **>14:1 AAA**)
- **Muted Text**: `#94a3b8` (Soft Slate — **>5.0:1 AA**)

---

## 3. WCAG Accessibility & Contrast Grid

| Element Pair | Foreground | Background | Contrast Ratio | Rating |
|---|---|---|---|---|
| Primary Button Text | `#ffffff` / `#111314` | `#[HEX_1]` | [X.X]:1 | WCAG AA / AAA |
| Body Text (Light) | `#111314` | `#fcfbf9` | 18.5:1 | WCAG AAA |
| Body Text (Dark) | `#f5f5f7` | `#111314` | 16.2:1 | WCAG AAA |
| Accent on Canvas | `#[HEX_2]` | Canvas | [X.X]:1 | Verified |

---

## 4. UI Component Application Guidelines

- **Primary Button**: Solid `#[HEX_1]` background with dynamic inverted high-contrast text.
- **Secondary Button**: 1.5px border in `#[HEX_2]` or `#e5e7eb`, text in primary ink.
- **Cards & Panels**: Monochrome elevated surface (`#ffffff` / `#1a1e24`) with subtle 3px top-border in `#[HEX_2]`.
- **Badges & Pills**: 15% opacity background of `#[HEX_1]`, text in solid `#[HEX_1]`.
- **Semantic Feedback**: Success `#2e7d32`, Warning `#ed6c02`, Danger `#d32f2f`, Info `#[HEX_1]`.

---

## 5. Ready-to-Use Implementation Code

### CSS Custom Properties (`theme.css`)
```css
:root {
  --wada-primary: #[HEX_1];
  --wada-secondary: #[HEX_2];
  --wada-accent: #[HEX_3];
  --bg-canvas: #fcfbf9;
  --bg-surface: #ffffff;
  --border-subtle: #e5e7eb;
  --text-primary: #111314;
  --text-muted: #64748b;
}

[data-theme='dark'], .dark {
  --bg-canvas: #111314;
  --bg-surface: #1a1e24;
  --border-subtle: #2d3238;
  --text-primary: #f5f5f7;
  --text-muted: #94a3b8;
}
```

### Tailwind CSS v4 `@theme`
```css
@theme {
  --color-wada-primary: #[HEX_1];
  --color-wada-secondary: #[HEX_2];
  --color-wada-accent: #[HEX_3];
  --color-wada-canvas: #fcfbf9;
  --color-wada-ink: #111314;
}
```
```

---

## Full Catalog Reference Links

- **2-Color Combinations**: #1 to #120 (Minimalist, Developer Tools, Portfolios)
- **3-Color Combinations**: #121 to #240 (Standard SaaS, Dashboards, Mobile)
- **4-Color Combinations**: #241 to #348 (Rich Editorial, E-Commerce, Lifestyle)

For the complete catalog of all 348 combinations and tags, see [palette-directory.md](file:///d:/work/wada_color/skills/wada-colors/references/palette-directory.md) and [mood-matrix.md](file:///d:/work/wada_color/skills/wada-colors/references/mood-matrix.md).

