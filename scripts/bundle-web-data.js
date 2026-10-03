const fs = require('fs');
const path = require('path');

const combos = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/wada_combinations.json'), 'utf8'));
const colors = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/wada_colors.json'), 'utf8'));

const outPath = path.resolve(__dirname, '../web/data.js');
const content = `// Auto-generated Wada Sanzo Dataset bundle for zero-build web visualizer
window.WADA_COMBINATIONS = ${JSON.stringify(combos)};
window.WADA_COLORS = ${JSON.stringify(colors)};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log('Successfully generated web/data.js');
