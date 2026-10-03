/**
 * 🌸 Wada Colors Autonomous Theming Engine
 * Automatically scans project architecture, injects tokens, and refactors components
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Color Math helpers
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

// Common Tailwind utility colors approximation table
const TAILWIND_HEX_MAP = {
  'blue-600': '#2563eb', 'blue-500': '#3b82f6', 'blue-700': '#1d4ed8',
  'indigo-600': '#4f46e5', 'indigo-500': '#6366f1', 'indigo-700': '#4338ca',
  'sky-600': '#0284c7', 'sky-500': '#0ea5e9', 'sky-700': '#0369a1',
  'teal-600': '#0d9488', 'teal-500': '#14b8a6', 'teal-700': '#0f766e',
  'emerald-600': '#059669', 'emerald-500': '#10b981', 'emerald-700': '#047857',
  'green-600': '#16a34a', 'green-500': '#22c55e', 'green-700': '#15803d',
  'amber-600': '#d97706', 'amber-500': '#f59e0b', 'amber-700': '#b45309',
  'yellow-600': '#ca8a04', 'yellow-500': '#eab308', 'yellow-700': '#a16207',
  'orange-600': '#ea580c', 'orange-500': '#f97316', 'orange-700': '#c2410c',
  'red-600': '#dc2626', 'red-500': '#ef4444', 'red-700': '#b91c1c',
  'rose-600': '#e11d48', 'rose-500': '#f43f5e', 'rose-700': '#be123c',
  'purple-600': '#9333ea', 'purple-500': '#a855f7', 'purple-700': '#7e22ce',
  'violet-600': '#7c3aed', 'violet-500': '#8b5cf6', 'violet-700': '#6d28d9',
  'fuchsia-600': '#c026d3', 'fuchsia-500': '#d946ef', 'fuchsia-700': '#a21caf',
  'pink-600': '#db2777', 'pink-500': '#ec4899', 'pink-700': '#be185d'
};

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.svelte-kit',
  '.output', 'out', 'coverage', '.agents', '.gemini', '.cursor', '.windsurf',
  'data', 'scratch', 'web'
]);

const MARKUP_EXTENSIONS = new Set(['.html', '.jsx', '.tsx', '.vue', '.svelte', '.astro', '.php']);
const STYLE_EXTENSIONS = new Set(['.css', '.scss', '.sass', '.less']);

function findFiles(dir, files = { markup: [], styles: [], configs: [] }) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      findFiles(fullPath, files);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (entry.name.startsWith('tailwind.config.')) {
        files.configs.push(fullPath);
      } else if (STYLE_EXTENSIONS.has(ext)) {
        files.styles.push(fullPath);
      } else if (MARKUP_EXTENSIONS.has(ext)) {
        files.markup.push(fullPath);
      }
    }
  }

  return files;
}

// Detect occurrences in files
function scanOccurrences(fileList) {
  const twRegex = /\b(bg|text|border|ring|fill|stroke|from|to|via)-([a-z]+-[1-9]00)\b/g;
  const hexRegex = /#([0-9a-fA-F]{6})\b/g;

  const twCounts = {};
  const hexCounts = {};
  const fileDetails = [];

  for (const filePath of fileList) {
    const content = fs.readFileSync(filePath, 'utf8');
    let twMatches = [];
    let hexMatches = [];

    let m;
    while ((m = twRegex.exec(content)) !== null) {
      const full = m[0];
      const colorKey = m[2];
      twCounts[colorKey] = (twCounts[colorKey] || 0) + 1;
      twMatches.push({ match: full, colorKey });
    }

    while ((m = hexRegex.exec(content)) !== null) {
      const hex = m[0].toLowerCase();
      // Skip pure monochrome neutrals
      if (!['#ffffff', '#000000', '#fcfbf9', '#111314', '#1a1e24'].includes(hex)) {
        hexCounts[hex] = (hexCounts[hex] || 0) + 1;
        hexMatches.push(hex);
      }
    }

    if (twMatches.length > 0 || hexMatches.length > 0) {
      fileDetails.push({ filePath, twMatches, hexMatches, content });
    }
  }

  return { twCounts, hexCounts, fileDetails };
}

// Generate token block
function generateTokenSnippet(combo, framework) {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];
  const c4 = combo.colors[3] || combo.colors[1];

  if (framework === 'tailwind-v4') {
    return `/* Wada Sanzo Color Harmonies (#${combo.id}: ${combo.name_en}) */\n` +
      `@theme {\n` +
      `  --color-wada-primary: ${c1.hex};\n` +
      `  --color-wada-secondary: ${c2.hex};\n` +
      `  --color-wada-accent: ${c3.hex};\n` +
      (combo.colors.length > 3 ? `  --color-wada-highlight: ${c4.hex};\n` : '') +
      `  --color-wada-canvas: #fcfbf9;\n` +
      `  --color-wada-ink: #111314;\n` +
      `}\n`;
  }

  if (framework === 'tailwind-v3') {
    return `      // Wada Sanzo Color Palette (#${combo.id}: ${combo.name_en})\n` +
      `      wada: {\n` +
      `        primary: '${c1.hex}',\n` +
      `        secondary: '${c2.hex}',\n` +
      `        accent: '${c3.hex}',\n` +
      (combo.colors.length > 3 ? `        highlight: '${c4.hex}',\n` : '') +
      `        canvas: '#fcfbf9',\n` +
      `        ink: '#111314',\n` +
      `      },\n`;
  }

  return `/* Wada Sanzo Color Harmonies (#${combo.id}: ${combo.name_en}) */\n` +
    `:root {\n` +
    `  --wada-primary: ${c1.hex}; /* ${c1.name_jp} / ${c1.name_en} */\n` +
    `  --wada-secondary: ${c2.hex}; /* ${c2.name_jp} / ${c2.name_en} */\n` +
    `  --wada-accent: ${c3.hex}; /* ${c3.name_jp} / ${c3.name_en} */\n` +
    (combo.colors.length > 3 ? `  --wada-highlight: ${c4.hex}; /* ${c4.name_jp} */\n` : '') +
    `  --wada-canvas: #fcfbf9;\n` +
    `  --wada-ink: #111314;\n` +
    `}\n`;
}

// Autonomous apply execution
async function runApplyTheme(options) {
  const { combo, cwd = process.cwd(), dryRun = false, autoYes = false } = options;

  console.log(`\n🌸 Running Wada Colors Autonomous Theming Engine`);
  console.log(`   Applying Palette #${combo.id}: ${combo.name_jp} (${combo.name_en})`);
  console.log(`   Target Directory: ${cwd}`);
  if (dryRun) console.log(`   🔍 MODE: Dry-run preview (no files will be modified)\n`);

  // 1. Scan files
  const files = findFiles(cwd);
  const allScanFiles = [...files.styles, ...files.markup];
  console.log(`📂 Scanned ${allScanFiles.length} project files (${files.styles.length} styles, ${files.markup.length} markup/components).`);

  // 2. Scan occurrences
  const { twCounts, hexCounts, fileDetails } = scanOccurrences(allScanFiles);

  const topTw = Object.entries(twCounts).sort((a, b) => b[1] - a[1]);
  const topHex = Object.entries(hexCounts).sort((a, b) => b[1] - a[1]);

  console.log(`\n🎨 Discovered existing color patterns:`);
  if (topTw.length > 0) {
    console.log(`   Tailwind classes: ${topTw.slice(0, 5).map(([k, v]) => `${k} (${v}x)`).join(', ')}`);
  }
  if (topHex.length > 0) {
    console.log(`   Hardcoded hexes: ${topHex.slice(0, 5).map(([k, v]) => `${k} (${v}x)`).join(', ')}`);
  }
  if (topTw.length === 0 && topHex.length === 0) {
    console.log(`   No generic Tailwind utility colors or raw hexes found in components.`);
  }

  // 3. Determine Color Mappings
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];

  const mappings = {
    tailwind: {},
    hex: {}
  };

  // Assign primary Tailwind color (most frequent)
  if (topTw.length > 0) {
    mappings.tailwind[topTw[0][0]] = 'wada-primary';
  }
  if (topTw.length > 1) {
    mappings.tailwind[topTw[1][0]] = 'wada-secondary';
  }
  if (topTw.length > 2) {
    mappings.tailwind[topTw[2][0]] = 'wada-accent';
  }

  // Any remaining tailwind colors -> match via Delta-E
  const c1Lab = hexToLab(c1.hex);
  const c2Lab = hexToLab(c2.hex);
  const c3Lab = hexToLab(c3.hex);

  for (let i = 3; i < topTw.length; i++) {
    const key = topTw[i][0];
    const hex = TAILWIND_HEX_MAP[key];
    if (hex) {
      const lab = hexToLab(hex);
      const d1 = deltaE(lab, c1Lab);
      const d2 = deltaE(lab, c2Lab);
      const d3 = deltaE(lab, c3Lab);
      const min = Math.min(d1, d2, d3);
      mappings.tailwind[key] = min === d1 ? 'wada-primary' : min === d2 ? 'wada-secondary' : 'wada-accent';
    } else {
      mappings.tailwind[key] = 'wada-primary';
    }
  }

  // Map hexes
  for (const [hex] of topHex) {
    const lab = hexToLab(hex);
    const d1 = deltaE(lab, c1Lab);
    const d2 = deltaE(lab, c2Lab);
    const d3 = deltaE(lab, c3Lab);
    const min = Math.min(d1, d2, d3);
    mappings.hex[hex] = min === d1 ? c1.hex : min === d2 ? c2.hex : c3.hex;
  }

  console.log(`\n📋 Proposed Mapping to Wada Tokens:`);
  console.log(`   [Primary]   ${c1.hex} (${c1.name_en})`);
  Object.entries(mappings.tailwind).filter(([, v]) => v === 'wada-primary').forEach(([k]) => console.log(`     ↳ Tailwind: ${k} -> wada-primary`));
  Object.entries(mappings.hex).filter(([, v]) => v === c1.hex).forEach(([k]) => console.log(`     ↳ Hex: ${k} -> ${c1.hex}`));

  console.log(`   [Secondary] ${c2.hex} (${c2.name_en})`);
  Object.entries(mappings.tailwind).filter(([, v]) => v === 'wada-secondary').forEach(([k]) => console.log(`     ↳ Tailwind: ${k} -> wada-secondary`));
  Object.entries(mappings.hex).filter(([, v]) => v === c2.hex).forEach(([k]) => console.log(`     ↳ Hex: ${k} -> ${c2.hex}`));

  if (c3) {
    console.log(`   [Accent]    ${c3.hex} (${c3.name_en})`);
    Object.entries(mappings.tailwind).filter(([, v]) => v === 'wada-accent').forEach(([k]) => console.log(`     ↳ Tailwind: ${k} -> wada-accent`));
    Object.entries(mappings.hex).filter(([, v]) => v === c3.hex).forEach(([k]) => console.log(`     ↳ Hex: ${k} -> ${c3.hex}`));
  }

  // Interactive confirmation if not autoYes
  if (!autoYes && process.stdin.isTTY) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ans = await new Promise(res => rl.question('\nApply this mapping to your project? [Y/n]: ', a => {
      rl.close();
      res(a.trim().toLowerCase());
    }));
    if (ans === 'n' || ans === 'no') {
      console.log('Theming canceled.');
      return;
    }
  }

  // 4. Token Injection into Main Stylesheet
  let targetStyle = files.styles.find(f => /theme|global|index|style|app/i.test(path.basename(f))) || files.styles[0];
  let framework = 'vanilla';

  if (targetStyle) {
    const styleContent = fs.readFileSync(targetStyle, 'utf8');
    if (styleContent.includes('@import "tailwindcss"') || styleContent.includes('@theme')) {
      framework = 'tailwind-v4';
    }
  } else if (files.configs.length > 0) {
    framework = 'tailwind-v3';
  }

  const tokenSnippet = generateTokenSnippet(combo, framework);

  console.log(`\n💉 Token Injection Target:`);
  if (targetStyle) {
    console.log(`   File: ${path.relative(cwd, targetStyle)} (${framework})`);
  } else {
    targetStyle = path.join(cwd, 'src', 'theme.css');
    console.log(`   File: ${path.relative(cwd, targetStyle)} (New file, ${framework})`);
  }

  if (dryRun) {
    console.log(`\n[DRY-RUN] Would inject the following token block into ${path.basename(targetStyle)}:\n`);
    console.log(tokenSnippet);
  } else {
    let existingContent = fs.existsSync(targetStyle) ? fs.readFileSync(targetStyle, 'utf8') : '';
    if (existingContent.includes('--color-wada-primary') || existingContent.includes('--wada-primary')) {
      // Replace existing wada theme
      existingContent = existingContent.replace(/\/\* Wada Sanzo[\s\S]*?\}\n/g, '');
    }
    const updatedContent = tokenSnippet + '\n' + existingContent;
    const targetDir = path.dirname(targetStyle);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(targetStyle, updatedContent, 'utf8');
    console.log(`   ✅ Tokens successfully written to ${path.relative(cwd, targetStyle)}`);
  }

  // 5. Component Refactoring
  let totalReplacements = 0;
  const modifiedFiles = [];

  for (const item of fileDetails) {
    let newContent = item.content;
    let fileReplacements = 0;

    // Replace Tailwind classes
    for (const [oldClass, targetRole] of Object.entries(mappings.tailwind)) {
      const classRegex = new RegExp(`\\b(bg|text|border|ring|fill|stroke|from|to|via)-${oldClass}\\b`, 'g');
      newContent = newContent.replace(classRegex, (match, prefix) => {
        fileReplacements++;
        return `${prefix}-${targetRole}`;
      });
    }

    // Replace hardcoded hexes
    for (const [oldHex, targetHex] of Object.entries(mappings.hex)) {
      const hexRegex = new RegExp(oldHex, 'gi');
      newContent = newContent.replace(hexRegex, () => {
        fileReplacements++;
        return targetHex;
      });
    }

    if (fileReplacements > 0) {
      totalReplacements += fileReplacements;
      modifiedFiles.push({ path: item.filePath, count: fileReplacements });

      if (dryRun) {
        console.log(`   [DRY-RUN] ${path.relative(cwd, item.filePath)} (${fileReplacements} replacements proposed)`);
      } else {
        fs.writeFileSync(item.filePath, newContent, 'utf8');
        console.log(`   ✅ Refactored: ${path.relative(cwd, item.filePath)} (${fileReplacements} replacements)`);
      }
    }
  }

  console.log(`\n✨ Theming Complete!`);
  console.log(`   - Palette: #${combo.id} ${combo.name_jp} (${combo.name_en})`);
  console.log(`   - Modified Files: ${modifiedFiles.length}`);
  console.log(`   - Total Color Replacements: ${totalReplacements}`);
  if (dryRun) {
    console.log(`\n💡 Run again without --dry-run to commit these changes to your files.\n`);
  } else {
    console.log(`   - Next step: Run your dev server to see the harmonious Wada palette live!\n`);
  }
}

module.exports = {
  findFiles,
  scanOccurrences,
  runApplyTheme,
  generateTokenSnippet
};
