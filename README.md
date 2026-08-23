# Trendora

India-style shopping website for a college / vlg project — the habits of **Myntra**, **Flipkart** and **Meesho** in one React store.

Browse eight categories, filter and search, heart a wishlist, fill a bag, apply coupons, check out (UPI / card / COD are simulated) and track the order. Nothing is billed; everything lives in the browser so a viva demo survives a refresh.

## Run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## Demo

- Coupons: `TREND10` · `FESTIVE20` · `WELCOME100` · `FREESHIP`
- Login page → **Use demo account**
- Documents (also linked in the footer):
  - [How it was built](public/docs/how-it-was-built.html)
  - [Project report](/docs/project-report.html) (open from the running site)
  - [Step-by-step presentation](public/docs/presentation.html) — arrow keys

Markdown copies sit in [`docs/`](docs/).

## Stack

React 18, Vite 5, React Router 6, Context API, localStorage, hand-written CSS.

## Project layout

```
src/data/products.js          catalogue + coupons
src/context/StoreContext.jsx  cart, auth, orders
src/pages/                    one screen per file
src/components/               navbar, cards, toasts
public/docs/                  report, slides, build log
```
