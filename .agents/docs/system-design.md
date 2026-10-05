# 📐 System Design & Technical Specification

Architecture specification for the `wada-colors` system, color matching math, and multi-domain generators.

---

## 1. System Pipeline

```
                    ┌────────────────────────┐
                    │    User Input / CLI    │
                    │ (/wada, init, apply)   │
                    └───────────┬────────────┘
                                │
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
┌──────────────┐        ┌──────────────┐         ┌──────────────┐
│  Color Math  │        │   Fashion    │         │   Theming    │
│  (CIELAB ΔE) │        │ 7-Layer Eng. │         │  AST Parser  │
└───────┬──────┘        └───────┬──────┘         └───────┬──────┘
        │                       │                        │
        ▼                       ▼                        ▼
 159 Colors / 348       lookbook.md /            Tailwind CSS /
 Combinations Match     GenAI Prompts            CSS Vars Injection
```

---

## 2. Perceptual Color Matching Math
Color similarity matching is performed by converting standard sRGB values to the CIELAB color space:
1. **sRGB to Linear RGB**:
   $$V_{\text{linear}} = \begin{cases} \frac{V}{12.92} & \text{if } V \le 0.04045 \\ \left(\frac{V + 0.055}{1.055}\right)^{2.4} & \text{if } V > 0.04045 \end{cases}$$
2. **Linear RGB to CIE XYZ (Observer 2°, Illuminant D65)**:
   $$X = 0.4124 R + 0.3576 G + 0.1805 B$$
   $$Y = 0.2126 R + 0.7152 G + 0.0722 B$$
   $$Z = 0.0193 R + 0.1192 G + 0.9505 B$$
3. **CIE XYZ to CIELAB**:
   Standard non-linear cube-root transformation using reference white point $(95.047, 100.0, 108.883)$.
4. **Euclidean Delta-E ($\Delta E^*$)**:
   $$\Delta E^* = \sqrt{(L_1 - L_2)^2 + (a_1 - a_2)^2 + (b_1 - b_2)^2}$$

---

## 3. 7-Layer Fashion Architecture
Implemented in `bin/fashion-catalog.js`:
- Each layer maps explicitly to one color from the selected Wada combination or a monochromatic neutral bridge.
- The bottom widget ensures full visual transparency of hex codes and Japanese pigment names.
- GenAI prompt builder outputs tailored instructions for Midjourney v6.1, Flux.1, Imagen 3, and DALL-E 3.
