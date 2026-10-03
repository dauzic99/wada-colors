const fs = require('fs');
const path = require('path');

const colorsPath = path.resolve(__dirname, '../data/wada_colors.json');
const combosPath = path.resolve(__dirname, '../data/wada_combinations.json');

console.log('--- Validating Wada Sanzo Dataset ---');

if (!fs.existsSync(colorsPath)) {
  console.error('Error: wada_colors.json not found!');
  process.exit(1);
}
if (!fs.existsSync(combosPath)) {
  console.error('Error: wada_combinations.json not found!');
  process.exit(1);
}

const colors = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
const combos = JSON.parse(fs.readFileSync(combosPath, 'utf8'));

let errors = 0;

// Validate Colors
if (colors.length !== 159) {
  console.error(`Invalid colors count: expected 159, got ${colors.length}`);
  errors++;
}

colors.forEach((c, idx) => {
  if (!c.id || c.id !== idx + 1) {
    console.error(`Invalid color ID at index ${idx}:`, c);
    errors++;
  }
  if (!/^#[0-9a-f]{6}$/i.test(c.hex)) {
    console.error(`Invalid hex format in color ${c.id}: ${c.hex}`);
    errors++;
  }
  if (!Array.isArray(c.rgb) || c.rgb.length !== 3 || c.rgb.some(v => v < 0 || v > 255)) {
    console.error(`Invalid rgb in color ${c.id}:`, c.rgb);
    errors++;
  }
  if (!c.name_en || !c.name_jp || !c.name_romaji) {
    console.error(`Missing name in color ${c.id}:`, c);
    errors++;
  }
});

// Validate Combinations
if (combos.length !== 348) {
  console.error(`Invalid combinations count: expected 348, got ${combos.length}`);
  errors++;
}

let count2 = 0, count3 = 0, count4 = 0;

combos.forEach((combo, idx) => {
  if (!combo.id || combo.id !== idx + 1) {
    console.error(`Invalid combo ID at index ${idx}:`, combo.id);
    errors++;
  }
  if (combo.colors.length === 2) count2++;
  else if (combo.colors.length === 3) count3++;
  else if (combo.colors.length === 4) count4++;
  else {
    console.error(`Unexpected combo size in #${combo.id}: ${combo.colors.length}`);
    errors++;
  }

  combo.colors.forEach(c => {
    if (!colors[c.id - 1] || colors[c.id - 1].hex !== c.hex) {
      console.error(`Color mismatch in combo #${combo.id} for color ${c.id}`);
      errors++;
    }
  });

  if (!combo.contrast || !combo.contrast.against_white || !combo.contrast.against_black) {
    console.error(`Missing contrast data in combo #${combo.id}`);
    errors++;
  }
});

console.log(`- 159 Colors validated.`);
console.log(`- 348 Combinations validated:`);
console.log(`  * 2-color palettes: ${count2} (expected 120)`);
console.log(`  * 3-color palettes: ${count3} (expected 120)`);
console.log(`  * 4-color palettes: ${count4} (expected 108)`);

if (count2 === 120 && count3 === 120 && count4 === 108 && errors === 0) {
  console.log('✅ All validation checks PASSED successfully!');
} else {
  console.error(`❌ Validation failed with ${errors} errors.`);
  process.exit(1);
}
