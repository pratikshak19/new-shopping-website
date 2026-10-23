# Trendify catalogue expansion plan

Goal: grow the catalogue from 60 → 118 realistic products in batches,
without changing the site's design, layout, theme or existing features.

## Non-negotiable image rule

- Every product gets its **own unique image file** in `public/images/products/`.
  Never reuse one image for two products.
- The image must show **exactly** the product in the name — same garment/item,
  same main colour, same variant.
- The pictured colour is always `colors[0]`; colour-specific names start with
  the pictured colour (e.g. "Maroon Velvet Wrap Midi Dress").
- Images are normalised to **800×1000 (4:5)**, matching the product cards.
- After adding a batch, visually audit the new images (contact sheet) against
  each product's name/category/`colors[0]` before committing.
- New products are appended in `src/data/catalogExpansion.js` with full
  fields: price, MRP, rating, reviews, stock, colors, sizes, tags,
  description and highlights. Returning shoppers automatically receive new
  products because the store merges missing catalogue IDs on load.

## Status

| Batch | Products | Status |
|---|---|---|
| Base catalogue | 60 (td-1001…td-2008) | Live |
| Batch 1 (Oct 2026) | +10 (td-3001…td-3010): Women ×8, Men ×2 | Live |
| Batch 2 | +10 (td-3011…td-3020): Kids ×5, Electronics ×5 | Live |
| Batch 3 | +10 (td-3021…td-3030): Kids ×3, Electronics ×3, Home ×4 | In this release |
| Batch 4 | +10 (td-3031…td-3040): Home ×4, Beauty ×6 | Queued |
| Batch 5 | +10 (td-3041…td-3050): Beauty ×2, Footwear ×6, Accessories ×2 | Queued |
| Batch 6 | +8 (td-3051…td-3058): Men ×6, Accessories ×2 | Queued |
| **Target total** | **118 products, every category ≥ 11** | |

> AI product photos can be generated 10 at a time per working session, which
> is why the expansion lands in these exact batches instead of one risky
> drop. Say "continue" to generate and add the next batch.

## Queued products (pictured colour first in the name)

**Batch 2 — Kids ×5 + Electronics ×5:** Sunny Yellow Hooded Raincoat
(`yellow-kids-raincoat.jpg`) · Blue Denim Dungaree & Tee Set
(`blue-kids-dungaree-set.jpg`) · Pink Polka Dot Cotton Frock
(`pink-polka-frock.jpg`) · Green Dinosaur Print Tee & Shorts Set
(`green-dino-kids-set.jpg`) · Red Puffer Winter Jacket (`red-kids-puffer.jpg`)
· Black Noise-Cancelling Headphones (`black-headphones.jpg`) · Backlit
Mechanical Gaming Keyboard (`gaming-keyboard.jpg`) · 4K Action Camera
(`action-camera.jpg`) · White Portable Mini Projector (`mini-projector.jpg`)
· Black Smart Fitness Band (`fitness-band.jpg`)

**Batch 3 — Kids ×3 + Electronics ×3 + Home ×4:** Sky Blue Star Print Pyjama
Set (`blue-star-pyjama-set.jpg`) · Orange Ethnic Kurta Pyjama Set
(`orange-kids-kurta-set.jpg`) · Lavender Unicorn Print Sweatshirt
(`lavender-unicorn-sweatshirt.jpg`) · White 65W USB-C Fast Charger
(`usbc-fast-charger.jpg`) · Grey Wireless Ergonomic Mouse
(`grey-wireless-mouse.jpg`) · Silver 11-inch Tablet with Stylus
(`tablet-with-stylus.jpg`) · White & Grey Striped King Bedsheet Set
(`striped-king-bedsheet.jpg`) · Sage Green Ceramic Dinner Set 12
(`sage-dinner-set.jpg`) · Amber Scented Soy Candle Duo
(`amber-soy-candles.jpg`) · Walnut Wooden Wall Shelves Set of 3
(`walnut-wall-shelves.jpg`)

**Batch 4 — Home ×4 + Beauty ×6:** Teal Cotton Bath Towel Set 4
(`teal-towel-set.jpg`) · Black Non-Stick Kadhai with Lid
(`black-nonstick-Kadhai.jpg`) · Rust Woven Cotton Throw Blanket
(`rust-throw-blanket.jpg`) · Beige Cotton Curtain Pair
(`beige-cotton-curtains.jpg`) · Matte Liquid Lipstick Set 4
(`matte-lipstick-set.jpg`) · Vitamin C Face Serum 30 ml
(`vitamin-c-serum.jpg`) · Rose Quartz Roller & Gua Sha Set
(`rose-quartz-roller-set.jpg`) · Black Waterproof Mascara
(`waterproof-mascara.jpg`) · Argan Oil Hair Serum 100 ml
(`argan-hair-serum.jpg`) · Compact Powder & Blush Duo
(`compact-blush-duo.jpg`)

**Batch 5 — Beauty ×2 + Footwear ×6 + Accessories ×2:** Pastel Nail Polish
Set 6 (`pastel-nail-polish-set.jpg`) · Herbal Bath & Body Gift Hamper
(`herbal-gift-hamper.jpg`) · Brown Leather Derby Shoes
(`brown-derby-shoes.jpg`) · Pastel Pink Knit Running Shoes
(`pink-knit-runners.jpg`) · Tan Embroidered Mojari Juttis
(`tan-mojari-juttis.jpg`) · Black Chelsea Ankle Boots (`black-Chelsea Boots.jpg`)
· Beige Strappy Flat Sandals (`beige-strappy-sandals.jpg`) · Grey Slip-On
Walking Shoes (`grey-slipon-shoes.jpg`) · Black Leather Bifold Wallet
(`black-leather-wallet.jpg`) · Gold Temple Jhumka Earrings
(`gold-jhumka-earrings.jpg`)

**Batch 6 — Men ×6 + Accessories ×2:** White & Blue Striped Oxford Shirt
(`striped-oxford-shirt.jpg`) · Beige Knit Half-Zip Sweater
(`beige-halfzip-sweater.jpg`) · Black Abstract Graphic Oversized Tee
(`black-graphic-oversized-tee.jpg`) · Cream Cotton Nehru Jacket
(`cream-nehru-jacket.jpg`) · Rust Orange Checked Casual Shirt
(`rust-checked-shirt.jpg`) · Grey Melange Jogger Track Pants
(`grey-jogger-pants.jpg`) · Round Blue-Light Glasses (`bluelight-glasses.jpg`)
· Floral Silk Hair Scarf (`floral-silk-scarf.jpg`)

## Product-photo prompt template (per product)

> "Professional e-commerce product photograph of a single {pictured colour}
> {product} {on invisible mannequin / flat lay / folded}, {2–3 defining
> details}, full product in frame, soft studio lighting, plain warm beige
> background, no person, no face, no readable text, no logo, no watermark,
> portrait composition" → then mirror-pad/centre-crop to 800×1000 and audit.
