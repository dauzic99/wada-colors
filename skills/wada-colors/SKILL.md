---
name: wada-colors
description: Master color harmony skill using Sanzo Wada's 1930s "A Dictionary of Color Combinations" (Haishoku Sōkan). Supports Digital UI/UX (design.md), Autonomous Project Theming (wada-colors apply), Fashion & Wardrobe Lookbooks (lookbook.md), Spatial & Interior Architecture (interior-spec.md), and Multi-Platform Generative AI Image Prompts (Midjourney v6.1, Flux.1, Gemini Imagen 3, ChatGPT / DALL-E 3) with live image generation.
---

# 🌸 Wada Colors Skill (和田三造 配色)
> **Japanese Color Theory, Modern Design Systems & Multi-Domain Creative Studio**  
> Based on Sanzo Wada's 1933 *Haishoku Sōkan* (A Dictionary of Color Combinations)

This skill guides AI agents in applying Sanzo Wada's authentic 1930s Japanese color harmonies across multiple creative domains:
1. **Digital UI/UX Design System**: Production-grade `design.md` with CSS custom properties, Tailwind v4 tokens, and WCAG AA/AAA contrast.
2. **Autonomous Project Theming**: Automatically scan existing codebases, inject tokens into root stylesheets, and refactor color classes without breaking layout.
3. **Fashion & Wardrobe Styling**: High-fashion `lookbook.md` with garment layer color mapping, model direction, backdrop harmony, and GenAI image generation.
4. **Interior & Spatial Architecture**: Architectural `interior-spec.md` with surface planes, furniture upholstery, textiles, and lighting temperature specs.
5. **Multi-Target Generative AI Prompts**: Ready-to-render prompts for **Midjourney v6.1**, **Flux.1**, **Google Gemini (Imagen 3)**, and **OpenAI ChatGPT (GPT Image / DALL-E 3)**.

---

## 🏛️ Core Directives

1. **Strict Authentic Palette Preservation**:
   Never mathematically shift, desaturate, or alter chosen Wada Sanzo colors. Use them in their pure 1930s historical hex values for brand anchors, primary garments, focal furniture, or interactive accents.
2. **Neutral Monochrome Bridge**:
   - For UI: Bridge with washi ivory (`#fcfbf9`) and deep carbon (`#111314`) to guarantee **WCAG AA/AAA compliance**.
   - For Fashion & Interiors: Bridge with natural linen, raw silk, weathered timber, textured washi plaster, or industrial concrete backdrops.
3. **Multi-Domain Intelligence**:
   Detect whether the user wants an application design system, an automated codebase recolor, a fashion wardrobe set, an interior architectural scheme, or generative AI image generation.
4. **Proactive Visual Demonstration**:
   When the AI environment supports image generation (such as Antigravity's `generate_image` tool), **proactively generate the visual asset** (e.g. fashion model in styled wardrobe or interior room) alongside the markdown specification!

---

## 🔄 The 6-Step Multi-Domain Workflow

```
[ Step 1: Profiling & Ingestion ] ──► [ Step 2: 3-Candidate Showcase ] ──► [ Step 3: Domain Mapping ]
                                                                                   │
[ Step 6: Autonomous Theming ]  ◄── [ Step 5: GenAI Image Prompts ] ◄── [ Step 4: Spec Synthesis ]
```

### Step 1: Profiling & Domain Determination

1. **Determine Creative Domain**:
   - **Digital UI/UX**: Web apps, mobile apps, SaaS dashboards, developer tools $\rightarrow$ Generates `design.md`.
   - **Autonomous Project Theming**: Recolor an existing codebase $\rightarrow$ Runs `wada-colors apply` or refactors classes.
   - **Fashion & Wardrobe**: Apparel collections, model styling, editorial lookbooks $\rightarrow$ Generates `lookbook.md`.
   - **Interior & Spatial Architecture**: Rooms, boutique cafes, residential spaces, studios $\rightarrow$ Generates `interior-spec.md`.
   - **General Visual Art / Concept**: Any custom prompt generation.
2. **Dual-Path Ingestion**:
   - **Path A (Brand & Asset Ingestion)**: If the user provides a hex color (e.g. `#2A6F97`) or brand files (`brand.json`, `logo.svg`, `theme.css`), run CIELAB Delta-E matching to find the nearest Wada historical pigment and anchor palettes.
   - **Path B (Aesthetic & Archetype Profiling)**: If starting greenfield, identify the style silhouette or archetype (e.g., *Minimalist Tailoring*, *Modern Neo-Trad*, *Tokyo Streetwear*, *1930s Showa Vintage*, or *Japandi*, *Mid-Century Modern*, *Wabi-Sabi Cafe*).

---

### Step 2: Curated 3-Candidate Showcase

Present exactly 3 curated Wada combinations tailored to the requested domain. Format each candidate clearly:

```markdown
### 1. Combination #[ID]: [Japanese Kanji] ([Romaji]) — [English Name]
- **Palette Size**: [2/3/4]-color | **Temperature**: [Warm / Cool / Balanced]
- **Colors**:
  - `[HEX_1]` [Name 1] (Role: Outerwear / Primary Brand / Focal Furniture)
  - `[HEX_2]` [Name 2] (Role: Mid-Layer / Secondary Accent / Textiles & Rug)
  - `[HEX_3]` [Name 3] (Role: Bottoms / Surface Highlight / Accent Vessels)
- **Domain Rationale**: [Explain why this specific harmony elevates the design or garment set].
- **Contrast / Environment**: [UI contrast verification OR backdrop and lighting synergy].
```

---

### Step 3: Domain-Specific Color Mapping

Once a combination is selected, map the colors systematically:

#### For Digital UI/UX:
- `c1` $\rightarrow$ Primary Brand & CTA button background.
- `c2` $\rightarrow$ Secondary Accent, active tabs, pill badges.
- `c3` $\rightarrow$ Surface borders, tag highlights, subtle indicators.
- Bridge with `#fcfbf9` washi canvas and `#111314` sumi text.

#### For Fashion Lookbooks:
- `c1` $\rightarrow$ Outerwear (Overcoat, tailored jacket, or draped haori).
- `c2` $\rightarrow$ Mid-layer / Top (Cashmere knit, silk blouse, or hoodie).
- `c3` $\rightarrow$ Bottoms (Tailored wool trousers, pleated hakama culottes, or relaxed cargos).
- `c4` $\rightarrow$ Accents & Leather Goods (Footwear, neckerchief, tote bag).
- Backdrop $\rightarrow$ Coordinated architectural environment (Tokyo concrete gallery, cedar courtyard, Shibuya twilight).

#### For Interior & Spatial Design:
- `c1` $\rightarrow$ Focal Seating (Lounge sofa in linen bouclé, curved velvet salon sofa, banquette).
- `c2` $\rightarrow$ Textiles & Rugs (Hand-woven wool rug, drapery, glazed tile backsplash).
- `c3` $\rightarrow$ Accent Furniture & Sculptural Decor (Armchair, ceramic vessels, metal shelving).
- `c4` $\rightarrow$ Lighting & Art details (Raw clay ceramics, lacquer coffee table).
- Walls & Lighting $\rightarrow$ Washi lime plaster, 2700K ambient cove illumination.

---

### Step 4: Specification Document Synthesis

Write the resulting specification document into the workspace using the appropriate template:
- Digital UI: `design.md` (using `templates/design-md-template.md`)
- Fashion Studio: `lookbook.md` (using `templates/fashion-lookbook-template.md`)
- Interior Studio: `interior-spec.md` (using `templates/interior-spec-template.md`)

---

### Step 5: Generative AI Image Prompts & Proactive Generation

Provide ready-to-use image prompts across 4 major AI generators:

#### 1. 📸 Midjourney v6.1 Prompt Formula
```text
[Subject & Domain], [Silhouette/Archetype], styled with 1930s Japanese color harmony Wada Sanzo #[ID] ([Combo Name]). [Color 1 Element] in [c1_name] [c1_hex], [Color 2 Element] in [c2_name] [c2_hex], [Color 3 Element] in [c3_name] [c3_hex]. Set against [Backdrop & Atmosphere]. Shot on [Lens Spec, e.g. 85mm f/1.4 or 24mm tilt-shift], [Lighting Spec], editorial quality, tactile texture --ar [3:4 or 16:9] --style raw --v 6.1
```

#### 2. ⚡ Flux.1 Prompt Formula
```text
A high-resolution photograph of a [model/interior space] styled with authentic 1930s Japanese color theory (Wada Sanzo #[ID]). Features [c1_element] in [c1_name] ([c1_hex]), paired with [c2_element] in [c2_name] ([c2_hex]), and [c3_element] in [c3_name] ([c3_hex]). Realistic material drape, natural shadow falloff, tranquil Japanese aesthetic, [backdrop details].
```

#### 3. 🔮 Google Gemini (Imagen 3) Prompt Formula
```text
Photorealistic [fashion portrait / architectural interior rendering] designed with Sanzo Wada's color harmony #[ID] ([Combo Name]). Exact color allocation: [c1_name] [c1_hex] for [element 1], [c2_name] [c2_hex] for [element 2], [c3_name] [c3_hex] for [element 3]. Background: [setting]. Global Illumination, 8k resolution, Hasselblad medium format camera aesthetic.
```

#### 4. 🧠 OpenAI ChatGPT (GPT Image / DALL-E 3) Prompt Formula
```text
A full-length photograph featuring a [model/interior scene] showcasing a coordinated design inspired by Sanzo Wada's Japanese palette #[ID]. The composition balances [c1_element] in [c1_name] ([c1_hex]) with [c2_element] in [c2_name] ([c2_hex]) and [c3_element] in [c3_name] ([c3_hex]). Natural directional lighting highlights the rich textures and serene aesthetic harmony.
```

> **Proactive Image Tool Invocation**: If your environment has a native `generate_image` tool (e.g. Google Antigravity), call `generate_image` immediately with the crafted prompt to show the user a live visual artifact!

---

### Step 6: Autonomous Codebase Theming & Refactoring

When asked to recolor or theme an existing application:
1. **Automated Theming Engine**:
   Execute the automated scan and injection engine:
   ```bash
   # Preview proposed changes first
   npx wada-colors apply --combo <ID> --dry-run

   # Apply tokens and refactor classes
   npx wada-colors apply --combo <ID> --yes
   ```
2. **Token Injection**:
   - For Tailwind v4: Injects `@theme` with `--color-wada-primary`, `--color-wada-secondary`, `--color-wada-accent`.
   - For Tailwind v3: Injects `theme.extend.colors.wada`.
   - For Vanilla CSS: Injects `:root { --wada-primary: ... }`.
3. **Semantic Class Refactoring**:
   - Identifies generic color utility classes (e.g. `bg-blue-600`, `text-indigo-500`) or hardcoded hexes.
   - Maps them to semantic Wada classes (`bg-wada-primary`, `text-wada-secondary`, `border-wada-accent`).
   - Preserves all layout classes (`flex`, `grid`, `p-4`, `rounded`, `shadow`) completely untouched.

---

## 🎨 Recommended Wada Combinations Across Domains

### 1. Fashion & Wardrobe Styling
- **#165 (Poetic Luxury)**: Cameo Pink (`#e0b3b6`), Spinel Coral (`#f27291`), Deep Lake Wine (`#6d4145`). *Ideal for High-End Minimalist Tailoring or Silk Blouses.*
- **#009 (Muted Editorial)**: Eosine Pink (`#f37f94`), Muted Sage Olive (`#848061`). *Subtle, tactile duo for modern draped noragi jackets.*
- **#305 (Heritage Streetwear)**: Burnt Sienna (`#ae5224`), Olive Ochre (`#d6b43e`), Warm Ecru (`#c2ae93`), Sepia (`#644b1e`). *Rich textured palette for modular streetwear.*
- **#176 (Showa Classic)**: Hermosa Pink (`#f9c1ce`), Deep Iron Navy (`#12354e`), Warm Ash Gray (`#a1a39a`). *Oscar-winning 1930s tailoring homage.*

### 2. Interior & Spatial Architecture
- **#121 (Japandi / Modern Ryokan)**: Green Blue (`#099197`), Silver Gray (`#b6bfc1`), Warm Ivory (`#ebd3a2`). *Tranquil balance of washi lime plaster and oak joinery.*
- **#161 (Wabi-Sabi Cafe)**: Rich Brown (`#7c4226`), Cinnamon Peach (`#eeb480`), Helvetia Blue (`#005b8d`). *Warm clay plaster, reclaimed timber, ceramic tableware.*
- **#241 (Warm Brutalist Studio)**: Slate (`#34454c`), Benzol Green (`#00978d`), Cream Gold (`#fdbf68`), Warm Brown (`#7c4226`). *Architectural concrete and modular seating.*

### 3. Digital UI/UX & Web Applications
- **#001 (Developer Tools / High-Contrast Duo)**: Rust Red (`#d96629`), Cerulian Blue (`#0093a5`).
- **#127 (Enterprise SaaS / High Readability)**: Lyons Blue (`#1c4286`), Golden Amber (`#f3a257`), Pure White (`#ffffff`).
- **#130 (Fintech / Trustworthy Contrast)**: Deep Iron Navy (`#12354e`), Coral Vermillion (`#f58e84`).

---

## 💻 CLI Quick Commands

All commands can be run via `npx wada-colors <command>` (or `node bin/cli.js <command>` when working inside the source repository):

- Install Skill for Agents: `npx wada-colors init` (or `npx wada-colors init --agent <name>`)
- Search Harmonies: `npx wada-colors search <keyword>`
- Match Brand Color: `npx wada-colors match --color "#HEX" [--file <path>]`
- Generate GenAI Image Prompts: `npx wada-colors prompt --combo <ID> --domain <fashion|interior|ui> --style <name>`
- Generate Full Specification: `npx wada-colors generate --combo <ID> --domain <fashion|interior|ui> --out <file>`
- Autonomously Recolor Codebase: `npx wada-colors apply --combo <ID> [--dry-run] [--yes]`
- Launch Interactive Visualizer: `npx wada-colors serve` (or open `web/index.html` in browser)
