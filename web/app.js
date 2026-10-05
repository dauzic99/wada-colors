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

function getReadableAccentOnSurface(accentHex, surfaceHex, isLight) {
  const contrast = parseFloat(calculateContrastRatio(accentHex, surfaceHex));
  if (contrast >= 3.6) {
    return accentHex;
  }
  return isLight ? '#1c1916' : '#f6f4ee';
}

// Application State
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
  uiDeviceMode: 'desktop',
  exportTab: 'css',
  activeDomain: 'ui',
  fashionStyle: 'casual_walk',
  outfitVibe: 'casual_walk',
  outfitClimate: 'tropical',
  outfitHijab: false,
  outfitBackground: 'auto',
  outfitCustomPieces: {},
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

// Fashion Atelier Controls (Climate, Hijab, Background Scene & Suitability)
const fashionBgDropdown = document.getElementById('fashionBgDropdown');
const fashionBgDropdownTrigger = document.getElementById('fashionBgDropdownTrigger');
const fashionBgDropdownIcon = document.getElementById('fashionBgDropdownIcon');
const fashionBgDropdownLabel = document.getElementById('fashionBgDropdownLabel');
const fashionBgDropdownMenu = document.getElementById('fashionBgDropdownMenu');

const fashionClimateSwitch = document.getElementById('fashionClimateSwitch');
const climateBtns = document.querySelectorAll('.climate-btn');
const fashionHijabToggle = document.getElementById('fashionHijabToggle');
const fashionHijabBadge = document.getElementById('fashionHijabBadge');
const fashionSuitabilityText = document.getElementById('fashionSuitabilityText');
const climateMetaPill = document.getElementById('climateMetaPill');
const modestyMetaPill = document.getElementById('modestyMetaPill');
const bgMetaPill = document.getElementById('bgMetaPill');
const fashionBgTag = document.getElementById('fashionBgTag');

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

// Viewport Device Switcher & Mockup DOM Inside Modal
const modalDeviceBar = document.getElementById('modalDeviceBar');
const deviceBtns = document.querySelectorAll('.device-btn');
const desktopMockupContainer = document.getElementById('desktopMockupContainer');
const mobileMockupContainer = document.getElementById('mobileMockupContainer');
const mobilePhoneScreen = document.getElementById('mobilePhoneScreen');
const mobilePhoneChassis = document.getElementById('mobilePhoneChassis');
const desktopNavTabs = document.getElementById('desktopNavTabs');
const mobileBottomNav = document.getElementById('mobileBottomNav');
const desktopMockupToggle = document.getElementById('desktopMockupToggle');
const mobileMockupToggle = document.getElementById('mobileMockupToggle');


// App Initialization
function init() {
  state.filtered = [...state.combinations];
  state.selectedCombo = state.combinations[164] || state.combinations[0]; // Combination #165

  const savedTheme = localStorage.getItem('wada_theme') || document.documentElement.getAttribute('data-theme') || 'dark';
  state.canvasThemeMode = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (brandPickerSwatch && brandColorPicker) {
    brandPickerSwatch.style.backgroundColor = brandColorPicker.value;
  }

  setupEventListeners();
  initArchivalDropdowns();
  renderGrid();
  applyDynamicTheme(state.selectedCombo);
  updateFloatingDock(state.selectedCombo);
  syncCanvasTheme();
  syncDeviceView();
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

  // Only show device viewport switcher when in UI Application domain
  if (modalDeviceBar) {
    modalDeviceBar.style.display = state.activeDomain === 'ui' ? 'inline-flex' : 'none';
  }
}

function syncDeviceView() {
  if (deviceBtns) {
    deviceBtns.forEach(btn => {
      if (btn.dataset.device === state.uiDeviceMode) {
        btn.classList.add('active');
        btn.style.backgroundColor = 'var(--accent-wada)';
        btn.style.color = 'var(--accent-wada-text)';
      } else {
        btn.classList.remove('active');
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }
    });
  }

  if (desktopMockupContainer && mobileMockupContainer) {
    if (state.uiDeviceMode === 'desktop') {
      desktopMockupContainer.classList.add('active');
      mobileMockupContainer.classList.remove('active');
    } else {
      desktopMockupContainer.classList.remove('active');
      mobileMockupContainer.classList.add('active');
    }
  }
}

/**
 * Synchronize theme globally across the entire website and specimen canvas
 */
function setGlobalTheme(mode) {
  state.canvasThemeMode = mode;
  document.documentElement.setAttribute('data-theme', mode);
  try {
    localStorage.setItem('wada_theme', mode);
  } catch (e) {}
  syncCanvasTheme();
  updateMockup();
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
  if (mobilePhoneScreen) {
    mobilePhoneScreen.className = `phone-screen mode-${state.canvasThemeMode}`;
  }
}

/**
 * Modal Open & Close Management (Unified Single Sheet)
 */
function openModal(focusTarget = 'studio') {
  specimenModalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  syncDomainView();
  syncDeviceView();
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

  // Canvas Theme Switcher (Inside Studio Modal) - Synchronized with Whole Site
  canvasThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setGlobalTheme(btn.dataset.mode);
    });
  });

  // Device Viewport Switcher (Desktop Web vs Mobile App)
  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.uiDeviceMode = btn.dataset.device;
      syncDeviceView();
    });
  });

  // Interactive Desktop Navigation Tabs
  if (desktopNavTabs) {
    desktopNavTabs.addEventListener('click', e => {
      const tabBtn = e.target.closest('.desktop-tab-btn');
      if (!tabBtn) return;
      desktopNavTabs.querySelectorAll('.desktop-tab-btn').forEach(b => {
        b.classList.remove('active');
        b.style.backgroundColor = '';
        b.style.color = '';
      });
      tabBtn.classList.add('active');
      if (state.selectedCombo && state.selectedCombo.colors) {
        const c1 = state.selectedCombo.colors[0];
        const btn1Text = getContrastColor(c1.hex);
        tabBtn.style.backgroundColor = c1.hex;
        tabBtn.style.color = btn1Text;
      }
    });
  }

  // Interactive Desktop Mockup Toggle Switch
  if (desktopMockupToggle) {
    desktopMockupToggle.addEventListener('click', () => {
      const isAct = desktopMockupToggle.classList.toggle('active');
      desktopMockupToggle.setAttribute('aria-checked', isAct);
      if (state.selectedCombo && state.selectedCombo.colors) {
        const c1 = state.selectedCombo.colors[0];
        desktopMockupToggle.style.backgroundColor = isAct ? c1.hex : '';
      }
    });
  }

  // Interactive Mobile Mockup Toggle Switch
  if (mobileMockupToggle) {
    mobileMockupToggle.addEventListener('click', () => {
      const isAct = mobileMockupToggle.classList.toggle('active');
      mobileMockupToggle.setAttribute('aria-checked', isAct);
      if (state.selectedCombo && state.selectedCombo.colors) {
        const c1 = state.selectedCombo.colors[0];
        mobileMockupToggle.style.backgroundColor = isAct ? c1.hex : '';
      }
    });
  }

  // Interactive Mobile Bottom Navigation Tabs
  if (mobileBottomNav) {
    mobileBottomNav.addEventListener('click', e => {
      const tab = e.target.closest('.phone-nav-tab');
      if (!tab) return;
      mobileBottomNav.querySelectorAll('.phone-nav-tab').forEach(t => {
        t.classList.remove('active');
        t.style.color = '';
      });
      tab.classList.add('active');
      if (state.selectedCombo && state.selectedCombo.colors) {
        const c1 = state.selectedCombo.colors[0];
        const isLight = state.canvasThemeMode === 'light';
        const navBgHex = isLight ? '#ffffff' : '#191816';
        tab.style.color = getReadableAccentOnSurface(c1.hex, navBgHex, isLight);
      }
    });
  }

  // Fashion Atelier: Climate Switch (Tropical vs Winter)
  if (climateBtns) {
    climateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        climateBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.outfitClimate = btn.dataset.climate;
        updateMockup();
        updateExportCode();
      });
    });
  }

  // Fashion Atelier: Hijab Toggle Switch
  if (fashionHijabToggle) {
    fashionHijabToggle.addEventListener('click', () => {
      state.outfitHijab = !state.outfitHijab;
      fashionHijabToggle.classList.toggle('active', state.outfitHijab);
      fashionHijabToggle.setAttribute('aria-pressed', state.outfitHijab);
      if (fashionHijabBadge) {
        fashionHijabBadge.textContent = state.outfitHijab ? 'ON' : 'OFF';
      }
      // Clean up incompatible headwear when switching modesty mode
      if (state.outfitCustomPieces && state.outfitCustomPieces.headwear) {
        const cat = GARMENT_CATALOG.headwear[state.outfitCustomPieces.headwear];
        if (cat) {
          if (state.outfitHijab && cat.contemporaryOnly) {
            delete state.outfitCustomPieces.headwear;
          } else if (!state.outfitHijab && cat.hijabOnly) {
            delete state.outfitCustomPieces.headwear;
          }
        }
      }
      updateMockup();
      updateExportCode();
    });
  }

  // Fashion Atelier: Interactive In-Card Garment Customization
  if (fashionEnsembleGrid) {
    fashionEnsembleGrid.addEventListener('change', (e) => {
      const select = e.target.closest('.ensemble-type-select');
      if (!select) return;
      const layer = select.dataset.layer;
      const val = select.value;
      if (!state.outfitCustomPieces) state.outfitCustomPieces = {};
      if (val === 'default') {
        delete state.outfitCustomPieces[layer];
      } else {
        state.outfitCustomPieces[layer] = val;
      }
      updateMockup();
      updateExportCode();
    });
  }

  // Fashion Atelier: Reset All Custom Pieces to Vibe Defaults
  const btnResetEnsemblePieces = document.getElementById('btnResetEnsemblePieces');
  if (btnResetEnsemblePieces) {
    btnResetEnsemblePieces.addEventListener('click', () => {
      state.outfitCustomPieces = {};
      updateMockup();
      updateExportCode();
      showToast('Reset all wardrobe pieces to occasion defaults');
    });
  }

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

  // Site Dark/Light theme toggle - unified with global theme
  if (siteThemeToggle) {
    siteThemeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      setGlobalTheme(next);
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

const CURATED_VIBES = [
  'casual_walk',
  'office_meeting',
  'romantic_date',
  'evening_party',
  'kondangan_wedding',
  'family_arisan',
  'vacation_resort',
  'campus_casual'
];

const fashionProfiles = {
  casual_walk: {
    name: 'Casual Walk & Coffee Hangout',
    sub: 'Santai & Weekend Café Walk',
    genre: 'Relaxed Smart-Casual / Effortless Street',
    suitability: 'Café visits, weekend walks, casual daytime meetups, city strolls',
    swatchRoles: {
      2: ['Primary Layer & Silhouette', 'Foundation Shirt & Slides'],
      3: ['Relaxed Outer Layer', 'Breathable Inner Shirt', 'Comfort-Fit Trousers'],
      4: ['Relaxed Outer Layer', 'Breathable Inner Shirt', 'Comfort-Fit Trousers', 'Footwear & Slouchy Bag']
    },
    climates: {
      tropical: {
        backdrop: 'Sunlit modern open-air aesthetic café patio in Jakarta with lush tropical monstera foliage, soft natural morning daylight',
        items: {
          outerwear: { name: 'Unstructured Linen Overshirt', material: 'Breathable washed 100% slub European flax linen' },
          shirt: { name: 'Relaxed Boxy Cotton Tee', material: '220gsm combed organic Supima cotton' },
          bottoms: { name: 'High-Waist Fluid Linen Culottes', material: 'Airy linen-rayon drape with elasticized back waistband' },
          footwear: { name: 'Minimalist Leather Slides', material: 'Supple tan calfskin leather with cushioned anatomical footbed' },
          socks: { name: 'Invisible No-Show Bamboo Socks', material: 'Breathable anti-slip bamboo cotton' },
          bag: { name: 'Slouchy Linen-Canvas Hobo Bag', material: 'Natural unbleached canvas with wide shoulder strap' },
          headwear: { name: 'Tortoiseshell Acetate Hair Clip', material: 'Hand-polished tortoiseshell-finish bio-acetate claw clip' }
        },
        hijabItems: {
          outerwear: { name: 'Flowing Duster Kimono Cardigan', material: 'Ultra-light crinkled airy viscose with graceful motion' },
          shirt: { name: 'Long-Sleeve Modest Inner Top', material: 'Coolmax breathable bamboo-cotton blend with high crewneck' },
          bottoms: { name: 'Wide-Leg Palazzo Trousers', material: 'Fluid non-clinging matte tencel twill' },
          footwear: { name: 'Modern Low Block Mules', material: 'Soft lambskin leather with comfortable 3cm stacked block heel' },
          socks: { name: 'Breathable Wudhu-Friendly Socks', material: 'Odor-resistant modal cotton with stretch ribbed cuff' },
          bag: { name: 'Slouchy Crescent Crossbody Bag', material: 'Buttery vegan leather with minimalist brushed metal buckle' },
          headwear: { name: 'Premium Voal Draped Hijab', material: 'Finely spun ultrafine Arabian voal scarf, breathable and easy to shape' }
        }
      },
      winter: {
        backdrop: 'Crisp autumn city street in Tokyo with golden ginkgo trees and soft overcast diffused daylight',
        items: {
          outerwear: { name: 'Relaxed Cocoon Wool Overcoat', material: 'Mid-weight double-faced virgin wool blend' },
          shirt: { name: 'Fine-Gauge Merino Knit Sweater', material: 'Ultra-soft 19.5-micron Australian merino wool' },
          bottoms: { name: 'Relaxed Wide Corduroy Trousers', material: 'Soft 8-wale cotton corduroy with deep slant pockets' },
          footwear: { name: 'Chunky Lug-Sole Chelsea Boots', material: 'Water-resistant box-calf leather with elastic gore' },
          socks: { name: 'Thermal Ribbed Wool Socks', material: 'Cushioned merino wool blend in heathered knit' },
          bag: { name: 'Structured Padded Crossbody Bag', material: 'Matte water-repellent nylon twill with leather trim' },
          headwear: { name: 'Ribbed Cashmere Knit Beanie', material: 'Folded cuff seamless 2-ply Scottish cashmere' }
        },
        hijabItems: {
          outerwear: { name: 'Longline Tailored Wool Duster', material: 'Warm double-weave wool gabardine with clean concealed placket' },
          shirt: { name: 'High-Neck Cashmere-Blend Knit', material: 'Soft seamless cashmere-modal thermal knit with relaxed turtleneck' },
          bottoms: { name: 'Fluid Wool-Blend Maxi Skirt', material: 'A-line silhouette in warm draped wool flannel' },
          footwear: { name: 'Leather Square-Toe Ankle Boots', material: 'Supple full-grain calf leather with low wooden block heel' },
          socks: { name: 'Thermal Brushed Cashmere Tights', material: 'Opaque 120D warm thermal fleece-lined knit' },
          bag: { name: 'Structured Minimalist Leather Tote', material: 'Pebbled Italian leather with magnetic closure' },
          headwear: { name: 'Cashmere-Modal Warm Pashmina Hijab', material: 'Draped warm cashmere-modal blend scarf with soft fringe edges' }
        }
      }
    }
  },

  office_meeting: {
    name: 'Office & Business Meeting',
    sub: 'Meeting Kantor & Formal Professional',
    genre: 'Modern Executive Tailoring / Power Elegance',
    suitability: 'Boardroom meetings, client presentations, conferences, corporate office',
    swatchRoles: {
      2: ['Executive Tailored Blazer', 'Under-Layer Blouse & Slingback Pumps'],
      3: ['Tailored Single-Breasted Blazer', 'Silk Charmeuse Blouse', 'High-Rise Straight Trousers'],
      4: ['Tailored Single-Breasted Blazer', 'Silk Charmeuse Blouse', 'High-Rise Straight Trousers', 'Pointed Heels & Structured Brief-Tote']
    },
    climates: {
      tropical: {
        backdrop: 'Modern glass high-rise executive meeting suite in Sudirman Jakarta, soft ambient morning interior lighting',
        items: {
          outerwear: { name: 'Tropical Wool Relaxed Blazer', material: 'Breathable lightweight high-twist tropical wool with half-lining' },
          shirt: { name: 'Silk-Blend Collarless Blouse', material: 'Matte silk-crepe with clean concealed front placket' },
          bottoms: { name: 'High-Rise Ankle-Length Trousers', material: 'Fluid wrinkle-resistant stretch twill with crisp center crease' },
          footwear: { name: 'Pointed Slingback Kitten Heels', material: 'Polished calfskin leather with comfortable 4.5cm slim heel' },
          socks: { name: 'Sheer Breathable Hosiery Socks', material: 'Fine 15-denier mercerized nylon with reinforced toe' },
          bag: { name: 'Architectural Leather Work Tote', material: 'Structured full-grain saffiano leather fitting 14-inch laptop' },
          headwear: { name: 'Sleek Minimal Gold Hair Barrette', material: 'Brushed 18k gold-plated brass geometric clasp' }
        },
        hijabItems: {
          outerwear: { name: 'Tailored Longline Executive Blazer', material: 'Breathable tropical poly-viscose blend with graceful hip-length drape' },
          shirt: { name: 'High-Neck Crepe Tunic Blouse', material: 'Airy non-sheer crepe-de-chine with modest gathered cuff' },
          bottoms: { name: 'Straight-Leg Tailored Slack Trousers', material: 'Fluid tropical wool-blend with elegant tailored drape' },
          footwear: { name: 'Classic Block-Heel Leather Pumps', material: 'Supple kidskin leather with cushioned leather insole' },
          socks: { name: 'Breathable Modest Tights Socks', material: 'Opaque matte 40D microfibre with wudhu opening' },
          bag: { name: 'Structured Executive Satchel Bag', material: 'Full-grain box leather with brass lock hardware' },
          headwear: { name: 'Clean Silk-Voal Executive Hijab', material: 'Crisp Japanese silk-cotton voal neatly styled in formal corporate wrap' }
        }
      },
      winter: {
        backdrop: 'Sleek minimalist corporate atrium in Seoul, floor-to-ceiling glass overlooking cold misty winter skyline',
        items: {
          outerwear: { name: 'Double-Breasted Wool Twill Blazer', material: 'Heavyweight virgin wool twill with horn buttons' },
          shirt: { name: 'Cashmere-Silk Mockneck Knit', material: 'Fine 16-gauge Mongolian cashmere-silk yarn' },
          bottoms: { name: 'Pleated Flannel Wide-Leg Trousers', material: 'Heavy Yorkshire wool flannel with deep front pleats' },
          footwear: { name: 'Leather Pointed Ankle Boots', material: 'Smooth glazed calfskin with sculptural Cuban heel' },
          socks: { name: 'Fine Merino Wool Dress Socks', material: 'Over-the-calf rib knit merino wool' },
          bag: { name: 'Structured Polished Leather Brief-Tote', material: 'Rigid vegetable-tanned bridle leather' },
          headwear: { name: 'Fine Cashmere Band Headband', material: 'Soft rib-knit pure cashmere padded hairband' }
        },
        hijabItems: {
          outerwear: { name: 'Double-Weave Wool Trench Coat', material: 'Heavy structured Italian wool melton with waist sash' },
          shirt: { name: 'High-Neck Wool Base Layer Blouse', material: 'Seamless extrafine merino knit with neat mock neckline' },
          bottoms: { name: 'Tailored Wool Flannel Maxi Skirt', material: 'Heavy drape A-line maxi silhouette with back walking pleat' },
          footwear: { name: 'Chic Leather Riding-Style Boots', material: 'Supple full-grain calf leather with stacked wood sole' },
          socks: { name: 'Thermal Wool-Blend Modest Tights', material: 'Opaque 100D heat-retention thermal knit' },
          bag: { name: 'Minimalist Lock Leather Tote', material: 'Hand-burnished Italian calfskin with brushed gold clasp' },
          headwear: { name: 'Fine Cashmere Pashmina Hijab', material: 'Luxurious featherlight cashmere scarf draped in clean modest folds' }
        }
      }
    }
  },

  romantic_date: {
    name: 'Romantic Date Night',
    sub: 'Kencan & Romantic Dinner',
    genre: 'Feminine Sophistication / Modern Romance',
    suitability: 'Candlelit dinner, fine dining, art gallery evening, rooftop wine date',
    swatchRoles: {
      2: ['Fluid Draped Silhouette Layer', 'Silk Foundation Slip & Strappy Heels'],
      3: ['Light Draped Wrap Jacket', 'Fluid Silk Charmeuse Camisole / Top', 'Bias-Cut Silk Midi Skirt'],
      4: ['Light Draped Wrap Jacket', 'Fluid Silk Charmeuse Top', 'Bias-Cut Silk Skirt', 'Stiletto Heels & Satin Evening Bag']
    },
    climates: {
      tropical: {
        backdrop: 'Dimly lit romantic garden restaurant veranda in Seminyak Bali, candlelit tables and warm glowing lanterns',
        items: {
          outerwear: { name: 'Sheer Organza Draped Wrap Shrug', material: 'Lightweight silk-organza with delicate rolled hems' },
          shirt: { name: 'Cowl-Neck Sand-Washed Silk Top', material: 'Fluid 19mm Mulberry silk satin with soft drape' },
          bottoms: { name: 'Bias-Cut Fluid Satin Midi Skirt', material: 'Heavy silk-rayon satin clinging gracefully with movement' },
          footwear: { name: 'Delicate Strappy Stiletto Sandals', material: 'Supple metallic-sheen nappa leather with 6.5cm slender heel' },
          socks: { name: 'Bare-Leg Invisible Toe Gel Pad', material: 'Comfort silicone forefoot cushioning' },
          bag: { name: 'Miniature Ruched Satin Evening Clutch', material: 'Gathered silk satin with delicate jeweled clasp' },
          headwear: { name: 'Pearl & Silk Drop Ear Cuff Pin', material: 'Freshwater Baroque pearl with 14k gold chain accents' }
        },
        hijabItems: {
          outerwear: { name: 'Flowing Silk Satin Belted Kimono', material: 'Fluid high-luster silk satin with matching waist tie' },
          shirt: { name: 'High-Collar Modest Silk Tunic', material: 'Pure sandwashed Habotai silk with delicate neck gathers' },
          bottoms: { name: 'Pleated Lustrous Satin Maxi Skirt', material: 'Fine accordion-pleated silk satin in sweeping maxi length' },
          footwear: { name: 'Pointed Satin Kitten-Heel Mules', material: 'Lustrous satin upper with subtle crystal buckle embellishment' },
          socks: { name: 'Silky Sheer Modest Foot Cover', material: 'Ultra-thin breathable nude nylon with reinforced sole' },
          bag: { name: 'Structured Mini Leather Vanity Box', material: 'Embossed lizard-print leather with gold-tone chain strap' },
          headwear: { name: 'Draped Satin-Crepe Pashmina Hijab', material: 'Silky sheen crepe pashmina scarf pinned in romantic cascading folds' }
        }
      },
      winter: {
        backdrop: 'Intimate French bistro restaurant in Paris on a rainy winter evening, warm candle glow through foggy window panes',
        items: {
          outerwear: { name: 'Belted Draped Wool Wrap Coat', material: 'Plush brushed alpaca-wool blend with wide shawl lapels' },
          shirt: { name: 'Fitted Cashmere Ribbed Sweetheart Top', material: 'Fine 14-gauge cashmere with sweetheart neckline' },
          bottoms: { name: 'Velvet Bias-Cut Column Skirt', material: 'Deep-pile silk velvet with dramatic fluid drape' },
          footwear: { name: 'Sleek Leather Knee-High Boots', material: 'Polished calfskin leather with tapered 7cm stiletto heel' },
          socks: { name: 'Sheer Black 20D Polka-Dot Tights', material: 'French lace-pattern sheer stretch hosiery' },
          bag: { name: 'Quilted Leather Shoulder Flap Bag', material: 'Supple lambskin with antique gold chain link strap' },
          headwear: { name: 'Vintage French Wool Beret', material: 'Molded French merino felted wool in classic pillbox tilt' }
        },
        hijabItems: {
          outerwear: { name: 'Shawl-Collar Longline Wool Coat', material: 'Luxurious double-faced cashmere-wool in sweeping maxi length' },
          shirt: { name: 'Gathered Neck Silk-Velvet Tunic', material: 'Lustrous silk-velvet top with modest high jewel neckline' },
          bottoms: { name: 'Fluid Satin-Faced Wool Maxi Skirt', material: 'A-line column silhouette in heavy midnight drape' },
          footwear: { name: 'Leather Pointed Ankle Heeled Boots', material: 'Glazed kidskin leather with slim architectural heel' },
          socks: { name: 'Thermal Brushed Modest Tights', material: 'Opaque 80D warm microfiber tights' },
          bag: { name: 'Velvet Evening Minaudière Bag', material: 'Rich crushed velvet with ornate jeweled clasp' },
          headwear: { name: 'Plush Silk-Cashmere Pashmina Hijab', material: 'Warm silk-cashmere blend pashmina draped with regal softness' }
        }
      }
    }
  },

  evening_party: {
    name: 'Party & Evening Soirée',
    sub: 'Pesta & Night Out Celebration',
    genre: 'Glamorous Evening Couture / Contemporary Chic',
    suitability: 'Cocktail party, social celebration, gala evening, rooftop soirée',
    swatchRoles: {
      2: ['Glamour Outer Piece / Cape', 'Liquid Metallic Silk & Evening Heels'],
      3: ['Sculptural Party Blazer', 'Liquid Silk Slip Top', 'High-Shine Statement Trousers'],
      4: ['Sculptural Party Blazer', 'Liquid Silk Slip Top', 'Statement Trousers', 'Metallic Sandals & Crystal Clutch']
    },
    climates: {
      tropical: {
        backdrop: 'High-end rooftop open-air cocktail lounge in Jakarta under twilight cityscape lights and ambient deep house music',
        items: {
          outerwear: { name: 'Sleeveless Tailored Long Tuxedo Vest', material: 'Crisp tropical wool with lustrous satin peak lapels' },
          shirt: { name: 'Liquid Metallic Lamé Halter Top', material: 'Shimmering metallic-thread micro-jersey with fluid drape' },
          bottoms: { name: 'High-Waist Fluid Satin Wide Pants', material: 'Heavy Japanese crepe-satin with liquid movement' },
          footwear: { name: 'Crystal-Embellished Strappy Heels', material: 'Metallic leather with shimmering crystal micro-straps' },
          socks: { name: 'Invisible Comfort Gel Arch Insole', material: 'Non-slip shock-absorbing footbed' },
          bag: { name: 'Hard-Shell Metallic Minaudière', material: 'Polished mirrored gold-tone brass clutch' },
          headwear: { name: 'Crystal Cascading Drop Hairpins', material: 'Art deco faceted zirconias set in sterling silver' }
        },
        hijabItems: {
          outerwear: { name: 'Embellished Tailored Evening Blazer', material: 'Rich brocade jacquard with subtle metallic lurex threading' },
          shirt: { name: 'High-Collar Silk Satin Blouse', material: 'High-shine heavy silk satin with elegant bishop sleeves' },
          bottoms: { name: 'Fluid Floor-Length Satin Palazzo', material: 'High-density crepe-backed satin with sweeping hemline' },
          footwear: { name: 'Pointed Metallic Leather Pumps', material: 'Mirror-finish champagne specchio leather with 7.5cm heel' },
          socks: { name: 'Opaque Stretch Microfibre Socks', material: 'Matte black anti-static nylon knit' },
          bag: { name: 'Crystal Mesh Slouchy Evening Pouch', material: 'Sparkling crystal-mesh sack with satin drawstring' },
          headwear: { name: 'Shimmer Chiffon Draped Hijab', material: 'Gently glittering micro-shimmer chiffon hijab styled in clean red-carpet drape' }
        }
      },
      winter: {
        backdrop: 'Opulent Grand Hotel ballroom lounge in Vienna during winter gala season, crystal chandeliers and marble arches',
        items: {
          outerwear: { name: 'Tailored Tuxedo Velvet Jacket', material: 'Deep midnight silk-velvet with hand-quilted silk lining' },
          shirt: { name: 'Lace-Appliqué Silk Corset Top', material: 'Chantilly French lace over bonded silk mesh structure' },
          bottoms: { name: 'Sequined Floor-Length Column Skirt', material: 'Micro-sequin embroidery on fluid stretch velvet' },
          footwear: { name: 'Velvet Pointed-Toe Platform Stilettos', material: 'Plush velvet upper with sculptural bevelled platform' },
          socks: { name: 'Lurex Metallic Sheer Tights', material: 'Subtle shimmer metallic-thread 30D stretch hosiery' },
          bag: { name: 'Jewel-Encrusted Box Evening Bag', material: 'Solid metal box frame encrusted with pavé crystals' },
          headwear: { name: 'Velvet Halo Cocktail Headband', material: 'Padded silk-velvet band with hand-sewn crystal accents' }
        },
        hijabItems: {
          outerwear: { name: 'Maxi Velvet Evening Cape Coat', material: 'Regal silk-velvet longline cape with satin trim' },
          shirt: { name: 'Brocade Embellished Longline Tunic', material: 'Rich jacquard silk woven with metallic embroidery motifs' },
          bottoms: { name: 'Wide Trailing Crepe-Satin Trousers', material: 'Heavy weighted crepe-satin with tailored front pleat' },
          footwear: { name: 'Lacquered Pointed Evening Boots', material: 'Patent calfskin leather with tapered golden heel' },
          socks: { name: 'Thermal Brushed Opaque Hosiery', material: '100D heat-insulating fleece-backed tights' },
          bag: { name: 'Gilded Brass Clasp Velvet Clutch', material: 'Deep jewel-tone silk velvet with antique brass frame' },
          headwear: { name: 'Opulent Silk-Satin Shimmer Hijab', material: 'Lustrous Turkish silk-satin scarf pinned with a fine crystal brooch' }
        }
      }
    }
  },

  kondangan_wedding: {
    name: 'Kondangan & Wedding Reception',
    sub: 'Pesta Pernikahan & Formal Celebration',
    genre: 'Indonesian Festive Heritage / Modern Kebaya & Brocade',
    suitability: 'Indonesian wedding receptions (kondangan), formal cultural ceremonies, grand ballroom celebrations',
    swatchRoles: {
      2: ['Embroidered Kebaya Outer / Wrap', 'Batik Silk Skirt & Beaded Mules'],
      3: ['Organza Embroidered Kebaya Outer', 'Silk Camisole / Inner Bustier', 'Modern Batik Prada Drape Skirt'],
      4: ['Organza Embroidered Kebaya Outer', 'Silk Camisole / Inner', 'Batik Prada Drape Skirt', 'Embellished Mules & Beaded Pouch']
    },
    climates: {
      tropical: {
        backdrop: 'Luxurious Indonesian wedding ballroom foyer in Jakarta, opulent floral installations, warm golden chandeliers and jasmine aroma',
        items: {
          outerwear: { name: 'Modern Organza Kebaya Outer', material: 'Sheer glass organza embroidered with delicate floral motifs and silver cord' },
          shirt: { name: 'Fitted Silk Satin Camisole Bustier', material: 'Draped Mulberry silk satin with supportive boning' },
          bottoms: { name: 'Draped Modern Batik Prada Wrap Skirt', material: 'Hand-drawn Pekalongan batik silk with genuine gold leaf prada outlines' },
          footwear: { name: 'Crystal Pointed Embellished Mules', material: 'Sheer mesh and metallic nappa leather with Swarovski crystal brooches' },
          socks: { name: 'Invisible Non-Slip Forefoot Cushion', material: 'Anti-friction silicone pad' },
          bag: { name: 'Hand-Beaded Indonesian Pouch (Kinchaku)', material: 'Gold bullion beadwork on silk velvet with silk tassels' },
          headwear: { name: 'Traditional Modern Sirkam Hair Comb', material: 'Handcrafted filigree brass plated in 24k gold with zirconias' }
        },
        hijabItems: {
          outerwear: { name: 'Full-Coverage Modern Modest Kebaya Tunic', material: 'French chantilly lace over full opaque silk furing with payet beadwork' },
          shirt: { name: 'Inner High-Neck Silk Satin Furing', material: 'Non-sheer cooling breathable silk-rayon knit foundation layer' },
          bottoms: { name: 'Batik Tulis Silk Mermaid Maxi Skirt', material: 'Authentic handmade batik tulis on smooth primissima silk in modest floor-length' },
          footwear: { name: 'Pointed Satin Mules with Pearl Brooch', material: 'Lustrous silk satin with clustered freshwater pearl buckle' },
          socks: { name: 'Opaque Nude Modest Wudhu Socks', material: 'Soft modal cotton in skin-tone shade' },
          bag: { name: 'Embroidered Velvet Clasp Clutch', material: 'Royal velvet with intricate gold thread embroidery' },
          headwear: { name: 'Lustrous Silk Voal Clean-Wrap Hijab', material: 'Premium Ultrafine Voal silk scarf with neat symmetrical chin fold and golden pin' }
        }
      },
      winter: {
        backdrop: 'Grand historic manor salon decorated for a winter banquet, warm roaring fireplace and evergreen floral garlands',
        items: {
          outerwear: { name: 'Velvet Embroidered Long Kebaya Coat', material: 'Heavy silk-velvet with hand-embroidered metallic thread borders' },
          shirt: { name: 'Silk Jacquard High-Neck Inner Blouse', material: 'Rich brocade weave with floral damask motifs' },
          bottoms: { name: 'Floor-Length Silk Brocade Column Skirt', material: 'Heavyweight metallic jacquard with structured drape' },
          footwear: { name: 'Velvet Pointed Evening Pumps', material: 'Black cherry velvet with embellished crystal stiletto heel' },
          socks: { name: 'Warm Sheer 40D Silk-Lined Tights', material: 'Dual-layer optical sheer thermal hosiery' },
          bag: { name: 'Antique Gold Filigree Box Clutch', material: 'Intricate pierced brass metalwork with silk velvet lining' },
          headwear: { name: 'Velvet & Pearl Ornate Hair Ornament', material: 'Couture hairpiece with hand-twisted golden wire and seed pearls' }
        },
        hijabItems: {
          outerwear: { name: 'Regal Velvet Longline Modest Kebaya Coat', material: 'Opulent silk velvet encrusted with tone-on-tone payet and brocade facings' },
          shirt: { name: 'Thermal Silk-Cashmere High Neck Top', material: 'Ultra-thin insulating silk-cashmere foundation inner' },
          bottoms: { name: 'Brocade Jacquard Floor-Length Maxi Skirt', material: 'Stately Japanese silk brocade with golden thread motifs' },
          footwear: { name: 'Pointed Velvet Ankle Boots', material: 'Supple velvet upper with jeweled ankle strap buckle' },
          socks: { name: 'Thermal Brushed Modest Tights', material: 'Heavy 120D warm thermal fleece-lined tights' },
          bag: { name: 'Gold-Embroidered Velvet Envelope Bag', material: 'Hand-sewn gold bullion embroidery on deep velvet' },
          headwear: { name: 'Opulent Turkish Silk Satin Hijab', material: 'High-density Turkish silk scarf styled in structured formal wedding wrap' }
        }
      }
    }
  },

  family_arisan: {
    name: 'Family Gathering & Arisan',
    sub: 'Acara Keluarga & Upscale Arisan',
    genre: 'Graceful Semi-Formal / Modest Demure Chic',
    suitability: 'Arisan luncheons, family reunions, Eid festive gatherings, upscale high-tea',
    swatchRoles: {
      2: ['Fluid Pleated Outer Robe', 'Breathable Silk Tunic & Loafers'],
      3: ['Accordion-Pleat Plissé Duster', 'Soft Silk Knit Top', 'Wide Fluid Pleated Trousers'],
      4: ['Accordion-Pleat Plissé Duster', 'Silk Knit Top', 'Wide Pleated Trousers', 'Leather Loafers & Woven Tote']
    },
    climates: {
      tropical: {
        backdrop: 'Sun-drenched botanical garden veranda dining terrace in Bandung, warm natural teak furniture and orchid planters',
        items: {
          outerwear: { name: 'Airy Plissé Draped Long Cardigan', material: 'Heat-set micro-pleated lightweight chiffon with soft movement' },
          shirt: { name: 'Sand-Washed Silk Short-Sleeve Top', material: 'Breathable 16mm Habotai silk with relaxed neckline' },
          bottoms: { name: 'Fluid Wide-Leg Plissé Culottes', material: 'High-twist micro-pleated crepe with comfortable elastic waist' },
          footwear: { name: 'Woven Leather Low Block Mules', material: 'Hand-braided lambskin leather with 3.5cm wooden block heel' },
          socks: { name: 'Invisible Bamboo Anti-Slip Liners', material: 'Cooling moisture-wicking organic bamboo' },
          bag: { name: 'Artisanal Woven Leather Basket Bag', material: 'Intricate intrecciato woven supple calfskin' },
          headwear: { name: 'Silk Scrunchie & Acetate Hair Clip', material: '100% Mulberry silk scrunchie with pastel marbled acetate pin' }
        },
        hijabItems: {
          outerwear: { name: 'Modern Pleated Longline Abaya Coat', material: 'Flowing heat-set accordion plissé georgette in pastel harmony' },
          shirt: { name: 'Long-Sleeve Cooling Inner Tunic', material: 'Airy Tencel-modal jersey with modest relaxed neckline' },
          bottoms: { name: 'Wide-Leg Fluid Crepe Palazzo Pants', material: 'Non-sheer heavy georgette crepe with graceful sway' },
          footwear: { name: 'Pointed Loafer Mules with Gold Bit', material: 'Soft cream calfskin with miniature horsebit hardware' },
          socks: { name: 'Breathable Cotton Modest Anklets', material: 'Ribbed Supima cotton in matching tone' },
          bag: { name: 'Soft Slouchy Leather Top-Handle Bag', material: 'Pebbled Italian leather with braided handle' },
          headwear: { name: 'Laser-Cut Edge Premium Voal Hijab', material: 'Ultrafine voal scarf with delicate scalloped laser-cut edges' }
        }
      },
      winter: {
        backdrop: 'Warm sunlit living room of a heritage countryside estate, soft woolen rugs and steaming afternoon tea',
        items: {
          outerwear: { name: 'Fine Merino Wool Long Cardigan', material: 'Superfine 100% merino knit with patch pockets' },
          shirt: { name: 'Pleated Chiffon Long-Sleeve Blouse', material: 'Double-layered crepe chiffon with buttoned cuffs' },
          bottoms: { name: 'Pleated A-Line Wool-Blend Skirt', material: 'Medium-weight wool blend with sharp permanent pleats' },
          footwear: { name: 'Classic Leather Penny Loafers', material: 'Polished box leather with stacked leather heel' },
          socks: { name: 'Cashmere-Blend Ribbed Knee Socks', material: 'Warm heathered cashmere-wool knit' },
          bag: { name: 'Structured Leather Saddle Bag', material: 'Vegetable-tanned smooth saddle leather' },
          headwear: { name: 'Knit Wool Headband Wrap', material: 'Soft honeycomb stitch merino wool ear-warmer headband' }
        },
        hijabItems: {
          outerwear: { name: 'Belted Cashmere-Wool Maxi Cardigan', material: 'Plush 7-gauge cashmere knit with self-tie knit belt' },
          shirt: { name: 'High-Neck Draped Silk-Modal Top', material: 'Warm insulating silk-modal thermal blend' },
          bottoms: { name: 'Pleated Wool Maxi Column Skirt', material: 'Sweeping maxi length in warm fluid wool blend' },
          footwear: { name: 'Square-Toe Leather Loafer Boots', material: 'Supple full-grain calfskin with low block heel' },
          socks: { name: 'Thermal Opaque Modest Tights', material: '100D heat-retention microfiber knit' },
          bag: { name: 'Minimalist Leather Shoulder Bag', material: 'Smooth calf leather with magnetic closure' },
          headwear: { name: 'Warm Modal-Cashmere Pashmina Hijab', material: 'Soft modal-cashmere blend scarf with gentle fringed trim' }
        }
      }
    }
  },

  vacation_resort: {
    name: 'Vacation & Resort Wear',
    sub: 'Liburan & Tropical Getaway',
    genre: 'Coastal Leisure & Resort Bohemian',
    suitability: 'Bali villa vacation, seaside resort, coastal dining, summer holiday',
    swatchRoles: {
      2: ['Breezy Resort Duster / Kimono', 'Airy Linen Slip & Raffia Slides'],
      3: ['Flowing Resort Robe Jacket', 'Breathable Ramie Cami Top', 'Tiered Linen-Cotton Maxi Skirt'],
      4: ['Flowing Resort Robe Jacket', 'Breathable Ramie Top', 'Tiered Maxi Skirt', 'Raffia Slides & Woven Straw Tote']
    },
    climates: {
      tropical: {
        backdrop: 'Serene open-air luxury tropical villa in Uluwatu Bali overlooking an azure infinity pool and ocean cliffs at golden hour',
        items: {
          outerwear: { name: 'Breezy Sheer Cotton Voile Kaftan', material: 'Featherlight 100% cotton voile with airy kimono sleeves' },
          shirt: { name: 'Cropped Linen Tie-Front Top', material: 'Pure natural flax linen with adjustable front tie knot' },
          bottoms: { name: 'Tiered Bohemian Linen Maxi Skirt', material: 'Voluminous multi-tiered breathable linen with raw-edge hem' },
          footwear: { name: 'Hand-Woven Raffia Minimal Slides', material: 'Natural Madagascar raffia weave with molded cork sole' },
          socks: { name: 'Barefoot Sandal Protection Strips', material: 'Invisible anti-chafe adhesive strips' },
          bag: { name: 'Oversized Hand-Plaited Straw Market Tote', material: 'Handwoven natural palm leaf straw with leather handles' },
          headwear: { name: 'Wide-Brim Sun Straw Boater Hat', material: 'Hand-braided wheat straw with grosgrain ribbon tie' }
        },
        hijabItems: {
          outerwear: { name: 'Flowing Tropical Kaftan Duster Coat', material: 'Airy crinkle-rayon blend with fluid sweeping movement' },
          shirt: { name: 'Long-Sleeve Breathable Linen Blouse', material: 'Pure natural European linen in loose modest cut' },
          bottoms: { name: 'Wide-Leg Drawstring Linen Trousers', material: 'Breathable washed linen with relaxed elasticated waistband' },
          footwear: { name: 'Woven Raffia Pointed Flat Mules', material: 'Natural vegetable-fiber upper with cushioned footbed' },
          socks: { name: 'Ultra-Thin Breathable Cotton Liners', material: 'Moisture-wicking mesh cotton' },
          bag: { name: 'Round Woven Rattan Crossbody Bag', material: 'Hand-smoked Balinese ata grass with genuine leather strap' },
          headwear: { name: 'Airy Crinkled Cotton Gauze Hijab', material: 'Lightweight breathable crinkle cotton gauze, no-pin effortless wrap' }
        }
      },
      winter: {
        backdrop: 'Alpine winter resort lodge in Niseko Hokkaido, snow-covered pine trees and warm outdoor steaming onsen',
        items: {
          outerwear: { name: 'Shearling-Trimmed Quilted Jacket', material: 'Water-repellent ripstop with genuine curly shearling collar' },
          shirt: { name: 'Chunky Fisherman Wool Sweater', material: '100% pure Irish wool cable-knit' },
          bottoms: { name: 'Thermal Corduroy Wide-Leg Pants', material: 'Thick 6-wale organic cotton corduroy' },
          footwear: { name: 'Shearling-Lined Winter Boots', material: 'Waterproof oiled nubuck with Vibram arctic-grip sole' },
          socks: { name: 'Heavyweight Thermal Alpaca Socks', material: 'Cushioned baby alpaca wool low-tension knit' },
          bag: { name: 'Puffer Quilted Tote Bag', material: 'Down-filled ripstop nylon with reinforced canvas handles' },
          headwear: { name: 'Faux-Fur Trim Trapper Hat', material: 'Plush polar fleece with ear flaps' }
        },
        hijabItems: {
          outerwear: { name: 'Longline Down-Filled Puffer Duster', material: 'Lightweight water-repellent shell with 700-fill down insulation' },
          shirt: { name: 'High-Neck Thermal Merino Tunic', material: 'Seamless 200gsm merino wool base layer' },
          bottoms: { name: 'Fleece-Lined Wide Travel Trousers', material: 'Four-way stretch softshell with brushed thermal fleece interior' },
          footwear: { name: 'Thermal Leather Lace-Up Boots', material: 'Water-resistant oiled leather with warm wool lining' },
          socks: { name: 'Thermal Merino Wool Modest Tights', material: 'Heavy 140D thermal compression wool tights' },
          bag: { name: 'Padded Nylon Crossbody Sling', material: 'Waterproof composite fabric with chunky zip pulls' },
          headwear: { name: 'Thermal Knit Ribbed Balaclava Hijab', material: 'Seamless merino-cashmere knit providing full neck and head warmth' }
        }
      }
    }
  },

  campus_casual: {
    name: 'Campus & Student Casual',
    sub: 'Kuliah & Perpustakaan Minimalist',
    genre: 'Youthful Academia / Modern City Student',
    suitability: 'University classes, library study sessions, creative workshops, campus hangout',
    swatchRoles: {
      2: ['Relaxed Utility Jacket / Shacket', 'Campus Tee & Canvas Sneakers'],
      3: ['Oversized Cotton Utility Shacket', 'Ribbed Cotton Longsleeve', 'Relaxed Straight-Leg Denim'],
      4: ['Oversized Cotton Utility Shacket', 'Ribbed Longsleeve', 'Straight-Leg Denim', 'Retro Sneakers & Canvas Tote']
    },
    climates: {
      tropical: {
        backdrop: 'Sunlit modern university campus courtyard in Depok / Jakarta, brick paths, lush trees and open-air study benches',
        items: {
          outerwear: { name: 'Oversized Cotton Twill Shacket', material: 'Durable washed 8oz cotton drill with chest patch pockets' },
          shirt: { name: 'Ribbed Cotton Crewneck Baby Tee', material: 'Soft 100% combed cotton fine rib' },
          bottoms: { name: 'Relaxed High-Rise Straight Jeans', material: '11oz washed vintage-tint Japanese selvedge denim' },
          footwear: { name: 'Retro Low-Top Canvas Sneakers', material: 'Heavyweight organic cotton canvas with vulcanized rubber sole' },
          socks: { name: 'Retro Athletic Striped Crew Socks', material: 'Breathable slub cotton with cushioned sole' },
          bag: { name: 'Heavy 24oz Canvas Student Tote', material: 'Kurashiki cotton canvas with interior bottle pocket' },
          headwear: { name: 'Unstructured Washed Cotton Baseball Cap', material: 'Vintage enzyme-washed chino cotton with tonal embroidery' }
        },
        hijabItems: {
          outerwear: { name: 'Relaxed Oversized Utility Jacket', material: 'Lightweight breathable cotton-tencel blend with drawstring waist' },
          shirt: { name: 'Long-Sleeve Striped Modest Top', material: 'Comfortable breathable cotton jersey with high crewneck' },
          bottoms: { name: 'Wide-Leg Baggy Mom Jeans', material: '100% cotton non-stretch vintage wash denim in loose modest fit' },
          footwear: { name: 'Minimalist White Leather Court Sneakers', material: 'Soft full-grain calf leather with gum rubber sole' },
          socks: { name: 'Cushioned Ribbed Cotton Socks', material: 'Arch-support athletic cotton knit' },
          bag: { name: 'Multi-Pocket Canvas Messenger Bag', material: 'Water-resistant coated canvas fitting 15-inch laptop and books' },
          headwear: { name: 'Clean Everyday Cotton-Voal Hijab', material: 'Durable soft cotton voal neatly pinned in effortless campus wrap' }
        }
      },
      winter: {
        backdrop: 'Historic university library quad in Oxford during late autumn, fallen red maple leaves and stone arches',
        items: {
          outerwear: { name: 'Oversized Varsity Wool Bomber', material: 'Heavy melton wool body with genuine leather sleeve accents' },
          shirt: { name: 'Chunky Cable-Knit Wool Sweater', material: 'Warm spun British Shetland wool with ribbed collar' },
          bottoms: { name: 'Pleated Wool-Blend Schoolboy Trousers', material: 'High-waist houndstooth wool with cuffed hem' },
          footwear: { name: 'Chunky Lug-Sole Oxford Brogues', material: 'Polished burgundy box calfskin with Goodyear-welted sole' },
          socks: { name: 'Chunky Marled Wool Boot Socks', material: 'Warm twisted-yarn Scottish wool knit' },
          bag: { name: 'Structured Leather Satchel Backpack', material: 'Hand-oiled pull-up leather with traditional brass buckle straps' },
          headwear: { name: 'Cable-Knit Wool Beanie Hat', material: 'Extra-warm ribbed cuff pure wool knit' }
        },
        hijabItems: {
          outerwear: { name: 'Longline Wool-Blend Duffle Coat', material: 'Heavy wool melton with classic horn toggle closures' },
          shirt: { name: 'High-Neck Cable-Knit Tunic Sweater', material: 'Soft merino-cashmere blend in relaxed modest length' },
          bottoms: { name: 'Pleated Wool Maxi A-Line Skirt', material: 'Warm tailored wool blend in classic academic check' },
          footwear: { name: 'Leather Chelsea Ankle Boots', material: 'Water-resistant oiled leather with rugged commando sole' },
          socks: { name: 'Thermal Fleece-Lined Modest Tights', material: 'Opaque 120D warm microfiber knit' },
          bag: { name: 'Classic Leather School Satchel', material: 'Rich vintage brown saddle leather with top carry handle' },
          headwear: { name: 'Warm Fine-Knit Ribbed Hijab', material: 'Stretchy lightweight wool-modal knit for cozy cold-weather coverage' }
        }
      }
    }
  }
};

// Aliases for backward compatibility
fashionProfiles.minimalist = fashionProfiles.office_meeting;
fashionProfiles.neotrad = fashionProfiles.kondangan_wedding;
fashionProfiles.gorpcore = fashionProfiles.vacation_resort;
fashionProfiles.avantgarde = fashionProfiles.evening_party;
fashionProfiles.showa = fashionProfiles.romantic_date;
fashionProfiles.cityboy = fashionProfiles.casual_walk;
fashionProfiles.darktechwear = fashionProfiles.evening_party;
fashionProfiles.zenlinen = fashionProfiles.family_arisan;
fashionProfiles.boro = fashionProfiles.campus_casual;
fashionProfiles.oscar = fashionProfiles.kondangan_wedding;

const BACKGROUND_PRESETS = {
  auto: {
    id: 'auto',
    name: 'Auto (Occasion Setting)',
    icon: '🎯',
    sub: 'Matches selected outfit occasion vibe',
    climates: null
  },
  wardrobe: {
    id: 'wardrobe',
    name: 'Walk-in Wardrobe & Mirror',
    icon: '🚪',
    sub: 'Dressing suite & arched mirror',
    climates: {
      tropical: 'Modern luxury sun-drenched walk-in closet with warm oak cabinetry, full-length arched standing mirror, soft neutral linen curtains filtering warm morning daylight',
      winter: 'Warm minimalist high-end dressing suite, rich walnut shelving, warm 2700K recessed cove lighting, plush wool bouclé rug, elegant bronze full-length mirror'
    }
  },
  cafe: {
    id: 'cafe',
    name: 'Aesthetic Boutique Café',
    icon: '☕',
    sub: 'Open-air patio & coffee tables',
    climates: {
      tropical: 'Sunlit open-air aesthetic boutique café patio in Jakarta, warm natural timber tables, lush potted monstera and fiddle-leaf fig plants, warm morning golden-hour light',
      winter: 'Cozy glass-windowed Parisian corner café on a crisp winter morning, warm ambient bistro glow, steaming ceramic cups, soft rainy street reflections outside'
    }
  },
  street: {
    id: 'street',
    name: 'Urban City Street',
    icon: '🏙️',
    sub: 'Pedestrian pavement & city avenue',
    climates: {
      tropical: 'Aesthetic pedestrian street in SCBD Jakarta, clean modern architectural limestone pavements, modern skyscrapers blurred in background, natural humid tropical daylight',
      winter: 'Chic tree-lined city boulevard in Omotesando Tokyo, golden autumn ginkgo leaves on the pavement, crisp cool ambient air, soft overcast daylight'
    }
  },
  studio: {
    id: 'studio',
    name: 'Minimalist Studio Cove',
    icon: '📸',
    sub: 'Warm limestone plaster & softbox',
    climates: {
      tropical: 'High-fashion daylight photography studio, seamless warm limestone plaster wall, polished concrete floor, soft directional tropical window lighting with organic palm leaf shadows',
      winter: 'Minimalist editorial cyclorama studio, subtle warm taupe lime-wash backdrop, diffused overhead softbox lighting with soft gentle shadow falloff'
    }
  },
  nature: {
    id: 'nature',
    name: 'Botanical Garden & Veranda',
    icon: '🌿',
    sub: 'Sun-dappled palms & stone path',
    climates: {
      tropical: 'Sun-dappled tropical botanical garden veranda, surrounded by lush broad-leaf palms and flowering frangipani, soft golden-hour equatorial daylight',
      winter: 'Quiet misty winter park garden path lined with frost-dusted pine trees and stone benches, peaceful soft winter atmospheric haze'
    }
  },
  hotel_lounge: {
    id: 'hotel_lounge',
    name: 'Luxury Hotel Lounge',
    icon: '✨',
    sub: 'Marble lobby & ambient evening glow',
    climates: {
      tropical: 'High-end luxury resort hotel lobby lounge in Bali, double-height open timber ceiling, marble flooring, warm sea breeze, subtle architectural water features',
      winter: 'Opulent Grand Hotel fireside lounge, marble fireplace with glowing hearth, plush velvet armchairs, warm crystal chandelier ambiance'
    }
  }
};

// Comprehensive 7-Layer Customizable Garment Catalog with Climate & Modesty Adaptation
const GARMENT_CATALOG = {
  outerwear: {
    blazer: {
      label: 'Tailored Blazer',
      climates: {
        tropical: { name: 'Unstructured Linen-Cotton Blazer', material: 'Breathable tropical-weight unlined linen blend with relaxed shoulders' },
        winter: { name: 'Tailored Heavy Wool Flannel Blazer', material: 'Structured 100% melton wool with cupro lining and horn buttons' }
      },
      hijab: {
        tropical: { name: 'Oversized Modest Longline Blazer', material: 'Loose-cut lightweight breathable linen blend covering hips' },
        winter: { name: 'Relaxed Double-Breasted Wool Blazer', material: 'Modest tailored fit in warm virgin wool with generous drape' }
      }
    },
    cardigan: {
      label: 'Knit Cardigan',
      climates: {
        tropical: { name: 'Airy Open-Knit Cotton Cardigan', material: 'Featherlight slub cotton open mesh knit' },
        winter: { name: 'Chunky Ribbed Cashmere Cardigan', material: 'Heavy gauge pure Mongolian cashmere with tortoiseshell buttons' }
      },
      hijab: {
        tropical: { name: 'Longline Flowing Duster Cardigan', material: 'Breathable ribbed modal blend sweeping past mid-calf' },
        winter: { name: 'Maxi Wool Bouclé Wrap Cardigan', material: 'Warm brushed alpaca-wool blend with self-tie modest sash' }
      }
    },
    jacket: {
      label: 'Jacket (Utility / Denim / Leather)',
      climates: {
        tropical: { name: 'Lightweight Washed Cotton Shacket', material: 'Breathable 8oz enzyme-washed cotton drill with utility pockets' },
        winter: { name: 'Sherpa-Lined Vintage Leather Jacket', material: 'Distressed supple cowhide with warm insulating shearling collar' }
      },
      hijab: {
        tropical: { name: 'Relaxed Modest Safari Utility Jacket', material: 'Crisp breathable cotton tencel with drawstring waist' },
        winter: { name: 'Insulated Longline Field Utility Jacket', material: 'Windproof technical shell with quilted thermal lining' }
      }
    },
    hoodie: {
      label: 'Hoodie',
      climates: {
        tropical: { name: 'Breathable French Terry Pullover Hoodie', material: 'Lightweight 280gsm 100% looped cotton French terry' },
        winter: { name: 'Heavyweight Fleece-Lined Boxy Hoodie', material: 'Dense 500gsm brushed fleece with double-layered hood' }
      },
      hijab: {
        tropical: { name: 'Relaxed Longline Tunic Hoodie', material: 'Breathable slub cotton with side slits in modest relaxed coverage' },
        winter: { name: 'Oversized Modest Thermal Kangaroo Hoodie', material: 'Extra-warm brushed fleece cut in flattering extended modest length' }
      }
    },
    trench_coat: {
      label: 'Trench Coat',
      climates: {
        tropical: { name: 'Featherlight Fluid Lyocell Trench', material: 'Silky unlined drape lyocell with storm flap and sash belt' },
        winter: { name: 'Classic Double-Breasted Wool Trench', material: 'Heavy water-repellent British gabardine wool with storm latch' }
      },
      hijab: {
        tropical: { name: 'Modest Sweeping Drape Trench Coat', material: 'Lightweight airy twill fabric with full floor-skimming modest drape' },
        winter: { name: 'Longline Storm-Proof Melton Trench', material: 'Insulated tailored wool melton offering full thermal coverage' }
      }
    },
    kimono_duster: {
      label: 'Kimono Duster / Kaftan',
      climates: {
        tropical: { name: 'Flowing Silk-Chiffon Duster Kimono', material: 'Featherlight breathable crinkle chiffon with sweeping kimono sleeves' },
        winter: { name: 'Lined Wool-Silk Jacquard Robe Coat', material: 'Heavyweight woven jacquard with soft insulating cupro lining' }
      },
      hijab: {
        tropical: { name: 'Elegant Modest Kaftan Duster Robe', material: 'Floor-length breathable rayon voile with fluid modest movement' },
        winter: { name: 'Velvet-Bordered Wool Duster Coat', material: 'Rich textured wool crepe with plush velvet sleeve trims' }
      }
    },
    kebaya_outer: {
      label: 'Kebaya Outer',
      climates: {
        tropical: { name: 'Modern Embroidered Organza Kebaya Outer', material: 'Crisp sheer floral-embroidered organza with scalloped lapels' },
        winter: { name: 'Rich Silk-Velvet Kartini Kebaya Jacket', material: 'Lustrous Japanese silk-velvet with metallic thread embroidery' }
      },
      hijab: {
        tropical: { name: 'Modest Lined Brocade Kebaya Outer', material: 'Fully lined non-sheer Jacquard brocade with high mandarin collar' },
        winter: { name: 'Warm Velvet Longline Kebaya Duster', material: 'Full-coverage plush velvet with antique brass kerongsang clasps' }
      }
    },
    vest: {
      label: 'Vest / Waistcoat',
      climates: {
        tropical: { name: 'Tailored Sleeveless Linen Waistcoat', material: 'Pure natural European flax with horn button fastening' },
        winter: { name: 'Quilted Down Puffer Vest', material: 'Water-repellent ripstop shell with 700-fill goose down insulation' }
      },
      hijab: {
        tropical: { name: 'Longline Modest Sleeveless Tunic Vest', material: 'Draped cotton-viscose blend worn elegantly over long sleeves' },
        winter: { name: 'Longline Wool-Blend Belted Gilet', material: 'Warm double-faced wool worn over sweaters with cinch belt' }
      }
    }
  },
  shirt: {
    tshirt: {
      label: 'T-Shirt / Tee',
      climates: {
        tropical: { name: 'Relaxed Combed Supima Cotton Crew Tee', material: 'Lightweight 180gsm breathable long-staple organic cotton' },
        winter: { name: 'Heavyweight Rib-Knit Thermal Long-Sleeve', material: 'Dense 300gsm waffle-knit thermal combed cotton' }
      },
      hijab: {
        tropical: { name: 'Modest Loose High-Neck Cotton Longsleeve', material: 'Opaque breathable 100% cotton with relaxed drop shoulders' },
        winter: { name: 'Thermal Brushed Cotton High-Neck Top', material: 'Extra-warm brushed interior thermal cotton base layer' }
      }
    },
    blouse: {
      label: 'Blouse / Shirt',
      climates: {
        tropical: { name: 'Sandwashed Silk Crepe-de-Chine Blouse', material: 'Matte lightweight breathable silk with mother-of-pearl buttons' },
        winter: { name: 'Heavy Twill Silk Spread-Collar Shirt', material: 'Substantial 22-momme lustrous silk twill with double cuffs' }
      },
      hijab: {
        tropical: { name: 'Loose Modest Button-Up Tencel Blouse', material: 'Breathable non-sheer fluid tencel in extended modest cut' },
        winter: { name: 'High-Collar Tailored Silk Modest Shirt', material: 'Full-coverage fine silk twill with concealed button placket' }
      }
    },
    sweater: {
      label: 'Knit Sweater / Pullover',
      climates: {
        tropical: { name: 'Fine-Gauge Short-Sleeve Linen Knit', material: 'Airy open-weave linen-cotton blend' },
        winter: { name: 'Chunky Ribbed Merino Turtleneck', material: 'Warm 7-gauge extra-fine Australian merino wool' }
      },
      hijab: {
        tropical: { name: 'Lightweight Modest Long-Sleeve Knit Tunic', material: 'Breathable cotton-viscose yarn with side vent hem' },
        winter: { name: 'High-Neck Cashmere-Merino Tunic Sweater', material: 'Seamless 200gsm merino-cashmere blend in relaxed modest length' }
      }
    },
    tunic: {
      label: 'Tunic Blouse',
      climates: {
        tropical: { name: 'Flowing Crinkled Rayon Tunic Top', material: 'Breathable lightweight rayon with delicate pintuck pleating' },
        winter: { name: 'Structured Wool-Twill Longline Tunic', material: 'Warm tailored wool blend with clean architectural lines' }
      },
      hijab: {
        tropical: { name: 'Modest Pleated Linen Long Tunic', material: 'Full hip-and-thigh coverage in natural breathable flax' },
        winter: { name: 'Warm Fine-Knit Modest Longline Tunic', material: 'Merino-blend soft knit with high mock neck and long cuffs' }
      }
    },
    camisole: {
      label: 'Camisole / Bustier Top',
      climates: {
        tropical: { name: 'Bias-Cut Mulberry Silk Camisole', material: 'Featherlight 16-momme silk satin with delicate spaghetti straps' },
        winter: { name: 'Velvet Sweetheart Bustier Top', material: 'Plush structured cotton-velvet with internal boning' }
      },
      hijab: {
        tropical: { name: 'Modest Layered Faux-Camisole Blouse', material: 'Contrasting inner blouse with modesty insert and long sleeves' },
        winter: { name: 'Layered Velvet Modest Longsleeve Blouse', material: 'Rich velvet bodice seamlessly tailored over soft fine-knit sleeves' }
      }
    },
    hoodie_inner: {
      label: 'Hoodie / Sweatshirt Inner',
      climates: {
        tropical: { name: 'Lightweight Raglan Crew Sweatshirt', material: 'Soft breathable slub cotton French terry' },
        winter: { name: 'Thermal Brushed-Back Fleece Crewneck', material: 'Heavyweight 450gsm thermal fleece with ribbed cuffs' }
      },
      hijab: {
        tropical: { name: 'Modest Relaxed-Fit Cotton Sweatshirt', material: 'Breathable combed cotton with dropped shoulders and long hem' },
        winter: { name: 'Thermal Modest Longline Sweatshirt', material: 'Plush warm fleece in relaxed silhouette covering hips' }
      }
    },
    shacket: {
      label: 'Overshirt / Shacket Top',
      climates: {
        tropical: { name: 'Washed Chambray Utility Overshirt', material: 'Airy 6oz lightweight cotton chambray with dual flap pockets' },
        winter: { name: 'Heavy Brushed Flannel Work Shirt', material: 'Thick 10oz double-sided brushed cotton flannel' }
      },
      hijab: {
        tropical: { name: 'Longline Relaxed Chambray Shacket', material: 'Breathable lightweight cotton in modest thigh-length fit' },
        winter: { name: 'Thick Flannel Modest Overshirt', material: 'Warm heavyweight flannel in modest relaxed tunic cut' }
      }
    }
  },
  bottoms: {
    jeans: {
      label: 'Jeans (Denim)',
      climates: {
        tropical: { name: 'Relaxed High-Rise Straight-Leg Jeans', material: '11oz washed vintage-tint Japanese selvedge denim' },
        winter: { name: 'Heavyweight Fleece-Lined Straight Jeans', material: '14oz rigid raw Japanese denim with bonded thermal interior' }
      },
      hijab: {
        tropical: { name: 'Wide-Leg Baggy Mom Jeans', material: '100% cotton non-stretch vintage wash denim in loose modest fit' },
        winter: { name: 'Relaxed Wide-Leg Thermal Denim', material: 'Thick insulated denim with modest fluid wide leg drape' }
      }
    },
    trousers: {
      label: 'Tailored Trousers / Slacks',
      climates: {
        tropical: { name: 'High-Waisted Pleated Linen Trousers', material: 'Breathable washed European linen with relaxed tapered hem' },
        winter: { name: 'Double-Pleated Wool Flannel Trousers', material: 'Heavyweight Italian wool flannel with sharp center press crease' }
      },
      hijab: {
        tropical: { name: 'Loose Wide-Leg Tailored Trousers', material: 'Fluid breathable tencel-wool blend in modest loose silhouette' },
        winter: { name: 'Relaxed Wide-Leg Wool Flannel Slacks', material: 'Warm virgin wool with front pleats and non-clinging modest drape' }
      }
    },
    maxi_skirt: {
      label: 'Maxi Skirt',
      climates: {
        tropical: { name: 'Tiered Bohemian Linen Maxi Skirt', material: 'Voluminous multi-tiered breathable linen with raw-edge hem' },
        winter: { name: 'Heavy Wool-Blend Pleated Maxi Skirt', material: 'Warm structured wool melton in sweeping architectural A-line' }
      },
      hijab: {
        tropical: { name: 'Full-Coverage Fluid Crepe Maxi Skirt', material: 'Opaque breathable crepe with elegant graceful flare' },
        winter: { name: 'Warm Quilted A-Line Maxi Skirt', material: 'Insulated thermal quilting in structured modest full length' }
      }
    },
    culottes: {
      label: 'Culottes',
      climates: {
        tropical: { name: 'Cropped Wide-Leg Linen Culottes', material: 'Breathable pure flax linen with elasticated back waist' },
        winter: { name: 'Heavy Corduroy Wide-Leg Culottes', material: 'Thick 8-wale textured cotton corduroy' }
      },
      hijab: {
        tropical: { name: 'Full-Length Palazzo Culottes', material: 'Fluid ankle-grazing breathable rayon with modest skirt-like drape' },
        winter: { name: 'Ankle-Length Wool Culottes', material: 'Tailored wool blend worn modestly with tall boots' }
      }
    },
    batik_skirt: {
      label: 'Batik Skirt (Modern Traditional)',
      climates: {
        tropical: { name: 'Modern Hand-Drawn Batik Silk Wrap Skirt', material: 'Artisanal Pekalongan wax-resist batik on breathable silk mori' },
        winter: { name: 'Lined Heavy Jacquard Batik Long Skirt', material: 'Thermal-lined traditional Parang batik weave with gold thread accent' }
      },
      hijab: {
        tropical: { name: 'Full Modest Hand-Stamped Batik Maxi Skirt', material: 'Opaque cotton primissima batik with graceful walking pleat' },
        winter: { name: 'Wool-Lined Modest Traditional Batik Skirt', material: 'Heavy Indonesian sogan batik with cozy thermal lining' }
      }
    },
    palazzo: {
      label: 'Palazzo Pants',
      climates: {
        tropical: { name: 'Fluid High-Waisted Crepe Palazzo Pants', material: 'Featherlight airy crepe de chine with sweeping wide-leg drape' },
        winter: { name: 'Heavyweight Velvet Palazzo Pants', material: 'Plush lustrous cotton-velvet with generous pooling hem' }
      },
      hijab: {
        tropical: { name: 'Billowing Modest Linen Palazzo Pants', material: 'Breathable non-clinging washed linen with extra-wide hem' },
        winter: { name: 'Thermal-Lined Fluid Wool Palazzo Pants', material: 'Warm fine wool with soft brushed interior and modest drape' }
      }
    },
    column_skirt: {
      label: 'Column / Pencil Skirt',
      climates: {
        tropical: { name: 'Bias-Cut Silk Crepe Column Skirt', material: 'Fluid sandwashed silk with subtle side walking slit' },
        winter: { name: 'Structured Heavy Wool Column Skirt', material: 'Warm dense wool gabardine with tailored back vent' }
      },
      hijab: {
        tropical: { name: 'Modest Straight-Cut Long Column Skirt', material: 'Non-sheer textured cotton blend without high slits' },
        winter: { name: 'Tailored Modest Wool Ankle Skirt', material: 'Full-length insulated wool blend with concealed modest back pleat' }
      }
    }
  },
  footwear: {
    sneakers: {
      label: 'Sneakers',
      climates: {
        tropical: { name: 'Minimalist Retro Court Sneakers', material: 'Supple perforated calfskin leather with lightweight rubber cupsole' },
        winter: { name: 'Waterproof High-Top Trail Sneakers', material: 'Ballistic Cordura nylon with Gore-Tex membrane and lug tread' }
      }
    },
    loafers: {
      label: 'Loafers',
      climates: {
        tropical: { name: 'Supple Deconstructed Suede Penny Loafers', material: 'Unlined buttery Italian goat suede with flexible leather sole' },
        winter: { name: 'Chunky Lug-Sole Box Leather Loafers', material: 'Polished calfskin with Goodyear-welted commando rubber tread' }
      }
    },
    mules: {
      label: 'Mules / Slides',
      climates: {
        tropical: { name: 'Pointed Woven Raffia Low Mules', material: 'Handwoven natural palm fiber with cushioned leather footbed' },
        winter: { name: 'Shearling-Lined Closed Leather Mules', material: 'Oiled nubuck leather with cozy genuine sheepskin fleece lining' }
      }
    },
    heels: {
      label: 'Heels / Pumps',
      climates: {
        tropical: { name: 'Pointed Slingback Kitten Heels', material: 'Glossy patent leather with delicate 45mm sculpted heel' },
        winter: { name: 'Velvet Pointed High Stiletto Pumps', material: 'Plush Italian silk-velvet with 85mm stiletto heel' }
      }
    },
    boots: {
      label: 'Boots',
      climates: {
        tropical: { name: 'Deconstructed Split-Suede Ankle Boots', material: 'Featherlight unlined suede with breathable cotton canvas lining' },
        winter: { name: 'Classic Leather Chelsea Ankle Boots', material: 'Water-resistant oiled full-grain leather with storm welt' }
      }
    },
    slides: {
      label: 'Flat Sandals / Slides',
      climates: {
        tropical: { name: 'Minimalist Nappa Leather Crisscross Slides', material: 'Padded glove leather straps with molded ergonomic cork sole' },
        winter: { name: 'Faux-Fur Lined Indoor/Outdoor Slides', material: 'Soft suede upper with thick plush shearling footbed' }
      }
    }
  },
  socks: {
    invisible_liners: {
      label: 'Invisible No-Show Liners',
      climates: {
        tropical: { name: 'Anti-Slip Bamboo Low-Cut Liners', material: 'Breathable antibacterial bamboo fiber with silicone heel grip' },
        winter: { name: 'Thermal Low-Cut Wool Blend Liners', material: 'Merino-cushioned sole with non-slip silicone rim' }
      }
    },
    ribbed_socks: {
      label: 'Ribbed Crew Socks',
      climates: {
        tropical: { name: 'Slub Cotton Fine-Ribbed Crew Socks', material: 'Breathable organic Japanese slub cotton' },
        winter: { name: 'Chunky Marled Wool Boot Socks', material: 'Heavy twisted-yarn Scottish Shetland wool' }
      }
    },
    sheer_tights: {
      label: 'Sheer Hosiery / Tights',
      climates: {
        tropical: { name: 'Ultra-Sheer 15D Cooling Tights', material: 'Breathable cooling microfiber with invisible reinforced toe' },
        winter: { name: 'Semi-Sheer 40D Silk-Infused Hosiery', material: 'Thermal silk-polyamide blend with elegant satin sheen' }
      }
    },
    opaque_tights: {
      label: 'Opaque Modest Tights',
      climates: {
        tropical: { name: 'Breathable Modest 60D Wudhu Socks', material: 'Moisture-wicking stretch microfiber with flip-toe wudhu opening' },
        winter: { name: 'Thermal Fleece-Lined 140D Modest Tights', material: 'Plush brushed fleece interior with dense non-sheer exterior' }
      }
    },
    wool_socks: {
      label: 'Thermal Wool Socks',
      climates: {
        tropical: { name: 'Lightweight Merino Dress Socks', material: 'Ultra-fine 18.5 micron merino wool for temperature regulation' },
        winter: { name: 'Heavy Cushion Alpaca-Merino Socks', material: 'Low-tension thick loopback knit baby alpaca wool' }
      }
    }
  },
  bag: {
    tote: {
      label: 'Tote Bag',
      climates: {
        tropical: { name: 'Hand-Plaited Straw & Leather Market Tote', material: 'Natural vegetable fiber with saddle-stitched leather shoulder straps' },
        winter: { name: 'Structured Saffiano Leather Work Tote', material: 'Scratch-resistant textured Italian leather with gold hardware' }
      }
    },
    crossbody: {
      label: 'Crossbody Bag',
      climates: {
        tropical: { name: 'Slouchy Crescent Leather Crossbody Bag', material: 'Buttery soft glove-tanned leather with adjustable webbing strap' },
        winter: { name: 'Structured Saddle Leather Crossbody Bag', material: 'Rich pull-up vegetable-tanned bridle leather with brass hardware' }
      }
    },
    shoulder_bag: {
      label: 'Shoulder Bag',
      climates: {
        tropical: { name: 'Minimalist Baguette Shoulder Bag', material: 'Glossy patent leather with clean 90s-inspired silhouette' },
        winter: { name: 'Quilted Lambskin Chain Shoulder Bag', material: 'Diamond-quilted supple lambskin with woven brass chain' }
      }
    },
    clutch: {
      label: 'Clutch / Minaudière',
      climates: {
        tropical: { name: 'Handcrafted Mother-of-Pearl Shell Clutch', material: 'Iridescent natural pearl shell tiles over metal frame' },
        winter: { name: 'Jeweled Velvet Minaudière Clutch', material: 'Lustrous black silk-velvet with faceted crystal clasp' }
      }
    },
    vanity_box: {
      label: 'Vanity Box / Micro Bag',
      climates: {
        tropical: { name: 'Cylindrical Woven Rattan Vanity Case', material: 'Balinese smoked cane with smooth box calfskin lid and strap' },
        winter: { name: 'Embossed Crocodile Vanity Case Bag', material: 'Structured gloss croc-embossed calfskin with top carry handle' }
      }
    },
    backpack: {
      label: 'Backpack / Rucksack',
      climates: {
        tropical: { name: 'Lightweight Water-Repellent Nylon Backpack', material: 'High-density micro-nylon with sleek taped zippers' },
        winter: { name: 'Hand-Oiled Pull-Up Leather Satchel Backpack', material: 'Heavyweight waxed leather with antique brass buckle clasps' }
      }
    }
  },
  headwear: {
    // Hijabi Options
    voal_hijab: {
      label: 'Ultrafine Voal Square Hijab',
      hijabOnly: true,
      climates: {
        tropical: { name: 'Ultrafine Arabian Voal Square Hijab', material: 'Featherlight 100% breathable Egyptian cotton voal with laser-cut hem' },
        winter: { name: 'Double-Layered Warm Voal-Silk Hijab', material: 'Soft dense voal blended with warming mulberry silk threads' }
      }
    },
    pashmina_hijab: {
      label: 'Pashmina Shawl Hijab',
      hijabOnly: true,
      climates: {
        tropical: { name: 'Draped Airflow Satin-Crepe Pashmina', material: 'Silky smooth breathable crinkle satin with effortless fluid drape' },
        winter: { name: 'Pure Cashmere-Silk Pashmina Shawl', material: '70% Mongolian cashmere and 30% silk with delicate hand-knotted fringe' }
      }
    },
    gauze_hijab: {
      label: 'Cotton Gauze Hijab',
      hijabOnly: true,
      climates: {
        tropical: { name: 'Airy Crinkled Cotton Gauze Hijab', material: 'Pure natural crinkle cotton, breathable and no-pin effortless wrap' },
        winter: { name: 'Thermal Waffle-Weave Cotton Gauze Hijab', material: 'Textured honeycombed cotton trapping warm insulating air' }
      }
    },
    silk_hijab: {
      label: 'Silk-Satin Hijab',
      hijabOnly: true,
      climates: {
        tropical: { name: 'Sandwashed Silk-Chiffon Hijab', material: 'Featherlight breathable matte silk chiffon with non-slip finish' },
        winter: { name: 'Lustrous Turkish Silk-Satin Hijab', material: 'Heavy 18-momme opulent silk twill with hand-rolled borders' }
      }
    },
    knit_hijab: {
      label: 'Thermal Knit Hijab',
      hijabOnly: true,
      climates: {
        tropical: { name: 'Fine-Gauge Modal Ribbed Jersey Hijab', material: 'Stretchy breathable moisture-wicking beechwood modal' },
        winter: { name: 'Thermal Merino Ribbed Balaclava Hijab', material: 'Seamless extra-fine merino wool providing complete neck and ear warmth' }
      }
    },
    // Contemporary Options
    hair_clip: {
      label: 'Hair Clip / Barrette',
      contemporaryOnly: true,
      climates: {
        tropical: { name: 'Tortoiseshell & Gold Architectural Barrette', material: 'Hand-carved Italian cellulose acetate with polished gold clip' },
        winter: { name: 'Brushed Brass Sculptural Hair Pin', material: 'Solid cast brass with subtle hand-hammered texture' }
      }
    },
    beanie: {
      label: 'Knit Beanie',
      contemporaryOnly: true,
      climates: {
        tropical: { name: 'Breathable Slub Cotton Cuffed Beanie', material: 'Lightweight open-weave slub cotton knit' },
        winter: { name: 'Seamless Ribbed Scottish Cashmere Beanie', material: 'Heavy 4-ply pure cashmere with snug thermal fold-over cuff' }
      }
    },
    beret: {
      label: 'Wool Beret',
      contemporaryOnly: true,
      climates: {
        tropical: { name: 'Featherlight Linen-Blend French Beret', material: 'Crisp woven linen-cotton with breathable crown' },
        winter: { name: 'Molded French Merino Wool Beret', material: 'Dense water-resistant boiled merino wool with leather sweatband' }
      }
    },
    cap: {
      label: 'Baseball Cap',
      contemporaryOnly: true,
      climates: {
        tropical: { name: 'Unstructured Enzyme-Washed Cotton Cap', material: 'Vintage washed 100% chino cotton with antique brass buckle' },
        winter: { name: 'Thermal Corduroy 6-Panel Cap', material: 'Heavy 8-wale cotton corduroy with wool-lined interior' }
      }
    },
    straw_hat: {
      label: 'Straw Sun Hat / Boater',
      contemporaryOnly: true,
      climates: {
        tropical: { name: 'Hand-Braided Wheat Straw Boater Sun Hat', material: 'Natural golden wheat straw with grosgrain ribbon tie' },
        winter: { name: 'Structured Wool Felt Wide-Brim Fedora', material: 'Firm rabbit-wool felt with satin lining and feather trim' }
      }
    },
    headband: {
      label: 'Padded Headband',
      contemporaryOnly: true,
      climates: {
        tropical: { name: 'Ruched Silk-Chiffon Headband', material: 'Airy crinkle silk wrapped around flexible lightweight band' },
        winter: { name: 'Padded Silk-Velvet Halo Headband', material: 'Plush raised Italian velvet with subtle crystal embellishments' }
      }
    }
  }
};

// Helper to resolve an individual ensemble item with climate, modesty, and custom piece type adaptation
function resolveEnsembleItem(layerKey, vibeKey, climate = 'tropical', isHijab = false, customType = null) {
  const p = fashionProfiles[vibeKey] || fashionProfiles.casual_walk;
  const cData = (p.climates && p.climates[climate]) ? p.climates[climate] : (p.climates ? p.climates.tropical : p);
  const defaultItems = (isHijab && cData.hijabItems) ? cData.hijabItems : (cData.items || p.items);
  const defaultItem = defaultItems[layerKey];

  if (!customType || customType === 'default') {
    return defaultItem;
  }

  const catalogLayer = GARMENT_CATALOG[layerKey];
  if (!catalogLayer || !catalogLayer[customType]) {
    return defaultItem;
  }

  const pieceDef = catalogLayer[customType];
  if (isHijab && pieceDef.hijab && pieceDef.hijab[climate]) {
    return pieceDef.hijab[climate];
  }
  if (pieceDef.climates && pieceDef.climates[climate]) {
    return pieceDef.climates[climate];
  }

  return defaultItem;
}

// Helper to resolve active items and backdrop based on climate, hijab, background scene, and custom pieces
function getFashionSpec(vibeKey, climate = 'tropical', isHijab = false, bgKey = 'auto', customPieces = null) {
  const p = fashionProfiles[vibeKey] || fashionProfiles.casual_walk;
  const cData = (p.climates && p.climates[climate]) ? p.climates[climate] : (p.climates ? p.climates.tropical : p);
  
  const activePieces = customPieces !== null && customPieces !== undefined ? customPieces : (state.outfitCustomPieces || {});
  const layers = ['outerwear', 'shirt', 'bottoms', 'footwear', 'socks', 'bag', 'headwear'];
  const items = {};
  layers.forEach(layer => {
    const customType = activePieces[layer];
    items[layer] = resolveEnsembleItem(layer, vibeKey, climate, isHijab, customType);
  });
  
  const activeBgKey = bgKey || 'auto';
  const bgPreset = BACKGROUND_PRESETS[activeBgKey] || BACKGROUND_PRESETS.auto;
  let backdrop = cData.backdrop || p.backdrop;
  if (activeBgKey !== 'auto' && bgPreset && bgPreset.climates) {
    backdrop = bgPreset.climates[climate] || bgPreset.climates.tropical;
  }

  return {
    profile: p,
    items,
    backdrop,
    bgKey: activeBgKey,
    bgName: bgPreset.name,
    bgIcon: bgPreset.icon,
    climateLabel: climate === 'tropical' ? 'Tropical (Indonesia / Warm)' : 'Four Seasons (Autumn / Winter)',
    modestyLabel: isHijab ? 'Modern Modest Hijabi' : 'Chic Contemporary Women'
  };
}

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

  const fashionKeys = CURATED_VIBES;
  fashionDropdownMenu.innerHTML = fashionKeys.map((key, idx) => {
    const p = fashionProfiles[key];
    const indexStr = String(idx + 1).padStart(2, '0');
    const isActive = (state.outfitVibe || state.fashionStyle) === key;
    return `
      <button type="button" class="dropdown-option ${isActive ? 'active' : ''}" data-value="${key}" role="option" aria-selected="${isActive}">
        <span class="option-index">${indexStr}</span>
        <div class="option-content">
          <div class="option-header-line">
            <span class="option-title">${p.name}</span>
            <span class="option-sub">${p.sub}</span>
          </div>
          ${p.suitability ? `<span class="option-suitability">🎯 Best for: ${p.suitability}</span>` : ''}
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

  const currentVibeKey = state.outfitVibe || state.fashionStyle || 'casual_walk';
  const initialFashion = fashionProfiles[currentVibeKey] || fashionProfiles.casual_walk;
  const initialFashionIdx = String(Math.max(0, fashionKeys.indexOf(currentVibeKey)) + 1).padStart(2, '0');
  if (fashionDropdownLabel) {
    fashionDropdownLabel.textContent = `${initialFashionIdx} · ${initialFashion.name}`;
  }

  const initialInterior = interiorProfiles[state.interiorStyle] || interiorProfiles.japandi;
  const initialInteriorIdx = String(interiorKeys.indexOf(state.interiorStyle) + 1).padStart(2, '0');
  if (interiorDropdownLabel) {
    interiorDropdownLabel.textContent = `${initialInteriorIdx} · ${initialInterior.name}`;
  }

  // 3. Background Scene Dropdown Menu Population
  const bgKeys = Object.keys(BACKGROUND_PRESETS);
  if (fashionBgDropdownMenu) {
    fashionBgDropdownMenu.innerHTML = bgKeys.map(key => {
      const preset = BACKGROUND_PRESETS[key];
      const isActive = (state.outfitBackground || 'auto') === key;
      return `
        <button type="button" class="dropdown-option ${isActive ? 'active' : ''}" data-value="${key}" role="option" aria-selected="${isActive}">
          <span class="option-icon">${preset.icon}</span>
          <div class="option-content">
            <span class="option-title">${preset.name}</span>
            <span class="option-sub">${preset.sub}</span>
          </div>
        </button>
      `;
    }).join('');
  }

  const initialBg = BACKGROUND_PRESETS[state.outfitBackground] || BACKGROUND_PRESETS.auto;
  if (fashionBgDropdownLabel) fashionBgDropdownLabel.textContent = initialBg.name;
  if (fashionBgDropdownIcon) fashionBgDropdownIcon.textContent = initialBg.icon;

  if (fashionDropdownTrigger) {
    fashionDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = fashionDropdownMenu.classList.toggle('open');
      fashionDropdownTrigger.setAttribute('aria-expanded', isOpen);
      if (fashionBgDropdownMenu) {
        fashionBgDropdownMenu.classList.remove('open');
        if (fashionBgDropdownTrigger) fashionBgDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
      if (interiorDropdownMenu) {
        interiorDropdownMenu.classList.remove('open');
        if (interiorDropdownTrigger) interiorDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (fashionBgDropdownTrigger) {
    fashionBgDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = fashionBgDropdownMenu.classList.toggle('open');
      fashionBgDropdownTrigger.setAttribute('aria-expanded', isOpen);
      if (fashionDropdownMenu) {
        fashionDropdownMenu.classList.remove('open');
        if (fashionDropdownTrigger) fashionDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
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
      if (fashionBgDropdownMenu) {
        fashionBgDropdownMenu.classList.remove('open');
        if (fashionBgDropdownTrigger) fashionBgDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  fashionDropdownMenu.addEventListener('click', (e) => {
    const option = e.target.closest('.dropdown-option');
    if (!option) return;
    const value = option.dataset.value;
    state.outfitVibe = value;
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

  if (fashionBgDropdownMenu) {
    fashionBgDropdownMenu.addEventListener('click', (e) => {
      const option = e.target.closest('.dropdown-option');
      if (!option) return;
      const value = option.dataset.value;
      state.outfitBackground = value;
      const preset = BACKGROUND_PRESETS[value] || BACKGROUND_PRESETS.auto;
      if (fashionBgDropdownLabel) fashionBgDropdownLabel.textContent = preset.name;
      if (fashionBgDropdownIcon) fashionBgDropdownIcon.textContent = preset.icon;
      fashionBgDropdownMenu.querySelectorAll('.dropdown-option').forEach(opt => {
        const isSel = opt.dataset.value === value;
        opt.classList.toggle('active', isSel);
        opt.setAttribute('aria-selected', isSel);
      });
      fashionBgDropdownMenu.classList.remove('open');
      if (fashionBgDropdownTrigger) fashionBgDropdownTrigger.setAttribute('aria-expanded', 'false');
      updateMockup();
      updateExportCode();
    });
  }

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
    if (fashionBgDropdown && !fashionBgDropdown.contains(e.target)) {
      if (fashionBgDropdownMenu) fashionBgDropdownMenu.classList.remove('open');
      if (fashionBgDropdownTrigger) fashionBgDropdownTrigger.setAttribute('aria-expanded', 'false');
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
      if (fashionBgDropdownMenu) {
        fashionBgDropdownMenu.classList.remove('open');
        if (fashionBgDropdownTrigger) fashionBgDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
      if (interiorDropdownMenu) {
        interiorDropdownMenu.classList.remove('open');
        if (interiorDropdownTrigger) interiorDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

function generateFashionPrompts(combo, vibeKey, climate, isHijab, bgKey, customPieces = null) {
  const activeVibe = vibeKey || state.outfitVibe || state.fashionStyle || 'casual_walk';
  const activeClimate = climate || state.outfitClimate || 'tropical';
  const activeHijab = isHijab !== undefined && isHijab !== null ? isHijab : (state.outfitHijab || false);
  const activeBg = bgKey || state.outfitBackground || 'auto';

  const spec = getFashionSpec(activeVibe, activeClimate, activeHijab, activeBg, customPieces);
  const p = spec.profile;
  const items = spec.items;
  const numColors = combo.colors.length;
  const map = getFashionMapping(numColors);

  const cOuter = combo.colors[map[0]];
  const cShirt = combo.colors[map[1]];
  const cBottoms = combo.colors[map[2]];
  const cFootwear = combo.colors[map[3]];
  const cSocks = combo.colors[map[4]];
  const cBag = combo.colors[map[5]];
  const cHeadwear = combo.colors[map[6]];

  const headwearLabel = activeHijab ? `Hijab / Headwear (${items.headwear.name} in ${cHeadwear.name_en} ${cHeadwear.hex}, ${items.headwear.material})` : `Headwear / Hair Accessory (${items.headwear.name} in ${cHeadwear.hex}, ${items.headwear.material})`;

  const wardrobeBreakdown = `7-piece wardrobe breakdown: Outerwear (${items.outerwear.name} in ${cOuter.name_en} ${cOuter.hex}, ${items.outerwear.material}), layered over ${items.shirt.name} in ${cShirt.name_en} ${cShirt.hex} (${items.shirt.material}), paired with ${items.bottoms.name} in ${cBottoms.name_en} ${cBottoms.hex} (${items.bottoms.material}), ${items.footwear.name} in ${cFootwear.name_en} ${cFootwear.hex}, ${items.socks.name} in ${cSocks.hex}, accessorized with ${items.bag.name} in ${cBag.hex}, and ${headwearLabel}`;

  const swatchChipsText = combo.colors.map((c, i) => `C${i + 1}: ${c.name_jp} (${c.name_en}) ${c.hex}`).join(', ');

  if (activeHijab) {
    return {
      profile: p,
      spec,
      midjourney: `Ultra-realistic editorial fashion photography, full body portrait of an elegant 26-year-old modern Indonesian Muslimah model wearing an authentic 7-piece ${p.name} ensemble (${p.genre}) inspired by Wada Sanzo combination #${combo.id} (${combo.name_en}). Styled for ${spec.climateLabel}, tailored modesty. ${wardrobeBreakdown}. Setting: ${spec.backdrop}. Shot on 85mm f/1.4 lens, natural dewy skin texture, authentic fabric folds, directional soft studio lighting, Vogue editorial aesthetic, hyper-realistic materiality. Mandatory integrated bottom palette widget: Along the bottom edge of the image is an elegant minimalist graphic swatch bar displaying the Wada Sanzo combination #${combo.id} palette (${combo.name_en}), featuring distinct solid rectangular color sample swatches for each pigment (${swatchChipsText}) neatly labeled with color names and exact hex codes in clean sans-serif typography, fashion lookbook footer presentation --ar 3:4 --style raw --v 6.1`,
      flux: `A high-fashion editorial photograph of an elegant Southeast Asian Muslim woman in a complete 7-piece ${p.name} wardrobe styled with authentic 1930s Japanese color theory (Wada Sanzo #${combo.id} - ${combo.name_en}). Climate & Occasion: ${spec.climateLabel}, suitable for ${p.suitability}. Modest fashion ensemble: ${items.outerwear.name} in ${cOuter.name_en} (${cOuter.hex}, ${items.outerwear.material}), layered over ${items.shirt.name} in ${cShirt.name_en} (${cShirt.hex}), with ${items.bottoms.name} in ${cBottoms.name_en} (${cBottoms.hex}), ${items.footwear.name} in ${cFootwear.name_en} (${cFootwear.hex}), ${items.socks.name} in ${cSocks.hex}, ${items.bag.name} in ${cBag.hex}, and styled ${items.headwear.name} in ${cHeadwear.hex} (${items.headwear.material}). Natural skin texture, realistic non-sheer cloth drape, soft ambient lighting, ${spec.backdrop}. Mandatory integrated bottom palette widget: Across the bottom edge of the image is a sleek minimalist graphic design swatch bar displaying the Wada Sanzo #${combo.id} (${combo.name_en}) color harmony, featuring crisp solid color sample tiles (${swatchChipsText}) labeled with their pigment names and hex codes in neat modern publication typography, showing the exact color mix used in the outfit. Hasselblad 100MP clarity.`,
      gemini: `Photorealistic fashion portrait of a stylish modern Indonesian woman wearing a sophisticated modest hijabi ensemble based on Sanzo Wada's color harmony #${combo.id} (${combo.name_en}). Aesthetic vibe: ${p.name} (${spec.climateLabel}, ideal for ${p.suitability}). Exact 7-piece color allocation: Outerwear (${items.outerwear.name}) in ${cOuter.name_en} ${cOuter.hex}, Modest Top (${items.shirt.name}) in ${cShirt.name_en} ${cShirt.hex}, Bottoms (${items.bottoms.name}) in ${cBottoms.name_en} ${cBottoms.hex}, Footwear (${items.footwear.name}) in ${cFootwear.name_en} ${cFootwear.hex}, Legwear (${items.socks.name}) in ${cSocks.hex}, Bag (${items.bag.name}) in ${cBag.hex}, Hijab Headwear (${items.headwear.name}) in ${cHeadwear.hex}. Setting: ${spec.backdrop}. Mandatory integrated bottom color widget: A clean minimalist horizontal palette swatch banner anchored along the bottom border of the image, showcasing the authentic Wada Sanzo combination #${combo.id} (${combo.name_en}) with solid color chips for each pigment (${swatchChipsText}), labeled with pigment names and hex codes in refined typography, providing an official fashion lookbook color guide. Soft daylight shadows, cinematic composition, authentic fabric weaves, 8k resolution.`,
      dalle: `A full-length fashion photograph featuring a graceful Indonesian Muslimah model in a beautifully coordinated modest 7-piece wardrobe inspired by Sanzo Wada's Japanese color palette #${combo.id} (${combo.name_en}). The style is ${p.name} tailored for ${spec.climateLabel}. The ensemble balances ${items.outerwear.name} in ${cOuter.name_en} (${cOuter.hex}) over ${items.shirt.name} in ${cShirt.name_en} (${cShirt.hex}), ${items.bottoms.name} in ${cBottoms.name_en} (${cBottoms.hex}), ${items.footwear.name} in ${cFootwear.name_en} (${cFootwear.hex}), accented with ${items.bag.name} in ${cBag.hex} and an elegantly styled ${items.headwear.name} in ${cHeadwear.hex}. The backdrop is ${spec.backdrop} with soft natural sunlight streaming from the side. At the bottom of the image, incorporate a mandatory integrated minimalist lookbook graphic widget / color swatch bar displaying the Wada Sanzo color combination #${combo.id} (${combo.name_en}) with rectangular color sample swatches for each pigment (${swatchChipsText}) and neatly printed hex codes, visually presenting the exact color combination mixed in the outfit in an editorial lookbook layout.`
    };
  } else {
    return {
      profile: p,
      spec,
      midjourney: `Editorial fashion photography, full body portrait of a chic modern woman wearing a complete 7-piece ${p.name} ensemble (${p.genre}) inspired by Wada Sanzo combination #${combo.id} (${combo.name_en}). Styled for ${spec.climateLabel}, suitable for ${p.suitability}. ${wardrobeBreakdown}. Set against ${spec.backdrop}. Shot on 85mm f/1.4 lens, natural skin texture, authentic fabric folds, soft directional diffused studio lighting, Vogue editorial aesthetic, high tactile texture. Mandatory integrated bottom palette widget: Along the bottom edge of the image is an elegant minimalist graphic swatch bar displaying the Wada Sanzo combination #${combo.id} palette (${combo.name_en}), featuring distinct solid rectangular color sample swatches for each pigment (${swatchChipsText}) neatly labeled with color names and exact hex codes in clean sans-serif typography, fashion lookbook footer presentation --ar 3:4 --style raw --v 6.1`,
      flux: `A high-fashion editorial photograph of a woman in a complete 7-piece ${p.name} wardrobe styled with authentic 1930s Japanese color theory (Wada Sanzo #${combo.id} - ${combo.name_en}). Climate & Occasion: ${spec.climateLabel}, suitable for ${p.suitability}. Ensemble: ${items.outerwear.name} in ${cOuter.name_en} (${cOuter.hex}, ${items.outerwear.material}), layered over ${items.shirt.name} in ${cShirt.name_en} (${cShirt.hex}), with ${items.bottoms.name} in ${cBottoms.name_en} (${cBottoms.hex}), ${items.footwear.name} in ${cFootwear.name_en} (${cFootwear.hex}), ${items.socks.name} in ${cSocks.hex}, and accessories (${items.bag.name} in ${cBag.hex}, ${items.headwear.name} in ${cHeadwear.hex}). Natural skin texture, realistic cloth drape, soft ambient lighting, ${spec.backdrop}. Mandatory integrated bottom palette widget: Across the bottom edge of the image is a sleek minimalist graphic design swatch bar displaying the Wada Sanzo #${combo.id} (${combo.name_en}) color harmony, featuring crisp solid color sample tiles (${swatchChipsText}) labeled with their pigment names and hex codes in neat modern publication typography, showing the exact color mix used in the outfit.`,
      gemini: `Photorealistic fashion portrait of a chic fashion model showcasing a complete 7-piece ${p.name} collection based on Sanzo Wada's color harmony #${combo.id} (${combo.name_en}). Silhouette for ${spec.climateLabel}, ideal for ${p.suitability}. Exact 7-piece color allocation: Outerwear (${items.outerwear.name}) in ${cOuter.name_en} ${cOuter.hex}, Shirt/Knit (${items.shirt.name}) in ${cShirt.name_en} ${cShirt.hex}, Bottoms (${items.bottoms.name}) in ${cBottoms.name_en} ${cBottoms.hex}, Footwear (${items.footwear.name}) in ${cFootwear.name_en} ${cFootwear.hex}, Legwear (${items.socks.name}) in ${cSocks.hex}, Leather Bag (${items.bag.name}) in ${cBag.hex}, Headwear / Hair Accessory (${items.headwear.name}) in ${cHeadwear.hex}. Setting: ${spec.backdrop}. Mandatory integrated bottom color widget: A clean minimalist horizontal palette swatch banner anchored along the bottom border of the image, showcasing the authentic Wada Sanzo combination #${combo.id} (${combo.name_en}) with solid color chips for each pigment (${swatchChipsText}), labeled with pigment names and hex codes in refined typography, providing an official fashion lookbook color guide. Soft studio shadows, Hasselblad camera quality, 8k resolution, authentic fabric weaves.`,
      dalle: `A full-length fashion photograph featuring a woman model posing gracefully in a coordinated 7-piece wardrobe inspired by Sanzo Wada's Japanese color palette #${combo.id} (${combo.name_en}). The aesthetic is ${p.name} tailored for ${spec.climateLabel}. The ensemble balances ${items.outerwear.name} in ${cOuter.name_en} (${cOuter.hex}) over ${items.shirt.name} in ${cShirt.name_en} (${cShirt.hex}), ${items.bottoms.name} in ${cBottoms.name_en} (${cBottoms.hex}), ${items.footwear.name} in ${cFootwear.name_en} (${cFootwear.hex}), accented with ${items.bag.name} in ${cBag.hex} and ${items.headwear.name} in ${cHeadwear.hex}. The background is ${spec.backdrop} with soft natural light streaming from the side. At the bottom of the image, incorporate a mandatory integrated minimalist lookbook graphic widget / color swatch bar displaying the Wada Sanzo color combination #${combo.id} (${combo.name_en}) with rectangular color sample swatches for each pigment (${swatchChipsText}) and neatly printed hex codes, visually presenting the exact color combination mixed in the outfit in an editorial lookbook layout.`
    };
  }
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
  const spec = getFashionSpec(state.outfitVibe || state.fashionStyle, state.outfitClimate, state.outfitHijab, state.outfitBackground);
  const p = spec.profile;
  const items = spec.items;
  const numColors = combo.colors.length;

  const fashionKicker = document.getElementById('fashionKicker');
  if (fashionKicker) {
    fashionKicker.textContent = `${p.name} · ${spec.climateLabel} · ${spec.modestyLabel}`;
  }

  if (fashionSuitabilityText) {
    fashionSuitabilityText.textContent = p.suitability;
  }

  if (climateMetaPill) {
    climateMetaPill.textContent = state.outfitClimate === 'tropical' ? '☀️ Tropical (Indo / Warm)' : '❄️ Autumn / Winter Layers';
  }

  if (modestyMetaPill) {
    modestyMetaPill.textContent = state.outfitHijab ? '🧕 Modern Modest Hijabi' : '👗 Contemporary Women';
  }

  if (bgMetaPill) {
    bgMetaPill.textContent = `${spec.bgIcon} ${spec.bgName}`;
  }

  if (fashionBgTag) {
    fashionBgTag.textContent = `${spec.bgIcon} ${spec.bgName}`;
  }

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
          title = items.outerwear.name;
          desc = `${items.outerwear.material}. Primary silhouette layer anchoring the ensemble.`;
        } else {
          title = `${items.shirt.name} & Footwear`;
          desc = `${items.shirt.material} paired with ${items.footwear.name}.`;
        }
      } else if (numColors === 3) {
        if (idx === 0) {
          title = items.outerwear.name;
          desc = `${items.outerwear.material}. Dominant coat/outer layer.`;
        } else if (idx === 1) {
          title = items.shirt.name;
          desc = `${items.shirt.material}. Foundation mid-layer piece.`;
        } else {
          title = items.bottoms.name;
          desc = `${items.bottoms.material}. Lower silhouette balance.`;
        }
      } else {
        if (idx === 0) {
          title = items.outerwear.name;
          desc = `${items.outerwear.material}. Dominant coat/outer layer.`;
        } else if (idx === 1) {
          title = items.shirt.name;
          desc = `${items.shirt.material}. Mid-layer styling.`;
        } else if (idx === 2) {
          title = items.bottoms.name;
          desc = `${items.bottoms.material}. Structured trousers or skirt.`;
        } else {
          title = `${items.footwear.name} & Accessories`;
          desc = `${items.footwear.material} with ${items.bag.name}.`;
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
      { key: 'shirt', layer: 'Shirt / Top', num: '02' },
      { key: 'bottoms', layer: 'Bottoms', num: '03' },
      { key: 'footwear', layer: 'Footwear', num: '04' },
      { key: 'socks', layer: 'Socks & Legwear', num: '05' },
      { key: 'bag', layer: 'Bag & Leather', num: '06' },
      { key: 'headwear', layer: state.outfitHijab ? 'Hijab / Headwear' : 'Headwear', num: '07' }
    ];

    const btnReset = document.getElementById('btnResetEnsemblePieces');
    const hasCustomPieces = Object.values(state.outfitCustomPieces || {}).some(v => v && v !== 'default');
    if (btnReset) {
      btnReset.style.display = hasCustomPieces ? 'inline-flex' : 'none';
    }

    layers.forEach((l, idx) => {
      const colorIdx = mapping[idx];
      const col = combo.colors[colorIdx] || combo.colors[0];
      const item = items[l.key];
      const currentSelected = (state.outfitCustomPieces && state.outfitCustomPieces[l.key]) || 'default';
      const isCustomized = currentSelected !== 'default';

      // Build options from GARMENT_CATALOG
      const catLayer = GARMENT_CATALOG[l.key] || {};
      let optionsHtml = `<option value="default"${currentSelected === 'default' ? ' selected' : ''}>Occasion Default</option>`;
      
      Object.keys(catLayer).forEach(typeKey => {
        if (typeKey === 'default') return;
        const piece = catLayer[typeKey];
        if (l.key === 'headwear') {
          if (state.outfitHijab && piece.contemporaryOnly) return;
          if (!state.outfitHijab && piece.hijabOnly) return;
        }
        const isSelected = currentSelected === typeKey;
        optionsHtml += `<option value="${typeKey}"${isSelected ? ' selected' : ''}>${piece.label}</option>`;
      });

      const itemCard = document.createElement('div');
      itemCard.className = `ensemble-item-card ${isCustomized ? 'is-customized' : ''}`;
      itemCard.style.borderLeft = `3px solid ${col.hex}`;
      itemCard.innerHTML = `
        <div class="ensemble-item-header">
          <div class="ensemble-item-tag">
            <span class="ensemble-dot" style="background-color: ${col.hex};"></span>
            <span class="ensemble-color-name">${col.name_jp} (${col.name_en})</span>
          </div>
          <span class="ensemble-item-layer">${l.num} · ${l.layer}</span>
        </div>
        <div class="ensemble-type-select-wrap">
          <select class="ensemble-type-select" data-layer="${l.key}" aria-label="Select piece type for ${l.layer}">
            ${optionsHtml}
          </select>
          <span class="ensemble-select-chevron">▼</span>
        </div>
        <div class="ensemble-piece-name">${item.name}</div>
        <div class="ensemble-piece-material">${item.material}</div>
      `;
      fashionEnsembleGrid.appendChild(itemCard);
    });
  }

  const fashionBackdropText = document.getElementById('fashionBackdropText');
  if (fashionBackdropText) {
    fashionBackdropText.textContent = spec.backdrop;
  }

  // Mandatory Lookbook Bottom Palette Widget Preview
  const lookbookWidgetComboId = document.getElementById('lookbookWidgetComboId');
  const lookbookWidgetComboName = document.getElementById('lookbookWidgetComboName');
  const lookbookWidgetComboJp = document.getElementById('lookbookWidgetComboJp');
  const lookbookWidgetSwatches = document.getElementById('lookbookWidgetSwatches');

  if (lookbookWidgetComboId) {
    lookbookWidgetComboId.textContent = `Combination #${combo.id}`;
  }
  if (lookbookWidgetComboName) {
    lookbookWidgetComboName.textContent = combo.name_en;
  }
  if (lookbookWidgetComboJp) {
    lookbookWidgetComboJp.textContent = `${combo.name_jp} (${combo.name_romaji || ''})`;
  }
  if (lookbookWidgetSwatches) {
    lookbookWidgetSwatches.innerHTML = '';
    combo.colors.forEach((col, idx) => {
      const chip = document.createElement('div');
      chip.className = 'lookbook-swatch-chip';
      chip.style.borderColor = `${col.hex}55`;
      chip.innerHTML = `
        <span class="chip-color-block" style="background-color: ${col.hex};"></span>
        <div class="chip-meta">
          <span class="chip-label">C${idx + 1} · ${col.name_jp}</span>
          <span class="chip-name-en">${col.name_en}</span>
          <span class="chip-hex">${col.hex}</span>
        </div>
      `;
      lookbookWidgetSwatches.appendChild(chip);
    });
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

// Update Live Interactive App Mockup with Desktop & Mobile Dual-View Harmonic Styling
function updateUIMockup(combo) {
  if (!combo || !combo.colors || !combo.colors.length) return;

  const c1 = combo.colors[0];
  const c2 = combo.colors[1] || combo.colors[0];
  const c3 = combo.colors[2] || combo.colors[0];
  const c4 = combo.colors[3] || combo.colors[1] || combo.colors[0];

  // Luminance-tested high-contrast text for button/badge backgrounds
  const btn1Text = getContrastColor(c1.hex);
  const btn2Text = getContrastColor(c2.hex);
  const btn3Text = getContrastColor(c3.hex);

  // Sync canvas background classes
  if (mockupCanvas) {
    mockupCanvas.className = `mockup-canvas mode-${state.canvasThemeMode}`;
  }
  if (mobilePhoneScreen) {
    mobilePhoneScreen.className = `phone-screen mode-${state.canvasThemeMode}`;
  }

  const isLight = state.canvasThemeMode === 'light';
  const canvasBgHex = isLight ? '#fbfaf7' : '#0f0e0d';
  const contrastWithBg = calculateContrastRatio(c1.hex, canvasBgHex);
  const wcagRating = contrastWithBg >= 7.0 ? 'AAA' : contrastWithBg >= 4.5 ? 'AA' : 'Pass';

  // ==========================================
  // A. DESKTOP WEB APPLICATION MOCKUP
  // ==========================================
  const appLogoBadge = document.getElementById('appLogoBadge');
  if (appLogoBadge) {
    appLogoBadge.style.backgroundColor = c1.hex;
    appLogoBadge.style.color = btn1Text;
  }

  const appNavBtn = document.getElementById('appNavBtn');
  if (appNavBtn) {
    appNavBtn.style.color = c1.hex;
    appNavBtn.style.borderColor = `${c1.hex}66`;
  }

  // Desktop Navigation active tab styling
  if (desktopNavTabs) {
    desktopNavTabs.querySelectorAll('.desktop-tab-btn').forEach(b => {
      if (b.classList.contains('active')) {
        b.style.backgroundColor = c1.hex;
        b.style.color = btn1Text;
      } else {
        b.style.backgroundColor = '';
        b.style.color = '';
      }
    });
  }

  // Desktop KPI Metrics Cards (C1, C2, C3 chromatic hierarchy)
  const desktopKpi1 = document.getElementById('desktopKpi1');
  const desktopKpiTrend1 = document.getElementById('desktopKpiTrend1');
  const desktopKpiProgress1 = document.getElementById('desktopKpiProgress1');
  if (desktopKpi1) desktopKpi1.style.borderTop = `3px solid ${c1.hex}`;
  if (desktopKpiTrend1) {
    desktopKpiTrend1.style.backgroundColor = `${c1.hex}18`;
    desktopKpiTrend1.style.color = c1.hex;
  }
  if (desktopKpiProgress1) desktopKpiProgress1.style.backgroundColor = c1.hex;

  const desktopKpi2 = document.getElementById('desktopKpi2');
  const desktopKpiTrend2 = document.getElementById('desktopKpiTrend2');
  const desktopKpiProgress2 = document.getElementById('desktopKpiProgress2');
  if (desktopKpi2) desktopKpi2.style.borderTop = `3px solid ${c2.hex}`;
  if (desktopKpiTrend2) {
    desktopKpiTrend2.style.backgroundColor = `${c2.hex}18`;
    desktopKpiTrend2.style.color = c2.hex;
  }
  if (desktopKpiProgress2) desktopKpiProgress2.style.backgroundColor = c2.hex;

  const desktopKpi3 = document.getElementById('desktopKpi3');
  const desktopKpiTrend3 = document.getElementById('desktopKpiTrend3');
  const desktopKpiVal3 = document.getElementById('desktopKpiVal3');
  const desktopKpiProgress3 = document.getElementById('desktopKpiProgress3');
  if (desktopKpi3) desktopKpi3.style.borderTop = `3px solid ${c3.hex}`;
  if (desktopKpiTrend3) {
    desktopKpiTrend3.style.backgroundColor = `${c3.hex}18`;
    desktopKpiTrend3.style.color = c3.hex;
    desktopKpiTrend3.textContent = `WCAG ${wcagRating}`;
  }
  if (desktopKpiVal3) desktopKpiVal3.textContent = `${contrastWithBg}:1 Ratio`;
  if (desktopKpiProgress3) desktopKpiProgress3.style.backgroundColor = c3.hex;

  // Desktop Hero Section
  const appHeroPill = document.getElementById('appHeroPill');
  if (appHeroPill) {
    appHeroPill.textContent = `Combination #${combo.id} · ${combo.name_jp} (${combo.temperature.toUpperCase()})`;
    appHeroPill.style.color = c1.hex;
    appHeroPill.style.backgroundColor = `${c1.hex}14`;
    appHeroPill.style.border = `1px solid ${c1.hex}36`;
  }

  const heroAccentColor = getReadableAccentOnSurface(c1.hex, canvasBgHex, isLight);
  const appHeroTitle = document.getElementById('appHeroTitle');
  if (appHeroTitle) {
    appHeroTitle.innerHTML = `Harmonious Design in <span style="color: ${heroAccentColor};">${c1.name_en}</span>`;
  }

  const appBtnPrimary = document.getElementById('appBtnPrimary');
  if (appBtnPrimary) {
    appBtnPrimary.style.backgroundColor = c1.hex;
    appBtnPrimary.style.color = btn1Text;
  }

  const appBtnSecondary = document.getElementById('appBtnSecondary');
  if (appBtnSecondary) {
    appBtnSecondary.style.borderColor = `${c2.hex}88`;
    appBtnSecondary.style.color = isLight ? '#1c1916' : '#f6f4ee';
  }

  // Desktop Status Pills Strip
  const statusPill1 = document.getElementById('statusPill1');
  if (statusPill1) {
    statusPill1.style.backgroundColor = `${c1.hex}18`;
    statusPill1.style.color = c1.hex;
    statusPill1.style.borderColor = `${c1.hex}36`;
  }
  const statusPill2 = document.getElementById('statusPill2');
  if (statusPill2) {
    statusPill2.style.backgroundColor = `${c2.hex}18`;
    statusPill2.style.color = c2.hex;
    statusPill2.style.borderColor = `${c2.hex}36`;
  }
  const statusPill3 = document.getElementById('statusPill3');
  if (statusPill3) {
    statusPill3.style.backgroundColor = `${c3.hex}18`;
    statusPill3.style.color = c3.hex;
    statusPill3.style.borderColor = `${c3.hex}36`;
  }

  // Desktop Sandbox Controls
  if (desktopMockupToggle) {
    if (desktopMockupToggle.classList.contains('active')) {
      desktopMockupToggle.style.backgroundColor = c1.hex;
    } else {
      desktopMockupToggle.style.backgroundColor = '';
    }
  }

  const desktopCheckboxCustom = document.getElementById('desktopCheckboxCustom');
  if (desktopCheckboxCustom) {
    desktopCheckboxCustom.style.backgroundColor = c1.hex;
    desktopCheckboxCustom.style.borderColor = c1.hex;
  }

  // Desktop Specimen Cards (Bottom)
  const appCard1 = document.getElementById('appCard1');
  if (appCard1) {
    appCard1.style.borderLeft = `3px solid ${c2.hex}`;
    const heading = appCard1.querySelector('.card-heading');
    if (heading) {
      heading.textContent = `${c2.name_en} (${c2.name_jp})`;
    }
  }

  const appCard2 = document.getElementById('appCard2');
  if (appCard2) {
    appCard2.style.borderLeft = `3px solid ${c3.hex}`;
    const heading = appCard2.querySelector('.card-heading');
    if (heading) {
      heading.textContent = `WCAG ${wcagRating} (${contrastWithBg}:1)`;
    }
  }

  // ==========================================
  // B. MOBILE SMARTPHONE APPLICATION MOCKUP
  // ==========================================
  const mobileLogoBadge = document.getElementById('mobileLogoBadge');
  if (mobileLogoBadge) {
    mobileLogoBadge.style.backgroundColor = c1.hex;
    mobileLogoBadge.style.color = btn1Text;
  }

  const mobileNotifPip = document.getElementById('mobileNotifPip');
  if (mobileNotifPip) {
    mobileNotifPip.style.backgroundColor = c4.hex || c3.hex;
  }

  const mobileHeroCard = document.getElementById('mobileHeroCard');
  if (mobileHeroCard) {
    mobileHeroCard.style.borderLeft = `3px solid ${c1.hex}`;
  }

  const mobileHeroKicker = document.getElementById('mobileHeroKicker');
  if (mobileHeroKicker) {
    mobileHeroKicker.textContent = `Combination #${combo.id} · ${combo.name_jp}`;
    mobileHeroKicker.style.color = c1.hex;
  }

  const mobileHeroTitle = document.getElementById('mobileHeroTitle');
  if (mobileHeroTitle) {
    const mobileScreenBg = isLight ? '#ffffff' : '#191816';
    const mobileHeroAccent = getReadableAccentOnSurface(c1.hex, mobileScreenBg, isLight);
    mobileHeroTitle.innerHTML = `Harmonious Flow in <span style="color: ${mobileHeroAccent};">${c1.name_en}</span>`;
  }

  const mobileBtnPrimary = document.getElementById('mobileBtnPrimary');
  if (mobileBtnPrimary) {
    mobileBtnPrimary.style.backgroundColor = c1.hex;
    mobileBtnPrimary.style.color = btn1Text;
  }

  // Mobile KPI Cards
  const mobileKpiCard1 = document.getElementById('mobileKpiCard1');
  const mobileKpiTrend1 = document.getElementById('mobileKpiTrend1');
  if (mobileKpiCard1) mobileKpiCard1.style.borderLeft = `3px solid ${c2.hex}`;
  if (mobileKpiTrend1) {
    mobileKpiTrend1.style.backgroundColor = `${c2.hex}18`;
    mobileKpiTrend1.style.color = c2.hex;
  }

  const mobileKpiCard2 = document.getElementById('mobileKpiCard2');
  const mobileKpiVal2 = document.getElementById('mobileKpiVal2');
  const mobileKpiTrend2 = document.getElementById('mobileKpiTrend2');
  if (mobileKpiCard2) mobileKpiCard2.style.borderLeft = `3px solid ${c3.hex}`;
  if (mobileKpiVal2) mobileKpiVal2.textContent = wcagRating;
  if (mobileKpiTrend2) {
    mobileKpiTrend2.style.backgroundColor = `${c3.hex}18`;
    mobileKpiTrend2.style.color = c3.hex;
    mobileKpiTrend2.textContent = `${contrastWithBg}:1`;
  }

  // Mobile Toggle Switch
  if (mobileMockupToggle) {
    if (mobileMockupToggle.classList.contains('active')) {
      mobileMockupToggle.style.backgroundColor = c1.hex;
    } else {
      mobileMockupToggle.style.backgroundColor = '';
    }
  }

  // Mobile Status Chips
  const mobileTag1 = document.getElementById('mobileTag1');
  if (mobileTag1) {
    mobileTag1.style.backgroundColor = `${c1.hex}18`;
    mobileTag1.style.color = c1.hex;
    mobileTag1.style.borderColor = `${c1.hex}36`;
  }
  const mobileTag2 = document.getElementById('mobileTag2');
  if (mobileTag2) {
    mobileTag2.style.backgroundColor = `${c2.hex}18`;
    mobileTag2.style.color = c2.hex;
    mobileTag2.style.borderColor = `${c2.hex}36`;
  }

  // Mobile Bottom Nav active tab
  if (mobileBottomNav) {
    const activeNavTab = mobileBottomNav.querySelector('.phone-nav-tab.active');
    if (activeNavTab) {
      const navBgHex = isLight ? '#ffffff' : '#191816';
      activeNavTab.style.color = getReadableAccentOnSurface(c1.hex, navBgHex, isLight);
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
      code = generateFashionPrompts(combo, state.outfitVibe || state.fashionStyle, state.outfitClimate, state.outfitHijab, state.outfitBackground, state.outfitCustomPieces).midjourney;
    } else if (state.activeDomain === 'interior') {
      code = generateInteriorPrompts(combo, state.interiorStyle).midjourney;
    } else {
      code = generateUIPrompts(combo).midjourney;
    }
  } else if (state.exportTab === 'flux') {
    if (state.activeDomain === 'fashion') {
      code = generateFashionPrompts(combo, state.outfitVibe || state.fashionStyle, state.outfitClimate, state.outfitHijab, state.outfitBackground, state.outfitCustomPieces).flux;
    } else if (state.activeDomain === 'interior') {
      code = generateInteriorPrompts(combo, state.interiorStyle).flux;
    } else {
      code = generateUIPrompts(combo).flux;
    }
  } else if (state.exportTab === 'gemini') {
    if (state.activeDomain === 'fashion') {
      code = generateFashionPrompts(combo, state.outfitVibe || state.fashionStyle, state.outfitClimate, state.outfitHijab, state.outfitBackground, state.outfitCustomPieces).gemini;
    } else if (state.activeDomain === 'interior') {
      code = generateInteriorPrompts(combo, state.interiorStyle).gemini;
    } else {
      code = generateUIPrompts(combo).gemini;
    }
  } else if (state.exportTab === 'dalle') {
    if (state.activeDomain === 'fashion') {
      code = generateFashionPrompts(combo, state.outfitVibe || state.fashionStyle, state.outfitClimate, state.outfitHijab, state.outfitBackground, state.outfitCustomPieces).dalle;
    } else if (state.activeDomain === 'interior') {
      code = generateInteriorPrompts(combo, state.interiorStyle).dalle;
    } else {
      code = generateUIPrompts(combo).dalle;
    }
  } else if (state.exportTab === 'design-md') {
    if (state.activeDomain === 'fashion') {
      const spec = getFashionSpec(state.outfitVibe || state.fashionStyle, state.outfitClimate, state.outfitHijab, state.outfitBackground, state.outfitCustomPieces);
      const p = spec.profile;
      const items = spec.items;
      const numColors = combo.colors.length;
      const roles = p.swatchRoles[numColors] || p.swatchRoles[3];
      const mapping = getFashionMapping(numColors);

      code = `# Wada Sanzo Fashion Lookbook: #${combo.id} ${combo.name_en}\n\n`;
      code += `**Occasion Vibe**: ${p.name} (${p.sub})\n`;
      code += `**Best Suited For**: ${p.suitability}\n`;
      code += `**Photography Setting**: ${spec.bgIcon} ${spec.bgName}\n`;
      code += `**Climate**: ${spec.climateLabel}\n`;
      code += `**Modesty Style**: ${spec.modestyLabel}\n`;
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
        { key: 'shirt', label: '2. Shirt / Top' },
        { key: 'bottoms', label: '3. Bottoms' },
        { key: 'footwear', label: '4. Footwear' },
        { key: 'socks', label: '5. Socks & Legwear' },
        { key: 'bag', label: '6. Bag & Leather' },
        { key: 'headwear', label: state.outfitHijab ? '7. Hijab / Headwear' : '7. Headwear' }
      ];
      layers.forEach((l, idx) => {
        const colorIdx = mapping[idx];
        const col = combo.colors[colorIdx] || combo.colors[0];
        const it = items[l.key];
        code += `| ${l.label} | ${it.name} | ${col.name_jp} (${col.name_en}) | \`${col.hex}\` | ${it.material} |\n`;
      });
      code += `\n**Backdrop & Setting**: ${spec.backdrop}\n\n`;
      
      const swatchChipsText = combo.colors.map((c, i) => `C${i + 1}: ${c.name_jp} (${c.name_en}) ${c.hex}`).join(', ');
      code += `### Lookbook Composition & Mandatory Bottom Palette Widget\n`;
      code += `- **Widget Mandate**: Mandatory on all created lookbook images.\n`;
      code += `- **Wada Palette Reference**: Combination #${combo.id} (${combo.name_jp} / ${combo.name_en})\n`;
      code += `- **Exact Pigment Swatches**: ${swatchChipsText}\n`;
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
