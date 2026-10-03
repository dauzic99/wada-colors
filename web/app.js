/**
 * 🌸 Wada Colors Archival Web Visualizer App
 * Sanzo Wada (1930s) Haishoku Sōkan Japanese Color Harmony System
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

function calculateContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
}

function getContrastColor(hex) {
  const [r, g, b] = hexToRgb(hex);
  return getLuminance(r, g, b) > 0.45 ? '#111214' : '#ffffff';
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
  canvasThemeMode: 'light',
  exportTab: 'css',
  activeDomain: 'ui',
  fashionStyle: 'minimalist',
  interiorStyle: 'japandi'
};

// DOM References
const headerBrandSeal = document.getElementById('headerBrandSeal');
const mainControlsBar = document.getElementById('mainControlsBar');
const brandMatcherRow = document.getElementById('brandMatcherRow');
const paletteGrid = document.getElementById('paletteGrid');
const resultsCount = document.getElementById('resultsCount');
const btnResetFilters = document.getElementById('btnResetFilters');
const searchInput = document.getElementById('searchInput');
const brandColorPicker = document.getElementById('brandColorPicker');
const brandHexInput = document.getElementById('brandHexInput');
const brandPickerSwatch = document.getElementById('brandPickerSwatch');
const brandMatchBadge = document.getElementById('brandMatchBadge');
const btnMatch = document.getElementById('btnMatch');
const sizeTabs = document.querySelectorAll('.filter-tab');
const moodPills = document.querySelectorAll('.mood-pill');

// Floating Dock DOM
const floatingDock = document.getElementById('floatingDock');
const dockSwatches = document.getElementById('dockSwatches');
const dockIndexNum = document.getElementById('dockIndexNum');
const dockJpName = document.getElementById('dockJpName');
const dockEnName = document.getElementById('dockEnName');
const btnOpenStudio = document.getElementById('btnOpenStudio');
const btnOpenExport = document.getElementById('btnOpenExport');

// Modal DOM
const specimenModalOverlay = document.getElementById('specimenModalOverlay');
const modalDialogCard = document.getElementById('modalDialogCard');
const modalHeaderBar = document.getElementById('modalHeaderBar');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCloseModalFooter = document.getElementById('btnCloseModalFooter');
const modalIndex = document.getElementById('modalIndex');
const modalJpTitle = document.getElementById('modalJpTitle');
const modalEnTitle = document.getElementById('modalEnTitle');
const modalSwatchBadge = document.getElementById('modalSwatchBadge');
const modalStudioSection = document.getElementById('modalStudioSection');
const modalExportSection = document.getElementById('modalExportSection');

// Studio DOM Inside Modal
const mockupCanvas = document.getElementById('mockupCanvas');
const domainBtns = document.querySelectorAll('.domain-btn');
const canvasThemeBtns = document.querySelectorAll('.canvas-theme-btn');
const fashionDropdown = document.getElementById('fashionDropdown');
const fashionDropdownTrigger = document.getElementById('fashionDropdownTrigger');
const fashionDropdownLabel = document.getElementById('fashionDropdownLabel');
const fashionDropdownMenu = document.getElementById('fashionDropdownMenu');

const interiorDropdown = document.getElementById('interiorDropdown');
const interiorDropdownTrigger = document.getElementById('interiorDropdownTrigger');
const interiorDropdownLabel = document.getElementById('interiorDropdownLabel');
const interiorDropdownMenu = document.getElementById('interiorDropdownMenu');

const fashionSwatchboards = document.getElementById('fashionSwatchboards');
const fashionEnsembleGrid = document.getElementById('fashionEnsembleGrid');
const interiorSwatchboards = document.getElementById('interiorSwatchboards');
const interiorEnsembleGrid = document.getElementById('interiorEnsembleGrid');

// Export DOM Inside Modal
const codeBox = document.getElementById('codeBox');
const btnCopyCode = document.getElementById('btnCopyCode');
const copyBtnText = document.getElementById('copyBtnText');
const exportTabs = document.querySelectorAll('.export-tab');
const toast = document.getElementById('toast');
const siteThemeToggle = document.getElementById('siteThemeToggle');

// App Initialization
function init() {
  state.filtered = [...state.combinations];
  state.selectedCombo = state.combinations[164] || state.combinations[0]; // Combination #165
  state.canvasThemeMode = document.documentElement.getAttribute('data-theme') || 'dark';

  if (brandPickerSwatch && brandColorPicker) {
    brandPickerSwatch.style.backgroundColor = brandColorPicker.value;
  }

  setupEventListeners();
  initArchivalDropdowns();
  renderGrid();
  applyDynamicTheme(state.selectedCombo);
  updateFloatingDock(state.selectedCombo);
  updateMockup();
  updateExportCode();
}

/**
 * Dynamically recolor the website interface based on the active Wada selection
 */
function applyDynamicTheme(combo) {
  if (!combo || !combo.colors || !combo.colors.length) return;

  const c1 = combo.colors[0];
  const c2 = combo.colors[1] || combo.colors[0];
  const c3 = combo.colors[2] || combo.colors[0];

  const c1Text = getContrastColor(c1.hex);
  const c2Text = getContrastColor(c2.hex);

  const root = document.documentElement;

  // Set primary and secondary accents
  root.style.setProperty('--accent-wada', c1.hex);
  root.style.setProperty('--accent-wada-text', c1Text);
  root.style.setProperty('--accent-wada-secondary', c2.hex);
  root.style.setProperty('--accent-wada-secondary-text', c2Text);
  root.style.setProperty('--accent-wada-tertiary', c3.hex);
  root.style.setProperty('--accent-wada-subtle', `${c1.hex}14`);
  root.style.setProperty('--accent-wada-border', `${c1.hex}44`);

  // Update Header Seal
  if (headerBrandSeal) {
    headerBrandSeal.style.backgroundColor = c1.hex;
    headerBrandSeal.style.color = c1Text;
  }

  // Update Controls Bar border & background tint
  if (mainControlsBar) {
    mainControlsBar.style.borderColor = `${c1.hex}44`;
  }

  // Update Brand Matcher Row border tint
  if (brandMatcherRow) {
    brandMatcherRow.style.borderColor = `${c1.hex}36`;
  }

  // Update Floating Dock border tint
  if (floatingDock) {
    floatingDock.style.borderColor = `${c1.hex}44`;
  }

  if (btnOpenStudio) {
    btnOpenStudio.style.backgroundColor = c1.hex;
    btnOpenStudio.style.borderColor = c1.hex;
    btnOpenStudio.style.color = c1Text;
  }

  // Update Modal Dialog borders & atmospheric background wash
  if (modalDialogCard) {
    modalDialogCard.style.borderColor = `${c1.hex}48`;
  }

  if (modalHeaderBar) {
    modalHeaderBar.style.borderBottomColor = `${c1.hex}36`;
  }

  if (btnCopyCode) {
    btnCopyCode.style.backgroundColor = c1.hex;
    btnCopyCode.style.color = c1Text;
  }

  if (btnResetFilters) {
    btnResetFilters.style.borderColor = `${c1.hex}66`;
    btnResetFilters.style.color = c1.hex;
  }

  const calloutSealDot = document.querySelector('.callout-seal-dot');
  if (calloutSealDot) {
    calloutSealDot.style.backgroundColor = c1.hex;
    calloutSealDot.style.boxShadow = `0 0 6px ${c1.hex}`;
  }

  // Update active mood pill
  const activeMoodPill = document.querySelector('.mood-pill.active');
  if (activeMoodPill) {
    activeMoodPill.style.backgroundColor = c1.hex;
    activeMoodPill.style.borderColor = c1.hex;
    activeMoodPill.style.color = c1Text;
  }

  // Update active domain button
  const activeDomainBtn = document.querySelector('.domain-btn.active');
  if (activeDomainBtn) {
    activeDomainBtn.style.backgroundColor = c1.hex;
    activeDomainBtn.style.color = c1Text;
  }

  // Update active canvas theme button
  const activeCanvasThemeBtn = document.querySelector('.canvas-theme-btn.active');
  if (activeCanvasThemeBtn) {
    activeCanvasThemeBtn.style.backgroundColor = c1.hex;
    activeCanvasThemeBtn.style.color = c1Text;
  }
}

/**
 * Update the bottom floating dock with selected combination
 */
function updateFloatingDock(combo) {
  if (!combo) return;

  if (dockIndexNum) dockIndexNum.textContent = `#${String(combo.id).padStart(3, '0')}`;
  if (dockJpName) dockJpName.textContent = combo.name_jp;
  if (dockEnName) dockEnName.textContent = combo.name_en;

  if (dockSwatches) {
    dockSwatches.innerHTML = combo.colors.map(col => `
      <span class="dock-swatch-dot" style="background-color: ${col.hex};" title="${col.name_jp} / ${col.name_en} (${col.hex})"></span>
    `).join('');
  }

  // Also update modal header info
  if (modalIndex) modalIndex.textContent = `#${String(combo.id).padStart(3, '0')}`;
  if (modalJpTitle) modalJpTitle.textContent = combo.name_jp;
  if (modalEnTitle) modalEnTitle.textContent = `${combo.name_en} · ${combo.name_romaji}`;

  if (modalSwatchBadge) {
    modalSwatchBadge.innerHTML = combo.colors.map(col => `
      <span class="modal-swatch-seg" style="background-color: ${col.hex};" title="${col.name_en} (${col.hex})"></span>
    `).join('');
  }
}

function syncDomainView() {
  domainBtns.forEach(btn => {
    if (btn.dataset.domain === state.activeDomain) {
      btn.classList.add('active');
      btn.style.backgroundColor = 'var(--accent-wada)';
      btn.style.color = 'var(--accent-wada-text)';
    } else {
      btn.classList.remove('active');
      btn.style.backgroundColor = '';
      btn.style.color = '';
    }
  });

  const views = {
    ui: document.getElementById('uiMockupView'),
    fashion: document.getElementById('fashionMockupView'),
    interior: document.getElementById('interiorMockupView')
  };

  Object.entries(views).forEach(([dom, el]) => {
    if (!el) return;
    if (dom === state.activeDomain) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

function syncCanvasTheme() {
  canvasThemeBtns.forEach(btn => {
    if (btn.dataset.mode === state.canvasThemeMode) {
      btn.classList.add('active');
      btn.style.backgroundColor = 'var(--accent-wada)';
      btn.style.color = 'var(--accent-wada-text)';
    } else {
      btn.classList.remove('active');
      btn.style.backgroundColor = '';
      btn.style.color = '';
    }
  });

  if (mockupCanvas) {
    mockupCanvas.className = `mockup-canvas mode-${state.canvasThemeMode}`;
  }
}

/**
 * Modal Open & Close Management (Unified Single Sheet)
 */
function openModal(focusTarget = 'studio') {
  specimenModalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  syncDomainView();
  syncCanvasTheme();
  updateMockup();
  updateExportCode();

  if (focusTarget === 'export' && modalExportSection) {
    setTimeout(() => {
      modalExportSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else if (modalStudioSection) {
    const modalBody = document.getElementById('modalBodyContainer');
    if (modalBody) modalBody.scrollTop = 0;
  }
}

function closeModal() {
  specimenModalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function setupEventListeners() {
  // Modal Triggers from Floating Dock
  if (btnOpenStudio) {
    btnOpenStudio.addEventListener('click', () => openModal('studio'));
  }

  if (btnOpenExport) {
    btnOpenExport.addEventListener('click', () => openModal('export'));
  }

  // Modal Close Buttons (Top "✕" & Footer "Close Preview")
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
  }

  if (btnCloseModalFooter) {
    btnCloseModalFooter.addEventListener('click', closeModal);
  }

  if (specimenModalOverlay) {
    specimenModalOverlay.addEventListener('click', e => {
      if (e.target === specimenModalOverlay) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && specimenModalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Domain Switcher (Inside Studio Modal)
  domainBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeDomain = btn.dataset.domain;
      syncDomainView();
      updateMockup();
      updateExportCode();
    });
  });

  // Search Input
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

  // Mood Filter Horizon with Authenticated Taxonomy
  moodPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (pill.classList.contains('active')) {
        pill.classList.remove('active');
        pill.style.backgroundColor = '';
        pill.style.borderColor = '';
        pill.style.color = '';
        state.moodFilter = 'all';
      } else {
        moodPills.forEach(p => {
          p.classList.remove('active');
          p.style.backgroundColor = '';
          p.style.borderColor = '';
          p.style.color = '';
        });
        pill.classList.add('active');
        pill.style.backgroundColor = 'var(--accent-wada)';
        pill.style.borderColor = 'var(--accent-wada)';
        pill.style.color = 'var(--accent-wada-text)';
        state.moodFilter = pill.dataset.mood;
      }
      filterPalettes();
    });
  });

  // Brand Color Matcher
  brandColorPicker.addEventListener('input', e => {
    const hex = e.target.value.toUpperCase();
    brandHexInput.value = hex;
    if (brandPickerSwatch) brandPickerSwatch.style.backgroundColor = hex;
  });

  brandHexInput.addEventListener('input', e => {
    let val = e.target.value.trim();
    if (!val.startsWith('#') && /^[0-9a-f]{6}$/i.test(val)) {
      val = '#' + val;
    }
    if (/^#[0-9a-f]{6}$/i.test(val)) {
      val = val.toUpperCase();
      brandColorPicker.value = val;
      if (brandPickerSwatch) brandPickerSwatch.style.backgroundColor = val;
    }
  });

  btnMatch.addEventListener('click', () => {
    let hex = brandHexInput.value.trim();
    if (!hex.startsWith('#') && /^[0-9a-f]{6}$/i.test(hex)) hex = '#' + hex;
    if (!/^#[0-9a-f]{6}$/i.test(hex)) {
      showToast('Enter a valid 6-digit hex code (#RRGGBB)');
      return;
    }
    matchBrandColor(hex);
  });

  // Canvas Theme Switcher (Inside Studio Modal)
  canvasThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.canvasThemeMode = btn.dataset.mode;
      syncCanvasTheme();
      updateMockup();
    });
  });

  // Filter Reset Button
  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', resetFilters);
  }

  // Export Tabs inside Modal
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
      if (copyBtnText) copyBtnText.textContent = 'Copied!';
      showToast('Copied artifact to clipboard');
      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = 'Copy Artifact';
      }, 2000);
    });
  });

  // Site Dark/Light theme toggle
  if (siteThemeToggle) {
    siteThemeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      state.canvasThemeMode = next;
      syncCanvasTheme();
      updateMockup();
    });
  }
}

// Brand Color Matcher Algorithm
function matchBrandColor(hex) {
  const targetLab = hexToLab(hex);

  // Compute Delta-E for all 159 pigments
  const rankedPigments = state.colors.map(c => {
    const dE = deltaE(targetLab, c.lab);
    return { id: c.id, name_en: c.name_en, name_jp: c.name_jp, hex: c.hex, deltaE: dE };
  }).sort((a, b) => a.deltaE - b.deltaE);

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

  const bestPigment = rankedPigments[0];
  if (brandMatchBadge) {
    brandMatchBadge.style.display = 'inline-flex';
    brandMatchBadge.innerHTML = `
      <span>Nearest: <strong>${bestPigment.name_jp}</strong> (${bestPigment.name_en})</span>
      <span class="delta-score">ΔE ${bestPigment.deltaE.toFixed(1)}</span>
    `;
  }

  applyDynamicTheme(state.selectedCombo);
  updateFloatingDock(state.selectedCombo);
  showToast(`Matched Wada #${state.selectedCombo.id} via ${bestPigment.name_en} (ΔE: ${bestPigment.deltaE.toFixed(1)})`);
  renderGrid();
  updateResetButtonVisibility();
  updateMockup();
  updateExportCode();
}

// Filter and Search Palettes with Verified Mood Taxonomy
function filterPalettes() {
  state.filtered = state.combinations.filter(c => {
    // Size check
    if (state.sizeFilter !== 'all' && c.size !== parseInt(state.sizeFilter, 10)) {
      return false;
    }

    // Verified Mood check
    if (state.moodFilter !== 'all') {
      const m = state.moodFilter;
      let hasMood = false;

      if (m === 'wabi-sabi') {
        hasMood = c.tags.some(t => t.includes('wabi-sabi') || t.includes('grounded'));
      } else if (m === 'botanical') {
        hasMood = c.tags.some(t => t.includes('botanical') || t.includes('serene'));
      } else if (m === 'oceanic') {
        hasMood = c.tags.some(t => t.includes('oceanic') || t.includes('tranquil'));
      } else if (m === 'noble') {
        hasMood = c.tags.some(t => t.includes('noble') || t.includes('elegant') || t.includes('mystical'));
      } else if (m === 'nostalgic') {
        hasMood = c.tags.some(t => t.includes('nostalgic') || t.includes('showa-retro'));
      } else if (m === 'earthy') {
        hasMood = c.tags.some(t => t.includes('earthy'));
      } else if (m === 'warm') {
        hasMood = c.temperature === 'warm' || c.tags.includes('warm');
      } else if (m === 'cool') {
        hasMood = c.temperature === 'cool' || c.tags.includes('cool');
      } else if (m === 'balanced') {
        hasMood = c.temperature === 'balanced' || c.tags.includes('balanced');
      }

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
                    c.colors.some(col => col.hex.toLowerCase().includes(q) || col.name_en.toLowerCase().includes(q) || col.name_jp.includes(q));
      if (!match) return false;
    }
    return true;
  });

  renderGrid();
  updateResetButtonVisibility();
}

function updateResetButtonVisibility() {
  if (!btnResetFilters) return;
  const isFiltered = state.searchQuery !== '' ||
                     state.sizeFilter !== 'all' ||
                     state.moodFilter !== 'all' ||
                     (brandMatchBadge && brandMatchBadge.style.display !== 'none');
  btnResetFilters.style.display = isFiltered ? 'inline-flex' : 'none';
}

function resetFilters() {
  state.searchQuery = '';
  state.sizeFilter = 'all';
  state.moodFilter = 'all';
  if (searchInput) searchInput.value = '';

  sizeTabs.forEach(t => {
    if (t.dataset.size === 'all') {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  moodPills.forEach(p => {
    p.classList.remove('active');
    p.style.backgroundColor = '';
    p.style.borderColor = '';
    p.style.color = '';
  });

  if (brandMatchBadge) {
    brandMatchBadge.style.display = 'none';
    brandMatchBadge.innerHTML = '';
  }

  state.filtered = [...state.combinations];
  renderGrid();
  updateResetButtonVisibility();
  showToast('All filters reset (348 combinations)');
}

// Render Palette Cards (Archival Swatch-First Grid with In-Swatch Hover Hex & Copy)
function renderGrid() {
  paletteGrid.innerHTML = '';
  resultsCount.textContent = `${state.filtered.length} of ${state.combinations.length} combinations`;

  if (state.filtered.length === 0) {
    paletteGrid.innerHTML = `
      <div class="empty-state">
        <span class="empty-kanji">無</span>
        <p class="empty-title">No matching combinations</p>
        <p class="empty-desc">Try clearing your search query or relaxing mood filters.</p>
      </div>
    `;
    return;
  }

  state.filtered.forEach(combo => {
    const card = document.createElement('article');
    const isSelected = state.selectedCombo && state.selectedCombo.id === combo.id;
    card.className = `palette-card ${isSelected ? 'selected' : ''}`;
    card.dataset.id = combo.id;
    card.tabIndex = 0;

    // Swatches block with centered contrast-aware hover hex
    const swatchesHtml = combo.colors.map(col => {
      const contrastText = getContrastColor(col.hex);
      return `
        <div class="swatch-segment" style="background-color: ${col.hex};" data-hex="${col.hex}" title="Click to copy ${col.name_jp} / ${col.name_en} (${col.hex})">
          <span class="swatch-hover-hex" style="color: ${contrastText};">${col.hex}</span>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div class="card-swatch-canvas">
        <div class="swatch-strip">
          ${swatchesHtml}
        </div>
      </div>
      <div class="card-body">
        <div class="card-title-row">
          <h3 class="card-jp-title">${combo.name_jp}</h3>
          <span class="card-index-num">#${String(combo.id).padStart(3, '0')}</span>
        </div>
        <div class="card-subtitle-row">
          <span class="card-en-title">${combo.name_en}</span>
          <span class="card-romaji">${combo.name_romaji}</span>
        </div>
        <div class="card-footer-row">
          <span class="card-color-count">${combo.size} Colors · ${combo.temperature.toUpperCase()}</span>
          <button class="btn-card-inspect" title="Open Studio Specimen & Prompts">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6"></path>
              <path d="M10 14L21 3"></path>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            </svg>
            <span>Inspect</span>
          </button>
        </div>
      </div>
    `;

    // Swatch segment click to copy individual hex
    const swatchSegments = card.querySelectorAll('.swatch-segment');
    swatchSegments.forEach(seg => {
      seg.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering card selection/modal
        const hex = seg.dataset.hex;
        navigator.clipboard.writeText(hex).then(() => {
          showToast(`Copied ${hex} to clipboard`);
        });
      });
    });

    const selectCard = (openDialog = false) => {
      document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedCombo = combo;
      applyDynamicTheme(combo);
      updateFloatingDock(combo);
      updateMockup();
      updateExportCode();

      if (openDialog) {
        openModal('studio');
      }
    };

    // Selecting card recolors page and updates dock
    card.addEventListener('click', (e) => {
      const isInspectBtn = e.target.closest('.btn-card-inspect');
      selectCard(Boolean(isInspectBtn));
    });

    // Double clicking or keyboard enter opens modal directly
    card.addEventListener('dblclick', () => selectCard(true));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        selectCard(true);
      } else if (e.key === ' ') {
        e.preventDefault();
        selectCard(false);
      }
    });

    paletteGrid.appendChild(card);
  });
}

// Style Mappings and Profiles for Fashion Atelier & Spatial Interior
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

const fashionProfiles = {
  minimalist: {
    name: 'Minimalist Luxury Tailoring',
    sub: 'Lemaire & The Row Aesthetic',
    genre: 'Quiet Luxury / Sculptural Wool',
    backdrop: 'Clean architectural brutalist concrete gallery in Tokyo, soft diffuse natural morning light',
    swatchRoles: {
      2: ['Primary Overcoat & Tailoring', 'Under-Layer Knit & Leather Footwear'],
      3: ['Boiled Wool Overcoat', 'Cashmere Knit Crewneck', 'Pleated Gabardine Trousers'],
      4: ['Boiled Wool Overcoat', 'Cashmere Knit Crewneck', 'Pleated Gabardine Trousers', 'Calfskin Loafers & Leather Tote']
    },
    items: {
      outerwear: { name: 'Structured Double-Breasted Overcoat', material: 'Heavy boiled virgin wool with raw horn buttons' },
      shirt: { name: 'Ribbed Cashmere Knit Crewneck', material: 'Ultra-soft 12-gauge Mongolian cashmere' },
      bottoms: { name: 'Wide-Leg Pleated Trousers', material: 'Fluid high-twist wool gabardine with deep front pleats' },
      footwear: { name: 'Polished Leather Loafers', material: 'Smooth calfskin with Goodyear-welted stacked leather sole' },
      socks: { name: 'Fine-Gauge Mercerized Socks', material: 'Egyptian mako cotton knit' },
      bag: { name: 'Minimalist Unlined Tote', material: 'Vegetable-tanned full-grain bridle leather' },
      headwear: { name: 'Cashmere Ribbed Beanie', material: 'Folded cuff seamless Italian knit' }
    }
  },
  neotrad: {
    name: 'Modern Japanese Neo-Trad',
    sub: 'Visvim & Yohji Haori Cuts',
    genre: 'Contemporary Noragi & Kimono Drape',
    backdrop: 'Serene Japanese architectural courtyard with weathered cedar timber and raked gravel',
    swatchRoles: {
      2: ['Draped Noragi Haori & Culottes', 'Silk Wrap Blouse & Tabi Footwear'],
      3: ['Raw Linen Haori Jacket', 'Silk Wrap Blouse', 'Tailored Hakama Culottes'],
      4: ['Raw Linen Haori Jacket', 'Silk Wrap Blouse', 'Tailored Hakama Culottes', 'Tabi Leather Boots & Kurume Satchel']
    },
    items: {
      outerwear: { name: 'Draped Noragi Haori Jacket', material: 'Heavyweight organic raw slub linen with sashiko edge-stitch' },
      shirt: { name: 'Collarless Wrap Blouse', material: 'Sand-washed Habotai silk crepe' },
      bottoms: { name: 'Tailored Hakama Culottes', material: 'Crisp high-density ramie-cotton blend with origami pleating' },
      footwear: { name: 'Split-Toe Tabi Boots', material: 'Supple horsehide leather with rubber tread' },
      socks: { name: 'Japanese Tabi Cotton Socks', material: 'Traditional bifurcated toe ribbed knit' },
      bag: { name: 'Woven Kurume Kasuri Satchel', material: 'Handloom indigo-resist dyed cotton canvas' },
      headwear: { name: 'Foldable Tenugui Wrap Scarf', material: 'Hand-dyed artisanal lightweight gauze' }
    }
  },
  gorpcore: {
    name: 'Tokyo Technical Gorpcore',
    sub: 'And Wander & White Mountaineering',
    genre: 'Alpine Functionalism / Techwear',
    backdrop: 'Mount Fuji volcanic ridge trail at dawn, crisp morning mist and alpine rock textures',
    swatchRoles: {
      2: ['Cordura Weatherproof Shell', 'Thermal Mid-Layer & Trail Runners'],
      3: ['Weatherproof Hard-Shell', 'Grid-Fleece Mid-Layer', 'Articulated Climbing Pants'],
      4: ['Weatherproof Hard-Shell', 'Grid-Fleece Mid-Layer', 'Articulated Climbing Pants', 'Vibram Trail Runners & Dyneema Pack']
    },
    items: {
      outerwear: { name: '3-Layer Weatherproof Hard-Shell', material: 'Breathable Cordura ripstop with waterproof taped seams' },
      shirt: { name: 'Polartec Grid-Fleece Mid-Layer', material: 'Thermal regulating micro-fleece with half-zip collar' },
      bottoms: { name: 'Articulated Climbing Pants', material: 'Four-way stretch Schoeller nylon with integrated webbing belt' },
      footwear: { name: 'Lugged Trail Runner Boots', material: 'Vibram Megagrip outsole with quick-lace Kevlar upper' },
      socks: { name: 'Cushioned Merino Trail Socks', material: 'Reinforced heel and toe antimicrobial wool' },
      bag: { name: 'Dyneema Ultralight Crossbody', material: 'Waterproof composite fabric with magnetic Fidlock buckle' },
      headwear: { name: 'Technical Camp Cap', material: 'Water-repellent nylon with reflective rear paracord cinch' }
    }
  },
  avantgarde: {
    name: 'Tokyo Avant-Garde Deconstruction',
    sub: 'Comme des Garçons & Issey Miyake',
    genre: 'Architectural Asymmetry & Micro-Pleats',
    backdrop: 'Monochrome concrete atrium with sharp angular shadows and mirrored polished steel panels',
    swatchRoles: {
      2: ['Asymmetric Deconstructed Blazer', 'Pleated Architectural Tunic & Platforms'],
      3: ['Deconstructed Wool Blazer', 'Architectural Pleated Tunic', 'Sculptural Drop Trousers'],
      4: ['Deconstructed Wool Blazer', 'Pleated Architectural Tunic', 'Sculptural Drop Trousers', 'Square-Toe Derby Platforms & Leather Pouch']
    },
    items: {
      outerwear: { name: 'Deconstructed Asymmetric Blazer', material: 'Distressed raw-edge tropical wool with floating canvassing' },
      shirt: { name: 'Architectural Pleated Tunic', material: 'Heat-set micro-pleated technical polyester' },
      bottoms: { name: 'Sculptural Volume Drop Trousers', material: 'Bonded dense neoprene jersey with asymmetric hem' },
      footwear: { name: 'Derby Platforms with Chunky Welt', material: 'Patent box-calf leather with exaggerated squared toe' },
      socks: { name: 'Sheer Asymmetric Mesh Socks', material: 'High-twist nylon monofilament with diagonal seam' },
      bag: { name: 'Origami Folded Leather Pouch', material: 'Geometric tessellated lambskin' },
      headwear: { name: 'Structured Asymmetric Beret', material: 'Molded felted wool with sculptural crown indent' }
    }
  },
  showa: {
    name: '1930s Showa Vintage Dandyism',
    sub: 'Sanzo Wada Historical Tailoring',
    genre: 'Ginza Modern Boy & Classical Bespoke',
    backdrop: 'Nostalgic 1930s Tokyo art salon with dark wood paneling, warm incandescent amber lighting',
    swatchRoles: {
      2: ['1930s Double-Breasted Trench', 'Spearpoint Shirt & Oxford Brogues'],
      3: ['Covert Cloth Trench Coat', 'Spearpoint Dress Shirt', 'High-Rise Flannel Trousers'],
      4: ['Covert Cloth Trench Coat', 'Spearpoint Dress Shirt', 'High-Rise Flannel Trousers', 'Burnished Oxford Brogues & Gladstone Bag']
    },
    items: {
      outerwear: { name: 'Double-Breasted Wool Trench', material: 'Heavy British covert cloth with broad peak lapels' },
      shirt: { name: 'Spearpoint Collar Dress Shirt', material: 'Sea Island cotton poplin with French double cuffs' },
      bottoms: { name: 'High-Rise Forward-Pleat Trousers', material: 'Fine Yorkshire wool flannel with 2-inch cuffs' },
      footwear: { name: 'Full Oxford Brogues', material: 'Burnished antiqued calfskin with medallion toe cap' },
      socks: { name: 'Ribbed Silk Dress Socks', material: 'Fine-gauge Mulberry silk in classic over-the-calf cut' },
      bag: { name: 'Vintage Leather Gladstone Bag', material: 'Hand-stitched saddle leather with brass latch' },
      headwear: { name: 'Fur Felt Fedora Hat', material: 'Hand-blocked beaver felt with vintage grosgrain ribbon' }
    }
  },
  cityboy: {
    name: 'City Boy Relaxed Casual',
    sub: 'POPEYE Magazine Tokyo Lifestyle',
    genre: 'Oversized Ivy & Urban Skate Hybrid',
    backdrop: 'Sunny Yoyogi Park boulevard with ginkgo trees and vintage bicycle parked beside clean pavement',
    swatchRoles: {
      2: ['Oversized Balmacaan Coat', 'Heavyweight Oxford & Suede Wallabees'],
      3: ['Oversized Balmacaan Coat', 'Heavyweight Oxford Shirt', 'Relaxed Wide Chino Pants'],
      4: ['Oversized Balmacaan Coat', 'Heavyweight Oxford Shirt', 'Relaxed Wide Chino Pants', 'Suede Wallabee Boots & Kurashiki Canvas Tote']
    },
    items: {
      outerwear: { name: 'Oversized Balmacaan Coat', material: 'Water-resistant bonded cotton gabardine with raglan sleeves' },
      shirt: { name: 'Heavyweight Oxford Button-Down', material: 'Unwashed 6.5oz Japanese selvedge oxford cloth' },
      bottoms: { name: 'Relaxed Wide Chino Pants', material: 'High-density West Point twill with coin pocket detail' },
      footwear: { name: 'Classic Suede Wallabee Boots', material: 'Premium English suede with natural crepe sole' },
      socks: { name: 'Heavy Ribbed Athletic Crew Socks', material: 'Slub cotton knit with retro athletic stripe' },
      bag: { name: 'Over-Dyed Heavy Canvas Tote', material: '24oz Kurashiki cotton duck canvas with reinforced handles' },
      headwear: { name: 'Unstructured Cotton Bucket Hat', material: 'Washed chino twill with embroidered tonal eyelets' }
    }
  },
  darktechwear: {
    name: 'Harajuku Dark Techwear',
    sub: 'Undercover & Acronym Cyber-Aesthetic',
    genre: 'Modular Utilitarian & Tactical Fabrics',
    backdrop: 'Moody Shibuya alleyway at twilight, atmospheric mist and subtle neon reflections',
    swatchRoles: {
      2: ['Modular Gore-Tex Shell', 'Ergonomic Base & Tactical Zip Boots'],
      3: ['Modular Interops Jacket', 'Ergonomic Base Layer', 'Articulated Cargo Pants'],
      4: ['Modular Interops Jacket', 'Ergonomic Base Layer', 'Articulated Cargo Pants', 'Tactical Nubuck Boots & Cordura Sling Bag']
    },
    items: {
      outerwear: { name: 'Modular Interops Jacket', material: 'Gore-Tex Pro 3-layer with storm flap and gravity pockets' },
      shirt: { name: 'Seamless Ergonomic Base Layer', material: 'Compression Coolmax blend with articulated elbow panels' },
      bottoms: { name: 'Multi-Pocket Articulated Cargoes', material: 'Dryskin abrasion-resistant stretch twill with Fidlock cinch' },
      footwear: { name: 'Tactical Zip-Up Boots', material: 'Matte ballistic nylon and water-repellent nubuck' },
      socks: { name: 'Compression Tactical Socks', material: 'Graduated compression antimicrobial silver yarn' },
      bag: { name: 'MOLLE Modular Sling Bag', material: '1000D Cordura with aircraft-grade aluminum Cobra buckle' },
      headwear: { name: 'Storm Hood Balaclava Cap', material: 'Windproof technical fleece with magnetic fold-down veil' }
    }
  },
  zenlinen: {
    name: 'Zen Monastic Raw Linen',
    sub: 'Organic Unstructured Simplicity',
    genre: 'Natural Earth Pigments & Slub Weaves',
    backdrop: 'Kyoto stone garden with weathered bamboo fence and soft raked moss borders',
    swatchRoles: {
      2: ['Monastic Slub Linen Robe', 'Khadi Slub Shirt & Raffia Slides'],
      3: ['Monastic Raw Linen Robe', 'Khadi Grandad Shirt', 'Wide Drawstring Hemp Pants'],
      4: ['Monastic Raw Linen Robe', 'Khadi Grandad Shirt', 'Wide Drawstring Hemp Pants', 'Woven Raffia Slides & Knotted Market Sack']
    },
    items: {
      outerwear: { name: 'Unstructured Monastic Robe Coat', material: 'Pure natural European linen with enzyme wash slub texture' },
      shirt: { name: 'Grandad Collar Slub Shirt', material: 'Hand-spun organic khadi cotton' },
      bottoms: { name: 'Drawstring Wide-Leg Hemp Pants', material: 'Rustic organic hemp-linen weave with elasticized waist' },
      footwear: { name: 'Woven Raffia Minimal Slides', material: 'Natural vegetable-fiber upper with molded cork footbed' },
      socks: { name: 'Raw Organic Cotton Anklets', material: 'Undyed chemical-free knitted cotton' },
      bag: { name: 'Knotted Linen Market Sack', material: 'Heavy slub flax linen with hand-tied shoulder knot' },
      headwear: { name: 'Woven Straw Sunshade Hat', material: 'Hand-plaited Japanese paper straw' }
    }
  },
  boro: {
    name: 'Boro Heritage & Indigo Workwear',
    sub: 'Artisanal Sashiko & Tohoku Workwear',
    genre: 'Layered Patched Indigo & Selvedge Denim',
    backdrop: 'Rustic Japanese farmstead workshop with hand-hewn cedar benches and hanging indigo yarn skeins',
    swatchRoles: {
      2: ['Sashiko Patchwork Chore Jacket', 'Indigo Chambray & Roughout Boots'],
      3: ['Sashiko Chore Jacket', 'Indigo Chambray Workshirt', 'Selvedge Denim Trousers'],
      4: ['Sashiko Chore Jacket', 'Indigo Chambray Workshirt', 'Selvedge Denim Trousers', 'Roughout Service Boots & Canvas Haversack']
    },
    items: {
      outerwear: { name: 'Patchwork Sashiko Chore Jacket', material: 'Repurposed vintage indigo cotton with geometric sashiko hand-stitching' },
      shirt: { name: 'Natural Indigo Chambray Workshirt', material: '5oz shuttle-loomed Japanese selvedge chambray' },
      bottoms: { name: 'Distressed Selvedge Denim Trousers', material: '14oz Kurabo raw denim with repaired knee patches' },
      footwear: { name: 'Oiled Roughout Service Boots', material: 'Horween Chromexcel roughout leather with Commando sole' },
      socks: { name: 'Indigo-Dyed Slub Yarn Socks', material: 'Chunky low-tension knit botanically vat-dyed' },
      bag: { name: 'Repurposed Postbag Haversack', material: '1940s Japanese canvas mailbag with copper rivets' },
      headwear: { name: 'Sashiko Stitched Mechanic Cap', material: 'Patchwork indigo canvas with short pliable bill' }
    }
  },
  oscar: {
    name: '1954 Oscar Homage Couture',
    sub: 'Gate of Hell (地獄門) Grand Silk Costumes',
    genre: 'Imperial Court Brocades & Opulent Silks',
    backdrop: 'Heian-period palace veranda with red-lacquered pillars, vermilion silk draperies, gold leaf screen',
    swatchRoles: {
      2: ['Nishijin Gold Brocade Over-Wrap', 'Layered Habotai Slip & Lacquered Geta'],
      3: ['Nishijin Silk Brocade Wrap', 'Layered Habotai Silk Slip', 'Trailing Silk Palace Pants'],
      4: ['Nishijin Silk Brocade Wrap', 'Layered Habotai Silk Slip', 'Trailing Silk Palace Pants', 'Lacquered Geta & Silk Kinchaku Pouch']
    },
    items: {
      outerwear: { name: 'Imperial Silk Brocade Over-Wrap', material: 'Nishijin-ori silk jacquard woven with genuine gold leaf foil threads' },
      shirt: { name: 'Layered Silk Habotai Gown Slip', material: 'Fluid 16mm Japanese Habotai silk with raw draped cowl neckline' },
      bottoms: { name: 'Wide Trailing Silk Palace Pants', material: 'Heavy silk crepe-de-chine with pleated waistband' },
      footwear: { name: 'Lacquered Wooden Geta with Silk Straps', material: 'Black urushi-lacquered paulownia wood with velvet hanao' },
      socks: { name: 'Formal White Silk Tabi', material: 'Double-layered Habotai silk with hand-turned brass clasps' },
      bag: { name: 'Embroidered Silk Kinchaku Pouch', material: 'Gold thread peony embroidery with silk tassel drawstrings' },
      headwear: { name: 'Tortoiseshell & Gold Kanzashi Hairpin', material: 'Hand-carved polished resin with pure brass floral inlays' }
    }
  }
};

const interiorProfiles = {
  japandi: {
    name: 'Japandi / Modern Ryokan',
    sub: 'Minimal Warmth & Natural Textures',
    genre: 'Nordic Simplicity & Japanese Craft',
    lighting: 'Washi textured lime plaster, warm 2700K ambient cove glow, diffuse morning sunlight through slatted oak blinds',
    swatchRoles: {
      2: ['Linen Bouclé Lounge Sofa', 'Hand-Knotted Rug & Washi Lighting'],
      3: ['Linen Bouclé Lounge Sofa', 'Hand-Knotted Wool Rug', 'Hinoki Cedar Joinery & Stoneware'],
      4: ['Linen Bouclé Lounge Sofa', 'Hand-Knotted Wool Rug', 'Hinoki Cedar Floating Credenza', 'Akari Washi Lighting & Shigaraki Vessels']
    },
    items: {
      seating: { name: 'Low-Slung Curved Lounge Sofa', material: 'Textured linen-wool bouclé upholstery with solid white oak base' },
      rug: { name: 'Hand-Knotted Wool Area Rug', material: 'High-pile unbleached New Zealand wool with organic slub texture' },
      joinery: { name: 'Hinoki Cedar Floating Credenza', material: 'Quarter-sawn Japanese cypress with traditional mortise-and-tenon joints' },
      walls: { name: 'Washi Textured Lime Plaster', material: 'Hand-applied natural mineral plaster infused with mulberry washi fibers' },
      lighting: { name: 'Akari Rice Paper Pendant Cluster', material: 'Handcrafted mulberry bark washi shade over bamboo ribbing' },
      ceramics: { name: 'Shigaraki Unglazed Stoneware Vases', material: 'Coarse wood-fired clay with natural ash melt patterns' },
      hardware: { name: 'Brushed Satin Nickel Hardware', material: 'Low-luster champagne nickel with tactile knurling' }
    }
  },
  wabisabi: {
    name: 'Wabi-Sabi Tea Pavilion',
    sub: 'Earthen Patina & Unadorned Calm',
    genre: 'Sen no Rikyu Aesthetics & Clay Form',
    lighting: 'Hand-troweled clay walls, low tea-room charcoal brazier glow, diffused light through reed screen',
    swatchRoles: {
      2: ['Charred Yakisugi Bench & Table', 'Rush Tatami & Raku Ceramics'],
      3: ['Charred Yakisugi Low Bench', 'Rush Grass Tatami Matting', 'Live-Edge Keyaki Joinery'],
      4: ['Charred Yakisugi Low Bench', 'Rush Grass Tatami Matting', 'Live-Edge Keyaki Joinery', 'Black Iron Hearth & Raku Ceramics']
    },
    items: {
      seating: { name: 'Charred Yakisugi Low Bench', material: 'Torched Japanese cedar with wire-brushed carbon grain' },
      rug: { name: 'Natural Rush Tatami Matting', material: 'Hand-woven igusa rush grass with dark hemp border edging' },
      joinery: { name: 'Live-Edge Keyaki Tea Table', material: 'Single-slab Japanese zelkova with natural bark imperfections' },
      walls: { name: 'Juraku Earthen Clay Plaster', material: 'Traditional Kyoto soil plaster blended with fine straw chaff' },
      lighting: { name: 'Blackened Iron Hearth Sconce', material: 'Hand-forged wrought iron with soft flickering filament bulb' },
      ceramics: { name: 'Raku-Fired Chawan Tea Bowls', material: 'Hand-pinched earthenware with crackled black and red glaze' },
      hardware: { name: 'Hand-Forged Black Iron Pulls', material: 'Oxidized beeswax-sealed traditional smith hardware' }
    }
  },
  midcentury: {
    name: 'Mid-Century Kyoto Salon',
    sub: 'Curved Velvet & Walnut Millwork',
    genre: '1950s Architecture & Japanese Modern',
    lighting: 'Warm taupe plaster, walnut paneling, directional gallery spotlights and sculptural brass floor lamp',
    swatchRoles: {
      2: ['Curved Velvet Sectional', 'Cut-Pile Rug & Fluted Brass Lighting'],
      3: ['Curved Mohair Velvet Sectional', 'Tailored Cut-Pile Wool Rug', 'Fluted Walnut Joinery'],
      4: ['Curved Velvet Sectional', 'Tailored Cut-Pile Wool Rug', 'Fluted Walnut Joinery', 'Amber Glass Chandelier & Aged Brass']
    },
    items: {
      seating: { name: 'Curved Architectural Sectional', material: 'Plush mohair velvet upholstery with recessed walnut plinth' },
      rug: { name: 'Tailored Cut-Pile Wool Rug', material: 'Dense geometric wool carpet with hand-carved relief grooves' },
      joinery: { name: 'Dark Walnut Fluted Credenza', material: 'American black walnut with vertical tambour door slats' },
      walls: { name: 'Smoked Walnut Architectural Paneling', material: 'Book-matched walnut veneers paired with warm taupe matte paint' },
      lighting: { name: 'Mouth-Blown Fluted Glass Chandelier', material: 'Amber fluted borosilicate glass with solid spun brass fittings' },
      ceramics: { name: 'Mid-Century Studio Pottery Vessels', material: 'Matte reduction stoneware with organic modernist silhouette' },
      hardware: { name: 'Aged Patinated Brass Fixtures', material: 'Solid unlacquered architectural brass with living patina' }
    }
  },
  brutalist: {
    name: 'Warm Brutalist Concrete Atelier',
    sub: 'Board-Formed Mass & Raw Textures',
    genre: 'Tadao Ando Geometry & Monolithic Planes',
    lighting: 'Board-formed concrete, diffuse skylight illumination balanced with architectural warm LED slots',
    swatchRoles: {
      2: ['Monolithic Twill Sectional', 'Industrial Felt Rug & Steel Joinery'],
      3: ['Monolithic Twill Sectional', 'Textured Felt Area Rug', 'Cast Concrete & Steel Island'],
      4: ['Monolithic Twill Sectional', 'Textured Felt Area Rug', 'Cast Concrete & Steel Island', 'Basalt Vessels & Gunmetal Hardware']
    },
    items: {
      seating: { name: 'Monolithic Deep-Seated Sectional', material: 'Heavy basket-weave twill in architectural tailored block form' },
      rug: { name: 'Oversized Textured Felt Area Rug', material: 'Dense compressed industrial wool felt with bound edges' },
      joinery: { name: 'Cast Concrete & Blackened Steel Island', material: 'Polished micro-cement countertop over structural tube frame' },
      walls: { name: 'Board-Formed Architectural Concrete', material: 'Fair-faced reinforced concrete showing wood grain and tie-rod holes' },
      lighting: { name: 'Recessed Architectural Slot Lighting', material: 'Concealed 3000K high-CRI linear fixtures grazing wall surfaces' },
      ceramics: { name: 'Basalt Carved Architectural Vessels', material: 'Honed volcanic basalt stone hollowed into geometric cylinders' },
      hardware: { name: 'Gunmetal Acid-Etched Stainless Steel', material: 'PVD-coated industrial stainless steel with bead-blasted sheen' }
    }
  },
  scandizen: {
    name: 'Scandi-Japanese Minimal Loft',
    sub: 'Pale Ash Timber & Serene Air',
    genre: 'Light Oak, Paper Cord & Clean Air',
    lighting: 'Diffuse Scandinavian north light through sheer linen curtains, warm diffuse paper orbs',
    swatchRoles: {
      2: ['Ash Daybed & Dayroom Seating', 'Flatweave Rug & Folded Paper Pendant'],
      3: ['Ash Frame Daybed & Sofa', 'Braided Jute & Hemp Flatweave', 'Slatted Ash Wood Joinery'],
      4: ['Ash Frame Daybed & Sofa', 'Braided Jute Flatweave', 'Slatted Ash Joinery', 'Paper Shade Pendant & Matte Porcelain']
    },
    items: {
      seating: { name: 'Low Profile Oak Daybed & Sofa', material: 'Solid European ash frame with textured wool-cotton blend cushions' },
      rug: { name: 'Braided Jute & Hemp Flatweave', material: 'Natural vegetable fiber woven in circular interlocking coils' },
      joinery: { name: 'Slatted Ash Wood Room Dividers', material: 'Vertical pale ash louvers filtering natural daylight' },
      walls: { name: 'Ultra-Matte Chalk White Wash', material: 'Breathable ecological mineral paint with zero-sheen chalky finish' },
      lighting: { name: 'Sculptural Danish Paper Shade Pendant', material: 'Hand-folded geometric white paper shade with fabric cord' },
      ceramics: { name: 'Matte Porcelain Tableware & Vessels', material: 'Raw unglazed exterior biscuit porcelain with glazed white interior' },
      hardware: { name: 'Matte White Powder-Coated Metal', material: 'Architectural aluminum with satin electrostatic powder coat' }
    }
  },
  kissaten: {
    name: 'Showa Retro Kissaten',
    sub: 'Tufted Leather & Vintage Coffee Parlor',
    genre: '1930s-1960s Nostalgic Coffee Salon',
    lighting: 'Dark mahogany paneling, stained glass ambient pendants, soft amber warm glow, cigarette haze vintage filter',
    swatchRoles: {
      2: ['Tufted Leather Kissaten Booths', 'Jacquard Runner & Amber Glass Pendants'],
      3: ['Tufted Leather Booths', 'Patterned Jacquard Runner', 'Carved Mahogany Counter & Wainscoting'],
      4: ['Tufted Leather Booths', 'Patterned Jacquard Runner', 'Carved Mahogany Counter', 'Amber Art Deco Pendants & Bone China']
    },
    items: {
      seating: { name: 'Deep Button-Tufted Leather Booths', material: 'Antiqued oxblood / cognac full-grain leather with brass nailhead trim' },
      rug: { name: 'Vintage Patterned Jacquard Runner', material: 'Traditional Showa floral-geometric dense woven velvet carpet' },
      joinery: { name: 'Carved Honduran Mahogany Counter', material: 'High-gloss lacquered solid mahogany with fluted brass footrail' },
      walls: { name: 'Rich Mahogany Wood Wainscoting', material: 'Dark stained raised-panel wood with vintage embossed wallpaper above' },
      lighting: { name: 'Fluted Amber Art Deco Pendants', material: 'Ribbed amber carnival glass with braided dark fabric suspension cords' },
      ceramics: { name: 'Noritake Porcelain Coffee Service', material: 'Fine bone china with gilded edge lines and floral crests' },
      hardware: { name: 'Antique Cast Brass Hooks & Rails', material: 'Heavy cast brass with age-worn bronze patina' }
    }
  },
  zengarden: {
    name: 'Modern Zen Garden Residence',
    sub: 'Raked Stone Court & Basalt Plinths',
    genre: 'Blurring Indoor Sanctuary & Nature',
    lighting: 'Floor-to-ceiling frameless glazing, garden spotlighting on bonsai pine, low indirect perimeter floor cove',
    swatchRoles: {
      2: ['Sunken Lounge Platform Pit', 'Charcoal Walls & In-Floor Uplights'],
      3: ['Sunken Lounge Platform Pit', 'Raked Stone Interior Border', 'Smoked Oak Floating Joinery'],
      4: ['Sunken Lounge Platform Pit', 'Raked Stone Field Accent', 'Smoked Oak Tea Table', 'Bizen Ceramic Planters & Black Hardware']
    },
    items: {
      seating: { name: 'Platform Sunken Lounge Pit', material: 'Integrated floor-level seating with linen cushions over tatami core' },
      rug: { name: 'Organic Raked Sand & Stone Field', material: 'Indoor gravel bed with smoothed river pebbles and stone bridge' },
      joinery: { name: 'Smoked Oak Floating Tea Table', material: 'Deep charcoal fumed oak with concealed brass support legs' },
      walls: { name: 'Charcoal Silicate Mineral Wall', material: 'Natural textured dark mineral plaster absorbing specular reflection' },
      lighting: { name: 'Concealed In-Floor Linear Grazers', material: 'Low-glare 2400K uplights highlighting timber grains and foliage' },
      ceramics: { name: 'Bizen Wood-Fired Ceramic Planters', material: 'High-temperature stoneware with fiery reddish-brown scorch marks' },
      hardware: { name: 'Matte Black Anodized Aluminum', material: 'Ultra-thin architectural profiles with seamless concealed hinges' }
    }
  },
  biophilic: {
    name: 'Biophilic Botanical Solarium',
    sub: 'Living Greenery & Terracotta',
    genre: 'Glasshouse Greenhouse & Natural Flora',
    lighting: 'Overhead natural sun through conservatory glass mullions, warm dappled leaf shadows, twilight brass lanterns',
    swatchRoles: {
      2: ['Bentwood Rattan Armchairs', 'Kilim Rug & Living Botanical Wall'],
      3: ['Bentwood Rattan Armchairs', 'Botanical Wool Kilim Rug', 'Reclaimed Teak Potting Joinery'],
      4: ['Bentwood Rattan Armchairs', 'Botanical Wool Kilim Rug', 'Reclaimed Teak Potting Island', 'Terracotta Urns & Verdigris Bronze']
    },
    items: {
      seating: { name: 'Curved Bentwood & Rattan Armchairs', material: 'Steam-bent solid beech frame with hand-caned wicker panels' },
      rug: { name: 'Handmade Moroccan Wool Kilim', material: 'Natural botanical-dyed wool with organic geometric tribal motifs' },
      joinery: { name: 'Reclaimed Teak Potting Island', material: 'FSC-certified salvaged plantation teak with water-resistant oil seal' },
      walls: { name: 'Living Vertical Moss & Fern Wall', material: 'Preserved reindeer moss and cascading weeping ferns on acoustic backing' },
      lighting: { name: 'Verdigris Copper Lantern Pendants', material: 'Aged patinated green copper with textured seeded glass panes' },
      ceramics: { name: 'Hand-Thrown Terracotta Urns', material: 'Porous Tuscan clay pots developing natural salt and moss bloom' },
      hardware: { name: 'Antiqued Verdigris Bronze Fittings', material: 'Living bronze with turquoise mineral oxidation in recesses' }
    }
  },
  minka: {
    name: 'Modern Industrial Minka Loft',
    sub: 'Ancient Timber Rafters & Black Steel',
    genre: 'Japanese Farmhouse Meets Urban Loft',
    lighting: 'Massive dark timber roof trusses, exposed industrial steel beams, suspended paper orbs, warm 2700K Edison filaments',
    swatchRoles: {
      2: ['Oversized Saddle Leather Sectional', 'Sheepskin Boro Rug & Industrial Lanterns'],
      3: ['Deep Saddle Leather Sectional', 'Sheepskin & Boro Throw Rug', 'Salvaged Pine & Steel Joinery'],
      4: ['Deep Saddle Leather Sectional', 'Sheepskin & Boro Rug', 'Salvaged Pine Dining Island', 'Tambayaki Jars & Iron Strap Hardware']
    },
    items: {
      seating: { name: 'Oversized Deep Leather Sectional', material: 'Heavy pull-up saddle leather with rugged double-needle contrast stitching' },
      rug: { name: 'Natural Sheepskin & Boro Throw Rug', material: 'Plush long-hair sheepskin layered over vintage indigo canvas backing' },
      joinery: { name: 'Salvaged Japanese Pine Dining Table', material: '200-year-old rescued minka floorboards on heavy I-beam steel legs' },
      walls: { name: 'Distressed Earthen Plaster & Red Brick', material: 'Exposed historical brick blended with rough textured hemp-lime mortar' },
      lighting: { name: 'Industrial Wire-Caged Lanterns', material: 'Blackened iron wire cages with cast brass junction boxes' },
      ceramics: { name: 'Tambayaki Heavy Stoneware Jars', material: 'Dense iron-rich clay fired with pine firewood in climbing kilns' },
      hardware: { name: 'Raw Hand-Pounded Iron Straps', material: 'Structural black iron brackets with heavy square pyramid head bolts' }
    }
  },
  luxuryryokan: {
    name: 'Luxury Boutique Ryokan Suite',
    sub: 'Hinoki Bath, Gold Leaf & Washi Screens',
    genre: 'High-End Kyoto Hospitality & Pure Serenity',
    lighting: 'Indirect 2700K golden perimeter LED cove behind shoji screens, soft candle lanterns, cedar steam aroma',
    swatchRoles: {
      2: ['Hinoki Zaisu & Tatami Suite', 'Gold-Flecked Washi Walls & Shoji Glow'],
      3: ['Walnut Zaisu Platform Seating', 'Bingoshiki Rush Tatami Mats', 'Kiso Hinoki Joinery & Cabinetry'],
      4: ['Walnut Zaisu Platform Seating', 'Bingoshiki Rush Tatami Mats', 'Kiso Hinoki Joinery', 'Gold-Flecked Walls & Kiyomizu Celadon']
    },
    items: {
      seating: { name: 'Tatami Low Platform Zaisu Chairs', material: 'Solid curved walnut zaisu seats with silk damask seat cushions' },
      rug: { name: 'Premium Bingoshiki Rush Tatami', material: 'Top-grade Bingo rush grass mats with raw silk border tape' },
      joinery: { name: 'Aromatic Kiso Hinoki Joinery', material: 'Clear grain 300-year-old Kiso cypress with silky hand-planed finish' },
      walls: { name: 'Gold-Flecked Washi Paper Walls', material: 'Handmade Echizen washi wallpaper sprinkled with delicate gold dust flakes' },
      lighting: { name: 'Concealed Shoji Screen Ambient Glow', material: 'Double-sided lattice shoji screens diffusing warm golden LED backlight' },
      ceramics: { name: 'Kiyomizu-Yaki Celadon & Gold Vessels', material: 'Kyoto porcelain with translucent jade-green celadon crackle glaze' },
      hardware: { name: 'Concealed Soft-Close Shoji Hardware', material: 'Precision Japanese brass track rollers and recessed finger pulls' }
    }
  }
};

/**
 * Initialize Archival Dropdowns for Fashion and Interior Studios
 */
function initArchivalDropdowns() {
  if (!fashionDropdownMenu || !interiorDropdownMenu) return;

  const fashionKeys = Object.keys(fashionProfiles);
  fashionDropdownMenu.innerHTML = fashionKeys.map((key, idx) => {
    const p = fashionProfiles[key];
    const indexStr = String(idx + 1).padStart(2, '0');
    const isActive = state.fashionStyle === key;
    return `
      <button type="button" class="dropdown-option ${isActive ? 'active' : ''}" data-value="${key}" role="option" aria-selected="${isActive}">
        <span class="option-index">${indexStr}</span>
        <div class="option-content">
          <span class="option-title">${p.name}</span>
          <span class="option-sub">${p.sub}</span>
        </div>
      </button>
    `;
  }).join('');

  const interiorKeys = Object.keys(interiorProfiles);
  interiorDropdownMenu.innerHTML = interiorKeys.map((key, idx) => {
    const p = interiorProfiles[key];
    const indexStr = String(idx + 1).padStart(2, '0');
    const isActive = state.interiorStyle === key;
    return `
      <button type="button" class="dropdown-option ${isActive ? 'active' : ''}" data-value="${key}" role="option" aria-selected="${isActive}">
        <span class="option-index">${indexStr}</span>
        <div class="option-content">
          <span class="option-title">${p.name}</span>
          <span class="option-sub">${p.sub}</span>
        </div>
      </button>
    `;
  }).join('');

  const initialFashion = fashionProfiles[state.fashionStyle] || fashionProfiles.minimalist;
  const initialFashionIdx = String(fashionKeys.indexOf(state.fashionStyle) + 1).padStart(2, '0');
  if (fashionDropdownLabel) {
    fashionDropdownLabel.textContent = `${initialFashionIdx} · ${initialFashion.name}`;
  }

  const initialInterior = interiorProfiles[state.interiorStyle] || interiorProfiles.japandi;
  const initialInteriorIdx = String(interiorKeys.indexOf(state.interiorStyle) + 1).padStart(2, '0');
  if (interiorDropdownLabel) {
    interiorDropdownLabel.textContent = `${initialInteriorIdx} · ${initialInterior.name}`;
  }

  if (fashionDropdownTrigger) {
    fashionDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = fashionDropdownMenu.classList.toggle('open');
      fashionDropdownTrigger.setAttribute('aria-expanded', isOpen);
      if (interiorDropdownMenu) {
        interiorDropdownMenu.classList.remove('open');
        if (interiorDropdownTrigger) interiorDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (interiorDropdownTrigger) {
    interiorDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = interiorDropdownMenu.classList.toggle('open');
      interiorDropdownTrigger.setAttribute('aria-expanded', isOpen);
      if (fashionDropdownMenu) {
        fashionDropdownMenu.classList.remove('open');
        if (fashionDropdownTrigger) fashionDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  fashionDropdownMenu.addEventListener('click', (e) => {
    const option = e.target.closest('.dropdown-option');
    if (!option) return;
    const value = option.dataset.value;
    state.fashionStyle = value;
    const p = fashionProfiles[value];
    const idx = String(fashionKeys.indexOf(value) + 1).padStart(2, '0');
    if (fashionDropdownLabel) fashionDropdownLabel.textContent = `${idx} · ${p.name}`;
    fashionDropdownMenu.querySelectorAll('.dropdown-option').forEach(opt => {
      const isSel = opt.dataset.value === value;
      opt.classList.toggle('active', isSel);
      opt.setAttribute('aria-selected', isSel);
    });
    fashionDropdownMenu.classList.remove('open');
    if (fashionDropdownTrigger) fashionDropdownTrigger.setAttribute('aria-expanded', 'false');
    updateMockup();
    updateExportCode();
  });

  interiorDropdownMenu.addEventListener('click', (e) => {
    const option = e.target.closest('.dropdown-option');
    if (!option) return;
    const value = option.dataset.value;
    state.interiorStyle = value;
    const p = interiorProfiles[value];
    const idx = String(interiorKeys.indexOf(value) + 1).padStart(2, '0');
    if (interiorDropdownLabel) interiorDropdownLabel.textContent = `${idx} · ${p.name}`;
    interiorDropdownMenu.querySelectorAll('.dropdown-option').forEach(opt => {
      const isSel = opt.dataset.value === value;
      opt.classList.toggle('active', isSel);
      opt.setAttribute('aria-selected', isSel);
    });
    interiorDropdownMenu.classList.remove('open');
    if (interiorDropdownTrigger) interiorDropdownTrigger.setAttribute('aria-expanded', 'false');
    updateMockup();
    updateExportCode();
  });

  document.addEventListener('click', (e) => {
    if (fashionDropdown && !fashionDropdown.contains(e.target)) {
      fashionDropdownMenu.classList.remove('open');
      if (fashionDropdownTrigger) fashionDropdownTrigger.setAttribute('aria-expanded', 'false');
    }
    if (interiorDropdown && !interiorDropdown.contains(e.target)) {
      interiorDropdownMenu.classList.remove('open');
      if (interiorDropdownTrigger) interiorDropdownTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (fashionDropdownMenu) {
        fashionDropdownMenu.classList.remove('open');
        if (fashionDropdownTrigger) fashionDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
      if (interiorDropdownMenu) {
        interiorDropdownMenu.classList.remove('open');
        if (interiorDropdownTrigger) interiorDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

function generateFashionPrompts(combo, styleKey) {
  const p = fashionProfiles[styleKey] || fashionProfiles.minimalist;
  const numColors = combo.colors.length;
  const map = getFashionMapping(numColors);

  const cOuter = combo.colors[map[0]];
  const cShirt = combo.colors[map[1]];
  const cBottoms = combo.colors[map[2]];
  const cFootwear = combo.colors[map[3]];
  const cSocks = combo.colors[map[4]];
  const cBag = combo.colors[map[5]];
  const cHeadwear = combo.colors[map[6]];

  const wardrobeBreakdown = `7-piece wardrobe breakdown: Outerwear (${p.items.outerwear.name} in ${cOuter.name_en} ${cOuter.hex}, ${p.items.outerwear.material}), layered over ${p.items.shirt.name} in ${cShirt.name_en} ${cShirt.hex} (${p.items.shirt.material}), paired with ${p.items.bottoms.name} in ${cBottoms.name_en} ${cBottoms.hex} (${p.items.bottoms.material}), ${p.items.footwear.name} in ${cFootwear.name_en} ${cFootwear.hex}, ${p.items.socks.name} in ${cSocks.hex}, accessorized with ${p.items.bag.name} in ${cBag.hex} and ${p.items.headwear.name} in ${cHeadwear.hex}`;

  return {
    midjourney: `Editorial fashion photography, full body portrait of a model wearing a complete 7-piece ${p.name} ensemble (${p.genre}) inspired by Wada Sanzo combination #${combo.id} (${combo.name_en}). ${wardrobeBreakdown}. Set against ${p.backdrop}. Shot on 85mm f/1.4 lens, soft directional diffused studio lighting, Vogue editorial aesthetic, high tactile fabric texture --ar 3:4 --style raw --v 6.1`,
    flux: `A high-fashion editorial photograph of a model in a complete 7-piece ${p.name} wardrobe styled with authentic 1930s Japanese color theory (Wada Sanzo #${combo.id} - ${combo.name_en}). Ensemble: ${p.items.outerwear.name} in ${cOuter.name_en} (${cOuter.hex}, ${p.items.outerwear.material}), layered over ${p.items.shirt.name} in ${cShirt.name_en} (${cShirt.hex}), with ${p.items.bottoms.name} in ${cBottoms.name_en} (${cBottoms.hex}), ${p.items.footwear.name} in ${cFootwear.name_en} (${cFootwear.hex}), ${p.items.socks.name} in ${cSocks.hex}, and accessories (${p.items.bag.name} in ${cBag.hex}, ${p.items.headwear.name} in ${cHeadwear.hex}). Natural skin texture, realistic cloth drape, soft ambient lighting, ${p.backdrop}.`,
    gemini: `Photorealistic fashion portrait of a fashion model showcasing a complete 7-piece ${p.name} collection based on Sanzo Wada's color harmony #${combo.id} (${combo.name_en}). Exact 7-piece color allocation: Outerwear (${p.items.outerwear.name}) in ${cOuter.name_en} ${cOuter.hex}, Shirt/Knit (${p.items.shirt.name}) in ${cShirt.name_en} ${cShirt.hex}, Bottoms (${p.items.bottoms.name}) in ${cBottoms.name_en} ${cBottoms.hex}, Footwear (${p.items.footwear.name}) in ${cFootwear.name_en} ${cFootwear.hex}, Legwear (${p.items.socks.name}) in ${cSocks.hex}, Leather Bag (${p.items.bag.name}) in ${cBag.hex}, Headwear (${p.items.headwear.name}) in ${cHeadwear.hex}. Setting: ${p.backdrop}. Soft studio shadows, Hasselblad camera quality, 8k resolution, authentic fabric weaves.`,
    dalle: `A full-length fashion photograph featuring a model posing gracefully in a coordinated 7-piece wardrobe inspired by Sanzo Wada's Japanese color palette #${combo.id} (${combo.name_en}). The ensemble balances ${p.items.outerwear.name} in ${cOuter.name_en} (${cOuter.hex}) over ${p.items.shirt.name} in ${cShirt.name_en} (${cShirt.hex}), ${p.items.bottoms.name} in ${cBottoms.name_en} (${cBottoms.hex}), ${p.items.footwear.name} in ${cFootwear.name_en} (${cFootwear.hex}), accented with ${p.items.bag.name} in ${cBag.hex} and ${p.items.headwear.name} in ${cHeadwear.hex}. The background is ${p.backdrop} with soft natural light streaming from the side.`
  };
}

function generateInteriorPrompts(combo, styleKey) {
  const p = interiorProfiles[styleKey] || interiorProfiles.japandi;
  const numColors = combo.colors.length;
  const map = getInteriorMapping(numColors);

  const cSeating = combo.colors[map[0]];
  const cRug = combo.colors[map[1]];
  const cJoinery = combo.colors[map[2]];
  const cWalls = combo.colors[map[3]];
  const cLighting = combo.colors[map[4]];
  const cCeramics = combo.colors[map[5]];
  const cHardware = combo.colors[map[6]];

  const spatialBreakdown = `7-plane architectural material specification: Primary seating volume (${p.items.seating.name} in ${cSeating.name_en} ${cSeating.hex}, ${p.items.seating.material}), floor textiles (${p.items.rug.name} in ${cRug.name_en} ${cRug.hex}, ${p.items.rug.material}), architectural joinery (${p.items.joinery.name} in ${cJoinery.name_en} ${cJoinery.hex}), wall envelope (${p.items.walls.name} in ${cWalls.hex}, ${p.items.walls.material}), ambient lighting (${p.items.lighting.name} in ${cLighting.hex}), sculptural vessels (${p.items.ceramics.name} in ${cCeramics.hex}), and hardware details (${p.items.hardware.name} in ${cHardware.hex})`;

  return {
    midjourney: `Architectural interior photography of a luxurious ${p.name} space designed with complete 7-plane architectural harmony based on Sanzo Wada color harmony #${combo.id} (${combo.name_en}). ${spatialBreakdown}. ${p.lighting}. Shot on 24mm tilt-shift architectural lens, Architectural Digest editorial quality, hyper-realistic materiality, cinematic depth --ar 16:9 --style raw --v 6.1`,
    flux: `High-end architectural interior photography of a complete 7-plane ${p.name} living space inspired by 1930s Japanese color theory (Wada Sanzo #${combo.id} - ${combo.name_en}). ${spatialBreakdown}. Natural sunlight, realistic shadow falloff, rich tactile material textures, tranquil atmosphere.`,
    gemini: `Photorealistic architectural rendering of an interior room in ${p.name} style featuring Sanzo Wada's 7-plane color combination #${combo.id} (${combo.name_en}). Spatial plane allocation: Focal seating (${p.items.seating.name}) in ${cSeating.name_en} ${cSeating.hex}, Floor textiles (${p.items.rug.name}) in ${cRug.name_en} ${cRug.hex}, Joinery (${p.items.joinery.name}) in ${cJoinery.name_en} ${cJoinery.hex}, Walls in ${cWalls.hex}, Lighting in ${cLighting.hex}, Ceramics in ${cCeramics.hex}, Hardware in ${cHardware.hex}. Atmosphere: ${p.lighting}. Realistic Global Illumination, 8k resolution, Hasselblad medium format camera aesthetic.`,
    dalle: `A wide-angle photograph of an impeccably designed 7-plane ${p.name} interior space based on Sanzo Wada's palette #${combo.id} (${combo.name_en}). The room features ${p.items.seating.name} in ${cSeating.name_en} (${cSeating.hex}) as the focal point, complemented by ${p.items.rug.name} in ${cRug.name_en} (${cRug.hex}), joinery in ${cJoinery.hex}, walls in ${cWalls.hex}, and accents in ${p.items.ceramics.name} (${cCeramics.hex}). Beautiful natural light streams in, highlighting the rich textures and serene Japanese design harmony.`
  };
}

function generateUIPrompts(combo) {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];

  return {
    midjourney: `Clean modern web UI landing page mockup, minimalist design system, color palette inspired by Wada Sanzo combination #${combo.id} (${c1.name_en} ${c1.hex}, ${c2.name_en} ${c2.hex}, ${c3.name_en} ${c3.hex}). Crisp typography, quiet Japanese aesthetic, premium dark and light theme balance, Figma Dribbble UI showcase, 8k resolution --ar 16:9 --style raw --v 6.1`,
    flux: `A high-resolution modern SaaS user interface dashboard, beautifully designed using historical Japanese color harmony (Wada Sanzo #${combo.id}). Primary accent in ${c1.name_en} (${c1.hex}), secondary interactive states in ${c2.name_en} (${c2.hex}), clean card surfaces, elegant typography, polished product design.`,
    gemini: `Photorealistic web design interface showcasing a responsive application styled with Wada Sanzo color combination #${combo.id} (${combo.name_en}). Color tokens: Primary brand ${c1.hex} (${c1.name_en}), Secondary ${c2.hex} (${c2.name_en}), Accent ${c3.hex} (${c3.name_en}). Pristine layout, micro-interactions, accessibility-focused WCAG AAA contrast, 8k UI/UX design.`,
    dalle: `A sleek and modern web application dashboard interface designed with Sanzo Wada's color harmony #${combo.id}. The design features ${c1.name_en} (${c1.hex}) as the primary action color, paired with ${c2.name_en} (${c2.hex}) and subtle neutral surfaces. Professional design agency showcase, clean grid, crisp vector UI elements.`
  };
}

// Update Fashion Lookbook Studio View (Dynamic Swatchboards & 7-Piece Ensemble)
function updateFashionStudio(combo) {
  if (!combo || !combo.colors) return;
  const p = fashionProfiles[state.fashionStyle] || fashionProfiles.minimalist;
  const numColors = combo.colors.length;

  if (fashionSwatchboards) {
    fashionSwatchboards.className = `swatchboards-grid size-${numColors}`;
    fashionSwatchboards.innerHTML = '';

    const roles = p.swatchRoles[numColors] || p.swatchRoles[3];

    combo.colors.forEach((col, idx) => {
      const contrastText = getContrastColor(col.hex);
      const role = roles[idx] || `Pigment C${idx + 1}`;

      let title = '';
      let desc = '';
      if (numColors === 2) {
        if (idx === 0) {
          title = p.items.outerwear.name;
          desc = `${p.items.outerwear.material}. Primary silhouette layer anchoring the ensemble.`;
        } else {
          title = `${p.items.shirt.name} & Footwear`;
          desc = `${p.items.shirt.material} layered with ${p.items.footwear.name}.`;
        }
      } else if (numColors === 3) {
        if (idx === 0) {
          title = p.items.outerwear.name;
          desc = `${p.items.outerwear.material}. Dominant coat layer.`;
        } else if (idx === 1) {
          title = p.items.shirt.name;
          desc = `${p.items.shirt.material}. Foundation mid-layer piece.`;
        } else {
          title = p.items.bottoms.name;
          desc = `${p.items.bottoms.material}. Lower silhouette balance.`;
        }
      } else {
        if (idx === 0) {
          title = p.items.outerwear.name;
          desc = `${p.items.outerwear.material}. Dominant coat layer.`;
        } else if (idx === 1) {
          title = p.items.shirt.name;
          desc = `${p.items.shirt.material}. Mid-layer knitwear.`;
        } else if (idx === 2) {
          title = p.items.bottoms.name;
          desc = `${p.items.bottoms.material}. Structured trousers.`;
        } else {
          title = `${p.items.footwear.name} & Accessories`;
          desc = `${p.items.footwear.material} with ${p.items.bag.name}.`;
        }
      }

      const card = document.createElement('div');
      card.className = 'swatchboard-card';
      card.style.borderColor = `${col.hex}55`;
      card.innerHTML = `
        <div class="swatchboard-header" style="background-color: ${col.hex};">
          <span class="swatchboard-hex" style="color: ${contrastText};">${col.hex}</span>
          <span class="swatchboard-jp-tag" style="color: ${contrastText};">${col.name_jp}</span>
        </div>
        <div class="swatchboard-body">
          <span class="swatchboard-role">${role}</span>
          <h4 class="swatchboard-title">${title}</h4>
          <p class="swatchboard-desc">${desc}</p>
        </div>
      `;
      fashionSwatchboards.appendChild(card);
    });
  }

  // Complete 7-Piece Wardrobe Ensemble Breakdown
  if (fashionEnsembleGrid) {
    fashionEnsembleGrid.innerHTML = '';
    const mapping = getFashionMapping(numColors);
    const layers = [
      { key: 'outerwear', layer: 'Outerwear', num: '01' },
      { key: 'shirt', layer: 'Shirt / Knit', num: '02' },
      { key: 'bottoms', layer: 'Bottoms', num: '03' },
      { key: 'footwear', layer: 'Footwear', num: '04' },
      { key: 'socks', layer: 'Socks & Legwear', num: '05' },
      { key: 'bag', layer: 'Bag & Leather', num: '06' },
      { key: 'headwear', layer: 'Headwear', num: '07' }
    ];

    layers.forEach((l, idx) => {
      const colorIdx = mapping[idx];
      const col = combo.colors[colorIdx] || combo.colors[0];
      const item = p.items[l.key];

      const itemCard = document.createElement('div');
      itemCard.className = 'ensemble-item-card';
      itemCard.style.borderLeft = `3px solid ${col.hex}`;
      itemCard.innerHTML = `
        <div class="ensemble-item-header">
          <div class="ensemble-item-tag">
            <span class="ensemble-dot" style="background-color: ${col.hex};"></span>
            <span class="ensemble-color-name">${col.name_jp} (${col.name_en})</span>
          </div>
          <span class="ensemble-item-layer">${l.num} · ${l.layer}</span>
        </div>
        <div class="ensemble-piece-name">${item.name}</div>
        <div class="ensemble-piece-material">${item.material}</div>
      `;
      fashionEnsembleGrid.appendChild(itemCard);
    });
  }

  const fashionBackdropText = document.getElementById('fashionBackdropText');
  if (fashionBackdropText) {
    fashionBackdropText.textContent = p.backdrop;
  }
}

// Update Interior Spatial Studio View (Dynamic Swatchboards & 7-Plane Material Spec)
function updateInteriorStudio(combo) {
  if (!combo || !combo.colors) return;
  const p = interiorProfiles[state.interiorStyle] || interiorProfiles.japandi;
  const numColors = combo.colors.length;

  if (interiorSwatchboards) {
    interiorSwatchboards.className = `swatchboards-grid size-${numColors}`;
    interiorSwatchboards.innerHTML = '';

    const roles = p.swatchRoles[numColors] || p.swatchRoles[3];

    combo.colors.forEach((col, idx) => {
      const contrastText = getContrastColor(col.hex);
      const role = roles[idx] || `Spatial Plane C${idx + 1}`;

      let title = '';
      let desc = '';
      if (numColors === 2) {
        if (idx === 0) {
          title = p.items.seating.name;
          desc = `${p.items.seating.material}. Primary architectural furniture volume.`;
        } else {
          title = `${p.items.rug.name} & Surfaces`;
          desc = `${p.items.rug.material} paired with ${p.items.lighting.name}.`;
        }
      } else if (numColors === 3) {
        if (idx === 0) {
          title = p.items.seating.name;
          desc = `${p.items.seating.material}. Dominant seating centerpiece.`;
        } else if (idx === 1) {
          title = p.items.rug.name;
          desc = `${p.items.rug.material}. Expansive floor textile plane.`;
        } else {
          title = `${p.items.joinery.name} & Ceramics`;
          desc = `${p.items.joinery.material} with artisanal glaze accents.`;
        }
      } else {
        if (idx === 0) {
          title = p.items.seating.name;
          desc = `${p.items.seating.material}. Focal upholstery piece.`;
        } else if (idx === 1) {
          title = p.items.rug.name;
          desc = `${p.items.rug.material}. Floor plane and drapery.`;
        } else if (idx === 2) {
          title = p.items.joinery.name;
          desc = `${p.items.joinery.material}. Millwork and cabinetry.`;
        } else {
          title = `${p.items.ceramics.name} & Hardware`;
          desc = `${p.items.ceramics.material} with ${p.items.hardware.name}.`;
        }
      }

      const card = document.createElement('div');
      card.className = 'swatchboard-card';
      card.style.borderColor = `${col.hex}55`;
      card.innerHTML = `
        <div class="swatchboard-header" style="background-color: ${col.hex};">
          <span class="swatchboard-hex" style="color: ${contrastText};">${col.hex}</span>
          <span class="swatchboard-jp-tag" style="color: ${contrastText};">${col.name_jp}</span>
        </div>
        <div class="swatchboard-body">
          <span class="swatchboard-role">${role}</span>
          <h4 class="swatchboard-title">${title}</h4>
          <p class="swatchboard-desc">${desc}</p>
        </div>
      `;
      interiorSwatchboards.appendChild(card);
    });
  }

  // Complete 7-Plane Spatial Architecture Spec
  if (interiorEnsembleGrid) {
    interiorEnsembleGrid.innerHTML = '';
    const mapping = getInteriorMapping(numColors);
    const planes = [
      { key: 'seating', layer: 'Primary Seating', num: '01' },
      { key: 'rug', layer: 'Floor Textiles', num: '02' },
      { key: 'joinery', layer: 'Architectural Joinery', num: '03' },
      { key: 'walls', layer: 'Walls & Plaster', num: '04' },
      { key: 'lighting', layer: 'Lighting & Glow', num: '05' },
      { key: 'ceramics', layer: 'Ceramics & Vessels', num: '06' },
      { key: 'hardware', layer: 'Hardware & Details', num: '07' }
    ];

    planes.forEach((pl, idx) => {
      const colorIdx = mapping[idx];
      const col = combo.colors[colorIdx] || combo.colors[0];
      const item = p.items[pl.key];

      const planeCard = document.createElement('div');
      planeCard.className = 'ensemble-item-card';
      planeCard.style.borderLeft = `3px solid ${col.hex}`;
      planeCard.innerHTML = `
        <div class="ensemble-item-header">
          <div class="ensemble-item-tag">
            <span class="ensemble-dot" style="background-color: ${col.hex};"></span>
            <span class="ensemble-color-name">${col.name_jp} (${col.name_en})</span>
          </div>
          <span class="ensemble-item-layer">${pl.num} · ${pl.layer}</span>
        </div>
        <div class="ensemble-piece-name">${item.name}</div>
        <div class="ensemble-piece-material">${item.material}</div>
      `;
      interiorEnsembleGrid.appendChild(planeCard);
    });
  }

  const interiorLightingText = document.getElementById('interiorLightingText');
  if (interiorLightingText) {
    interiorLightingText.textContent = p.lighting;
  }
}

// Update Live Interactive App Mockup with Strict Luminance-Driven Text Contrast
function updateUIMockup(combo) {
  const c1 = combo.colors[0];
  const c2 = combo.colors[1];
  const c3 = combo.colors[2] || combo.colors[0];

  // Luminance-tested contrast text
  const btn1Text = getContrastColor(c1.hex);
  const btn2Text = getContrastColor(c2.hex);

  // Background reference synced with canvas theme
  if (mockupCanvas) {
    mockupCanvas.className = `mockup-canvas mode-${state.canvasThemeMode}`;
  }

  const canvasBgHex = state.canvasThemeMode === 'light' ? '#f7f5ef' : '#0f0e0d';
  const contrastWithBg = calculateContrastRatio(c1.hex, canvasBgHex);
  const wcagRating = contrastWithBg >= 7.0 ? 'AAA' : contrastWithBg >= 4.5 ? 'AA' : 'Normal';

  // Elements
  const appLogoBadge = document.getElementById('appLogoBadge');
  const appNavBtn = document.getElementById('appNavBtn');
  const appHeroPill = document.getElementById('appHeroPill');
  const appHeroTitle = document.getElementById('appHeroTitle');
  const appBtnPrimary = document.getElementById('appBtnPrimary');
  const appBtnSecondary = document.getElementById('appBtnSecondary');
  const appCard1 = document.getElementById('appCard1');
  const appCard2 = document.getElementById('appCard2');

  // Apply colors & high-contrast content
  if (appLogoBadge) {
    appLogoBadge.style.backgroundColor = c1.hex;
    appLogoBadge.style.color = btn1Text;
  }

  if (appNavBtn) {
    appNavBtn.style.color = c1.hex;
    appNavBtn.style.borderColor = `${c1.hex}66`;
  }

  if (appHeroPill) {
    appHeroPill.textContent = `Combination #${combo.id} · ${combo.name_jp} (${combo.temperature.toUpperCase()})`;
    appHeroPill.style.color = c1.hex;
  }

  if (appHeroTitle) {
    appHeroTitle.innerHTML = `Harmonious Design in <span style="color: ${c1.hex};">${combo.colors[0].name_en}</span>`;
  }

  if (appBtnPrimary) {
    appBtnPrimary.style.backgroundColor = c1.hex;
    appBtnPrimary.style.color = btn1Text;
  }

  if (appBtnSecondary) {
    appBtnSecondary.style.borderColor = `${c2.hex}88`;
    appBtnSecondary.style.color = state.canvasThemeMode === 'light' ? '#1c1916' : '#f6f4ee';
  }

  if (appCard1) {
    appCard1.style.borderLeft = `3px solid ${c2.hex}`;
    const heading = appCard1.querySelector('.card-heading');
    if (heading) {
      heading.textContent = `${c2.name_en} (${c2.name_jp})`;
    }
  }

  if (appCard2) {
    appCard2.style.borderLeft = `3px solid ${c3.hex}`;
    const heading = appCard2.querySelector('.card-heading');
    if (heading) {
      heading.textContent = `WCAG ${wcagRating} (${contrastWithBg}:1)`;
    }
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
    code += `  --bg-canvas: #fbfaf8;\n`;
    code += `  --bg-surface: #ffffff;\n`;
    code += `  --text-primary: #191817;\n`;
    code += `  --text-muted: #66615b;\n`;
    code += `}\n\n`;
    code += `[data-theme='dark'] {\n`;
    code += `  --bg-canvas: #101114;\n`;
    code += `  --bg-surface: #16181c;\n`;
    code += `  --text-primary: #f2f1ed;\n`;
    code += `  --text-muted: #8a8e95;\n`;
    code += `}`;
  } else if (state.exportTab === 'tailwind') {
    code = `@theme {\n`;
    combo.colors.forEach((col, idx) => {
      const role = idx === 0 ? 'primary' : idx === 1 ? 'secondary' : idx === 2 ? 'accent' : 'highlight';
      code += `  --color-wada-${role}: ${col.hex};\n`;
    });
    code += `  --color-wada-canvas: #fbfaf8;\n`;
    code += `  --color-wada-ink: #191817;\n`;
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
      const numColors = combo.colors.length;
      const roles = p.swatchRoles[numColors] || p.swatchRoles[3];
      const mapping = getFashionMapping(numColors);

      code = `# Wada Sanzo Fashion Lookbook: #${combo.id} ${combo.name_en}\n\n`;
      code += `**Style Silhouette**: ${p.name} (${p.sub})\n`;
      code += `**Genre**: ${p.genre}\n`;
      code += `**Japanese**: ${combo.name_jp} (${combo.name_romaji})\n\n`;

      code += `### Swatchboard Pigment Hierarchy (${numColors} Colors)\n`;
      code += `| Index | Wada Pigment | Hex | Swatchboard Role |\n|---|---|---|---|\n`;
      combo.colors.forEach((col, idx) => {
        code += `| C${idx + 1} | ${col.name_jp} / ${col.name_en} | \`${col.hex}\` | ${roles[idx] || 'Accent'} |\n`;
      });

      code += `\n### Complete 7-Piece Wardrobe Ensemble\n`;
      code += `| Layer | Garment / Piece | Wada Tone | Hex | Material & Construction |\n|---|---|---|---|---|\n`;
      const layers = [
        { key: 'outerwear', label: '1. Outerwear' },
        { key: 'shirt', label: '2. Shirt / Knit' },
        { key: 'bottoms', label: '3. Bottoms' },
        { key: 'footwear', label: '4. Footwear' },
        { key: 'socks', label: '5. Socks & Legwear' },
        { key: 'bag', label: '6. Bag & Leather' },
        { key: 'headwear', label: '7. Headwear' }
      ];
      layers.forEach((l, idx) => {
        const colorIdx = mapping[idx];
        const col = combo.colors[colorIdx] || combo.colors[0];
        const it = p.items[l.key];
        code += `| ${l.label} | ${it.name} | ${col.name_jp} (${col.name_en}) | \`${col.hex}\` | ${it.material} |\n`;
      });
      code += `\n**Backdrop & Setting**: ${p.backdrop}\n`;
    } else if (state.activeDomain === 'interior') {
      const p = interiorProfiles[state.interiorStyle] || interiorProfiles.japandi;
      const numColors = combo.colors.length;
      const roles = p.swatchRoles[numColors] || p.swatchRoles[3];
      const mapping = getInteriorMapping(numColors);

      code = `# Wada Sanzo Spatial Interior Spec: #${combo.id} ${combo.name_en}\n\n`;
      code += `**Style Archetype**: ${p.name} (${p.sub})\n`;
      code += `**Genre**: ${p.genre}\n`;
      code += `**Japanese**: ${combo.name_jp} (${combo.name_romaji})\n\n`;

      code += `### Swatchboard Spatial Planes (${numColors} Colors)\n`;
      code += `| Index | Wada Pigment | Hex | Spatial Volume Role |\n|---|---|---|---|\n`;
      combo.colors.forEach((col, idx) => {
        code += `| C${idx + 1} | ${col.name_jp} / ${col.name_en} | \`${col.hex}\` | ${roles[idx] || 'Accent'} |\n`;
      });

      code += `\n### Complete 7-Plane Architectural Material Spec\n`;
      code += `| Spatial Plane | Architectural Element | Wada Tone | Hex | Material Finish & Spec |\n|---|---|---|---|---|\n`;
      const planes = [
        { key: 'seating', label: '1. Primary Seating' },
        { key: 'rug', label: '2. Floor Textiles' },
        { key: 'joinery', label: '3. Architectural Joinery' },
        { key: 'walls', label: '4. Walls & Plaster' },
        { key: 'lighting', label: '5. Lighting & Glow' },
        { key: 'ceramics', label: '6. Ceramics & Vessels' },
        { key: 'hardware', label: '7. Hardware & Details' }
      ];
      planes.forEach((pl, idx) => {
        const colorIdx = mapping[idx];
        const col = combo.colors[colorIdx] || combo.colors[0];
        const it = p.items[pl.key];
        code += `| ${pl.label} | ${it.name} | ${col.name_jp} (${col.name_en}) | \`${col.hex}\` | ${it.material} |\n`;
      });
      code += `\n**Atmosphere & Illumination**: ${p.lighting}\n`;
    } else {
      code = `## Wada Sanzo Combination #${combo.id}\n`;
      code += `**Japanese**: ${combo.name_jp} (${combo.name_romaji})\n`;
      code += `**English**: ${combo.name_en}\n\n`;
      code += `| Token | Wada Pigment | Hex | Role |\n|---|---|---|---|\n`;
      combo.colors.forEach((col, idx) => {
        const role = idx === 0 ? 'Brand Primary' : idx === 1 ? 'Secondary Accent' : idx === 2 ? 'Surface Highlight' : 'Muted Accent';
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
  }, 2200);
}

// Mount
document.addEventListener('DOMContentLoaded', init);
