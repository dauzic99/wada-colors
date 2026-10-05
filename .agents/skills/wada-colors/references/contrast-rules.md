# 📐 WCAG Contrast & Strict Token Bridge Rules
> How to maintain strict Wada Sanzo color authenticity while guaranteeing 100% WCAG AA/AAA compliance.

## The Problem
Wada Sanzo's palettes were created for printing on physical paper in 1933. Some combinations pair two colors of similar luminance (e.g. Pink and Light Blue), which look gorgeous side-by-side but fail WCAG if one is placed as small body text directly over the other.

## The Strict Bridge Solution
1. **Never morph or desaturate Wada colors**:
   The exact hex codes from Wada Sanzo must be preserved 100% for branding, key accents, borders, tags, hero illustrations, and interactive focal points.
2. **Neutral Monochrome Bridge**:
   For structural UI backgrounds, elevated cards, and body text, bridge the palette with neutral monochromes:
   - **Light Mode Canvas**: `#fcfbf9` (Japanese Paper / Washi Ivory) or `#ffffff`
   - **Light Mode Body Text**: `#111314` (Wada Black / Sumi Ink) -> **18.5:1 (AAA)**
   - **Light Mode Subtle Border**: `#e5e7eb` or 15% opacity of the darkest Wada color
   - **Dark Mode Canvas**: `#111314` (Deep Carbon) or `#181a1b`
   - **Dark Mode Card Surface**: `#1f2326` (Elevated Carbon)
   - **Dark Mode Body Text**: `#f5f5f7` or `#fcfbf9` -> **16.2:1 (AAA)**
   - **Dark Mode Subtle Border**: `#2d3238`
3. **Button Text Inversion Rule**:
   - When a button background is a dark Wada color (Luminance < 0.25), button text MUST be `#ffffff` (Contrast >= 4.5:1).
   - When a button background is a light Wada color (Luminance > 0.4), button text MUST be `#111314` (Contrast >= 7.0:1).
