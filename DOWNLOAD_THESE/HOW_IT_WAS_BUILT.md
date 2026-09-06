# How Trendora was built

## How Trendora was built — overview

This note is the viva construction log. It is not a second website. Every step happened on the same Trendora React app (Vite + React 18).

Stack: HTML/CSS/JS via React components, React Router, Context API, localStorage, a pure-JS style engine, and Python only to print these college files.

## Step 1 — Scaffold

Vite React project in the repository root. npm install. npm run dev --host 0.0.0.0 --port 5173. Single page shell: Navbar, Footer, Routes, ErrorBoundary, Toasts, Seo.

## Step 2 — Brand and UI

Name Trendora (trend + kart energy). Rose #ff3f6c on navy #1a1a2e. Playfair + Outfit fonts. Logo in public/images. Design tokens in src/index.css. Home hero, category tiles, deal timer.

## Step 3 — Catalogue

src/data/products.js holds SKUs, brands, coupons, size charts, PIN helper, INR format. Campus SKUs (crop, jeans, tote, kurti, polo, stationery) were added so a Rs 1000 college look is possible.

## Step 4 — Commerce state

src/context/StoreContext.jsx is the application layer: cart, wishlist, orders, coupons, reviews, tickets, persist to trendora-store-v2. placeOrder sanitises address, checks stock and PIN.

## Step 5 — Shopper journey

Shop filters, PDP (gallery, size chart, PIN), bag, checkout (UPI/card/COD simulated), orders timeline, cancel, return after Delivered, Insider points, Studio lookbook.

## Step 6 — Customer-only auth

Public /login and /register are shoppers only. Passwords SHA-256. Customer path issues OTP (5 minutes, 5 tries). UI shows the demo code; 123456 always works in the lab. Staff emails are rejected on the public form.

## Step 7 — Private admin desk

Hidden /staff (tiny footer link). admin@ / admin123. Guided Add new item: name & price, photo picker, stock & publish. upsertProduct / removeProduct refuse anyone who is not admin or owner. /admin without that session redirects home.

## Step 8 — Personalized Smart Shopping

src/lib/styleEngine.js + src/pages/Style.jsx. Prompt parser, mood tiles, budget lock, complete-the-look on PDP, canvas photo match, why-recommend, ecoScore, smart cart, Student Mode and CAMPUS10. Preferences persist with the rest of the store.

## Step 9 — Documents and honesty

This generator writes PDF, Word and PPT. FAQ states: no real money, nothing ships, photo search is colour-only, OTP is simulated. That honesty is part of the marks.

## 7. Testing

T1 Home hero + categories render — Pass
T2 Search earbuds finds PulseBuds — Pass
T3 Filter Women + sort price — Pass
T4 Style prompt college under 1000 returns a look whose total <= 1000 — Pass
T5 Mood Party changes look composition — Pass
T6 Budget lock 1500 hides over-budget look total — Pass
T7 PDP Complete this look shows other slots — Pass
T8 Photo upload lists similar products — Pass
T9 Eco filter 8+ reduces catalogue — Pass
T10 Smart cart suggests missing accessory — Pass
T11 Student Mode + CAMPUS10 applies only when mode is on — Pass
T12 Public /login rejects admin@trendora.in — Pass
T13 /staff admin can publish a new SKU; it appears on Shop — Pass
T14 Customer OTP accepts on-screen code or 123456 — Pass
T15 FESTIVE20 rejected below Rs 1999 — Pass
T16 Place order empties bag and drops stock — Pass
T17 Admin pipeline Packed -> Delivered; customer can request return — Pass
T18 /admin as customer redirects home — Pass
T19 Refresh keeps session (trendora-store-v2) — Pass

## Appendix A — How to run

cd new-shopping-website
npm install
npm run dev
Open the printed URL (default http://localhost:5173).
Production: npm run build && npm run preview.
Regenerate these documents: .venv-docs/bin/python scripts/generate_docs.py

## Appendix B — User manuals

Customer: /login demo@trendora.in / demo123 -> OTP -> shop or /style -> bag -> CAMPUS10 (if Student Mode) or FESTIVE20 -> checkout. Payments are fake.

Admin (site owner only): footer Staff or type /staff -> admin@trendora.in / admin123 -> Add a new item (3 steps) -> Publish -> open Shop. Catalogue Edit / Hide. Orders pipeline.

Style Assistant: Nav Style -> type a Hindi/English wish -> Suggest complete outfit -> Add full look to bag.

Photo search: Style -> Photo search tab -> choose image -> similar products.
