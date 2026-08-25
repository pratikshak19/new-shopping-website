# Trendora — college shopping website

Myntra + Meesho + Flipkart storefront with **five login authorities**. Checkout is simulated — no real payments.

## Logins (`/login`)

Type the password, or tap a role card (demo shortcut). Stored passwords are SHA-256 hashes in `localStorage` (`trendora-store-v2`).

| Role | Email | Password |
|---|---|---|
| Customer | demo@trendora.in | demo123 |
| Reseller (Meesho share) | reseller@trendora.in | reseller123 |
| Seller / supplier | seller@trendora.in | seller123 |
| Admin | admin@trendora.in | admin123 |
| Owner | owner@trendora.in | owner123 |

Login locks for 30 seconds after 6 failed attempts (session storage).

## What maps to the real apps

**Myntra:** mega menu, wishlist + move to bag, size chart, Insider, Studio, reviews/Q&A, try & buy, exchange/return, bank offers, discount filter, hover add-to-bag.

**Meesho:** supplier catalogue + earnings, **reseller share-and-earn (8%)**, no-inventory reselling, COD, category tiles.

**Flipkart:** deal timer, coupons, MRP break-up, COD, EMI, order pipeline.

Coupons: `TREND10`, `FESTIVE20`, `WELCOME100`, `FREESHIP`, `INSIDER15`.

Reseller share: `/product/{id}?ref={user.id}` → 8% of grand total in `shares`.

## Production notes

- Error boundary around the app; skip-to-content + focus styles
- Route titles via `Seo`; PWA stub `public/manifest.json`, `robots.txt`, `sitemap.xml`
- Lazy product images; stock check + address sanitise on `placeOrder`
- Owner can mint staff logins (hashed)

## Run

```bash
npm install
npm run dev
```

Production preview:

```bash
npm run build
npm run preview
```

## Documents

- In-app: `/documents` and `/download.html`
- Binaries: `public/docs/` and `DOWNLOAD_THESE/`
- **Beginner book (50+ pages, screenshots + free hosting):** `Trendora_Beginner_Complete_Guide.pdf`
- Markdown sources: `docs/`
- Regenerate reports: `.venv-docs/bin/python scripts/generate_docs.py`
- Regenerate beginner PDF: `.venv-docs/bin/python scripts/generate_beginner_guide.py`
