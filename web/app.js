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
  exportTab: 'css',
  activeDomain: 'ui',
  fashionStyle: 'minimalist',
  interiorStyle: 'japandi'
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
const mockupTitle = document.getElementById('mockupTitle');
const codeBox = document.getElementById('codeBox');
const btnCopyCode = document.getElementById('btnCopyCode');
const exportTabs = document.querySelectorAll('.export-tab');
const toast = document.getElementById('toast');
const siteThemeToggle = document.getElementById('siteThemeToggle');
const domainBtns = document.querySelectorAll('.domain-btn');
const fashionStyleSelect = document.getElementById('fashionStyleSelect');
const interiorStyleSelect = document.getElementById('interiorStyleSelect');

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
  // Domain Switcher
  domainBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      domainBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeDomain = btn.dataset.domain;

      document.querySelectorAll('.domain-view').forEach(v => v.classList.remove('active'));
      if (state.activeDomain === 'ui') {
        document.getElementById('uiMockupView').classList.add('active');
        mockupTitle.textContent = 'Live App Preview (Recoloring Engine)';
      } else if (state.activeDomain === 'fashion') {
        document.getElementById('fashionMockupView').classList.add('active');
        mockupTitle.textContent = 'Fashion Lookbook Studio (Oscar 1954 Homage)';
      } else if (state.activeDomain === 'interior') {
        document.getElementById('interiorMockupView').classList.add('active');
        mockupTitle.textContent = 'Interior Design Studio (Spatial Harmony)';
      }

      updateMockup();
      updateExportCode();
    });
  });

  // Fashion & Interior Style Selectors
  if (fashionStyleSelect) {
    fashionStyleSelect.addEventListener('change', e => {
      state.fashionStyle = e.target.value;
      updateMockup();
      updateExportCode();
    });
  }

  if (interiorStyleSelect) {
    interiorStyleSelect.addEventListener('change', e => {
      state.interiorStyle = e.target.value;
      updateMockup();
      updateExportCode();
    });
  }

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

// Style Profiles for Fashion and Interior
const fashionProfiles = {
  minimalist: {
    name: 'High-End Minimalist Tailoring',
    genre: 'Luxury Contemporary / Lemaire aesthetic',
    c1Garment: 'structured double-breasted overcoat in heavy boiled wool',
    c2Garment: 'ribbed cashmere knit crewneck top',
    c3Garment: 'wide-leg pleated wool gabardine trousers',
    c4Garment: 'minimalist leather tote bag and polished leather loafers',
    coatDesc: 'Coat in Heavy Boiled Wool',
    topDesc: 'Cashmere Knit Crewneck',
    bottomDesc: 'Tailored Wool Trousers',
    backdrop: 'Clean architectural brutalist concrete gallery in Tokyo, soft diffuse natural morning light',
    posture: 'tall elegant fashion model standing poised with relaxed shoulders'
  },
  neotrad: {
    name: 'Modern Japanese Neo-Trad',
    genre: 'Contemporary Haori & Kimono cuts',
    c1Garment: 'draped contemporary noragi haori jacket in heavy raw linen',
    c2Garment: 'collarless washed silk wrap blouse',
    c3Garment: 'tailored hakama-inspired wide pleated culottes',
    c4Garment: 'leather tabi footwear and woven canvas satchel',
    coatDesc: 'Draped Noragi Haori Jacket',
    topDesc: 'Washed Silk Wrap Blouse',
    bottomDesc: 'Tailored Hakama Culottes',
    backdrop: 'Serene Japanese architectural courtyard with weathered cedar timber and raked gravel',
    posture: 'fashion model with graceful sculptural posture in profile'
  },
  streetwear: {
    name: 'Tokyo Contemporary Streetwear',
    genre: 'Urban Techwear & Oversized Silhouette',
    c1Garment: 'oversized matte technical bomber jacket',
    c2Garment: 'heavyweight ribbed hoodie',
    c3Garment: 'relaxed modular cargo pants with subtle strap details',
    c4Garment: 'chunky technical trail sneakers and crossbody sling bag',
    coatDesc: 'Oversized Matte Bomber',
    topDesc: 'Heavyweight Ribbed Hoodie',
    bottomDesc: 'Modular Relaxed Cargo Pants',
    backdrop: 'Moody Shibuya alleyway at twilight, atmospheric mist and subtle neon reflections',
    posture: 'dynamic urban streetwear model with confident forward stride'
  },
  showa: {
    name: 'Classic 1930s Showa Vintage',
    genre: 'Sanzo Wada Oscar Homage / Historical Tailoring',
    c1Garment: 'authentic 1930s tailored wool trench coat with peak lapels',
    c2Garment: 'vintage silk crepe neckerchief and button-down dress shirt',
    c3Garment: 'high-waisted tailored wool trousers with deep pleats',
    c4Garment: 'vintage oxford brogues and leather travel bag',
    coatDesc: '1930s Wool Trench Coat',
    topDesc: 'Silk Neckerchief & Dress Shirt',
    bottomDesc: 'High-Waisted Pleated Trousers',
    backdrop: 'Nostalgic 1930s Tokyo art salon with dark wood paneling, warm incandescent amber lighting',
    posture: 'classic editorial model posed against vintage studio backdrop'
  }
};

const interiorProfiles = {
  japandi: {
    name: 'Japandi / Modern Ryokan',
    sofaDesc: 'Modern Lounge Sofa in Linen Bouclé',
    rugDesc: 'Hand-Woven Wool Rug & Drapery',
    accentDesc: 'Sculptural Chair & Ceramic Vessels',
    c1Element: (c) => `low-slung modern lounge sofa upholstered in ${c.name_en} (${c.hex}) linen bouclé`,
    c2Element: (c) => `hand-woven area rug and linen drapery in ${c.name_en} (${c.hex})`,
    c3Element: (c) => `accent sculptural armchair and fluted ceramic vessels in ${c.name_en} (${c.hex})`,
    walls: 'warm washi textured lime plaster in soft off-white',
    lighting: 'Washi textured lime plaster, warm 2700K ambient cove glow, diffuse morning sunlight through slatted oak blinds',
    flooring: 'matte white oak hardwood flooring'
  },
  midcentury: {
    name: 'Mid-Century Modern Salon',
    sofaDesc: 'Curved Architectural Velvet Sofa',
    rugDesc: 'Tailored Wool Rug & Wall Drapery',
    accentDesc: 'Geometric Tapestry & Glass Vessel',
    c1Element: (c) => `curved architectural velvet sofa in ${c.name_en} (${c.hex})`,
    c2Element: (c) => `pair of tailored lounge chairs and woven rug in ${c.name_en} (${c.hex})`,
    c3Element: (c) => `geometric wool tapestry and mouth-blown glass pendant in ${c.name_en} (${c.hex})`,
    walls: 'rich warm taupe plaster with dark walnut architectural paneling',
    lighting: 'Warm taupe plaster, walnut paneling, directional gallery spotlights and sculptural brass floor lamp',
    flooring: 'herringbone walnut parquet flooring'
  },
  cafe: {
    name: 'Wabi-Sabi Boutique Cafe',
    sofaDesc: 'Curved Banquette in Washed Canvas',
    rugDesc: 'Glazed Tile Backsplash & Linens',
    accentDesc: 'Ceramic Tableware & Planters',
    c1Element: (c) => `long curved banquette bench seating in ${c.name_en} (${c.hex}) washed canvas`,
    c2Element: (c) => `custom ceramic pendant lamps and glazed tile backsplash in ${c.name_en} (${c.hex})`,
    c3Element: (c) => `artisan linen table runners and stoneware tableware in ${c.name_en} (${c.hex})`,
    walls: 'hand-troweled earthy clay plaster walls with natural imperfections',
    lighting: 'Hand-troweled clay plaster, golden hour sun streaming through iron-framed windows',
    flooring: 'terrazzo floor with river stone aggregate'
  },
  brutalist: {
    name: 'Warm Brutalist Creative Studio',
    sofaDesc: 'Monolithic Deep Sectional in Twill',
    rugDesc: 'Acoustic Felt Wall Panel & Rug',
    accentDesc: 'Powder-Coated Metal Shelving',
    c1Element: (c) => `monolithic deep-seated sectional sofa in ${c.name_en} (${c.hex}) heavy twill`,
    c2Element: (c) => `large acoustic felt wall panel and oversized wool rug in ${c.name_en} (${c.hex})`,
    c3Element: (c) => `sculptural powder-coated metal side tables and shelving in ${c.name_en} (${c.hex})`,
    walls: 'smooth board-formed architectural concrete walls with exposed grain',
    lighting: 'Board-formed concrete, diffuse skylight illumination balanced with architectural warm LED strips',
    flooring: 'polished industrial concrete flooring with satin sealer'
  }
};

function generateFashionPrompts(combo, styleKey) {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];
  const c4 = combo.colors[3] || combo.colors[1];
  const p = fashionProfiles[styleKey] || fashionProfiles.minimalist;

  return {
    midjourney: `Editorial fashion photography, full body portrait of a model wearing ${p.name}. Outer garment in ${c1.name_en} ${c1.hex} (${p.c1Garment}), inner layer in ${c2.name_en} ${c2.hex} (${p.c2Garment}), bottoms in ${c3.name_en} ${c3.hex} (${p.c3Garment}), accents in ${c4.name_en} ${c4.hex} (${p.c4Garment}). Set against ${p.backdrop}. Shot on 85mm f/1.4 lens, soft directional diffused studio lighting, Vogue editorial aesthetic, high tactile fabric texture --ar 3:4 --style raw --v 6.1`,
    flux: `A high-fashion editorial photograph of a model in a sophisticated ${p.name} outfit styled with 1930s Japanese color theory (Wada Sanzo #${combo.id}). The model wears a ${c1.name_en} (${c1.hex}) ${p.c1Garment}, layered over a ${c2.name_en} (${c2.hex}) ${p.c2Garment}, paired with ${c3.name_en} (${c3.hex}) ${p.c3Garment}. Natural skin texture, realistic cloth drape, soft ambient lighting, ${p.backdrop}.`,
    gemini: `Photorealistic fashion portrait of a fashion model styled in an elegant ${p.name} collection based on Sanzo Wada's color harmony #${combo.id} (${combo.name_en}). Garment breakdown: outer coat in exact ${c1.name_en} ${c1.hex}, mid-layer in ${c2.name_en} ${c2.hex}, trousers in ${c3.name_en} ${c3.hex}. Background: ${p.backdrop}. Soft studio shadows, Hasselblad camera quality, 8k resolution, authentic fabric weaves.`,
    dalle: `A full-length fashion photograph featuring a model posing gracefully in a coordinated wardrobe inspired by Sanzo Wada's Japanese color palette #${combo.id}. The model is dressed in a ${c1.name_en} (${c1.hex}) ${p.c1Garment}, a ${c2.name_en} (${c2.hex}) ${p.c2Garment}, and ${c3.name_en} (${c3.hex}) ${p.c3Garment}. The background is ${p.backdrop} with soft natural light streaming from the side.`
  };
}

function generateInteriorPrompts(combo, styleKey) {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];
  const c4 = combo.colors[3] || combo.colors[1];
  const p = interiorProfiles[styleKey] || interiorProfiles.japandi;

  const c1El = p.c1Element(c1);
  const c2El = p.c2Element(c2);
  const c3El = p.c3Element(c3);

  return {
    midjourney: `Architectural interior photography of a luxurious ${p.name} space designed with Sanzo Wada color harmony #${combo.id} (${combo.name_en}). Features ${c1El}, ${c2El}, and ${c3El}. Walls in ${p.walls}, flooring in ${p.flooring}. ${p.lighting}. Shot on 24mm tilt-shift architectural lens, Architectural Digest editorial quality, hyper-realistic materiality, cinematic depth --ar 16:9 --style raw --v 6.1`,
    flux: `High-end architectural interior photography of a ${p.name} living space inspired by 1930s Japanese color theory (Wada Sanzo #${combo.id}). Main centerpiece is ${c1El}, balanced with ${c2El}. Walls finished in ${p.walls}. Natural sunlight, realistic shadow falloff, tactile bouclé and linen textures, tranquil atmosphere.`,
    gemini: `Photorealistic architectural rendering of an interior room in ${p.name} style featuring Sanzo Wada's color combination #${combo.id}. Exact color allocation: primary furniture in ${c1.name_en} ${c1.hex}, textiles and drapery in ${c2.name_en} ${c2.hex}, accents in ${c3.name_en} ${c3.hex}. Realistic Global Illumination, 8k resolution, Hasselblad medium format camera aesthetic.`,
    dalle: `A wide-angle photograph of an impeccably designed ${p.name} interior space based on Sanzo Wada's palette #${combo.id}. The room features ${c1El} as the focal point, complemented by ${c2El} and ${c3El}. Beautiful natural light streams in, highlighting the rich textures and serene Japanese design harmony.`
  };
}

function generateUIPrompts(combo) {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];

  return {
    midjourney: `Clean modern web UI landing page mockup, minimalist design system, color palette inspired by Wada Sanzo combination #${combo.id} (${c1.name_en} ${c1.hex}, ${c2.name_en} ${c2.hex}, ${c3.name_en} ${c3.hex}). Crisp typography, glassmorphism cards, premium dark and light theme balance, Figma Dribbble Behance UI showcase, 8k resolution, UI design vector layout --ar 16:9 --style raw --v 6.1`,
    flux: `A high-resolution modern SaaS user interface dashboard, beautifully designed using historical Japanese color harmony (Wada Sanzo #${combo.id}). Primary accent in ${c1.name_en} (${c1.hex}), secondary interactive states in ${c2.name_en} (${c2.hex}), clean card surfaces, elegant typography, polished modern product design, studio lighting.`,
    gemini: `Photorealistic web design interface showcasing a responsive application styled with Wada Sanzo color combination #${combo.id} (${combo.name_en}). Color tokens: Primary brand ${c1.hex} (${c1.name_en}), Secondary ${c2.hex} (${c2.name_en}), Accent ${c3.hex} (${c3.name_en}). Pristine layout, micro-interactions, accessibility-focused WCAG AAA contrast, 8k UI/UX design.`,
    dalle: `A sleek and modern web application dashboard interface designed with Sanzo Wada's color harmony #${combo.id}. The design features ${c1.name_en} (${c1.hex}) as the primary action color, paired with ${c2.name_en} (${c2.hex}) and subtle neutral surfaces. Professional design agency showcase, clean grid, crisp vector UI elements.`
  };
}

// Update Fashion Lookbook Studio View
function updateFashionStudio(combo) {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];
  const p = fashionProfiles[state.fashionStyle] || fashionProfiles.minimalist;

  const coatSwatch = document.getElementById('coatSwatch');
  const coatName = document.getElementById('coatName');
  const topSwatch = document.getElementById('topSwatch');
  const topName = document.getElementById('topName');
  const bottomSwatch = document.getElementById('bottomSwatch');
  const bottomName = document.getElementById('bottomName');
  const fashionBackdropText = document.getElementById('fashionBackdropText');

  if (coatSwatch) coatSwatch.style.backgroundColor = c1.hex;
  if (coatName) coatName.textContent = `${p.coatDesc} (${c1.name_en} / ${c1.hex})`;

  if (topSwatch) topSwatch.style.backgroundColor = c2.hex;
  if (topName) topName.textContent = `${p.topDesc} (${c2.name_en} / ${c2.hex})`;

  if (bottomSwatch) bottomSwatch.style.backgroundColor = c3.hex;
  if (bottomName) bottomName.textContent = `${p.bottomDesc} (${c3.name_en} / ${c3.hex})`;

  if (fashionBackdropText) fashionBackdropText.textContent = p.backdrop;
}

// Update Interior Spatial Studio View
function updateInteriorStudio(combo) {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];
  const p = interiorProfiles[state.interiorStyle] || interiorProfiles.japandi;

  const sofaSwatch = document.getElementById('sofaSwatch');
  const sofaName = document.getElementById('sofaName');
  const rugSwatch = document.getElementById('rugSwatch');
  const rugName = document.getElementById('rugName');
  const accentSwatch = document.getElementById('accentSwatch');
  const interiorAccentName = document.getElementById('interiorAccentName');
  const interiorLightingText = document.getElementById('interiorLightingText');

  if (sofaSwatch) sofaSwatch.style.backgroundColor = c1.hex;
  if (sofaName) sofaName.textContent = `${p.sofaDesc} (${c1.name_en} / ${c1.hex})`;

  if (rugSwatch) rugSwatch.style.backgroundColor = c2.hex;
  if (rugName) rugName.textContent = `${p.rugDesc} (${c2.name_en} / ${c2.hex})`;

  if (accentSwatch) accentSwatch.style.backgroundColor = c3.hex;
  if (interiorAccentName) interiorAccentName.textContent = `${p.accentDesc} (${c3.name_en} / ${c3.hex})`;

  if (interiorLightingText) interiorLightingText.textContent = p.lighting;
}

// Update Live Interactive App Mockup
function updateUIMockup(combo) {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];

  // Luminance test for primary button text
  const lum1 = getLuminance(c1.rgb[0], c1.rgb[1], c1.rgb[2]);
  const btn1Text = lum1 > 0.4 ? '#111314' : '#ffffff';

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

// Master Update Mockup Router
function updateMockup() {
  const combo = state.selectedCombo;
  if (!combo) return;

  updateUIMockup(combo);
  updateFashionStudio(combo);
  updateInteriorStudio(combo);
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
  } else if (state.exportTab === 'midjourney') {
    if (state.activeDomain === 'fashion') {
      code = generateFashionPrompts(combo, state.fashionStyle).midjourney;
    } else if (state.activeDomain === 'interior') {
      code = generateInteriorPrompts(combo, state.interiorStyle).midjourney;
    } else {
      code = generateUIPrompts(combo).midjourney;
    }
  } else if (state.exportTab === 'flux') {
    if (state.activeDomain === 'fashion') {
      code = generateFashionPrompts(combo, state.fashionStyle).flux;
    } else if (state.activeDomain === 'interior') {
      code = generateInteriorPrompts(combo, state.interiorStyle).flux;
    } else {
      code = generateUIPrompts(combo).flux;
    }
  } else if (state.exportTab === 'gemini') {
    if (state.activeDomain === 'fashion') {
      code = generateFashionPrompts(combo, state.fashionStyle).gemini;
    } else if (state.activeDomain === 'interior') {
      code = generateInteriorPrompts(combo, state.interiorStyle).gemini;
    } else {
      code = generateUIPrompts(combo).gemini;
    }
  } else if (state.exportTab === 'dalle') {
    if (state.activeDomain === 'fashion') {
      code = generateFashionPrompts(combo, state.fashionStyle).dalle;
    } else if (state.activeDomain === 'interior') {
      code = generateInteriorPrompts(combo, state.interiorStyle).dalle;
    } else {
      code = generateUIPrompts(combo).dalle;
    }
  } else if (state.exportTab === 'design-md') {
    if (state.activeDomain === 'fashion') {
      const p = fashionProfiles[state.fashionStyle] || fashionProfiles.minimalist;
      code = `# Wada Sanzo Fashion Lookbook: #${combo.id} ${combo.name_en}\n\n`;
      code += `**Silhouette**: ${p.name} (${p.genre})\n`;
      code += `**Japanese**: ${combo.name_jp} (${combo.name_romaji})\n\n`;
      code += `| Garment Layer | Wada Pigment | Hex | Material & Cut |\n|---|---|---|---|\n`;
      combo.colors.forEach((col, idx) => {
        const layer = idx === 0 ? 'Outerwear' : idx === 1 ? 'Mid-Layer / Top' : idx === 2 ? 'Bottoms / Trousers' : 'Accessories';
        code += `| ${layer} | ${col.name_jp} / ${col.name_en} | \`${col.hex}\` | Authentic Wada 1930s tone |\n`;
      });
      code += `\n**Backdrop & Setting**: ${p.backdrop}\n`;
    } else if (state.activeDomain === 'interior') {
      const p = interiorProfiles[state.interiorStyle] || interiorProfiles.japandi;
      code = `# Wada Sanzo Spatial Interior Spec: #${combo.id} ${combo.name_en}\n\n`;
      code += `**Style Archetype**: ${p.name}\n`;
      code += `**Japanese**: ${combo.name_jp} (${combo.name_romaji})\n\n`;
      code += `| Spatial Plane | Wada Pigment | Hex | Material Finish |\n|---|---|---|---|\n`;
      combo.colors.forEach((col, idx) => {
        const plane = idx === 0 ? 'Focal Furniture' : idx === 1 ? 'Textiles & Rug' : idx === 2 ? 'Accent Elements' : 'Art & Vessels';
        code += `| ${plane} | ${col.name_jp} / ${col.name_en} | \`${col.hex}\` | Authentic Wada 1930s tone |\n`;
      });
      code += `\n**Lighting & Atmosphere**: ${p.lighting}\n`;
    } else {
      code = `## Wada Sanzo Combination #${combo.id}\n`;
      code += `**Japanese**: ${combo.name_jp} (${combo.name_romaji})\n`;
      code += `**English**: ${combo.name_en}\n\n`;
      code += `| Token | Wada Pigment | Hex | Role |\n|---|---|---|---|\n`;
      combo.colors.forEach((col, idx) => {
        const role = idx === 0 ? 'Brand Primary' : idx === 1 ? 'Secondary Accent' : idx === 2 ? 'Surface Highlight' : 'Tag Badge';
        code += `| \`--wada-${idx + 1}\` | ${col.name_jp} / ${col.name_en} | \`${col.hex}\` | ${role} |\n`;
      });
      code += `\n> Strict preservation rule: Never desaturate or alter authentic Wada hex codes.`;
    }
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
