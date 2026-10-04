/**
 * 🌸 Wada Colors - Fashion Catalog & Prompt Generation Engine
 * Defines 8 realistic occasion vibes, climate & modesty adaptations,
 * 7 background presets, and the 7-layer customizable garment catalog.
 */

function getFashionMapping(size) {
  if (size === 2) return [0, 1, 0, 1, 0, 0, 1]; // Outerwear:0, Shirt:1, Bottoms:0, Footwear:1, Socks:0, Bag:0, Headwear:1
  if (size === 3) return [0, 1, 2, 0, 1, 2, 1]; // Outerwear:0, Shirt:1, Bottoms:2, Footwear:0, Socks:1, Bag:2, Headwear:1
  return [0, 1, 2, 3, 2, 3, 0];                  // Outerwear:0, Shirt:1, Bottoms:2, Footwear:3, Socks:2, Bag:3, Headwear:0
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
fashionProfiles.streetwear = fashionProfiles.casual_walk;
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

function getFashionSpec(vibeKey, climate = 'tropical', isHijab = false, bgKey = 'auto', customPieces = null) {
  const p = fashionProfiles[vibeKey] || fashionProfiles.casual_walk;
  const cData = (p.climates && p.climates[climate]) ? p.climates[climate] : (p.climates ? p.climates.tropical : p);
  
  const activePieces = customPieces !== null && customPieces !== undefined ? customPieces : {};
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

function generateFashionPrompts(combo, vibeKey, climate = 'tropical', isHijab = false, bgKey = 'auto', customPieces = null) {
  const activeVibe = vibeKey || 'casual_walk';
  const activeClimate = climate || 'tropical';
  const activeHijab = isHijab !== undefined && isHijab !== null ? isHijab : false;
  const activeBg = bgKey || 'auto';

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

  const headwearLabel = activeHijab 
    ? `Hijab / Headwear (${items.headwear.name} in ${cHeadwear.name_en} ${cHeadwear.hex}, ${items.headwear.material})` 
    : `Headwear / Hair Accessory (${items.headwear.name} in ${cHeadwear.hex}, ${items.headwear.material})`;

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

module.exports = {
  CURATED_VIBES,
  fashionProfiles,
  BACKGROUND_PRESETS,
  GARMENT_CATALOG,
  getFashionMapping,
  resolveEnsembleItem,
  getFashionSpec,
  generateFashionPrompts
};
