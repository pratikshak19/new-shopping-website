# How Trendora Was Built

**Project:** Trendora — shopping website (Meesho / Myntra / Flipkart style)  
**Stack:** React 18, Vite 5, React Router 6, Context API, localStorage  
**Audience:** College / vlg project viva

---

## 1. What we set out to copy (and what we did not)

| Platform | Habit we borrowed | What we skipped |
|---|---|---|
| **Myntra** | Fashion-first home, wishlist hearts, size/colour PDP, rose accent | Live inventory, influencer studio |
| **Flipkart** | Mega-catalogue, deal timer, price breakdown, coupons, COD | Warehouse, real UPI |
| **Meesho** | Approachable prices, category tiles, mobile-friendly bag | Reseller panel |

Trendora is a **front-end system with a simulated back end**. That is enough to demonstrate software engineering: routing, state, validation, persistence, and UX — without needing cloud accounts.

---

## 2. Tools and why each one is there

1. **Vite** — starts in a second, easy `npm run dev` for the lab.
2. **React** — component tree matches the pages of a real store.
3. **React Router** — URL for every screen (`/shop?cat=women`, `/product/td-1001`).
4. **Context API** — one `StoreProvider` is the “database + session”.
5. **localStorage** — cart, user, orders survive a refresh (good for viva).
6. **Plain CSS** — no Tailwind/MUI so every style can be explained.

---

## 3. Folder map

```
new-shopping-website/
  index.html                 entry HTML + fonts
  package.json               scripts and dependencies
  vite.config.js             host 0.0.0.0 so the preview works
  public/images/             logo, heroes, categories, products
  public/docs/               report, slides, this guide (open in browser)
  src/main.jsx               React root + router + store
  src/App.jsx                all routes
  src/index.css              design system
  src/data/products.js       catalogue, coupons, helpers
  src/context/StoreContext.jsx  cart, auth, orders
  src/components/            Navbar, Footer, ProductCard, icons
  src/pages/                 one file per screen
```

---

## 4. Build sequence (what to say in the viva)

### Step 1 — Product thinking
Listed the shopping journey: land → browse → filter → PDP → bag → coupon → address → pay → track. Anything that did not serve that path was cut.

### Step 2 — Catalogue design
`PRODUCTS` is an array of objects (`id`, `name`, `brand`, `category`, `price`, `mrp`, `rating`, `stock`, `colors`, `sizes`, `tags`). Helpers `formatINR`, `discountOf`, `searchProducts` keep UI code thin.

### Step 3 — Global state
`StoreProvider` holds:

- `user` / `users` — register, login, demo account
- `cart` — lines with colour, size, qty
- `wishlist` — product ids
- `coupon` — TREND10, FESTIVE20, WELCOME100, FREESHIP
- `orders` — immutable snapshots after checkout
- `toasts` — short feedback

Every change is written to `localStorage` key `trendora-store-v1`.

### Step 4 — Pages
Home (hero carousel + countdown + categories), Shop (filters + sort), Product detail (gallery, variants, buy now), Cart, Checkout (address + payment method), Orders, Wishlist, Auth, Profile, About, Contact, FAQ.

### Step 5 — Visual system
Navy `#1A1A2E`, rose `#FF3F6C`, cream paper, Playfair Display headings, Outfit UI type. Cards, pills, sticky summary — the grammar of Indian e-commerce.

### Step 6 — Polish
Announcement bar, badges, empty states, 404, sticky nav, mobile drawer, image fallbacks, coupon errors, PIN validation.

### Step 7 — Documents
This guide, the project report, and a keyboard-driven slide deck — required for submission, not an afterthought.

---

## 5. How to run it

```bash
cd new-shopping-website
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

---

## 6. How money is calculated

```
subtotal     = sum(price × qty)
productSave  = sum(mrp × qty) − subtotal
coupon       = 10%/20% if min cart met, or ₹100 flat, or free ship
shipping     = ₹0 if subtotal ≥ 999 else ₹79
grand        = subtotal − coupon + shipping
```

Explain this on the whiteboard. Examiners love a clear formula.

---

## 7. Auth (honest version)

Passwords are stored in localStorage **only for the demo**. Say this out loud: a real site would hash passwords on a server (bcrypt) and issue JWT/session cookies. Never claim this is production-secure.

---

## 8. What you can extend next

- Node/Express + MongoDB instead of localStorage
- Razorpay test keys
- Admin dashboard to add products
- Image upload
- Recommendation by collaborative filtering

---

## 9. Viva one-liners

- “SPA with client-side routing.”
- “Single source of truth via Context.”
- “Optimistic UI + persistence.”
- “Catalogue is data, not hard-coded pages.”
- “Checkout is a state machine: bag → address → pay → confirmation.”
