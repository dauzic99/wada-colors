# 🌸 Wada Colors (和田三造 配色)
> **348 Timeless 1930s Japanese Color Harmonies for AI Agents & Generative AI**  
> *Transforming Sanzo Wada's classic "A Dictionary of Color Combinations" (Haishoku Sōkan) into universal AI agent skills for Digital UI/UX, High-Fashion Lookbooks, Interior Architecture, and Generative AI Image Prompts.*

[![CI](https://github.com/wada-colors/wada-colors/actions/workflows/ci.yml/badge.svg)](https://github.com/wada-colors/wada-colors/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Palettes](https://img.shields.io/badge/Palettes-348%20Combinations-e8926d.svg)](#the-348-palettes)
[![Pigments](https://img.shields.io/badge/Pigments-159%20Historical-1b2d42.svg)](#historical-provenance)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%20AA%2FAAA-2e7d32.svg)](#strict-palette-preservation--wcag-bridge)
[![Agents](https://img.shields.io/badge/AI%20Agents-Claude%20%7C%20Cursor%20%7C%20Antigravity%20%7C%20Windsurf%20%7C%20Roo%20%7C%20Copilot-8a2be2.svg)](#supported-agents--quick-install)
[![GenAI Prompts](https://img.shields.io/badge/GenAI-Midjourney%20%7C%20Flux%20%7C%20Gemini%20%7C%20GPT-ff69b4.svg)](#-multi-target-generative-ai-image-studio)
[![Zero Build](https://img.shields.io/badge/Web%20Studio-Zero%20Build-0093a5.svg)](#interactive-web-studio)

<p align="center">
  <img src="assets/banner.svg" alt="Wada Colors Banner" width="100%">
</p>

---

## ✨ Why Wada Colors?

Modern design and generative AI often suffer from repetitive, predictable color schemes. In 1933, Japanese artist, painter, and master color theorist **Sanzo Wada (和田三造)** published *Haishoku Sōkan* (配色総鑑) — a monumental study of **348 color combinations** blending traditional Japanese pigments with Showa modernism. In 1954, Wada won the **Academy Award for Best Costume Design** for *Gate of Hell* (地獄門), proving that authentic Japanese color harmony commands timeless global acclaim.

**Wada Colors** brings this heritage into the age of AI agents and Generative AI imagery across 3 major creative domains:

```
                  [ Sanzo Wada 1933 Color Harmonies ]
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
[ 1. Digital UI/UX ]    [ 2. Fashion & Lookbooks ]    [ 3. Interior & Spaces ]
• design.md System      • lookbook.md Specs           • interior-spec.md Specs
• CSS & Tailwind v4     • Garment Layer Allocation    • Spatial Plane Allocation
• WCAG AAA Compliance   • Model Poise & Lighting      • Materials & 2700K Glow
       └───────────────────────────┬───────────────────────────┘
                                   ▼
          [ Multi-Target Generative AI Image Prompts ]
     📸 Midjourney v6.1 • ⚡ Flux.1 • 🔮 Gemini Imagen 3 • 🧠 GPT Image
```

---

## ⚡ Quick Start: Install into Your Project

Install the Wada Colors skill into your project using the zero-dependency CLI:

```bash
# Interactive selection menu
npx wada-colors init

# Or install directly for your specific agent:
npx wada-colors init --agent claude        # .claude/skills/wada-colors/
npx wada-colors init --agent cursor        # .cursor/rules/wada-colors.mdc
npx wada-colors init --agent antigravity   # .agents/skills/wada-colors/
npx wada-colors init --agent windsurf      # .windsurf/rules/wada-colors.md
npx wada-colors init --agent roo           # .clinerules
npx wada-colors init --agent copilot       # .github/copilot-instructions.md

# Or install for all agents at once:
npx wada-colors init --agent all
```

---

## 📸 Multi-Target Generative AI Image Studio

Wada Colors translates any of the 348 historical palettes into production-ready prompts formatted for **Midjourney v6.1**, **Flux.1**, **Google Gemini (Imagen 3)**, and **OpenAI ChatGPT (GPT Image / DALL-E 3)**.

### Fashion & Wardrobe Styling:
```bash
# Generate prompts for High-End Minimalist Tailoring
npx wada-colors prompt --combo 165 --domain fashion --style minimalist

# Generate prompts for Modern Japanese Neo-Trad (Haori)
npx wada-colors prompt --combo 9 --domain fashion --style neotrad

# Generate prompts for Tokyo Contemporary Streetwear
npx wada-colors prompt --combo 305 --domain fashion --style streetwear

# Generate prompts for Classic 1930s Showa Vintage (Oscar 1954 Homage)
npx wada-colors prompt --combo 176 --domain fashion --style showa
```

**Sample Generated Midjourney v6.1 Prompt:**
> `Editorial fashion photography, full body portrait of a model wearing High-End Minimalist Tailoring. Outer garment in Cameo Pink #e0b3b6 (structured double-breasted overcoat in heavy boiled wool), inner layer in Spinel Coral #f27291 (ribbed cashmere knit crewneck top), bottoms in Deep Lake Wine #6d4145 (wide-leg pleated wool gabardine trousers). Set against clean architectural brutalist concrete gallery in Tokyo, soft diffuse natural morning light. Shot on 85mm f/1.4 lens, soft directional diffused studio lighting, Vogue editorial aesthetic, high tactile fabric texture --ar 3:4 --style raw --v 6.1`

### Interior & Spatial Architecture:
```bash
# Generate prompts for Japandi / Modern Ryokan
npx wada-colors prompt --combo 121 --domain interior --style japandi

# Generate prompts for Wabi-Sabi Boutique Cafe
npx wada-colors prompt --combo 161 --domain interior --style cafe

# Generate prompts for Warm Brutalist Creative Studio
npx wada-colors prompt --combo 241 --domain interior --style brutalist
```

**Sample Generated Flux.1 Prompt:**
> `High-end architectural interior photography of a Japandi / Modern Ryokan living space inspired by 1930s Japanese color theory (Wada Sanzo #121). Main centerpiece is low-slung modern lounge sofa upholstered in Green Blue (#099197) linen bouclé, balanced with hand-woven area rug and linen drapery in Silver Gray (#b6bfc1). Walls finished in warm washi textured lime plaster in soft off-white. Natural sunlight, realistic shadow falloff, tactile bouclé and linen textures, tranquil atmosphere.`

---

## 🔍 Brand & Asset Color Matcher

Already have a primary brand color or logo? Wada Colors uses **CIELAB Delta-E ($\Delta E$) perceptual color science** to find authentic 1930s Wada harmonies that anchor and elevate your existing identity:

```bash
# Match directly from a hex color:
npx wada-colors match --color "#2A6F97"

# Or extract automatically from brand asset files (JSON, SVG, or CSS):
npx wada-colors match --file ./brand.json
npx wada-colors match --file ./logo.svg
npx wada-colors match --file ./src/theme.css
```

---

## 📝 Automated Document Generation

Generate ready-to-commit specification files in seconds:

```bash
# Digital UI/UX Design System (design.md)
npx wada-colors generate --combo 127 --domain ui --out design.md

# Fashion Wardrobe Lookbook (lookbook.md)
npx wada-colors generate --combo 165 --domain fashion --style minimalist --out lookbook.md

# Spatial Interior Architecture Spec (interior-spec.md)
npx wada-colors generate --combo 121 --domain interior --style japandi --out interior-spec.md
```

---

## 🌐 Interactive Web Studio (Zero-Build)

This repository includes a zero-build web application ready to deploy directly on **GitHub Pages**:

- **Domain Switcher**: Seamlessly switch between **App UI Preview**, **Fashion Lookbook Studio**, and **Spatial Interior Studio**.
- **Interactive UI Recoloring Engine**: Real-time simulation of live app UI elements (Navbar, hero CTA, cards, pill tags) recoloring with authentic Wada hues.
- **Fashion Studio Swatches**: Interactive garment allocation (Overcoat, Mid-layer, Trousers) with live backdrop details and silhouette selectors.
- **Interior Studio Planes**: Architectural surface allocation (Focal sofa, textiles/rug, accent vessels) with lighting temperature specs.
- **Multi-Tab Code & Prompt Exporter**: Instant copy-paste for CSS custom properties (`:root`), Tailwind v4 `@theme`, **Midjourney**, **Flux.1**, **Gemini**, **GPT Image**, or markdown specs.

### Running Locally:
```bash
npm run serve
# Visit http://localhost:3333
```

---

## 🎨 Strict Palette Preservation & WCAG Bridge

Wada Colors enforces a strict design principle: **Never morph, desaturate, or artificially alter authentic Wada Sanzo colors.**

Instead, the skill pairs the authentic Wada palette with an **intelligent neutral monochrome bridge**:

| UI Layer | Light Mode | Dark Mode | WCAG Compliance |
|---|---|---|---|
| **Canvas Background** | `#fcfbf9` (Washi Ivory) | `#111314` (Deep Carbon) | Baseline |
| **Card Surface** | `#ffffff` (Elevated Panel) | `#1a1e24` (Obsidian Surface) | Structural |
| **Primary Text** | `#111314` (Sumi Ink) | `#f5f5f7` (Crisp Off-White) | **>15:1 (AAA)** |
| **Secondary Text** | `#64748b` (Readable Slate) | `#94a3b8` (Muted Slate) | **>5.2:1 (AA)** |
| **Wada Hero Color** | Pure Wada Hex | Pure Wada Hex | Brand Identity |
| **Button Text** | Dynamic Inverted | Dynamic Inverted | **>4.5:1 (AA)** |

---

## 📚 The 348 Palettes at a Glance

Sanzo Wada's dictionary is systematically divided into three palette densities:

### 1. 2-Color Duos (#1 – #120)
*Ideal for minimalist developer tools, terminal interfaces, high-contrast branding, and dual-tone noragi silhouettes.*
- **#1**: English Red (`#d96629`) & Cerulian Blue (`#0093a5`) — *弁柄赤・碧天*
- **#14**: Raw Sienna (`#bb7125`) & Deep Slate Olive (`#253122`) — *黄土色・石盤橄欖*
- **#28**: Brick Red (`#a84222`) & Peacock Blue (`#00939b`) — *弁柄色・孔雀青*

### 2. 3-Color Trios (#121 – #240)
*Ideal for SaaS dashboards, high-fashion wardrobe layering, and residential interior spaces.*
- **#121**: Green Blue (`#099197`), Silver Gray (`#b6bfc1`) & Warm Ivory (`#ebd3a2`) — *緑青・銀鼠・象牙色*
- **#161**: Brown (`#7c4226`), Pinkish Cinnamon (`#eeb480`) & Helvetia Blue (`#005b8d`) — *茶色・肉桂色・露草色*
- **#165**: Cameo Pink (`#e0b3b6`), Spinel Coral (`#f27291`) & Deep Lake Wine (`#6d4145`) — *紅梅色・尖晶石紅・深湖紅*
- **#176**: Hermosa Pink (`#f9c1ce`), Deep Tyrian Navy (`#12354e`) & Warm Gray (`#a1a39a`) — *肉色・鉄紺・灰桜*

### 3. 4-Color Quads (#241 – #348)
*Ideal for rich editorial publications, multi-plane architecture, and modular street fashion.*
- **#241**: Slate Color (`#34454c`), Benzol Green (`#00978d`), Cream Yellow (`#fdbf68`) & Brown (`#7c4226`)
- **#281**: Pale Lemon Yellow (`#ffefae`), Benzol Green (`#00978d`), Cobalt Green (`#96d1aa`) & Antwarp Blue (`#007190`)
- **#305**: Burnt Sienna (`#ae5224`), Olive Ochre (`#d6b43e`), Warm Ecru (`#c2ae93`) & Sepia (`#644b1e`)

---

## 🛠️ CLI Reference

```text
🌸 Wada Colors CLI (和田三造 配色)

Commands:
  npx wada-colors init [--agent <claude|cursor|antigravity|windsurf|roo|copilot|all>]
  npx wada-colors list [--size <2|3|4>]
  npx wada-colors search <keyword>
  npx wada-colors show <id (1-348)>
  npx wada-colors match --color "#HEX"
  npx wada-colors match --file <brand.json | logo.svg | theme.css>
  npx wada-colors prompt --combo <id> [--domain fashion|interior|ui] [--style name]
  npx wada-colors generate --combo <id> [--domain fashion|interior|ui] [--style name] [--out <file>]
  npx wada-colors serve [--port 3333]
  npx wada-colors help
```

---

## 🏛️ Historical Provenance

**Sanzo Wada (和田 三造, 1883–1967)** was an avant-garde Japanese painter, teacher, and kimono designer. In 1927, he founded the Japan Standard Color Association (precursor to the Japan Color Research Institute). In 1933–1934, he published the landmark multi-volume *Haishoku Sōkan* (A Dictionary of Color Combinations), documenting traditional Japanese pigments alongside modern Western color theory. In 1954, Wada won the **Academy Award for Best Costume Design** for the film *Gate of Hell* (地獄門), celebrating his mastery of historical Japanese color palettes on the world stage.

---

## 📄 License & Attribution

- **Dataset & Code**: Released under the [MIT License](LICENSE).
- **Original Color Harmonies**: Sanzo Wada (1883–1967), *Haishoku Sōkan* (1933).
