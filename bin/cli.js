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
    source: path.join(ROOT_DIR, 'adapters', 'claude', 'SKILL.md'),
    dest: path.join('.claude', 'skills', 'wada-colors', 'SKILL.md')
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
  const destPath = path.resolve(targetDir, adapter.dest);
  const destFolder = path.dirname(destPath);
  if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

  fs.copyFileSync(adapter.source, destPath);
  console.log(`✅ Installed [${adapter.name}] -> ${adapter.dest}`);
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

// Generative AI Prompt Builders
function generateFashionPrompts(combo, style = 'minimalist') {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];
  const c4 = combo.colors[3] || combo.colors[1];

  const styleProfiles = {
    minimalist: {
      name: 'High-End Minimalist Tailoring',
      genre: 'Luxury Contemporary / Lemaire aesthetic',
      c1Garment: 'structured double-breasted overcoat in heavy boiled wool',
      c2Garment: 'ribbed cashmere knit crewneck top',
      c3Garment: 'wide-leg pleated wool gabardine trousers',
      c4Garment: 'minimalist leather tote bag and polished leather loafers',
      backdrop: 'clean architectural brutalist concrete gallery in Tokyo, soft diffuse natural morning light',
      posture: 'tall elegant fashion model standing poised with relaxed shoulders'
    },
    neotrad: {
      name: 'Modern Japanese Neo-Trad',
      genre: 'Contemporary Haori & Kimono cuts',
      c1Garment: 'draped contemporary noragi haori jacket in heavy raw linen',
      c2Garment: 'collarless washed silk wrap blouse',
      c3Garment: 'tailored hakama-inspired wide pleated culottes',
      c4Garment: 'leather tabi footwear and woven canvas satchel',
      backdrop: 'serene Japanese architectural courtyard with weathered cedar timber and raked gravel',
      posture: 'fashion model with graceful sculptural posture in profile'
    },
    streetwear: {
      name: 'Tokyo Contemporary Streetwear',
      genre: 'Urban Techwear & Oversized Silhouette',
      c1Garment: 'oversized matte technical bomber jacket',
      c2Garment: 'heavyweight ribbed hoodie',
      c3Garment: 'relaxed modular cargo pants with subtle strap details',
      c4Garment: 'chunky technical trail sneakers and crossbody sling bag',
      backdrop: 'moody Shibuya alleyway at twilight, atmospheric mist and subtle neon reflections',
      posture: 'dynamic urban streetwear model with confident forward stride'
    },
    showa: {
      name: 'Classic 1930s Showa Vintage',
      genre: 'Sanzo Wada Oscar Homage / Historical Tailoring',
      c1Garment: 'authentic 1930s tailored wool trench coat with peak lapels',
      c2Garment: 'vintage silk crepe neckerchief and button-down dress shirt',
      c3Garment: 'high-waisted tailored wool trousers with deep pleats',
      c4Garment: 'vintage oxford brogues and leather travel bag',
      backdrop: 'nostalgic 1930s Tokyo art salon with dark wood paneling, warm incandescent amber lighting',
      posture: 'classic editorial model posed against vintage studio backdrop'
    }
  };

  const p = styleProfiles[style] || styleProfiles.minimalist;

  const midjourney = `Editorial fashion photography, full body portrait of a model wearing ${p.name}. Outer garment in ${c1.name_en} ${c1.hex} (${p.c1Garment}), inner layer in ${c2.name_en} ${c2.hex} (${p.c2Garment}), bottoms in ${c3.name_en} ${c3.hex} (${p.c3Garment}), accents in ${c4.name_en} ${c4.hex} (${p.c4Garment}). Set against ${p.backdrop}. Shot on 85mm f/1.4 lens, soft directional diffused studio lighting, Vogue editorial aesthetic, high tactile fabric texture --ar 3:4 --style raw --v 6.1`;

  const flux = `A high-fashion editorial photograph of a model in a sophisticated ${p.name} outfit styled with 1930s Japanese color theory (Wada Sanzo #${combo.id}). The model wears a ${c1.name_en} (${c1.hex}) ${p.c1Garment}, layered over a ${c2.name_en} (${c2.hex}) ${p.c2Garment}, paired with ${c3.name_en} (${c3.hex}) ${p.c3Garment}. Natural skin texture, realistic cloth drape, soft ambient lighting, ${p.backdrop}.`;

  const gemini = `Photorealistic fashion portrait of a fashion model styled in an elegant ${p.name} collection based on Sanzo Wada's color harmony #${combo.id} (${combo.name_en}). Garment breakdown: outer coat in exact ${c1.name_en} ${c1.hex}, mid-layer in ${c2.name_en} ${c2.hex}, trousers in ${c3.name_en} ${c3.hex}. Background: ${p.backdrop}. Soft studio shadows, Hasselblad camera quality, 8k resolution, authentic fabric weaves.`;

  const dalle = `A full-length fashion photograph featuring a model posing gracefully in a coordinated wardrobe inspired by Sanzo Wada's Japanese color palette #${combo.id}. The model is dressed in a ${c1.name_en} (${c1.hex}) ${p.c1Garment}, a ${c2.name_en} (${c2.hex}) ${p.c2Garment}, and ${c3.name_en} (${c3.hex}) ${p.c3Garment}. The background is ${p.backdrop} with soft natural light streaming from the side.`;

  return { profile: p, midjourney, flux, gemini, dalle };
}

function generateInteriorPrompts(combo, style = 'japandi') {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];
  const c4 = combo.colors[3] || combo.colors[1];

  const interiorProfiles = {
    japandi: {
      name: 'Japandi / Modern Ryokan',
      walls: 'warm washi textured lime plaster in soft off-white',
      c1Element: `low-slung modern lounge sofa upholstered in ${c1.name_en} (${c1.hex}) linen bouclé`,
      c2Element: `hand-woven area rug and linen drapery in ${c2.name_en} (${c2.hex})`,
      c3Element: `accent sculptural armchair and fluted ceramic vessels in ${c3.name_en} (${c3.hex})`,
      c4Element: `lacquered wood coffee table with raw clay ceramics in ${c4.name_en} (${c4.hex})`,
      lighting: 'soft diffuse morning sunlight filtering through shoji-style slatted oak blinds, warm 2700K ambient cove glow',
      flooring: 'matte white oak hardwood flooring'
    },
    midcentury: {
      name: 'Mid-Century Modern Salon',
      walls: 'rich warm taupe plaster with dark walnut architectural paneling',
      c1Element: `curved architectural velvet sofa in ${c1.name_en} (${c1.hex})`,
      c2Element: `pair of tailored lounge chairs in ${c2.name_en} (${c2.hex}) wool weave`,
      c3Element: `geometric wool tapestry and mouth-blown glass pendant in ${c3.name_en} (${c3.hex})`,
      c4Element: `decorative ceramic vases and marble side table in ${c4.name_en} (${c4.hex})`,
      lighting: 'warm directional gallery spotlights and sculptural brass floor lamp casting ambient shadows',
      flooring: 'herringbone walnut parquet flooring'
    },
    cafe: {
      name: 'Wabi-Sabi Boutique Cafe',
      walls: 'hand-troweled earthy clay plaster walls with natural imperfections',
      c1Element: `long curved banquette bench seating in ${c1.name_en} (${c1.hex}) washed canvas`,
      c2Element: `custom ceramic pendant lamps and glazed tile backsplash in ${c2.name_en} (${c2.hex})`,
      c3Element: `artisan linen table runners and stoneware tableware in ${c3.name_en} (${c3.hex})`,
      c4Element: `patinated steel accents and timber bar stools in ${c4.name_en} (${c4.hex})`,
      lighting: 'golden hour sun streaming through large floor-to-ceiling iron-framed windows',
      flooring: 'terrazzo floor with river stone aggregate'
    },
    brutalist: {
      name: 'Warm Brutalist Creative Studio',
      walls: 'smooth board-formed architectural concrete walls with exposed grain',
      c1Element: `monolithic deep-seated sectional sofa in ${c1.name_en} (${c1.hex}) heavy twill`,
      c2Element: `large acoustic felt wall panel and oversized wool rug in ${c2.name_en} (${c2.hex})`,
      c3Element: `sculptural powder-coated metal side tables and shelving in ${c3.name_en} (${c3.hex})`,
      c4Element: `industrial task lighting and large ceramic planter in ${c4.name_en} (${c4.hex})`,
      lighting: 'diffuse skylight illumination balanced with warm minimalist architectural LED strip lighting',
      flooring: 'polished industrial concrete flooring with satin sealer'
    }
  };

  const p = interiorProfiles[style] || interiorProfiles.japandi;

  const midjourney = `Architectural interior photography of a luxurious ${p.name} space designed with Sanzo Wada color harmony #${combo.id} (${combo.name_en}). Features ${p.c1Element}, ${p.c2Element}, and ${p.c3Element}. Walls in ${p.walls}, flooring in ${p.flooring}. ${p.lighting}. Shot on 24mm tilt-shift architectural lens, Architectural Digest editorial quality, hyper-realistic materiality, cinematic depth --ar 16:9 --style raw --v 6.1`;

  const flux = `High-end architectural interior photography of a ${p.name} living space inspired by 1930s Japanese color theory (Wada Sanzo #${combo.id}). Main centerpiece is a ${p.c1Element}, balanced with a ${p.c2Element}. Walls finished in ${p.walls}. Natural sunlight, realistic shadow falloff, tactile bouclé and linen textures, tranquil atmosphere.`;

  const gemini = `Photorealistic architectural rendering of an interior room in ${p.name} style featuring Sanzo Wada's color combination #${combo.id}. Exact color allocation: primary furniture in ${c1.name_en} ${c1.hex}, textiles and drapery in ${c2.name_en} ${c2.hex}, accents in ${c3.name_en} ${c3.hex}. Realistic Global Illumination, 8k resolution, Hasselblad medium format camera aesthetic.`;

  const dalle = `A wide-angle photograph of an impeccably designed ${p.name} interior space based on Sanzo Wada's palette #${combo.id}. The room features a ${p.c1Element} as the focal point, complemented by ${p.c2Element} and ${p.c3Element}. Beautiful natural light streams in, highlighting the rich textures and serene Japanese design harmony.`;

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
