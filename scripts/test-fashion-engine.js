const assert = require('assert');
const {
  fashionProfiles,
  BACKGROUND_PRESETS,
  GARMENT_CATALOG,
  getFashionMapping,
  resolveEnsembleItem,
  getFashionSpec,
  generateFashionPrompts
} = require('../bin/fashion-catalog');

console.log('--- Testing Wada Colors Fashion & Garment Customization Engine ---');

// 1. Catalog integrity
assert(Object.keys(GARMENT_CATALOG).length === 7, 'Must have 7 layers in catalog');
const expectedLayers = ['outerwear', 'shirt', 'bottoms', 'footwear', 'socks', 'bag', 'headwear'];
expectedLayers.forEach(layer => {
  assert(GARMENT_CATALOG[layer], `Layer ${layer} must exist`);
  assert(Object.keys(GARMENT_CATALOG[layer]).length > 4, `Layer ${layer} must have multiple piece options`);
});
console.log('✅ 7-layer garment catalog structure verified');

// 2. Context-aware piece adaptation
// Outerwear: Hoodie in Tropical vs Winter vs Hijab
const hoodieTrop = resolveEnsembleItem('outerwear', 'casual_walk', 'tropical', false, 'hoodie');
assert(hoodieTrop.name.includes('French Terry') || hoodieTrop.name.includes('Hoodie'), 'Tropical hoodie should be French terry/breathable');

const hoodieWinter = resolveEnsembleItem('outerwear', 'casual_walk', 'winter', false, 'hoodie');
assert(hoodieWinter.name.includes('Fleece') || hoodieWinter.material.includes('fleece'), 'Winter hoodie should be fleece');

const hoodieHijab = resolveEnsembleItem('outerwear', 'casual_walk', 'tropical', true, 'hoodie');
assert(hoodieHijab.name.includes('Longline') || hoodieHijab.material.includes('modest'), 'Hijab hoodie should be longline/modest');

console.log('✅ Climate and modesty garment piece adaptation verified');

// 3. Fallback to default
const defaultPiece = resolveEnsembleItem('bottoms', 'kondangan_wedding', 'tropical', true, 'default');
assert(defaultPiece.name.includes('Batik'), 'Default kondangan bottoms should be batik');
console.log('✅ Default occasion piece resolution verified');

// 4. Prompt Generation with Mock Combo
const mockCombo = {
  id: 165,
  name_jp: '紅梅色・尖晶石紅・深湖紅',
  name_en: 'Cameo Pink & Spinel Red & Vistoris Lake',
  colors: [
    { id: 1, name_jp: '紅梅色', name_en: 'Cameo Pink', hex: '#e0b3b6' },
    { id: 2, name_jp: '尖晶石紅', name_en: 'Spinel Red', hex: '#f27291' },
    { id: 3, name_jp: '深湖紅', name_en: 'Vistoris Lake', hex: '#6d4145' }
  ]
};

const customPrompt = generateFashionPrompts(
  mockCombo,
  'casual_walk',
  'tropical',
  true,
  'cafe',
  { outerwear: 'hoodie', bottoms: 'jeans' }
);

assert(customPrompt.midjourney.includes('Hoodie'), 'Midjourney prompt should contain custom hoodie');
assert(customPrompt.flux.includes('Jeans'), 'Flux prompt should contain custom jeans');
assert(customPrompt.gemini.includes('#e0b3b6'), 'Gemini prompt should preserve Wada hex codes');
assert(customPrompt.dalle.includes('#f27291'), 'DALL-E prompt should preserve Wada hex codes');

// 5. Mandatory Bottom Palette Widget Verification
assert(customPrompt.midjourney.includes('Mandatory integrated bottom palette widget'), 'Midjourney prompt must require bottom palette widget');
assert(customPrompt.flux.includes('Mandatory integrated bottom palette widget'), 'Flux prompt must require bottom palette widget');
assert(customPrompt.gemini.includes('Mandatory integrated bottom color widget'), 'Gemini prompt must require bottom palette widget');
assert(customPrompt.dalle.includes('mandatory integrated minimalist lookbook graphic widget'), 'DALL-E prompt must require bottom palette widget');
assert(customPrompt.midjourney.includes('#165'), 'Prompt widget must state palette combination number #165');

// Non-hijab prompt must also mandate bottom widget
const nonHijabPrompt = generateFashionPrompts(mockCombo, 'gallery_opening', 'winter', false, 'studio');
assert(nonHijabPrompt.midjourney.includes('Mandatory integrated bottom palette widget'), 'Non-hijab Midjourney must include bottom widget');
assert(nonHijabPrompt.flux.includes('Mandatory integrated bottom palette widget'), 'Non-hijab Flux must include bottom widget');
assert(nonHijabPrompt.gemini.includes('Mandatory integrated bottom color widget'), 'Non-hijab Gemini must include bottom widget');
assert(nonHijabPrompt.dalle.includes('mandatory integrated minimalist lookbook graphic widget'), 'Non-hijab DALL-E must include bottom widget');
console.log('✅ Mandatory bottom color palette widget verified across all models & modes');

// 6. CLI End-to-End Generation Tests (Fashion, Interior, UI)
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, '..', 'scratch');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const testFashionFile = path.join(tmpDir, 'test-fashion.md');
const testInteriorFile = path.join(tmpDir, 'test-interior.md');
const testUiFile = path.join(tmpDir, 'test-ui.md');

try {
  execSync(`node bin/cli.js generate --combo 165 --domain fashion --vibe casual_walk --tropical --hijabi --outer hoodie --bottoms jeans --out "${testFashionFile}"`, { stdio: 'pipe' });
  assert(fs.existsSync(testFashionFile), 'Fashion lookbook file should be generated');
  const fashionContent = fs.readFileSync(testFashionFile, 'utf8');
  assert(fashionContent.includes('Casual Walk & Coffee Hangout'), 'Fashion file must have occasion vibe');
  assert(fashionContent.includes('Cameo Pink'), 'Fashion file must contain combo #165 colors');

  execSync(`node bin/cli.js generate --combo 121 --domain interior --style japandi --out "${testInteriorFile}"`, { stdio: 'pipe' });
  assert(fs.existsSync(testInteriorFile), 'Interior spec file should be generated');
  const interiorContent = fs.readFileSync(testInteriorFile, 'utf8');
  assert(interiorContent.includes('Japandi / Modern Ryokan'), 'Interior file must have style archetype');

  execSync(`node bin/cli.js generate --combo 127 --domain ui --name "TestApp" --out "${testUiFile}"`, { stdio: 'pipe' });
  assert(fs.existsSync(testUiFile), 'UI design system file should be generated');
  const uiContent = fs.readFileSync(testUiFile, 'utf8');
  assert(uiContent.includes('Design System: TestApp'), 'UI file must contain app name');

  console.log('✅ CLI end-to-end generation verified across Fashion, Interior, and UI domains');
} finally {
  if (fs.existsSync(testFashionFile)) fs.unlinkSync(testFashionFile);
  if (fs.existsSync(testInteriorFile)) fs.unlinkSync(testInteriorFile);
  if (fs.existsSync(testUiFile)) fs.unlinkSync(testUiFile);
}

console.log('\n🎉 All Fashion & CLI Engine tests PASSED successfully!\n');

