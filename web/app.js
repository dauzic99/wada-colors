/**
 * 🌸 Wada Colors Web Visualizer App
 */

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

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Application State
const state = {
  combinations: window.WADA_COMBINATIONS || [],
  colors: window.WADA_COLORS || [],
  filtered: [],
  selectedCombo: null,
  sizeFilter: 'all',
  moodFilter: 'all',
  searchQuery: '',
  brandTarget: null,
  mockupMode: 'light',
  exportTab: 'css'
};

// DOM Elements
const paletteGrid = document.getElementById('paletteGrid');
const resultsCount = document.getElementById('resultsCount');
const searchInput = document.getElementById('searchInput');
const brandColorPicker = document.getElementById('brandColorPicker');
const brandHexInput = document.getElementById('brandHexInput');
const btnMatch = document.getElementById('btnMatch');
const sizeTabs = document.querySelectorAll('.filter-tab');
const moodPills = document.querySelectorAll('.mood-pill');
const mockupCanvas = document.getElementById('mockupCanvas');
const mockupModeBtn = document.getElementById('mockupModeBtn');
const codeBox = document.getElementById('codeBox');
const btnCopyCode = document.getElementById('btnCopyCode');
const exportTabs = document.querySelectorAll('.export-tab');
const toast = document.getElementById('toast');
const siteThemeToggle = document.getElementById('siteThemeToggle');

// Initialize
function init() {
  state.filtered = [...state.combinations];
  state.selectedCombo = state.combinations[164] || state.combinations[0]; // Combination #165

  setupEventListeners();
  renderGrid();
  updateMockup();
  updateExportCode();
}

function setupEventListeners() {
  // Search
  searchInput.addEventListener('input', e => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    filterPalettes();
  });

  // Size Filter Tabs
  sizeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sizeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.sizeFilter = tab.dataset.size;
      filterPalettes();
    });
  });

  // Mood Filter Pills
  moodPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (pill.classList.contains('active')) {
        pill.classList.remove('active');
        state.moodFilter = 'all';
      } else {
        moodPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.moodFilter = pill.dataset.mood;
      }
      filterPalettes();
    });
  });

  // Brand Color Matcher
  brandColorPicker.addEventListener('input', e => {
    brandHexInput.value = e.target.value.toLowerCase();
  });

  brandHexInput.addEventListener('input', e => {
    const val = e.target.value;
    if (/^#[0-9a-f]{6}$/i.test(val)) {
      brandColorPicker.value = val;
    }
  });

  btnMatch.addEventListener('click', () => {
    const hex = brandHexInput.value.trim();
    if (!/^#[0-9a-f]{6}$/i.test(hex)) {
      showToast('Please enter a valid 6-digit hex (#RRGGBB)');
      return;
    }
    matchBrandColor(hex);
  });

  // Mockup Light / Dark mode toggle
  mockupModeBtn.addEventListener('click', () => {
    state.mockupMode = state.mockupMode === 'light' ? 'dark' : 'light';
    mockupCanvas.className = `mockup-canvas mode-${state.mockupMode}`;
    mockupModeBtn.innerHTML = state.mockupMode === 'light' ? '🌙 Dark Preview' : '☀️ Light Preview';
    updateMockup();
    updateExportCode();
  });

  // Export Tabs
  exportTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      exportTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.exportTab = tab.dataset.tab;
      updateExportCode();
    });
  });

  // Copy Code Button
  btnCopyCode.addEventListener('click', () => {
    navigator.clipboard.writeText(codeBox.textContent).then(() => {
      showToast('Copied to clipboard!');
    });
  });

  // Site Dark/Light theme toggle
  if (siteThemeToggle) {
    siteThemeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      siteThemeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }
}

// Brand Color Matcher Algorithm
function matchBrandColor(hex) {
  const targetLab = hexToLab(hex);

  // Compute Delta-E for all 159 pigments
  const rankedPigments = state.colors.map(c => {
    const dE = deltaE(targetLab, c.lab);
    return { id: c.id, deltaE: dE };
  }).sort((a, b) => a.deltaE - b.deltaE);

  const nearestPigmentId = rankedPigments[0].id;

  // Score combinations by minimum distance to target color
  const scored = state.combinations.map(combo => {
    const minDE = Math.min(...combo.colors.map(col => {
      const colLab = hexToLab(col.hex);
      return deltaE(targetLab, colLab);
    }));
    return { ...combo, brandDeltaE: minDE };
  });

  scored.sort((a, b) => a.brandDeltaE - b.brandDeltaE);
  state.filtered = scored;
  state.selectedCombo = state.filtered[0];

  showToast(`Matched nearest Wada pigment (ΔE: ${rankedPigments[0].deltaE.toFixed(1)})`);
  renderGrid();
  updateMockup();
  updateExportCode();
}

// Filter and Search Palettes
function filterPalettes() {
  state.filtered = state.combinations.filter(c => {
    // Size check
    if (state.sizeFilter !== 'all' && c.size !== parseInt(state.sizeFilter, 10)) {
      return false;
    }
    // Mood check
    if (state.moodFilter !== 'all') {
      const m = state.moodFilter.toLowerCase();
      const hasMood = c.tags.some(t => t.toLowerCase().includes(m)) ||
                      c.archetypes.some(a => a.toLowerCase().includes(m)) ||
                      c.temperature.toLowerCase() === m;
      if (!hasMood) return false;
    }
    // Search query
    if (state.searchQuery) {
      const q = state.searchQuery;
      const match = c.name_en.toLowerCase().includes(q) ||
                    c.name_jp.includes(q) ||
                    c.name_romaji.toLowerCase().includes(q) ||
                    c.id.toString() === q.replace('#', '') ||
                    c.tags.some(t => t.toLowerCase().includes(q)) ||
                    c.archetypes.some(a => a.toLowerCase().includes(q)) ||
                    c.colors.some(col => col.hex.toLowerCase().includes(q) || col.name_en.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  renderGrid();
}

// Render Palette Cards
function renderGrid() {
  paletteGrid.innerHTML = '';
  resultsCount.textContent = `Showing ${state.filtered.length} of ${state.combinations.length} combinations`;

  if (state.filtered.length === 0) {
    paletteGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No palettes found matching your criteria.</div>`;
    return;
  }

  state.filtered.forEach(combo => {
    const card = document.createElement('div');
    const isSelected = state.selectedCombo && state.selectedCombo.id === combo.id;
    card.className = `palette-card ${isSelected ? 'selected' : ''}`;
    card.dataset.id = combo.id;

    // Swatches HTML
    const swatchesHtml = combo.colors.map(col => `
      <div class="swatch-segment" style="background-color: ${col.hex};" title="${col.name_en} (${col.hex})"></div>
    `).join('');

    // Tags HTML
    const tagsHtml = combo.tags.slice(0, 3).map(t => `
      <span class="palette-tag-item">${t}</span>
    `).join('');

    card.innerHTML = `
      <div class="palette-card-header">
        <span class="palette-badge">#${String(combo.id).padStart(3, '0')}</span>
        <span class="palette-size-tag">${combo.size} colors</span>
      </div>
      <div class="swatch-bar">
        ${swatchesHtml}
      </div>
      <div class="palette-names">
        <div class="jp-title">${combo.name_jp}</div>
        <div class="en-title">${combo.name_en}</div>
      </div>
      <div class="palette-tags">
        ${tagsHtml}
      </div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedCombo = combo;
      updateMockup();
      updateExportCode();
    });

    paletteGrid.appendChild(card);
  });
}

// Update Live Interactive App Mockup
function updateMockup() {
  const combo = state.selectedCombo;
  if (!combo) return;

  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];
  const c4 = combo.colors[3] || combo.colors[1];

  // Luminance test for primary button text
  const lum1 = getLuminance(c1.rgb[0], c1.rgb[1], c1.rgb[2]);
  const btn1Text = lum1 > 0.4 ? '#111314' : '#ffffff';

  const lum2 = getLuminance(c2.rgb[0], c2.rgb[1], c2.rgb[2]);
  const btn2Text = lum2 > 0.4 ? '#111314' : '#ffffff';

  // Elements
  const appLogoBadge = document.getElementById('appLogoBadge');
  const appNavBtn = document.getElementById('appNavBtn');
  const appHeroPill = document.getElementById('appHeroPill');
  const appHeroTitle = document.getElementById('appHeroTitle');
  const appBtnPrimary = document.getElementById('appBtnPrimary');
  const appBtnSecondary = document.getElementById('appBtnSecondary');
  const appCard1 = document.getElementById('appCard1');
  const appCard2 = document.getElementById('appCard2');
  const appCardIcon1 = document.getElementById('appCardIcon1');
  const appCardIcon2 = document.getElementById('appCardIcon2');

  // Apply colors
  if (appLogoBadge) appLogoBadge.style.backgroundColor = c1.hex;
  if (appNavBtn) {
    appNavBtn.style.backgroundColor = c1.hex;
    appNavBtn.style.color = btn1Text;
  }
  if (appHeroPill) {
    appHeroPill.style.backgroundColor = `${c1.hex}22`;
    appHeroPill.style.color = c1.hex;
    appHeroPill.textContent = `Wada #${combo.id} • ${combo.temperature.toUpperCase()}`;
  }
  if (appHeroTitle) {
    appHeroTitle.innerHTML = `Harmonious Design <span style="color: ${c1.hex};">${combo.colors[0].name_en}</span>`;
  }
  if (appBtnPrimary) {
    appBtnPrimary.style.backgroundColor = c1.hex;
    appBtnPrimary.style.color = btn1Text;
  }
  if (appBtnSecondary) {
    appBtnSecondary.style.borderColor = `${c2.hex}66`;
    appBtnSecondary.style.color = c2.hex;
  }
  if (appCard1) {
    appCard1.style.borderTop = `3px solid ${c2.hex}`;
  }
  if (appCard2) {
    appCard2.style.borderTop = `3px solid ${c3.hex}`;
  }
  if (appCardIcon1) {
    appCardIcon1.style.backgroundColor = `${c2.hex}25`;
    appCardIcon1.style.border = `1px solid ${c2.hex}66`;
  }
  if (appCardIcon2) {
    appCardIcon2.style.backgroundColor = `${c3.hex}25`;
    appCardIcon2.style.border = `1px solid ${c3.hex}66`;
  }
}

// Update Export Code
function updateExportCode() {
  const combo = state.selectedCombo;
  if (!combo) return;

  let code = '';

  if (state.exportTab === 'css') {
    code = `:root {\n`;
    combo.colors.forEach((col, idx) => {
      const role = idx === 0 ? 'primary' : idx === 1 ? 'secondary' : idx === 2 ? 'accent' : 'highlight';
      code += `  --wada-${role}: ${col.hex}; /* ${col.name_jp} / ${col.name_en} */\n`;
    });
    code += `\n  /* Neutral Monochrome Bridge */\n`;
    code += `  --bg-canvas: #fcfbf9;\n`;
    code += `  --bg-surface: #ffffff;\n`;
    code += `  --text-primary: #111314;\n`;
    code += `  --text-muted: #64748b;\n`;
    code += `}\n\n`;
    code += `[data-theme='dark'] {\n`;
    code += `  --bg-canvas: #111314;\n`;
    code += `  --bg-surface: #1a1e24;\n`;
    code += `  --text-primary: #f5f5f7;\n`;
    code += `  --text-muted: #94a3b8;\n`;
    code += `}`;
  } else if (state.exportTab === 'tailwind') {
    code = `@theme {\n`;
    combo.colors.forEach((col, idx) => {
      const role = idx === 0 ? 'primary' : idx === 1 ? 'secondary' : idx === 2 ? 'accent' : 'highlight';
      code += `  --color-wada-${role}: ${col.hex};\n`;
    });
    code += `  --color-wada-canvas: #fcfbf9;\n`;
    code += `  --color-wada-ink: #111314;\n`;
    code += `}`;
  } else if (state.exportTab === 'design-md') {
    code = `## Wada Sanzo Combination #${combo.id}\n`;
    code += `**Japanese**: ${combo.name_jp} (${combo.name_romaji})\n`;
    code += `**English**: ${combo.name_en}\n\n`;
    code += `| Token | Wada Pigment | Hex | Role |\n|---|---|---|---|\n`;
    combo.colors.forEach((col, idx) => {
      const role = idx === 0 ? 'Brand Primary' : idx === 1 ? 'Secondary Accent' : idx === 2 ? 'Surface Highlight' : 'Tag Badge';
      code += `| \`--wada-${idx + 1}\` | ${col.name_jp} / ${col.name_en} | \`${col.hex}\` | ${role} |\n`;
    });
    code += `\n> Strict preservation rule: Never desaturate or alter authentic Wada hex codes.`;
  } else if (state.exportTab === 'prompt') {
    code = `Act as an expert UI/UX designer. Style this application using Wada Sanzo's historical 1930s combination #${combo.id} (${combo.name_en}):\n`;
    combo.colors.forEach((col, idx) => {
      code += `- Color ${idx + 1}: ${col.hex} (${col.name_en} / ${col.name_jp})\n`;
    });
    code += `Strictly preserve these exact Wada hex values for brand and action tokens, and bridge with neutral washi white (#fcfbf9) and deep carbon (#111314) to guarantee WCAG AA/AAA compliance. Output the design system in design.md.`;
  }

  codeBox.textContent = code;
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Start
document.addEventListener('DOMContentLoaded', init);
