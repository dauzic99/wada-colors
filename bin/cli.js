#!/usr/bin/env node

/**
 * 🌸 Wada Colors CLI (和田三造 配色)
 * Universal AI Agent Skill installer and Sanzo Wada color harmony engine.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const readline = require('readline');
const { runApplyTheme } = require('./theming-engine');

const ROOT_DIR = path.resolve(__dirname, '..');
const COMBOS_FILE = path.join(ROOT_DIR, 'data', 'wada_combinations.json');
const COLORS_FILE = path.join(ROOT_DIR, 'data', 'wada_colors.json');

const combos = JSON.parse(fs.readFileSync(COMBOS_FILE, 'utf8'));
const colors = JSON.parse(fs.readFileSync(COLORS_FILE, 'utf8'));

// Perceptual Color Math: RGB -> XYZ -> CIELAB -> Delta-E
function rgbToXyz(r, g, b) {
  let [rs, gs, bs] = [r, g, b].map(v => {
    v = v / 255;
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
  });
  rs *= 100; gs *= 100; bs *= 100;
  const x = rs * 0.4124 + gs * 0.3576 + bs * 0.1805;
  const y = rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
  const z = rs * 0.0193 + gs * 0.1192 + bs * 0.9505;
  return [x, y, z];
}

function xyzToLab(x, y, z) {
  const refX = 95.047, refY = 100.0, refZ = 108.883;
  let [xr, yr, zr] = [x / refX, y / refY, z / refZ].map(v => {
    return v > 0.008856 ? Math.pow(v, 1 / 3) : (7.787 * v) + (16 / 116);
  });
  const L = (116 * yr) - 16;
  const a = 500 * (xr - yr);
  const b = 200 * (yr - zr);
  return [L, a, b];
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function hexToLab(hex) {
  const [r, g, b] = hexToRgb(hex);
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

function deltaE(lab1, lab2) {
  const dL = lab1[0] - lab2[0];
  const da = lab1[1] - lab2[1];
  const db = lab1[2] - lab2[2];
  return Math.sqrt(dL * dL + da * da + db * db);
}

// Adapters registry
const ADAPTERS = {
  claude: {
    name: 'Claude Code (Anthropic)',
    files: [
      {
        source: path.join(ROOT_DIR, 'adapters', 'claude', 'SKILL.md'),
        dest: path.join('.claude', 'skills', 'wada-colors', 'SKILL.md')
      },
      {
        source: path.join(ROOT_DIR, 'adapters', 'claude', 'commands', 'wada.md'),
        dest: path.join('.claude', 'commands', 'wada.md')
      }
    ]
  },
  cursor: {
    name: 'Cursor IDE (.cursor/rules)',
    source: path.join(ROOT_DIR, 'adapters', 'cursor', 'wada-colors.mdc'),
    dest: path.join('.cursor', 'rules', 'wada-colors.mdc')
  },
  antigravity: {
    name: 'Google Antigravity IDE (.agents/skills)',
    source: path.join(ROOT_DIR, 'adapters', 'antigravity', 'SKILL.md'),
    dest: path.join('.agents', 'skills', 'wada-colors', 'SKILL.md')
  },
  windsurf: {
    name: 'Codeium Windsurf (.windsurf/rules)',
    source: path.join(ROOT_DIR, 'adapters', 'windsurf', 'wada-colors.md'),
    dest: path.join('.windsurf', 'rules', 'wada-colors.md')
  },
  roo: {
    name: 'Roo Code & Cline (.clinerules)',
    source: path.join(ROOT_DIR, 'adapters', 'roo', '.clinerules-wada'),
    dest: '.clinerules'
  },
  copilot: {
    name: 'GitHub Copilot (.github/copilot-instructions.md)',
    source: path.join(ROOT_DIR, 'adapters', 'copilot', 'copilot-wada.md'),
    dest: path.join('.github', 'copilot-instructions.md')
  }
};

function copyAdapter(key, targetDir = process.cwd()) {
  const adapter = ADAPTERS[key];
  if (!adapter) {
    console.error(`❌ Unknown agent target: ${key}`);
    return false;
  }
  const files = adapter.files || [{ source: adapter.source, dest: adapter.dest }];
  for (const f of files) {
    const destPath = path.resolve(targetDir, f.dest);
    const destFolder = path.dirname(destPath);
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
    fs.copyFileSync(f.source, destPath);
    console.log(`✅ Installed [${adapter.name}] -> ${f.dest}`);
  }
  return true;
}

// Commands
async function handleInit(args) {
  let agentArg = null;
  const agentIdx = args.indexOf('--agent');
  if (agentIdx !== -1 && args[agentIdx + 1]) {
    agentArg = args[agentIdx + 1].toLowerCase();
  }

  if (agentArg) {
    if (agentArg === 'all') {
      console.log('\n🌸 Installing Wada Colors skills for ALL agents...\n');
      Object.keys(ADAPTERS).forEach(k => copyAdapter(k));
      console.log('\n✨ All agent adapters installed successfully!\n');
    } else if (ADAPTERS[agentArg]) {
      console.log(`\n🌸 Installing Wada Colors skill for ${agentArg}...\n`);
      copyAdapter(agentArg);
      console.log('\n✨ Installation complete!\n');
    } else {
      console.error(`❌ Invalid agent '${agentArg}'. Valid options: ${Object.keys(ADAPTERS).join(', ')}, all`);
    }
    return;
  }

  // Interactive selection
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n🌸 Welcome to Wada Colors Skill Installer');
  console.log('Select the AI agent(s) you are configuring for this project:\n');
  const keys = Object.keys(ADAPTERS);
  keys.forEach((k, idx) => {
    console.log(`  [${idx + 1}] ${ADAPTERS[k].name}`);
  });
  console.log(`  [7] All Agents`);
  console.log(`  [0] Exit\n`);

  rl.question('Choose an option (1-7): ', ans => {
    rl.close();
    const opt = parseInt(ans.trim(), 10);
    if (opt >= 1 && opt <= 6) {
      const selected = keys[opt - 1];
      console.log(`\n🌸 Installing Wada Colors for ${selected}...`);
      copyAdapter(selected);
      console.log('\n✨ Done!\n');
    } else if (opt === 7) {
      console.log('\n🌸 Installing for ALL agents...');
      keys.forEach(k => copyAdapter(k));
      console.log('\n✨ All adapters installed successfully!\n');
    } else {
      console.log('Exited without changes.');
    }
  });
}

function handleList(args) {
  let sizeFilter = null;
  const sizeIdx = args.indexOf('--size');
  if (sizeIdx !== -1 && args[sizeIdx + 1]) {
    sizeFilter = parseInt(args[sizeIdx + 1], 10);
  }

  console.log('\n🌸 Sanzo Wada Color Combinations (Haishoku Sōkan)\n');
  const filtered = sizeFilter ? combos.filter(c => c.size === sizeFilter) : combos;
  filtered.forEach(c => {
    const swatches = c.colors.map(col => `${col.hex} (${col.name_en})`).join(' | ');
    console.log(`  #${String(c.id).padStart(3, '0')} [${c.size} colors] ${c.name_jp} (${c.name_en})`);
    console.log(`       Colors: ${swatches}`);
  });
  console.log(`\nShowing ${filtered.length} combinations.`);
}

function handleSearch(args) {
  const q = args[0] ? args[0].toLowerCase() : '';
  if (!q) {
    console.error('Usage: wada-colors search <keyword>');
    return;
  }
  const results = combos.filter(c => {
    return c.name_en.toLowerCase().includes(q) ||
           c.name_jp.includes(q) ||
           c.name_romaji.toLowerCase().includes(q) ||
           c.tags.some(t => t.toLowerCase().includes(q)) ||
           c.archetypes.some(a => a.toLowerCase().includes(q)) ||
           c.colors.some(col => col.name_en.toLowerCase().includes(q) || col.hex.toLowerCase().includes(q));
  });

  console.log(`\n🌸 Search results for "${q}" (${results.length} found):\n`);
  results.slice(0, 20).forEach(c => {
    const colorsStr = c.colors.map(col => `${col.hex} (${col.name_en})`).join(' + ');
    console.log(`  #${c.id} ${c.name_jp} / ${c.name_en} [${c.temperature}]`);
    console.log(`     Colors: ${colorsStr}`);
    console.log(`     Tags: ${c.tags.join(', ')}\n`);
  });
  if (results.length > 20) {
    console.log(`... and ${results.length - 20} more.`);
  }
}

function handleShow(args) {
  const id = parseInt(args[0], 10);
  if (!id || id < 1 || id > 348) {
    console.error('Usage: wada-colors show <id (1-348)>');
    return;
  }
  const combo = combos[id - 1];
  console.log(`\n🌸 Combination #${combo.id}: ${combo.name_jp} (${combo.name_romaji})`);
  console.log(`   English: ${combo.name_en}`);
  console.log(`   Size: ${combo.size}-color palette | Temperature: ${combo.temperature}`);
  console.log(`   Tags: ${combo.tags.join(', ')}`);
  console.log(`   Archetypes: ${combo.archetypes.join(', ')}\n`);
  console.log('   Colors:');
  combo.colors.forEach((col, idx) => {
    console.log(`     [${idx + 1}] ${col.name_jp} / ${col.name_en}: ${col.hex} | RGB(${col.rgb.join(', ')})`);
  });
  console.log('\n   Contrast against Light Canvas (#ffffff):');
  combo.contrast.against_white.forEach(c => {
    console.log(`     - ${c.name} (${c.hex}): ${c.contrast}:1`);
  });
  console.log('   Contrast against Dark Canvas (#111314):');
  combo.contrast.against_black.forEach(c => {
    console.log(`     - ${c.name} (${c.hex}): ${c.contrast}:1`);
  });
  console.log('');
}

function handleMatch(args) {
  let hexTarget = null;
  const colorIdx = args.indexOf('--color');
  if (colorIdx !== -1 && args[colorIdx + 1]) {
    hexTarget = args[colorIdx + 1].trim();
  }

  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    const filePath = path.resolve(process.cwd(), args[fileIdx + 1]);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/#[0-9a-fA-F]{6}/g);
    if (!matches || matches.length === 0) {
      console.error(`❌ No hex colors found in file: ${filePath}`);
      return;
    }
    hexTarget = matches[0];
    console.log(`🔍 Extracted primary brand color from file: ${hexTarget}`);
  }

  if (!hexTarget || !/^#[0-9a-fA-F]{6}$/i.test(hexTarget)) {
    console.error('Usage: wada-colors match --color "#HEX" OR --file <path>');
    return;
  }

  const targetLab = hexToLab(hexTarget);

  // 1. Rank all 159 pigments by Delta-E
  const rankedColors = colors.map(c => {
    const dE = deltaE(targetLab, c.lab);
    return { ...c, deltaE: Number(dE.toFixed(2)) };
  }).sort((a, b) => a.deltaE - b.deltaE);

  const topColor = rankedColors[0];
  console.log(`\n🌸 Closest authentic Wada pigment to ${hexTarget}:`);
  console.log(`   #${topColor.id} ${topColor.name_jp} (${topColor.name_romaji}) / ${topColor.name_en}`);
  console.log(`   Hex: ${topColor.hex} | CIELAB ΔE: ${topColor.deltaE} (0 = identical)\n`);

  // 2. Find combinations featuring the closest pigments
  const matchingCombos = combos.filter(c => {
    return c.colors.some(col => col.id === topColor.id);
  });

  console.log(`🌟 Top Wada Sanzo Combinations anchoring your brand color:\n`);
  matchingCombos.slice(0, 3).forEach((combo, idx) => {
    console.log(`  [${idx + 1}] Combination #${combo.id}: ${combo.name_jp} (${combo.name_en})`);
    console.log(`      Size: ${combo.size}-color | Temperature: ${combo.temperature}`);
    const swatches = combo.colors.map(col => `${col.hex} (${col.name_en})`).join(' + ');
    console.log(`      Colors: ${swatches}`);
    console.log(`      Tags: ${combo.tags.join(', ')}\n`);
  });
}

function getFashionMapping(size) {
  if (size === 2) return [0, 1, 0, 1, 0, 0, 1]; // Outerwear:0, Shirt:1, Bottoms:0, Footwear:1, Socks:0, Bag:0, Headwear:1
  if (size === 3) return [0, 1, 2, 0, 1, 2, 1]; // Outerwear:0, Shirt:1, Bottoms:2, Footwear:0, Socks:1, Bag:2, Headwear:1
  return [0, 1, 2, 3, 2, 3, 0];                  // Outerwear:0, Shirt:1, Bottoms:2, Footwear:3, Socks:2, Bag:3, Headwear:0
}

function getInteriorMapping(size) {
  if (size === 2) return [0, 1, 0, 1, 1, 0, 1]; // Seating:0, Rug:1, Joinery:0, Walls:1, Lighting:1, Ceramics:0, Hardware:1
  if (size === 3) return [0, 1, 2, 1, 0, 2, 1]; // Seating:0, Rug:1, Joinery:2, Walls:1, Lighting:0, Ceramics:2, Hardware:1
  return [0, 1, 2, 3, 0, 3, 2];                  // Seating:0, Rug:1, Joinery:2, Walls:3, Lighting:0, Ceramics:3, Hardware:2
}

// Generative AI Prompt Builders
function generateFashionPrompts(combo, style = 'minimalist') {
  const numColors = combo.colors.length;
  const map = getFashionMapping(numColors);

  const styleProfiles = {
    minimalist: {
      name: 'High-End Minimalist Tailoring',
      genre: 'Luxury Contemporary / Lemaire aesthetic',
      backdrop: 'clean architectural brutalist concrete gallery in Tokyo, soft diffuse natural morning light',
      items: {
        outerwear: { name: 'Structured Double-Breasted Overcoat', material: 'heavy boiled virgin wool' },
        shirt: { name: 'Ribbed Cashmere Knit Crewneck', material: 'ultra-soft 12-gauge Mongolian cashmere' },
        bottoms: { name: 'Wide-Leg Pleated Trousers', material: 'fluid wool gabardine with deep pleats' },
        footwear: { name: 'Polished Leather Loafers', material: 'smooth calfskin leather' },
        socks: { name: 'Fine-Gauge Mercerized Socks', material: 'Egyptian cotton' },
        bag: { name: 'Minimalist Unlined Tote', material: 'full-grain bridle leather' },
        headwear: { name: 'Cashmere Ribbed Beanie', material: 'seamless Italian knit' }
      }
    },
    neotrad: {
      name: 'Modern Japanese Neo-Trad',
      genre: 'Contemporary Haori & Kimono cuts',
      backdrop: 'serene Japanese architectural courtyard with weathered cedar timber and raked gravel',
      items: {
        outerwear: { name: 'Draped Noragi Haori Jacket', material: 'heavy slub-spun raw linen' },
        shirt: { name: 'Collarless Wrap Blouse', material: 'washed mulberry silk' },
        bottoms: { name: 'Hakama-Inspired Pleated Culottes', material: 'dense cotton twill' },
        footwear: { name: 'Leather Tabi Ankle Boots', material: 'vegetable-tanned horsehide' },
        socks: { name: 'Split-Toe Tabi Socks', material: 'woven hemp' },
        bag: { name: 'Draped Linen Azuma Bukuro Bag', material: 'textured linen canvas' },
        headwear: { name: 'Sculptural Woven Straw Boater Hat', material: 'Japanese rush grass' }
      }
    },
    streetwear: {
      name: 'Tokyo Contemporary Streetwear',
      genre: 'Urban Techwear & Oversized Silhouette',
      backdrop: 'moody Shibuya alleyway at twilight, atmospheric mist and subtle neon reflections',
      items: {
        outerwear: { name: 'Oversized Matte Technical Bomber', material: 'water-repellent micro-ripstop' },
        shirt: { name: 'Heavyweight Drop-Shoulder Hoodie', material: '500gsm loopback French terry' },
        bottoms: { name: 'Modular Wide Cargo Pants', material: 'tactical cordura with strap details' },
        footwear: { name: 'Technical Trail Sneakers', material: 'layered ballistic mesh and suede' },
        socks: { name: 'Heavy Ribbed Athletic Crew Socks', material: 'combed cotton' },
        bag: { name: 'Crossbody Sling Bag', material: 'waterproof X-Pac sailcloth' },
        headwear: { name: 'Technical 6-Panel Cap', material: 'water-resistant matte nylon' }
      }
    },
    showa: {
      name: 'Classic 1930s Showa Vintage',
      genre: 'Sanzo Wada Oscar Homage / Historical Tailoring',
      backdrop: 'nostalgic 1930s Tokyo art salon with dark mahogany wood paneling, warm incandescent amber lighting',
      items: {
        outerwear: { name: 'Authentic 1930s Peak-Lapel Trench Coat', material: 'heavy twill melton wool' },
        shirt: { name: 'Spread-Collar Dress Shirt with Silk Scarf', material: 'vintage silk crepe' },
        bottoms: { name: 'High-Waisted Tailored Wool Trousers', material: 'deep double front pleats' },
        footwear: { name: 'Goodyear-Welted Oxford Brogues', material: 'hand-burnished calfskin' },
        socks: { name: 'Silk-Blend Ribbed Dress Socks', material: 'fine spun lisle' },
        bag: { name: 'Framed Gladstone Travel Case', material: 'saddle-stitched bridle leather' },
        headwear: { name: 'Wide-Brimmed Felt Fedora', material: 'brushed rabbit fur felt' }
      }
    }
  };

  const p = styleProfiles[style] || styleProfiles.minimalist;

  const cOuter = combo.colors[map[0]];
  const cShirt = combo.colors[map[1]];
  const cBottoms = combo.colors[map[2]];
  const cFootwear = combo.colors[map[3]];
  const cSocks = combo.colors[map[4]];
  const cBag = combo.colors[map[5]];
  const cHeadwear = combo.colors[map[6]];

  const wardrobeBreakdown = `7-piece wardrobe breakdown: Outerwear (${p.items.outerwear.name} in ${cOuter.name_en} ${cOuter.hex}, ${p.items.outerwear.material}), layered over ${p.items.shirt.name} in ${cShirt.name_en} ${cShirt.hex} (${p.items.shirt.material}), paired with ${p.items.bottoms.name} in ${cBottoms.name_en} ${cBottoms.hex} (${p.items.bottoms.material}), ${p.items.footwear.name} in ${cFootwear.name_en} ${cFootwear.hex}, ${p.items.socks.name} in ${cSocks.hex}, accessorized with ${p.items.bag.name} in ${cBag.hex} and ${p.items.headwear.name} in ${cHeadwear.hex}`;

  const midjourney = `Editorial fashion photography, full body portrait of a model wearing a complete 7-piece ${p.name} ensemble (${p.genre}) inspired by Wada Sanzo combination #${combo.id} (${combo.name_en}). ${wardrobeBreakdown}. Set against ${p.backdrop}. Shot on 85mm f/1.4 lens, soft directional diffused studio lighting, Vogue editorial aesthetic, high tactile fabric texture --ar 3:4 --style raw --v 6.1`;

  const flux = `A high-fashion editorial photograph of a model in a complete 7-piece ${p.name} wardrobe styled with authentic 1930s Japanese color theory (Wada Sanzo #${combo.id} - ${combo.name_en}). Ensemble: ${p.items.outerwear.name} in ${cOuter.name_en} (${cOuter.hex}, ${p.items.outerwear.material}), layered over ${p.items.shirt.name} in ${cShirt.name_en} (${cShirt.hex}), with ${p.items.bottoms.name} in ${cBottoms.name_en} (${cBottoms.hex}), ${p.items.footwear.name} in ${cFootwear.name_en} (${cFootwear.hex}), ${p.items.socks.name} in ${cSocks.hex}, and accessories (${p.items.bag.name} in ${cBag.hex}, ${p.items.headwear.name} in ${cHeadwear.hex}). Natural skin texture, realistic cloth drape, soft ambient lighting, ${p.backdrop}.`;

  const gemini = `Photorealistic fashion portrait of a fashion model showcasing a complete 7-piece ${p.name} collection based on Sanzo Wada's color harmony #${combo.id} (${combo.name_en}). Exact 7-piece color allocation: Outerwear (${p.items.outerwear.name}) in ${cOuter.name_en} ${cOuter.hex}, Shirt/Knit (${p.items.shirt.name}) in ${cShirt.name_en} ${cShirt.hex}, Bottoms (${p.items.bottoms.name}) in ${cBottoms.name_en} ${cBottoms.hex}, Footwear (${p.items.footwear.name}) in ${cFootwear.name_en} ${cFootwear.hex}, Legwear (${p.items.socks.name}) in ${cSocks.hex}, Leather Bag (${p.items.bag.name}) in ${cBag.hex}, Headwear (${p.items.headwear.name}) in ${cHeadwear.hex}. Setting: ${p.backdrop}. Soft studio shadows, Hasselblad camera quality, 8k resolution, authentic fabric weaves.`;

  const dalle = `A full-length fashion photograph featuring a model posing gracefully in a coordinated 7-piece wardrobe inspired by Sanzo Wada's Japanese color palette #${combo.id} (${combo.name_en}). The ensemble balances ${p.items.outerwear.name} in ${cOuter.name_en} (${cOuter.hex}) over ${p.items.shirt.name} in ${cShirt.name_en} (${cShirt.hex}), ${p.items.bottoms.name} in ${cBottoms.name_en} (${cBottoms.hex}), ${p.items.footwear.name} in ${cFootwear.name_en} (${cFootwear.hex}), accented with ${p.items.bag.name} in ${cBag.hex} and ${p.items.headwear.name} in ${cHeadwear.hex}. The background is ${p.backdrop} with soft natural light streaming from the side.`;

  return { profile: p, midjourney, flux, gemini, dalle };
}

function generateInteriorPrompts(combo, style = 'japandi') {
  const numColors = combo.colors.length;
  const map = getInteriorMapping(numColors);

  const interiorProfiles = {
    japandi: {
      name: 'Japandi / Modern Ryokan',
      lighting: 'soft diffuse morning sunlight filtering through shoji-style slatted oak blinds, warm 2700K ambient cove glow',
      items: {
        seating: { name: 'Low-Slung Modern Lounge Sofa', material: 'textured linen bouclé upholstery' },
        rug: { name: 'Hand-Woven Wool & Paper Yarn Rug', material: 'natural unbleached wool with subtle border' },
        joinery: { name: 'Solid White Oak Joinery & Table', material: 'hand-rubbed matte oil finish oak' },
        walls: { name: 'Warm Washi Textured Plaster', material: 'off-white breathable mineral lime plaster' },
        lighting: { name: 'Akari Washi Paper Lanterns', material: 'bamboo ribbing and mulberry washi paper' },
        ceramics: { name: 'Hand-Thrown Shino Ceramic Vessels', material: 'matte feldspathic crackle glaze stoneware' },
        hardware: { name: 'Recessed Blackened Brass Hardware', material: 'hand-patinated architectural brass' }
      }
    },
    midcentury: {
      name: 'Mid-Century Modern Salon',
      lighting: 'warm directional gallery spotlights and sculptural brass floor lamp casting ambient shadows',
      items: {
        seating: { name: 'Curved Sculptural Salon Sofa', material: 'rich Italian mohair velvet' },
        rug: { name: 'Hand-Tufted Geometric Carpet', material: 'high-density New Zealand wool' },
        joinery: { name: 'Honduran Walnut Credenza', material: 'fluted dark walnut with satin sheen' },
        walls: { name: 'Warm Taupe Mineral Plaster', material: 'textured architectural plaster with timber slats' },
        lighting: { name: 'Fluted Amber Glass Pendants', material: 'mouth-blown amber art glass' },
        ceramics: { name: 'Volcanic Ash Stoneware Vessels', material: 'reactive matte volcanic glaze' },
        hardware: { name: 'Unlacquered Satin Brass Pulls', material: 'heavy solid brass with living patina' }
      }
    },
    cafe: {
      name: 'Wabi-Sabi Boutique Cafe',
      lighting: 'golden hour sun streaming through large floor-to-ceiling iron-framed windows',
      items: {
        seating: { name: 'Curved Banquette Bench Seating', material: 'washed organic linen canvas' },
        rug: { name: 'Woven Flatweave Jute Runner', material: 'artisan hand-braided natural fiber' },
        joinery: { name: 'Reclaimed Chestnut Timber Bar Counter', material: 'hand-hewn century-old Japanese timber' },
        walls: { name: 'Earthy Clay Plaster Walls', material: 'hand-troweled clay with fine straw flecks' },
        lighting: { name: 'Terracotta Downlight Pendants', material: 'unglazed terracotta with warm 2400K filament' },
        ceramics: { name: 'Oribe and Bizen Ceramic Tableware', material: 'traditional wood-fired stoneware' },
        hardware: { name: 'Hand-Forged Wrought Iron Hardware', material: 'blacksmith-hammered matte iron' }
      }
    },
    brutalist: {
      name: 'Warm Brutalist Creative Studio',
      lighting: 'diffuse skylight illumination balanced with warm minimalist architectural LED strip lighting',
      items: {
        seating: { name: 'Monolithic Low Modular Sofa', material: 'heavy slubbed Belgian linen' },
        rug: { name: 'Dense Felted Wool Acoustic Carpet', material: 'monolithic charcoal felted wool' },
        joinery: { name: 'Smoked European Oak Plinth Table', material: 'fumed solid oak with satin finish' },
        walls: { name: 'Board-Formed Concrete Walls', material: 'smooth architectural concrete with wood grain' },
        lighting: { name: 'Concealed Linear Grazing Lights', material: 'low-glare 2700K recessed architectural cove' },
        ceramics: { name: 'Sculptural Raw Basalt Stone Vessels', material: 'carved volcanic basalt stone' },
        hardware: { name: 'Bead-Blasted Titanium Aluminum Pulls', material: 'anodized matte architectural metal' }
      }
    }
  };

  const p = interiorProfiles[style] || interiorProfiles.japandi;

  const cSeating = combo.colors[map[0]];
  const cRug = combo.colors[map[1]];
  const cJoinery = combo.colors[map[2]];
  const cWalls = combo.colors[map[3]];
  const cLighting = combo.colors[map[4]];
  const cCeramics = combo.colors[map[5]];
  const cHardware = combo.colors[map[6]];

  const spatialBreakdown = `7-plane architectural material specification: Primary seating volume (${p.items.seating.name} in ${cSeating.name_en} ${cSeating.hex}, ${p.items.seating.material}), floor textiles (${p.items.rug.name} in ${cRug.name_en} ${cRug.hex}, ${p.items.rug.material}), architectural joinery (${p.items.joinery.name} in ${cJoinery.name_en} ${cJoinery.hex}), wall envelope (${p.items.walls.name} in ${cWalls.hex}, ${p.items.walls.material}), ambient lighting (${p.items.lighting.name} in ${cLighting.hex}), sculptural vessels (${p.items.ceramics.name} in ${cCeramics.hex}), and hardware details (${p.items.hardware.name} in ${cHardware.hex})`;

  const midjourney = `Architectural interior photography of a luxurious ${p.name} space designed with complete 7-plane architectural harmony based on Sanzo Wada color harmony #${combo.id} (${combo.name_en}). ${spatialBreakdown}. ${p.lighting}. Shot on 24mm tilt-shift architectural lens, Architectural Digest editorial quality, hyper-realistic materiality, cinematic depth --ar 16:9 --style raw --v 6.1`;

  const flux = `High-end architectural interior photography of a complete 7-plane ${p.name} living space inspired by 1930s Japanese color theory (Wada Sanzo #${combo.id} - ${combo.name_en}). ${spatialBreakdown}. Natural sunlight, realistic shadow falloff, rich tactile material textures, tranquil atmosphere.`;

  const gemini = `Photorealistic architectural rendering of an interior room in ${p.name} style featuring Sanzo Wada's 7-plane color combination #${combo.id} (${combo.name_en}). Spatial plane allocation: Focal seating (${p.items.seating.name}) in ${cSeating.name_en} ${cSeating.hex}, Floor textiles (${p.items.rug.name}) in ${cRug.name_en} ${cRug.hex}, Joinery (${p.items.joinery.name}) in ${cJoinery.name_en} ${cJoinery.hex}, Walls in ${cWalls.hex}, Lighting in ${cLighting.hex}, Ceramics in ${cCeramics.hex}, Hardware in ${cHardware.hex}. Atmosphere: ${p.lighting}. Realistic Global Illumination, 8k resolution, Hasselblad medium format camera aesthetic.`;

  const dalle = `A wide-angle photograph of an impeccably designed 7-plane ${p.name} interior space based on Sanzo Wada's palette #${combo.id} (${combo.name_en}). The room features ${p.items.seating.name} in ${cSeating.name_en} (${cSeating.hex}) as the focal point, complemented by ${p.items.rug.name} in ${cRug.name_en} (${cRug.hex}), joinery in ${cJoinery.hex}, walls in ${cWalls.hex}, and accents in ${p.items.ceramics.name} (${cCeramics.hex}). Beautiful natural light streams in, highlighting the rich textures and serene Japanese design harmony.`;

  return { profile: p, midjourney, flux, gemini, dalle };
}

function handlePrompt(args) {
  let comboId = 165;
  const comboIdx = args.indexOf('--combo');
  if (comboIdx !== -1 && args[comboIdx + 1]) {
    comboId = parseInt(args[comboIdx + 1], 10);
  }

  let domain = 'fashion';
  const domainIdx = args.indexOf('--domain');
  if (domainIdx !== -1 && args[domainIdx + 1]) {
    domain = args[domainIdx + 1].toLowerCase();
  }

  let style = domain === 'fashion' ? 'minimalist' : 'japandi';
  const styleIdx = args.indexOf('--style');
  if (styleIdx !== -1 && args[styleIdx + 1]) {
    style = args[styleIdx + 1].toLowerCase();
  }

  const combo = combos[comboId - 1] || combos[0];
  console.log(`\n🌸 Generative AI Image Prompts: Wada Sanzo #${combo.id} (${combo.name_jp} / ${combo.name_en})`);
  console.log(`   Domain: ${domain.toUpperCase()} | Style: ${style}\n`);

  if (domain === 'fashion') {
    const res = generateFashionPrompts(combo, style);
    console.log(`📸 [Midjourney v6.1]:\n${res.midjourney}\n`);
    console.log(`⚡ [Flux.1]:\n${res.flux}\n`);
    console.log(`🔮 [Gemini Imagen 3]:\n${res.gemini}\n`);
    console.log(`🧠 [ChatGPT / DALL-E 3]:\n${res.dalle}\n`);
  } else if (domain === 'interior') {
    const res = generateInteriorPrompts(combo, style);
    console.log(`📸 [Midjourney v6.1]:\n${res.midjourney}\n`);
    console.log(`⚡ [Flux.1]:\n${res.flux}\n`);
    console.log(`🔮 [Gemini Imagen 3]:\n${res.gemini}\n`);
    console.log(`🧠 [ChatGPT / DALL-E 3]:\n${res.dalle}\n`);
  } else {
    console.log(`Act as an expert UI designer. Style a modern web app using Wada Sanzo palette #${combo.id} (${combo.colors.map(c => c.hex + ' ' + c.name_en).join(', ')}).`);
  }
}

function handleGenerate(args) {
  let comboId = null;
  const comboIdx = args.indexOf('--combo');
  if (comboIdx !== -1 && args[comboIdx + 1]) {
    comboId = parseInt(args[comboIdx + 1], 10);
  }

  const colorIdx = args.indexOf('--color');
  if (colorIdx !== -1 && args[colorIdx + 1]) {
    const targetHex = args[colorIdx + 1].trim();
    if (/^#[0-9a-fA-F]{6}$/i.test(targetHex)) {
      const targetLab = hexToLab(targetHex);
      const rankedColors = colors.map(c => ({ ...c, deltaE: deltaE(targetLab, c.lab) })).sort((a, b) => a.deltaE - b.deltaE);
      const topPigment = rankedColors[0];
      const match = combos.find(c => c.colors.some(col => col.id === topPigment.id));
      if (match) comboId = match.id;
    }
  }

  let domain = 'ui';
  const domainIdx = args.indexOf('--domain');
  if (domainIdx !== -1 && args[domainIdx + 1]) {
    domain = args[domainIdx + 1].toLowerCase();
  }

  if (!comboId || comboId < 1 || comboId > 348) {
    console.error('Usage: wada-colors generate --combo <id> [--domain ui|fashion|interior] [--out <file>]');
    return;
  }

  const combo = combos[comboId - 1];

  let style = domain === 'fashion' ? 'minimalist' : domain === 'interior' ? 'japandi' : 'modern';
  const styleIdx = args.indexOf('--style');
  if (styleIdx !== -1 && args[styleIdx + 1]) {
    style = args[styleIdx + 1].toLowerCase();
  }

  let appName = domain === 'fashion' ? 'Autumn / Winter Collection' : domain === 'interior' ? 'Minimalist Living Room' : 'Application';
  const nameIdx = args.indexOf('--name');
  if (nameIdx !== -1 && args[nameIdx + 1]) {
    appName = args[nameIdx + 1].trim();
  }

  let outFile = domain === 'fashion' ? 'lookbook.md' : domain === 'interior' ? 'interior-spec.md' : 'design.md';
  const outIdx = args.indexOf('--out');
  if (outIdx !== -1 && args[outIdx + 1]) {
    outFile = args[outIdx + 1].trim();
  }

  if (domain === 'fashion') {
    const tplPath = path.join(ROOT_DIR, 'templates', 'fashion-lookbook-template.md');
    let tpl = fs.readFileSync(tplPath, 'utf8');
    const prompts = generateFashionPrompts(combo, style);

    const garmentRows = combo.colors.map((col, idx) => {
      const layer = idx === 0 ? 'Outerwear (Coat / Jacket)' : idx === 1 ? 'Mid-layer (Knit / Top)' : idx === 2 ? 'Bottoms (Trousers / Skirt)' : 'Accessories & Footwear';
      const mat = idx === 0 ? 'Heavy boiled wool / raw silk' : idx === 1 ? 'Cashmere / ribbed cotton' : idx === 2 ? 'Wool gabardine / linen twill' : 'Polished calfskin / canvas';
      return `| ${layer} | ${col.name_jp} (${col.name_romaji}) / ${col.name_en} | \`${col.hex}\` | ${mat} | Anchor focal silhouette |`;
    }).join('\n');

    tpl = tpl
      .replace(/\{\{COLLECTION_NAME\}\}/g, appName)
      .replace(/\{\{WADA_ID\}\}/g, combo.id)
      .replace(/\{\{WADA_NAME_JP\}\}/g, combo.name_jp)
      .replace(/\{\{WADA_NAME_ROMAJI\}\}/g, combo.name_romaji)
      .replace(/\{\{WADA_NAME_EN\}\}/g, combo.name_en)
      .replace(/\{\{FASHION_STYLE\}\}/g, prompts.profile.name)
      .replace(/\{\{FASHION_GENRE\}\}/g, prompts.profile.genre)
      .replace(/\{\{FASHION_GARMENT_ROWS\}\}/g, garmentRows)
      .replace(/\{\{MODEL_SILHOUETTE\}\}/g, prompts.profile.posture)
      .replace(/\{\{FOOTWEAR_SPEC\}\}/g, prompts.profile.c4Garment)
      .replace(/\{\{JEWELRY_SPEC\}\}/g, 'Minimalist architectural jewelry in brushed silver or matte gold')
      .replace(/\{\{BACKDROP_SPEC\}\}/g, prompts.profile.backdrop)
      .replace(/\{\{LIGHTING_SPEC\}\}/g, 'Soft directional natural morning light with gentle studio fill')
      .replace(/\{\{PROMPT_MIDJOURNEY\}\}/g, prompts.midjourney)
      .replace(/\{\{PROMPT_FLUX\}\}/g, prompts.flux)
      .replace(/\{\{PROMPT_GEMINI\}\}/g, prompts.gemini)
      .replace(/\{\{PROMPT_DALLE\}\}/g, prompts.dalle)
      .replace(/\{\{WADA_HEX_LIST\}\}/g, combo.colors.map(c => c.hex).join(', '));

    fs.writeFileSync(path.resolve(process.cwd(), outFile), tpl, 'utf8');
    console.log(`\n✨ Successfully generated Fashion Lookbook: ${outFile}`);
    console.log(`   Based on Sanzo Wada Combination #${combo.id}: ${combo.name_jp} (${combo.name_en})\n`);
    return;
  }

  if (domain === 'interior') {
    const tplPath = path.join(ROOT_DIR, 'templates', 'interior-spec-template.md');
    let tpl = fs.readFileSync(tplPath, 'utf8');
    const prompts = generateInteriorPrompts(combo, style);

    const elementRows = combo.colors.map((col, idx) => {
      const elem = idx === 0 ? 'Primary Seating / Sofa Anchor' : idx === 1 ? 'Textiles & Area Rug' : idx === 2 ? 'Accent Seating & Drapery' : 'Ceramics & Lighting Decor';
      const finish = idx === 0 ? 'Linen bouclé / velvet upholstery' : idx === 1 ? 'Hand-spun wool / natural dye' : idx === 2 ? 'Linen sheers / fluted timber' : 'Raw clay / brushed brass';
      return `| ${elem} | ${col.name_jp} (${col.name_romaji}) / ${col.name_en} | \`${col.hex}\` | ${finish} | Spatial focal anchor |`;
    }).join('\n');

    tpl = tpl
      .replace(/\{\{SPACE_NAME\}\}/g, appName)
      .replace(/\{\{WADA_ID\}\}/g, combo.id)
      .replace(/\{\{WADA_NAME_JP\}\}/g, combo.name_jp)
      .replace(/\{\{WADA_NAME_ROMAJI\}\}/g, combo.name_romaji)
      .replace(/\{\{WADA_NAME_EN\}\}/g, combo.name_en)
      .replace(/\{\{SPATIAL_ARCHETYPE\}\}/g, prompts.profile.name)
      .replace(/\{\{INTERIOR_ELEMENT_ROWS\}\}/g, elementRows)
      .replace(/\{\{WALL_FINISH_SPEC\}\}/g, prompts.profile.walls)
      .replace(/\{\{FLOORING_SPEC\}\}/g, prompts.profile.flooring)
      .replace(/\{\{FURNITURE_SPEC\}\}/g, prompts.profile.c1Element)
      .replace(/\{\{TEXTILES_SPEC\}\}/g, prompts.profile.c2Element)
      .replace(/\{\{LIGHTING_PLAN_SPEC\}\}/g, prompts.profile.lighting)
      .replace(/\{\{ACCENTS_SPEC\}\}/g, `${prompts.profile.c3Element}, ${prompts.profile.c4Element}`)
      .replace(/\{\{PROMPT_MIDJOURNEY\}\}/g, prompts.midjourney)
      .replace(/\{\{PROMPT_FLUX\}\}/g, prompts.flux)
      .replace(/\{\{PROMPT_GEMINI\}\}/g, prompts.gemini)
      .replace(/\{\{PROMPT_DALLE\}\}/g, prompts.dalle);

    fs.writeFileSync(path.resolve(process.cwd(), outFile), tpl, 'utf8');
    console.log(`\n✨ Successfully generated Interior Specification: ${outFile}`);
    console.log(`   Based on Sanzo Wada Combination #${combo.id}: ${combo.name_jp} (${combo.name_en})\n`);
    return;
  }

  // Default: UI/UX (design.md)
  const templatePath = path.join(ROOT_DIR, 'templates', 'design-md-template.md');
  let tpl = fs.readFileSync(templatePath, 'utf8');

  // Build rows
  const colorRows = combo.colors.map((col, idx) => {
    const role = idx === 0 ? 'Brand Primary / Action' : idx === 1 ? 'Secondary Accent / Badges' : idx === 2 ? 'Surface Highlight / Pills' : 'Tag Indicator';
    return `| \`--wada-${idx + 1}\` | ${col.name_jp} (${col.name_romaji}) / ${col.name_en} | \`${col.hex}\` | RGB(${col.rgb.join(', ')}) | ${role} |`;
  }).join('\n');

  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];

  const lum1 = (0.2126 * c1.rgb[0] + 0.7152 * c1.rgb[1] + 0.0722 * c1.rgb[2]) / 255;
  const primaryBtnText = lum1 > 0.4 ? '#111314' : '#ffffff';

  const contrastRows = combo.colors.map(col => {
    const wCont = combo.contrast.against_white.find(x => x.hex === col.hex);
    const bCont = combo.contrast.against_black.find(x => x.hex === col.hex);
    return `| ${col.name_en} on Canvas | \`${col.hex}\` | Light / Dark Canvas | Light: ${wCont ? wCont.contrast : 'N/A'}:1 \\| Dark: ${bCont ? bCont.contrast : 'N/A'}:1 | Verified |`;
  }).join('\n');

  const cssVars = combo.colors.map((col, idx) => {
    const role = idx === 0 ? 'primary' : idx === 1 ? 'secondary' : idx === 2 ? 'accent' : 'highlight';
    return `  --wada-${role}: ${col.hex}; /* ${col.name_jp} / ${col.name_en} */`;
  }).join('\n');

  const tw4 = combo.colors.map((col, idx) => {
    const role = idx === 0 ? 'primary' : idx === 1 ? 'secondary' : idx === 2 ? 'accent' : 'highlight';
    return `  --color-wada-${role}: ${col.hex};`;
  }).join('\n');

  const tw3 = combo.colors.map((col, idx) => {
    const role = idx === 0 ? 'primary' : idx === 1 ? 'secondary' : idx === 2 ? 'accent' : 'highlight';
    return `          '${role}': '${col.hex}',`;
  }).join('\n');

  tpl = tpl
    .replace(/\{\{APP_NAME\}\}/g, appName)
    .replace(/\{\{WADA_ID\}\}/g, combo.id)
    .replace(/\{\{WADA_NAME_JP\}\}/g, combo.name_jp)
    .replace(/\{\{WADA_NAME_ROMAJI\}\}/g, combo.name_romaji)
    .replace(/\{\{WADA_NAME_EN\}\}/g, combo.name_en)
    .replace(/\{\{WADA_MOOD\}\}/g, combo.tags.join(', '))
    .replace(/\{\{WADA_PHILOSOPHY\}\}/g, `A timeless 1930s Showa-era harmony balancing traditional Japanese elegance with modern interface hierarchy.`)
    .replace(/\{\{WADA_COLOR_ROWS\}\}/g, colorRows)
    .replace(/\{\{LIGHT_BG\}\}/g, '#fcfbf9')
    .replace(/\{\{LIGHT_SURFACE\}\}/g, '#ffffff')
    .replace(/\{\{LIGHT_BORDER\}\}/g, '#e5e7eb')
    .replace(/\{\{LIGHT_TEXT_PRIMARY\}\}/g, '#111314')
    .replace(/\{\{LIGHT_TEXT_MUTED\}\}/g, '#64748b')
    .replace(/\{\{DARK_BG\}\}/g, '#111314')
    .replace(/\{\{DARK_SURFACE\}\}/g, '#1a1e24')
    .replace(/\{\{DARK_BORDER\}\}/g, '#2d3238')
    .replace(/\{\{DARK_TEXT_PRIMARY\}\}/g, '#f5f5f7')
    .replace(/\{\{DARK_TEXT_MUTED\}\}/g, '#94a3b8')
    .replace(/\{\{CONTRAST_ROWS\}\}/g, contrastRows)
    .replace(/\{\{COLOR_PRIMARY_HEX\}\}/g, c1.hex)
    .replace(/\{\{PRIMARY_BTN_TEXT\}\}/g, primaryBtnText)
    .replace(/\{\{COLOR_SECONDARY_HEX\}\}/g, c2.hex)
    .replace(/\{\{COLOR_ACCENT_HEX\}\}/g, c3.hex)
    .replace(/\{\{CSS_VARS_ROOT\}\}/g, cssVars)
    .replace(/\{\{TAILWIND_V4_TOKENS\}\}/g, tw4)
    .replace(/\{\{TAILWIND_V3_TOKENS\}\}/g, tw3);

  const destPath = path.resolve(process.cwd(), outFile);
  fs.writeFileSync(destPath, tpl, 'utf8');
  console.log(`\n✨ Successfully generated design system: ${outFile}`);
  console.log(`   Based on Sanzo Wada Combination #${combo.id}: ${combo.name_jp} (${combo.name_en})\n`);
}

async function handleApply(args) {
  let comboId = null;
  const comboIdx = args.indexOf('--combo');
  if (comboIdx !== -1 && args[comboIdx + 1]) {
    comboId = parseInt(args[comboIdx + 1], 10);
  }

  const colorIdx = args.indexOf('--color');
  if (colorIdx !== -1 && args[colorIdx + 1]) {
    const targetHex = args[colorIdx + 1].trim();
    if (/^#[0-9a-fA-F]{6}$/i.test(targetHex)) {
      const targetLab = hexToLab(targetHex);
      const rankedColors = colors.map(c => ({ ...c, deltaE: deltaE(targetLab, c.lab) })).sort((a, b) => a.deltaE - b.deltaE);
      const topPigment = rankedColors[0];
      const match = combos.find(c => c.colors.some(col => col.id === topPigment.id));
      if (match) comboId = match.id;
    }
  }

  if (!comboId || comboId < 1 || comboId > 348) {
    comboId = 165; // Default signature palette
  }

  const combo = combos[comboId - 1];
  const dryRun = args.includes('--dry-run');
  const autoYes = args.includes('--yes') || args.includes('-y');

  let targetDir = process.cwd();
  const dirIdx = args.indexOf('--dir');
  if (dirIdx !== -1 && args[dirIdx + 1]) {
    targetDir = path.resolve(process.cwd(), args[dirIdx + 1]);
  }

  await runApplyTheme({ combo, cwd: targetDir, dryRun, autoYes });
}

function handleServe(args) {
  let port = 3333;
  const portIdx = args.indexOf('--port');
  if (portIdx !== -1 && args[portIdx + 1]) {
    port = parseInt(args[portIdx + 1], 10) || 3333;
  }

  const server = http.createServer((req, res) => {
    let p = path.join(ROOT_DIR, 'web', req.url === '/' ? 'index.html' : req.url.startsWith('/data/') ? '..' + req.url : req.url);
    if (req.url.startsWith('/data/')) p = path.join(ROOT_DIR, req.url);
    if (!fs.existsSync(p)) {
      res.writeHead(404);
      return res.end('Not Found');
    }
    const ext = path.extname(p);
    const ct = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.svg': 'image/svg+xml'
    }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': ct });
    fs.createReadStream(p).pipe(res);
  });

  server.listen(port, () => {
    console.log(`\n🌸 Wada Colors Gallery & Creative Studio running at:`);
    console.log(`   👉 http://localhost:${port}\n`);
    console.log(`Press Ctrl+C to stop.`);
  });
}

function printHelp() {
  console.log(`
🌸 Wada Colors CLI (和田三造 配色)
Universal AI Agent Skill for Sanzo Wada 1930s Color Combinations

Usage:
  npx wada-colors init [--agent <claude|cursor|antigravity|windsurf|roo|copilot|all>]
  npx wada-colors list [--size <2|3|4>]
  npx wada-colors search <query>
  npx wada-colors show <id (1-348)>
  npx wada-colors match --color "#HEX"
  npx wada-colors match --file <brand.json | logo.svg | theme.css>
  npx wada-colors prompt --combo <id> [--domain fashion|interior|ui] [--style <name>]
  npx wada-colors generate --combo <id> [--domain ui|fashion|interior] [--out <file>]
  npx wada-colors apply --combo <id> [--dry-run] [--yes] [--dir <path>]
  npx wada-colors serve [--port 3333]
  npx wada-colors help

Examples:
  npx wada-colors apply --combo 165 --dry-run
  npx wada-colors apply --combo 127 --yes
  npx wada-colors prompt --combo 165 --domain fashion --style minimalist
  npx wada-colors prompt --combo 121 --domain interior --style japandi
  npx wada-colors generate --combo 165 --domain fashion --out lookbook.md
  npx wada-colors generate --combo 121 --domain interior --out interior-spec.md
  npx wada-colors generate --combo 127 --name "ZenFlow SaaS"
`);
}

// Main dispatcher
const [, , cmd, ...rest] = process.argv;

switch (cmd) {
  case 'init':
  case 'install':
    handleInit(rest);
    break;
  case 'list':
    handleList(rest);
    break;
  case 'search':
    handleSearch(rest);
    break;
  case 'show':
    handleShow(rest);
    break;
  case 'match':
    handleMatch(rest);
    break;
  case 'generate':
    handleGenerate(rest);
    break;
  case 'prompt':
    handlePrompt(rest);
    break;
  case 'apply':
    handleApply(rest);
    break;
  case 'serve':
    handleServe(rest);
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    printHelp();
    break;
  default:
    console.error(`Unknown command: ${cmd}`);
    printHelp();
    process.exit(1);
}
