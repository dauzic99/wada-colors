const fs = require('fs');
const path = require('path');

const combos = require('../data/wada_combinations.json');
const colors = require('../data/wada_colors.json');

const refDir = path.resolve(__dirname, '../skills/wada-colors/references');
if (!fs.existsSync(refDir)) fs.mkdirSync(refDir, { recursive: true });

// 1. Generate palette-directory.md
let dirMd = `# 🎨 Sanzo Wada Color Directory (All 348 Palettes)
> Reference guide for AI agents to look up authentic 1930s color combinations from Sanzo Wada's *Haishoku Sōkan*.

| ID | Size | Japanese Name | English Name | Hex Codes | Mood / Tags |
|---|---|---|---|---|---|
`;

combos.forEach(c => {
  const hexes = c.colors.map(col => `\`${col.hex}\``).join(' ');
  const tags = c.tags.slice(0, 3).join(', ');
  dirMd += `| **#${c.id}** | ${c.size}-color | ${c.name_jp} | ${c.name_en} | ${hexes} | ${tags} |\n`;
});

fs.writeFileSync(path.join(refDir, 'palette-directory.md'), dirMd, 'utf8');

// 2. Generate mood-matrix.md
let moodMd = `# 🎭 Mood & Archetype Matrix
> Fast-lookup guide to find Sanzo Wada combinations by aesthetic vibe and app archetype.

## By App Archetype

### 1. Developer Tools & Terminal / CLI Apps
High contrast, disciplined, technical elegance.
- **#1**: English Red & Cerulian Blue (\`#d96629\`, \`#0093a5\`)
- **#28**: Brick Red & Peacock Blue (\`#a84222\`, \`#00939b\`)
- **#123**: Ochre Red & Blue & Mineral Gray (\`#ab544d\`, \`#006eb8\`, \`#a2b0ad\`)
- **#241**: Slate Color, Benzol Green, Cream Yellow & Brown (\`#34454c\`, \`#00978d\`, \`#fdbf68\`, \`#7c4226\`)

### 2. SaaS Dashboards & Enterprise Systems
Balanced, clear hierarchy, high readability.
- **#121**: Green Blue, Neutral Gray & Ivory Buff (\`#099197\`, \`#b6bfc1\`, \`#ebd3a2\`)
- **#127**: Deep Lyons Blue, Golden Yellow & Cloud White (\`#1c4286\`, \`#f3a257\`, \`#ffffff\`)
- **#165**: Cameo Pink, Spinel Red & Vistoris Lake (\`#e0b3b6\`, \`#f27291\`, \`#6d4145\`)
- **#281**: Pale Lemon Yellow, Benzol Green, Cobalt Green & Antwarp Blue (\`#ffefae\`, \`#00978d\`, \`#96d1aa\`, \`#007190\`)

### 3. Coffee, Artisan & Lifestyle E-Commerce
Warm, earthy, wabi-sabi, organic depth.
- **#14**: Raw Sienna & Deep Slate Olive (\`#bb7125\`, \`#253122\`)
- **#32**: Brown & Olive Buff (\`#7c4226\`, \`#c1c494\`)
- **#161**: Brown, Pinkish Cinnamon & Helvetia Blue (\`#7c4226\`, \`#eeb480\`, \`#005b8d\`)
- **#305**: Burnt Sienna, Olive Ocher, Ecru & Sepia (\`#ae5224\`, \`#d6b43e\`, \`#c2ae93\`, \`#644b1e\`)

### 4. Luxury, Fashion & Editorial
Poetic, subtle, melancholic, refined.
- **#9**: Eosine Pink & Light Grayish Olive (\`#f37f94\`, \`#848061\`)
- **#134**: Grayish Lavender & Deep Violet (\`#b5b1d8\`, \`#70727c\`)
- **#176**: Hermosa Pink, Dark Tyrian Blue & Warm Gray (\`#f9c1ce\`, \`#12354e\`, \`#a1a39a\`)
- **#330**: Cotinga Purple, Nile Blue, Lilac & Gold (\`#501345\`, \`#bce4e5\`, \`#b984af\`, \`#f3a257\`)

### 5. Fintech & Modern Finance
Trustworthy, authoritative, distinct from generic bank blue.
- **#124**: Helvetia Blue & Apricot Yellow (\`#005b8d\`, \`#ffdd00\`)
- **#130**: Dark Tyrian Blue & Coral Red (\`#12354e\`, \`#f58e84\`)
- **#215**: Antwarp Blue, Olive Ocher & Mineral Gray (\`#007190\`, \`#d6b43e\`, \`#a2b0ad\`)
- **#312**: Deep Indigo, Peach Red, Cream Yellow & White (\`#051230\`, \`#f15a30\`, \`#fdbf68\`, \`#ffffff\`)

---

## By Vibe & Emotional Tone

- **Zen & Wabi-Sabi**: Earthy, muted greens, olives, ecru, and aged wood tones (#14, #32, #53, #77, #80, #108).
- **Nostalgic Showa**: Classic Showa-era magazine warmth, combining warm rusts with muted cyan or indigo (#1, #15, #66, #118, #161).
- **Botanical Serenity**: Fresh moss, young bamboo, morning dew (#88, #91, #99, #100, #105, #115).
- **Melancholic Elegance**: Deep violets, faded roses, lavender twilight (#3, #11, #134, #140, #142, #146).
- **Crisp Modernist**: High-energy contrast, bold primaries tempered by Japanese earthen tones (#17, #55, #64, #122).
`;

fs.writeFileSync(path.join(refDir, 'mood-matrix.md'), moodMd, 'utf8');

// 3. Generate contrast-rules.md
let contrastMd = `# 📐 WCAG Contrast & Strict Token Bridge Rules
> How to maintain strict Wada Sanzo color authenticity while guaranteeing 100% WCAG AA/AAA compliance.

## The Problem
Wada Sanzo's palettes were created for printing on physical paper in 1933. Some combinations pair two colors of similar luminance (e.g. Pink and Light Blue), which look gorgeous side-by-side but fail WCAG if one is placed as small body text directly over the other.

## The Strict Bridge Solution
1. **Never morph or desaturate Wada colors**:
   The exact hex codes from Wada Sanzo must be preserved 100% for branding, key accents, borders, tags, hero illustrations, and interactive focal points.
2. **Neutral Monochrome Bridge**:
   For structural UI backgrounds, elevated cards, and body text, bridge the palette with neutral monochromes:
   - **Light Mode Canvas**: \`#fcfbf9\` (Japanese Paper / Washi Ivory) or \`#ffffff\`
   - **Light Mode Body Text**: \`#111314\` (Wada Black / Sumi Ink) -> **18.5:1 (AAA)**
   - **Light Mode Subtle Border**: \`#e5e7eb\` or 15% opacity of the darkest Wada color
   - **Dark Mode Canvas**: \`#111314\` (Deep Carbon) or \`#181a1b\`
   - **Dark Mode Card Surface**: \`#1f2326\` (Elevated Carbon)
   - **Dark Mode Body Text**: \`#f5f5f7\` or \`#fcfbf9\` -> **16.2:1 (AAA)**
   - **Dark Mode Subtle Border**: \`#2d3238\`
3. **Button Text Inversion Rule**:
   - When a button background is a dark Wada color (Luminance < 0.25), button text MUST be \`#ffffff\` (Contrast >= 4.5:1).
   - When a button background is a light Wada color (Luminance > 0.4), button text MUST be \`#111314\` (Contrast >= 7.0:1).
`;

fs.writeFileSync(path.join(refDir, 'contrast-rules.md'), contrastMd, 'utf8');

console.log('Successfully generated references in skills/wada-colors/references/');
