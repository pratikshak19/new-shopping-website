# Trendora — Step-by-step presentation

Use **arrow keys** in `public/docs/presentation.html` during the viva. This markdown is the speaker script.

---

## Slide 1 — Title
**Trendora**  
A shopping website in the spirit of Meesho, Myntra & Flipkart  
College / vlg project · 2025–26

*Say:* “I built a complete store, not a single HTML page.”

---

## Slide 2 — Why this project
- Everyone in the class already shops online.
- E-commerce teaches **data + money + identity + UX** together.
- Easy to demo in 5 minutes.

---

## Slide 3 — Problem
Build a site where a user can **discover → decide → pay → track** without a real warehouse or payment gateway.

---

## Slide 4 — Inspiration map
- **Myntra** → fashion PDP, wishlist, rose UI
- **Flipkart** → deals, coupons, price break-up, COD
- **Meesho** → approachable prices, category-first mobile feel

---

## Slide 5 — Objectives
1. Multi-category catalogue  
2. Search, filter, sort  
3. Bag + wishlist  
4. Coupons  
5. Auth  
6. Checkout + orders  
7. Documents for submission

---

## Slide 6 — Tech stack
React 18 · Vite · React Router · Context API · localStorage · CSS design tokens

*Why not PHP?* Faster iteration, component reuse, same architecture used in industry SPAs.

---

## Slide 7 — Architecture
UI pages → StoreContext (use cases) → products.js + localStorage

Three layers. Draw this on the board if asked.

---

## Slide 8 — Modules
Navbar, Home, Shop, Product, Cart, Checkout, Orders, Auth, Profile, Footer, Toasts

---

## Slide 9 — Product schema
id, brand, category, price, mrp, rating, stock, colors, sizes, tags

Catalogue is **data**. Adding a SKU is one object, not a new page.

---

## Slide 10 — Shopping journey (live demo)
1. Land on hero  
2. Open Women  
3. Open a dress, pick size  
4. Add to bag + wishlist  
5. Apply FESTIVE20  
6. Checkout address  
7. UPI (simulated)  
8. Show order id

---

## Slide 11 — Money formula
grand = subtotal − coupon + shipping  
Free ship ≥ ₹999

---

## Slide 12 — Coupons
TREND10 · FESTIVE20 · WELCOME100 · FREESHIP  
Each has a **minimum cart** rule.

---

## Slide 13 — Persistence
Key `trendora-store-v1`. Refresh does not empty the bag. Clearing site data resets the world.

---

## Slide 14 — Testing
12 cases: search, filters, coupons, PIN, refresh, 404, mobile.

---

## Slide 15 — Limitations (say this first)
No real payment, no server hash, no logistics. This is a **simulation with production UX**.

---

## Slide 16 — Future
API + MongoDB, Razorpay test, admin panel, PWA, automated tests.

---

## Slide 17 — Conclusion
Trendora is a defendable, demoable, documented shopping system.

---

## Slide 18 — Thank you
Questions?  
Repo + running site + `/docs/project-report.html`
