# Trendora

India-style shopping website for a college / vlg project — **Myntra + Flipkart + Meesho** features, with **four separate login authorities**.

## Four logins (click the cards on `/login`)

| Role | Email | Password | Lands on |
|---|---|---|---|
| Customer | demo@trendora.in | demo123 | Store |
| Seller | seller@trendora.in | seller123 | `/seller` studio |
| Admin | admin@trendora.in | admin123 | `/admin` desk |
| Owner | owner@trendora.in | owner123 | `/owner` console |

Customer and seller can also self-register. Only the **owner** can create extra admin/seller accounts.

## Run

```bash
npm install
npm run dev
```

## College documents (PDF / Word / PPT)

Open **Documents** in the footer, or download directly:

- [`public/docs/Trendora_Project_Report.pdf`](public/docs/Trendora_Project_Report.pdf)
- [`public/docs/Trendora_Project_Report.docx`](public/docs/Trendora_Project_Report.docx)
- [`public/docs/Trendora_Presentation.pptx`](public/docs/Trendora_Presentation.pptx)
- [`public/docs/Trendora_How_It_Was_Built.pdf`](public/docs/Trendora_How_It_Was_Built.pdf)

Regenerate after edits:

```bash
python3 -m venv .venv-docs
.venv-docs/bin/pip install python-docx python-pptx fpdf2
.venv-docs/bin/python scripts/generate_docs.py
```

## Coupons

`TREND10` · `FESTIVE20` · `WELCOME100` · `FREESHIP` · `INSIDER15` (Elite / Icon)

## Stack

React 18, Vite 5, React Router 6, Context API, localStorage (`trendora-store-v2`).
