# 👘 Fashion & Garment Styling Rules (7-Layer Ensemble Engine)

> Architectural guide to Wada Sanzo layered fashion ensembles, climate adaptations, modesty rules, and multi-model GenAI image prompts.

---

## 1. The 7-Layer Garment Taxonomy

Every generated wardrobe lookbook or GenAI fashion prompt maps the chosen Wada palette across 7 structured garment layers:

| Layer | Category | Garment Types & Silhouettes | Role in Palette |
|---|---|---|---|
| **01** | **Outerwear** | Tailored Blazer, Trench Coat, Kimono Duster, Kebaya Outer, Utility/Denim Jacket, Oversized Hoodie, Wool Overcoat, Knit Cardigan, Tailored Vest | Outer surface anchor (`c1` or deep neutral) |
| **02** | **Top / Shirt** | Combed Cotton Tee, Silk/Satin Blouse, Merino Turtleneck, Tunic Blouse, Relaxed Oxford Shacket, Camisole Inner | Mid-layer contrast (`c2` or pure white `#ffffff`) |
| **03** | **Bottoms** | Tailored High-Rise Trousers, Column Maxi Skirt, Pleated Midi Skirt, Raw Denim Jeans, Modern Batik Skirt, Wide-Leg Culottes, Relaxed Chinos | Lower body anchor (`c3` or `c1` tonal echo) |
| **04** | **Footwear** | Minimalist Court Sneakers, Penny Loafers, Block Heel Mules, Kitten/Stiletto Heels, Chelsea Boots, Nappa Leather Slides, Traditional Geta-inspired Sandals | Grounding accent (`c1`, sumi carbon, or natural leather) |
| **05** | **Socks & Legwear** | No-Show Liners, Ribbed Crew Socks, Sheer Tights, Opaque Modest Tights, Fine Wool Thermal Socks | Subtle transition or contrast pip |
| **06** | **Bag & Leather** | Minimalist Structured Tote, Crescent Crossbody, Chain Shoulder Bag, Minaudière Clutch, Vanity Box, Leather Backpack | Focal accent (`c2` or `c4`) |
| **07** | **Headwear / Hijab** | **Hijabi**: Ultrafine Voal Square, Flowing Pashmina Shawl, Cotton Gauze, Silk-Satin Wrap, Thermal Balaclava Hijab<br>**Contemporary**: Architectural Hair Barrette, Cashmere Beanie, French Wool Beret, Structured Baseball Cap, Straw Boater, Padded Headband | Frame for face & crown harmony (`c2`, `c3`, or neutral bridge) |

---

## 2. Occasion Vibes (8 Curated Profiles)

1. **`casual_walk`**: Weekend city exploration, coffee runs. Relaxed silhouette, unlined jackets, sneakers, crossbody bag.
2. **`office_meeting`**: Corporate leadership, creative studio pitch. Sharp structured blazer, silk blouse, high-rise trousers, loafers or block heels.
3. **`romantic_date`**: Intimate evening dinner, twilight gallery stroll. Draped silk, flowing pleated skirt, kitten heels, subtle jewelry accents.
4. **`evening_party`**: Gala, cocktail reception, launch party. Architectural silhouettes, contrasting metallic hardware, clutch, stiletto heels.
5. **`kondangan_wedding`**: Traditional-modern ceremonial celebration. Modern kebaya outer or tailored suit with subtle batik accents, heels, minaudière bag.
6. **`family_arisan`**: Warm, elegant social gathering. Comfortable tunic or knit set, elegant scarf/hijab drape, refined flats.
7. **`vacation_resort`**: Coastal retreat, tropical getaway. Breathable linen trousers, kimono duster, raffia/nappa slides, straw accessories.
8. **`campus_casual`**: University or co-working space. Hoodie or denim jacket, cotton tee, straight-leg denim, court sneakers, leather backpack.

---

## 3. Climate & Modesty Adaptations

### Tropical (Indonesia / Southeast Asia / Warm Climate)
- Lightweight, breathable natural fibers: linen, cotton voal, Tencel, viscose, silk habotai.
- Replaces heavy wool overcoats with unlined duster jackets, kimono cardigans, or lightweight blazers.
- Avoids multiple thick heat-trapping layers.

### Four Seasons (Autumn / Winter / Cold Climate)
- Substantial insulating textures: double-faced wool, cashmere knitwear, corduroy, heavy denim, leather boots.
- Incorporates warm outerwear (wool trench, overcoat) and thermal legwear.

### Modern Modest Hijabi Adaptation
- Ensures long-line silhouettes (tunics covering hips, maxi skirts, wide-leg trousers).
- Replaces revealing necklines and short sleeves with modest high-neck tops, tunics, and long sleeves.
- Incorporates tailored hijab styling with premium fabrics (Ultrafine Voal, Pashmina, Silk-Satin).

---

## 4. Mandatory Bottom Color Palette Widget

Every lookbook prompt or visual generation **MUST** feature a clean bottom graphic widget displaying the authentic Wada pigments:

```
┌─────────────────────────────────────────────────────────────┐
│ 🌸 Wada Sanzo Palette #[ID] · [Japanese Name] ([Romaji])   │
│ █ [HEX_1] (Outerwear)  █ [HEX_2] (Top)  █ [HEX_3] (Bottoms) │
└─────────────────────────────────────────────────────────────┘
```

In GenAI prompts, this is enforced by specifying:
> *"The bottom 10% of the image features an editorial color palette widget with solid rectangular swatches of [HEX_1], [HEX_2], [HEX_3], clearly labeled with their respective Wada Sanzo pigment names and hex codes."*
