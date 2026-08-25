# Project Report

# Trendora — A Full-Featured Online Shopping Website

**Inspired by Meesho, Myntra and Flipkart**

A major / mini project submission for a college (vlg) computer-science / IT programme.

| Field | Detail |
|---|---|
| Project title | Trendora: Multi-category E-commerce Web Application |
| Domain | Web technologies / E-commerce |
| Front end | React 18, Vite, CSS3 |
| State & storage | Context API, localStorage |
| Type | Single-page application (SPA) |
| Year | 2025–26 |

---

## Certificate

This is to certify that the project titled **“Trendora — A Full-Featured Online Shopping Website”** is a bona fide record of work carried out as part of the academic curriculum. The software demonstrates browsing, search, filtering, cart, wishlist, authentication, coupon engine, checkout and order tracking in the style of contemporary Indian e-commerce platforms.

---

## Acknowledgement

I thank my project guide, the department of Computer Science / Information Technology, and classmates who reviewed the shopping flow. I also acknowledge the public UX patterns of Myntra, Flipkart and Meesho, which were studied only as references; the brand, code and copy of Trendora are original project work.

---

## Abstract

Online retail in India is defined by three consumer habits: browsing fashion the way Myntra presents it, comparing price the way Flipkart does, and discovering affordable catalogue the way Meesho does. This project implements **Trendora**, a single-page shopping website that unifies those habits into one coherent student-built system.

The application exposes a 32-SKU catalogue across eight categories (women, men, kids, electronics, home, beauty, footwear, accessories). Users can search, filter by category/brand/price/rating, sort, save a wishlist, configure colour and size, apply coupons, check out with a validated address, choose a simulated payment method (UPI, card, COD) and inspect an order timeline.

Technically, Trendora is a React SPA. Global commerce state lives in a Context provider and is persisted to `localStorage`, so a demonstration survives page refresh without a paid back-end. The report documents objectives, literature, requirements, architecture, data design, implementation, testing and future scope.

**Keywords:** e-commerce, React, SPA, shopping cart, Context API, college project

---

## 1. Introduction

### 1.1 Motivation
College students already shop on Meesho, Myntra and Flipkart. Building a look-alike is therefore a *relatable* software-engineering problem: information architecture, state, money, identity and trust. A to-do list does not teach those; a store does.

### 1.2 Problem statement
Design and implement a responsive shopping website that lets a guest or registered user browse a multi-category catalogue, manage a bag and wishlist, apply promotional codes, place an order and track it — without requiring a live payment gateway or warehouse.

### 1.3 Objectives
1. Study the information architecture of Indian e-commerce apps.
2. Design a reusable product schema and coupon rules.
3. Implement a complete purchase pipeline in React.
4. Persist session data locally for offline-friendly viva demos.
5. Produce report, build notes and a slide deck for evaluation.

### 1.4 Scope
**In scope:** catalogue, search, filters, PDP, cart, coupons, auth, checkout, orders, profile, static pages, documentation.  
**Out of scope:** real payments, logistics, seller onboarding, recommendation ML, native mobile apps.

---

## 2. Literature / existing system survey

| System | Strength | Gap for a student clone |
|---|---|---|
| Amazon / Flipkart | Scale, search, logistics | Too large to reimplement |
| Myntra | Fashion UX, size/return | Fashion-only |
| Meesho | Social commerce, reselling | Needs a seller graph |
| Shopify themes | Fast storefront | Not a from-scratch academic artefact |

Trendora takes **UX nouns** (bag, wishlist, MRP vs. selling price, COD) from the Indian market and implements them as original code.

---

## 3. System analysis

### 3.1 Users
- **Guest shopper** — browse, bag, checkout as guest.
- **Registered shopper** — profile, faster address fill, order history.
- **Evaluator / admin (you)** — reset by clearing site data.

### 3.2 Functional requirements
FR1 Search products by name, brand, category, tags.  
FR2 Filter and sort the catalogue.  
FR3 View product detail with variants.  
FR4 Add / update / remove bag lines.  
FR5 Toggle wishlist.  
FR6 Apply / remove coupons with min-cart rules.  
FR7 Register, login, demo login, logout, edit profile.  
FR8 Checkout with address validation and payment choice.  
FR9 Persist and display orders with a status timeline.  
FR10 Contact form (local acknowledgement).

### 3.3 Non-functional requirements
NFR1 Works on laptop and phone.  
NFR2 First interactive paint suitable for a lab machine.  
NFR3 No crash on empty cart / unknown SKU.  
NFR4 Currency formatted as INR.  
NFR5 Honest about simulated payments.

### 3.4 Feasibility
Technical (React is standard), economic (zero licence cost), operational (one command to run).

---

## 4. System design

### 4.1 Architecture
```
Browser
  └─ React UI (pages + components)
        └─ StoreContext  (use cases)
              ├─ products.js   (read-only catalogue)
              └─ localStorage  (users, cart, wishlist, orders)
```

This is a **3-layer front-end architecture**: presentation, application state, persistence.

### 4.2 Routing
`/`, `/shop`, `/product/:id`, `/cart`, `/checkout`, `/wishlist`, `/login`, `/register`, `/orders`, `/orders/:id`, `/profile`, `/about`, `/contact`, `/faq`.

### 4.3 Data dictionaries

**Product:** id, name, brand, category, price, mrp, rating, reviews, stock, colors[], sizes[], image, gallery[], tags[], description, highlights[].

**Cart line:** id, color, size, qty.

**Order:** id, placedAt, items[], totals, coupon, address, payment, status, timeline[], userId.

**Coupon:** type ∈ {percent, flat, shipping}, value, min, label.

### 4.4 Price algorithm
`grand = max(0, subtotal − couponDiscount + shipping)`  
Shipping is ₹79 unless subtotal ≥ ₹999 or coupon is FREESHIP.

### 4.5 Use-case (place order)
Actor selects variants → Add to bag → optional coupon → Checkout → fill address → choose UPI/Card/COD → Place order → order id generated → cart cleared → confirmation + timeline.

### 4.6 ER-style relationships (logical)
User 1—N Order; Order 1—N OrderItem; Product 1—N OrderItem; User N—N Product (wishlist); Coupon 0—1 Order.

---

## 5. Implementation

### 5.1 Environment
Node.js 18+, npm, modern Chromium / Firefox / Safari.

### 5.2 Key modules
- `StoreContext.jsx` — all mutations.
- `products.js` — domain data.
- `ProductCard.jsx` — reusable tile.
- `Shop.jsx` — derived list via `useMemo`.
- `Checkout.jsx` — form + `placeOrder`.

### 5.3 UI implementation
A design token file (`index.css`) defines rose, navy, cream, radii and type. Components stay free of inline chaos except for tiny layout tweaks.

### 5.4 Security note
Demo passwords sit in localStorage. Production would use HTTPS, hashed passwords, CSRF tokens and a payment SDK. This is stated in the FAQ and slides so the evaluator knows the student understands the gap.

---

## 6. Testing

| ID | Case | Expected | Result |
|---|---|---|---|
| T1 | Open home | Hero + categories render | Pass |
| T2 | Search “earbuds” | PulseBuds appears | Pass |
| T3 | Filter Women + sort price | Ordered women’s SKUs | Pass |
| T4 | Add two sizes of same SKU | Two bag lines | Pass |
| T5 | Coupon FESTIVE20 on ₹500 cart | Rejected (min ₹1999) | Pass |
| T6 | Coupon FESTIVE20 on ₹2500 | 20% off | Pass |
| T7 | PIN 560001 | Accepted | Pass |
| T8 | PIN 56A | Error | Pass |
| T9 | Place order | Cart empty, order listed | Pass |
| T10 | Refresh browser | Session kept | Pass |
| T11 | Unknown `/product/xx` | Not-found state | Pass |
| T12 | Mobile drawer | Categories reachable | Pass |

---

## 7. Results and discussion

The finished site presents a credible Indian storefront. Completing a purchase takes under a minute in a demo. Using Context instead of Redux kept the learning curve honest for a semester project while still showing unidirectional data flow. localStorage is a pedagogical stand-in for REST; swapping it for `fetch('/api/orders')` is a weekend of work, not a rewrite.

---

## 8. Conclusion

Trendora proves that a student team can reconstruct the *shape* of Meesho / Myntra / Flipkart: catalogue, merchandising, bag, offers, identity and post-purchase. The project meets its objectives and is ready for laboratory evaluation.

---

## 9. Future scope
1. Express + MongoDB API.  
2. Razorpay / Stripe test mode.  
3. Seller dashboard.  
4. Image search and size recommender.  
5. PWA install + offline catalogue.  
6. Jest + React Testing Library automation.

---

## 10. References
1. React documentation, https://react.dev  
2. Vite guide, https://vitejs.dev  
3. React Router, https://reactrouter.com  
4. Nielsen Norman Group, e-commerce UX heuristics.  
5. Public storefronts of Myntra, Flipkart and Meesho (UX reference only).  
6. MDN Web Docs — HTML, CSS, Web Storage API.

---

## Appendix A — How to run
See `docs/HOW_IT_WAS_BUILT.md` or open `/docs/how-it-was-built.html`.

## Appendix B — Coupon sheet
TREND10 · FESTIVE20 · WELCOME100 · FREESHIP

## Appendix C — Demo account
Button **Use demo account** on `/login` creates `demo@trendora.in`.
