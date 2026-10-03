#!/usr/bin/env node

/**
 * 🌸 Wada Colors CLI (和田三造 配色)
 * Universal AI Agent Skill installer and Sanzo Wada color harmony engine.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
  npx wada-colors help

Examples:
  npx wada-colors init --agent cursor
  npx wada-colors search "editorial"
  npx wada-colors show 165
  npx wada-colors match --color "#2A6F97"
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
