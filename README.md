# Trendora — college shopping website

Public site is a **customer shop** (Myntra-style). Catalogue add / delete is **only on a private admin desk**. Checkout is simulated — no real payments.

## Customer (everyone else)

- `/login` — shopper sign in + 2-step OTP  
- `/register` — customer account only (OTP)  
- Demo: `demo@trendora.in` / `demo123` then OTP on screen (or `123456`)

Shop, bag, wishlist, coupons, checkout, orders. No add-item buttons.

## Admin (only you)

Hidden door: **`/staff`** (tiny “Staff” link in the footer).

| Role | Email | Password |
|---|---|---|
| Admin | admin@trendora.in | admin123 |
| Owner | owner@trendora.in | owner123 |

Then: **Add a new item** → 3 steps → Publish. Edit / Hide on Catalogue.

Customers who open `/admin` without this login are sent home.

## Coupons

`TREND10` · `FESTIVE20` · `WELCOME100` · `FREESHIP` · `INSIDER15`

## Run

```bash
npm install
npm run dev
```

## Documents

`/documents` · `/download.html` · `DOWNLOAD_THESE/`
