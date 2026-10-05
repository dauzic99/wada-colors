---
trigger: always_on
---

# 💻 Coding Standards & Conventions

Coding style and verification standards for the `wada-colors` codebase.

---

## 1. Node.js & Module Format
- Keep CLI scripts and modules in **CommonJS** (`require` / `module.exports`) to maintain broad compatibility with global `npx` execution across diverse Node environments (v16 through v22+).
- Web frontend scripts (`web/app.js`) use modern ES6+ features with zero bundler requirements (vanilla JS, native DOM APIs, SVG).

---

## 2. Dependency Philosophy
- **Zero Heavy Runtime Dependencies**: The core CLI, math calculations, and AST file transformations must remain pure vanilla JavaScript using Node standard libraries.
- Avoid introducing massive build chains, Babel, or compilation steps for CLI commands.

---

## 3. Testing & Verification Standard
- Always run the full validation suite after touching any data, CLI, or engine logic:
  ```bash
  npm test
  ```
- Any PR or edit modifying `data/wada_colors.json` or `data/wada_combinations.json` must pass `scripts/validate-data.js` without any warnings.
- Any edit to `bin/fashion-catalog.js` or `bin/cli.js` must pass `scripts/test-fashion-engine.js`.

---

## 4. Error Handling & CLI UX
- Provide clear, actionable error messages with visual prefixes (`❌`, `⚠️`, `🌸`, `✅`).
- Handle missing files or invalid IDs gracefully with helpful suggestions.
