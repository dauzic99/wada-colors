# Contributing to Wada Colors (和田三造 配色)

Thank you for your interest in contributing to **Wada Colors**!

## Ways to Contribute

1. **New Agent Adapters**: Add support for new emerging agent environments in `adapters/` and update `bin/cli.js`.
2. **Archetype & Tag Refinements**: Improve semantic tags or archetype associations in `data/wada_combinations.json`.
3. **Web Visualizer Enhancements**: Propose UI/UX improvements to the zero-build visualizer in `web/`.
4. **Bug Reports & Inconsistencies**: Report any palette mismatches against the physical 1930s publication *Haishoku Sōkan*.

## Development Workflow

1. Clone repository:
   ```bash
   git clone https://github.com/dauzic99/wada-colors.git
   cd wada-colors
   ```
2. Run validation test:
   ```bash
   npm test
   ```
3. Rebuild reference tables if data changed:
   ```bash
   npm run build:refs
   ```
4. Start local web visualizer:
   ```bash
   npm run serve
   ```
   Open `http://localhost:3333` in your browser.

## Pull Request Guidelines

- Ensure `npm test` passes with 0 errors.
- Keep the web visualizer strictly zero-build (vanilla HTML/CSS/JS) so it remains effortlessly hostable on static platforms and GitHub Pages without build steps.
