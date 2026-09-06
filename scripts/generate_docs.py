#!/usr/bin/env python3
"""Generate college-ready PDF, Word and PowerPoint files for Trendora."""
import shutil
import zipfile
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, RGBColor
from fpdf import FPDF
from pptx import Presentation
from pptx.dml.color import RGBColor as PRGB
from pptx.util import Inches as PInches
from pptx.util import Pt as PPt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "docs"
DL = ROOT / "DOWNLOAD_THESE"
COLLEGE = ROOT / "COLLEGE_DOCUMENTS"
for folder in (OUT, DL, COLLEGE):
    folder.mkdir(parents=True, exist_ok=True)

NAVY = (26, 26, 46)
ROSE = (255, 63, 108)

CHAPTERS = [
    (
        "Certificate",
        "This is to certify that the project titled “Trendora — Personalized Smart Shopping Website” "
        "is a bona fide record of work carried out as part of the academic curriculum. The software "
        "implements a Myntra-style customer storefront, a private admin desk, two-step OTP for shoppers, "
        "and a Personalized Smart Shopping layer (AI style assistant, mood, budget lock, complete-the-look, "
        "photo similar search, eco score, smart cart and Student Mode). The candidate has presented the "
        "working system, test cases and this report for evaluation.",
    ),
    (
        "Declaration",
        "I declare that this project is my original work. Public storefronts of Myntra, Flipkart and Meesho "
        "were studied only as user-experience references. Brand name Trendora, source code, catalogue copy "
        "and documents are original. No live payment gateway is connected. Simulated credentials are published "
        "for laboratory demonstration only. Public users are customers only; catalogue add/delete is reserved "
        "for the store admin.",
    ),
    (
        "Acknowledgement",
        "I thank my project guide, the Department of Computer Science / Information Technology, laboratory "
        "staff and classmates who reviewed the shopping flow and the Style Assistant. I also thank open "
        "documentation of React, Vite and React Router.",
    ),
    (
        "Abstract",
        "Indian e-commerce is defined by fashion discovery (Myntra), deals (Flipkart) and affordable catalogue "
        "(Meesho). Trendora unifies those habits in one React single-page application and then goes further: "
        "the focus is Personalized Smart Shopping, not only a bag.\n\n"
        "Shoppers browse eight categories, search and filter, read size charts, check PIN codes, compare SKUs, "
        "use wishlist, coupons, gift-wrap, simulated UPI/card/COD checkout, order tracking, returns, Insider "
        "points and help tickets. New accounts use a two-step OTP (demo code on screen or 123456). The public "
        "site cannot add or delete products. The owner/admin enters a hidden /staff door to add items, hide "
        "SKUs, move orders and process returns.\n\n"
        "The Smart layer (route /style) builds a complete outfit from a natural-language prompt, mood tiles, "
        "or a budget lock; product pages complete the look; the bag suggests missing pieces; photo upload "
        "finds similar colour tones on-device; every card can show Why we recommend this and an Eco Score; "
        "Student Mode surfaces campus prices and coupon CAMPUS10.\n\n"
        "State lives in StoreContext and localStorage (key trendora-store-v2) so a viva survives refresh "
        "without a paid back-end.",
    ),
    (
        "1. Introduction",
        "1.1 Motivation\n"
        "College students already shop on Meesho, Myntra and Flipkart. A clone that only lists products is "
        "easy to dismiss. A system that styles the shopper — complete looks under a budget, mood, student "
        "mode — is easier to defend in a viva and closer to how people actually decide.\n\n"
        "1.2 Problem statement\n"
        "Design a responsive shopping website that covers the Indian shopping journey and a private admin "
        "desk, plus Personalized Smart Shopping, without a live warehouse or payment gateway. Public users "
        "must remain customers; only the site owner may change the catalogue.\n\n"
        "1.3 Objectives\n"
        "1. Study IA of Myntra, Meesho and Flipkart.\n"
        "2. Implement customer shop: catalogue, search, filter, PDP, size chart, PIN, reviews, Q&A, "
        "wishlist, compare, bag, coupons, checkout, orders, cancel, return, Insider, studio, help.\n"
        "3. Keep public login customer-only with 2-step OTP.\n"
        "4. Provide a private admin desk at /staff for add / edit / hide products and order pipeline.\n"
        "5. Implement Personalized Smart Shopping (nine modules listed in Chapter 6).\n"
        "6. Persist data locally and ship PDF / Word / PPT documents.\n\n"
        "1.4 Scope\n"
        "In scope: modules above, INR pricing, simulated payments, college documents.\n"
        "Out of scope: real Razorpay capture, courier AWB, native apps, cloud vision APIs.",
    ),
    (
        "2. Literature survey",
        "Myntra — fashion PDP, size chart, Insider loyalty, Studio lookbooks, easy returns.\n"
        "Flipkart — deal timer, coupon engine, MRP break-up, COD, order timeline.\n"
        "Meesho — supplier listing, commission, category-first mobile bag.\n"
        "Stitch Fix / Amazon Outfit — complete-the-look and budget outfits as personalization references.\n\n"
        "Gap: a student cannot reimplement logistics or a large ML cluster. Trendora copies the nouns "
        "(bag, wishlist, COD, look) and implements them as original React code with an honest simulation note.",
    ),
    (
        "3. System analysis and SRS",
        "3.1 Actors\n"
        "Customer (public) — shop, OTP login/register, bag, pay, track, return, review, ticket. Cannot mutate catalogue.\n"
        "Admin — private /staff login. Catalogue add/edit/hide, order pipeline, returns, coupons, tickets.\n"
        "Owner — superset of admin plus people, roles, store policy, GMV reports.\n\n"
        "3.2 Functional requirements\n"
        "FR1 Multi-category catalogue with stock and variants.\n"
        "FR2 Search / filter / sort (price, rating, discount, eco, mood, student).\n"
        "FR3 PDP variants, size chart, PIN check, reviews, Q&A.\n"
        "FR4 Bag, wishlist, compare (max 3).\n"
        "FR5 Coupon engine (TREND10, FESTIVE20, WELCOME100, FREESHIP, INSIDER15, CAMPUS10).\n"
        "FR6 Checkout with address sanitise, gift wrap, UPI/card/COD simulated.\n"
        "FR7 Order timeline, cancel before ship, return after deliver.\n"
        "FR8 Customer-only public auth + OTP (5 min, 5 tries, backup 123456).\n"
        "FR9 Private staff door /staff; public /login rejects staff accounts.\n"
        "FR10 Admin guided add-item (3 steps) and hide SKU.\n"
        "FR11 Style prompt -> complete look under budget.\n"
        "FR12 Mood shopping (7 moods).\n"
        "FR13 Budget lock persisted.\n"
        "FR14 Complete this look on PDP.\n"
        "FR15 Photo similar search (dominant colour, on-device).\n"
        "FR16 Why we recommend this + Eco Score + eco filter.\n"
        "FR17 Smart cart missing-slot suggestion.\n"
        "FR18 Student Mode + CAMPUS10.\n"
        "FR19 Help tickets and notifications.\n\n"
        "3.3 Non-functional\n"
        "Responsive, INR format, no crash on empty bag, honest security disclaimer, lab-machine friendly.",
    ),
    (
        "4. System design",
        "4.1 Architecture\n"
        "Browser -> React pages -> StoreContext (use cases) -> products.js + styleEngine.js + localStorage.\n"
        "Three layers: presentation, application state, persistence.\n\n"
        "4.2 Routing\n"
        "Public: /, /shop, /style, /product/:id, /offers, /brands, /studio, /insider, /compare, /help, "
        "/login, /register, /documents.\n"
        "Customer: /cart, /checkout, /orders, /returns, /addresses, /wishlist, /profile, /notifications.\n"
        "Hidden staff: /staff.\n"
        "Guarded: /admin/*, /owner/* via RequireRole. Customers hitting /admin are sent home.\n\n"
        "4.3 Price algorithm\n"
        "grand = max(0, subtotal - coupon + shipping + giftWrap)\n"
        "shipping = 0 if subtotal >= freeShipMin else shipFee (default 999 / 79).\n"
        "giftWrap = 49 if selected.\n"
        "Insider points += floor(grand / 10).\n\n"
        "4.4 Order state machine\n"
        "Confirmed -> Packed -> Shipped -> Out for delivery -> Delivered -> (optional) Returned.\n"
        "Cancel allowed before Shipped. Return allowed only after Delivered.\n\n"
        "4.5 Style engine\n"
        "src/lib/styleEngine.js parses a Hindi/English prompt for budget, mood, college, gender. "
        "It greedy-fills slots top, bottom, shoes, bag, accessory under the remaining rupees. "
        "Photo search averages RGB on a canvas and nearest-neighbour matches catalogue colours.\n\n"
        "4.6 Demo accounts\n"
        "Customer: demo@trendora.in / demo123 then OTP on screen or 123456.\n"
        "Admin: /staff then admin@trendora.in / admin123.\n"
        "Owner: /staff then owner@trendora.in / owner123.",
    ),
    (
        "5. Implementation",
        "Environment: Node.js 18+, npm, Vite 5, React 18, React Router 6, Context API, CSS design tokens.\n\n"
        "Key modules:\n"
        "src/context/StoreContext.jsx — auth, bag, orders, catalogue gates, studentMode, budgetLock, mood.\n"
        "src/data/products.js — seed catalogue including campus SKUs, coupons, size charts, PIN helper.\n"
        "src/lib/styleEngine.js — looks, mood, eco, why, photo colour, smart cart.\n"
        "src/lib/security.js — SHA-256 passwords, OTP issue/check, login lockout.\n"
        "src/pages/Style.jsx — Smart Shopping hub.\n"
        "src/pages/dash/AddItem.jsx — guided 3-step add (admin/owner only).\n"
        "src/pages/StaffLogin.jsx — private door.\n"
        "src/components/RequireRole.jsx — route guard.\n\n"
        "Security honesty: demo hashes live in localStorage. Production would hash on a server (bcrypt) "
        "and issue HTTP-only cookies. Stated in FAQ and viva notes.",
    ),
    (
        "6. Personalized Smart Shopping",
        "This chapter is the project differentiator.\n\n"
        "6.1 AI Style Assistant\n"
        "User types: “मुझे college के लिए Rs 1000 के अंदर outfit चाहिए।” "
        "Engine extracts budget 1000, college=true, mood=casual and returns a complete look "
        "(top, bottom if needed, shoes, bag, accessory) with running total and leftover.\n\n"
        "6.2 Mood shopping\n"
        "Seven moods: Cute, Aesthetic, Minimal, Party, Casual, Formal, Traditional. "
        "Each product has inferred moods from name, tags and description.\n\n"
        "6.3 Budget lock\n"
        "Persisted integer. Looks and shop max-price respect it. Example: Complete look Rs 1299 "
        "inside a Rs 1500 lock.\n\n"
        "6.4 Complete this look\n"
        "On PDP, complementary slots are suggested (earrings, footwear, bag, watch). "
        "One-piece dresses skip a bottom.\n\n"
        "6.5 Photo similar search\n"
        "File stays in the browser. Canvas 40x40 average colour -> nearest named tone -> ranked SKUs. "
        "No cloud API, suitable for a college lab.\n\n"
        "6.6 Why we recommend this\n"
        "Bullets: college friendly, in budget, mood match, good ratings, eco pick, bestseller.\n\n"
        "6.7 Eco Score\n"
        "0–10 from materials (organic, linen, handcrafted raise; electronics lower). Shop filter Eco 8+.\n\n"
        "6.8 Smart cart\n"
        "After add-to-bag, missing outfit slots trigger an optional suggestion "
        "(“Matching earrings sirf Rs 199 mein add karein?”).\n\n"
        "6.9 Student Mode\n"
        "Toggle on /style or shop filters. Surfaces campus SKUs (crop, jeans, tote, kurti, polo, "
        "notebook, pens, sleeve, flips) and unlocks CAMPUS10 (10% above Rs 499).",
    ),
    (
        "7. Testing",
        "T1 Home hero + categories render — Pass\n"
        "T2 Search earbuds finds PulseBuds — Pass\n"
        "T3 Filter Women + sort price — Pass\n"
        "T4 Style prompt college under 1000 returns a look whose total <= 1000 — Pass\n"
        "T5 Mood Party changes look composition — Pass\n"
        "T6 Budget lock 1500 hides over-budget look total — Pass\n"
        "T7 PDP Complete this look shows other slots — Pass\n"
        "T8 Photo upload lists similar products — Pass\n"
        "T9 Eco filter 8+ reduces catalogue — Pass\n"
        "T10 Smart cart suggests missing accessory — Pass\n"
        "T11 Student Mode + CAMPUS10 applies only when mode is on — Pass\n"
        "T12 Public /login rejects admin@trendora.in — Pass\n"
        "T13 /staff admin can publish a new SKU; it appears on Shop — Pass\n"
        "T14 Customer OTP accepts on-screen code or 123456 — Pass\n"
        "T15 FESTIVE20 rejected below Rs 1999 — Pass\n"
        "T16 Place order empties bag and drops stock — Pass\n"
        "T17 Admin pipeline Packed -> Delivered; customer can request return — Pass\n"
        "T18 /admin as customer redirects home — Pass\n"
        "T19 Refresh keeps session (trendora-store-v2) — Pass",
    ),
    (
        "8. Results and conclusion",
        "Trendora presents a credible Indian storefront plus a Smart Shopping layer that a viva panel "
        "can click through in under five minutes: type a college prompt, lock a budget, open a dress, "
        "see complete-the-look, add to bag, accept a smart suggestion, checkout (simulated).\n\n"
        "Public users never see add/delete. Admin work stays on /staff. Context + localStorage is a "
        "pedagogical stand-in for REST; swapping placeOrder for fetch('/api/orders') is a weekend of work, "
        "not a rewrite.\n\n"
        "Conclusion: the project meets its objectives. It is demoable, documented (PDF, Word, PPT) and "
        "honest about simulation.",
    ),
    (
        "9. Future scope",
        "1. Express + MongoDB API.\n"
        "2. Razorpay / Stripe test mode.\n"
        "3. Real SMS/email OTP.\n"
        "4. Cloud vision for photo search.\n"
        "5. Learned size recommender.\n"
        "6. PWA offline catalogue.\n"
        "7. Jest + React Testing Library.",
    ),
    (
        "10. References",
        "1. React documentation — https://react.dev\n"
        "2. Vite guide — https://vitejs.dev\n"
        "3. React Router — https://reactrouter.com\n"
        "4. Nielsen Norman Group, e-commerce UX heuristics\n"
        "5. Public storefronts of Myntra, Flipkart and Meesho (UX reference only)\n"
        "6. MDN Web Docs — Web Storage API, Canvas API\n"
        "7. Stitch Fix / Amazon Outfit pages (personalization reference only)",
    ),
    (
        "Appendix A — How to run",
        "cd new-shopping-website\nnpm install\nnpm run dev\n"
        "Open the printed URL (default http://localhost:5173).\n"
        "Production: npm run build && npm run preview.\n"
        "Regenerate these documents: .venv-docs/bin/python scripts/generate_docs.py",
    ),
    (
        "Appendix B — User manuals",
        "Customer: /login demo@trendora.in / demo123 -> OTP -> shop or /style -> bag -> CAMPUS10 "
        "(if Student Mode) or FESTIVE20 -> checkout. Payments are fake.\n\n"
        "Admin (site owner only): footer Staff or type /staff -> admin@trendora.in / admin123 -> "
        "Add a new item (3 steps) -> Publish -> open Shop. Catalogue Edit / Hide. Orders pipeline.\n\n"
        "Style Assistant: Nav Style -> type a Hindi/English wish -> Suggest complete outfit -> "
        "Add full look to bag.\n\n"
        "Photo search: Style -> Photo search tab -> choose image -> similar products.",
    ),
    (
        "Appendix C — Module list",
        "Home, Shop, Style Assistant, Product detail, Offers, Brands, Studio, Insider, Compare\n"
        "Bag, Checkout, Orders, Returns, Addresses, Wishlist, Profile, Notifications, Help, FAQ, Documents\n"
        "Login (customer OTP), Register (customer OTP), Staff login (hidden)\n"
        "Admin: home, guided add, catalogue, orders, returns, coupons, tickets, users\n"
        "Owner: all admin + reports + settings + create staff",
    ),
]

HOW_BUILT = [
    (
        "How Trendora was built — overview",
        "This note is the viva construction log. It is not a second website. Every step happened on "
        "the same Trendora React app (Vite + React 18).\n\n"
        "Stack: HTML/CSS/JS via React components, React Router, Context API, localStorage, "
        "a pure-JS style engine, and Python only to print these college files.",
    ),
    (
        "Step 1 — Scaffold",
        "Vite React project in the repository root. npm install. npm run dev --host 0.0.0.0 --port 5173. "
        "Single page shell: Navbar, Footer, Routes, ErrorBoundary, Toasts, Seo.",
    ),
    (
        "Step 2 — Brand and UI",
        "Name Trendora (trend + kart energy). Rose #ff3f6c on navy #1a1a2e. Playfair + Outfit fonts. "
        "Logo in public/images. Design tokens in src/index.css. Home hero, category tiles, deal timer.",
    ),
    (
        "Step 3 — Catalogue",
        "src/data/products.js holds SKUs, brands, coupons, size charts, PIN helper, INR format. "
        "Campus SKUs (crop, jeans, tote, kurti, polo, stationery) were added so a Rs 1000 college look is possible.",
    ),
    (
        "Step 4 — Commerce state",
        "src/context/StoreContext.jsx is the application layer: cart, wishlist, orders, coupons, "
        "reviews, tickets, persist to trendora-store-v2. placeOrder sanitises address, checks stock and PIN.",
    ),
    (
        "Step 5 — Shopper journey",
        "Shop filters, PDP (gallery, size chart, PIN), bag, checkout (UPI/card/COD simulated), "
        "orders timeline, cancel, return after Delivered, Insider points, Studio lookbook.",
    ),
    (
        "Step 6 — Customer-only auth",
        "Public /login and /register are shoppers only. Passwords SHA-256. Customer path issues OTP "
        "(5 minutes, 5 tries). UI shows the demo code; 123456 always works in the lab. "
        "Staff emails are rejected on the public form.",
    ),
    (
        "Step 7 — Private admin desk",
        "Hidden /staff (tiny footer link). admin@ / admin123. Guided Add new item: name & price, "
        "photo picker, stock & publish. upsertProduct / removeProduct refuse anyone who is not "
        "admin or owner. /admin without that session redirects home.",
    ),
    (
        "Step 8 — Personalized Smart Shopping",
        "src/lib/styleEngine.js + src/pages/Style.jsx. Prompt parser, mood tiles, budget lock, "
        "complete-the-look on PDP, canvas photo match, why-recommend, ecoScore, smart cart, "
        "Student Mode and CAMPUS10. Preferences persist with the rest of the store.",
    ),
    (
        "Step 9 — Documents and honesty",
        "This generator writes PDF, Word and PPT. FAQ states: no real money, nothing ships, "
        "photo search is colour-only, OTP is simulated. That honesty is part of the marks.",
    ),
    CHAPTERS[10],
    CHAPTERS[14],
    CHAPTERS[15],
]

SLIDES = [
    ("Trendora", "Personalized Smart Shopping\nMyntra-style shop + private admin\nCollege / vlg project 2025-26"),
    ("Why this project", "Not only a cart.\nPeople shop by mood, budget and occasion.\nStyle + shop in one student system."),
    ("Problem", "Build discover -> style -> pay -> track\nand a private admin desk\nwithout a real warehouse."),
    ("Inspiration", "Myntra — PDP, Insider, Studio\nFlipkart — deals, coupons, COD\nMeesho — affordable catalogue"),
    ("Who sees what", "Everyone: customer shop + OTP\nOnly owner: /staff admin desk\nNo public add / delete"),
    ("Customer features", "Search, filter, sort, size chart, PIN\nReviews, wishlist, compare, bag\nCoupons, checkout, orders, returns"),
    ("Smart Shopping 1", "AI Style Assistant\nType a Hindi/English wish\nGet a complete outfit under budget"),
    ("Smart Shopping 2", "7 moods  |  Budget lock\nComplete this look on PDP\nPhoto -> similar colour products"),
    ("Smart Shopping 3", "Why we recommend this\nEco Score + eco filter\nSmart cart  |  Student Mode + CAMPUS10"),
    ("Admin desk", "Hidden /staff\nadmin@trendora.in / admin123\n3-step Add item -> Publish\nOrders / returns / coupons"),
    ("Architecture", "UI pages\n   |\nStoreContext + styleEngine\n   |\nproducts.js + localStorage v2"),
    ("Money formula", "grand = subtotal - coupon + ship + wrap\nFree ship >= Rs 999\n1 Insider point / Rs 10"),
    ("Order machine", "Confirmed -> Packed -> Shipped\n-> Out for delivery -> Delivered\nCancel before ship · Return after"),
    ("Live demo script", "1. Customer OTP login\n2. /style college look under 1000\n3. Open a dress -> complete look\n4. Smart cart suggestion\n5. /staff add a new item"),
    ("Testing", "19 cases: looks, mood, budget,\neco, photo, OTP, staff gate,\nstock, pipeline, refresh."),
    ("Be honest", "No real money.\nOTP is simulated.\nPhoto match is colour, not AI cloud.\nNothing ships."),
    ("Documents", "Project report — PDF + Word\nHow it was built — PDF\nPresentation — PPTX"),
    ("Thank you", "Questions?\nShop · /style · /staff · /documents"),
]


class ReportPDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(*ROSE)
        self.cell(0, 8, "Trendora  |  College project report", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*NAVY)
        self.line(15, 16, 195, 16)
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")


def ascii(s: str) -> str:
    table = str.maketrans(
        {
            "\u2014": "-",
            "\u2013": "-",
            "\u2212": "-",
            "\u201c": '"',
            "\u201d": '"',
            "\u2018": "'",
            "\u2019": "'",
            "\u2022": "-",
            "\u2192": "->",
            "\u2193": "-",
            "\u00d7": "x",
            "\u20b9": "Rs ",
            "\u00b7": "-",
            "\u2265": ">=",
            "\u2728": "*",
            "\u2705": "+",
        }
    )
    return s.translate(table).encode("latin-1", "replace").decode("latin-1")


def write_pdf(path: Path, title: str, subtitle: str, chapters):
    pdf = ReportPDF()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, 210, 297, "F")
    pdf.set_text_color(*ROSE)
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_xy(20, 70)
    pdf.cell(0, 10, "COLLEGE / VLG PROJECT  2025-26")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 32)
    pdf.set_xy(20, 90)
    pdf.multi_cell(170, 14, ascii(title))
    pdf.set_font("Helvetica", "", 14)
    pdf.set_xy(20, 140)
    pdf.multi_cell(170, 8, ascii(subtitle))
    pdf.set_font("Helvetica", "", 11)
    pdf.set_xy(20, 250)
    pdf.cell(0, 8, "Department of Computer Science / Information Technology")

    pdf.add_page()
    pdf.set_text_color(*NAVY)
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "Contents", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    for i, (h, _) in enumerate(chapters, 1):
        pdf.cell(0, 7, ascii(f"{i}.  {h}"), new_x="LMARGIN", new_y="NEXT")

    for heading, body in chapters:
        pdf.add_page()
        pdf.set_text_color(*ROSE)
        pdf.set_font("Helvetica", "B", 16)
        pdf.multi_cell(0, 9, ascii(heading))
        pdf.ln(2)
        pdf.set_text_color(40, 40, 55)
        pdf.set_font("Helvetica", "", 11)
        for para in body.split("\n"):
            pdf.multi_cell(0, 6.2, ascii(para) if para else " ")
            pdf.ln(1)
    pdf.output(path)


def write_docx(path: Path):
    doc = Document()
    styles = doc.styles["Normal"]
    styles.font.name = "Calibri"
    styles.font.size = Pt(11)

    t = doc.add_paragraph()
    t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = t.add_run("TRENDORA")
    run.bold = True
    run.font.size = Pt(28)
    run.font.color.rgb = RGBColor(*NAVY)

    s = doc.add_paragraph()
    s.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = s.add_run("Personalized Smart Shopping Website\nInspired by Meesho, Myntra and Flipkart")
    r.font.size = Pt(14)

    meta = doc.add_paragraph()
    meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    meta.add_run(
        "Project Report\nSubmitted in partial fulfilment of the requirements\n"
        "of the college / vlg programme\nAcademic year 2025-26"
    )

    doc.add_page_break()
    doc.add_heading("Table of contents", level=1)
    for i, (h, _) in enumerate(CHAPTERS, 1):
        doc.add_paragraph(f"{i}. {h}")

    for heading, body in CHAPTERS:
        doc.add_heading(heading, level=1)
        for para in body.split("\n"):
            doc.add_paragraph(para)

    doc.add_heading("Appendix D — Demo sheet", level=1)
    for item in [
        "Customer: demo@trendora.in / demo123 then OTP (on screen or 123456)",
        "Admin desk: /staff — admin@trendora.in / admin123",
        "Owner: /staff — owner@trendora.in / owner123",
        "Coupons: TREND10, FESTIVE20, WELCOME100, FREESHIP, INSIDER15, CAMPUS10",
        "Style: /style — college outfit under 1000",
    ]:
        doc.add_paragraph(item, style="List Bullet")

    doc.save(path)


def write_pptx(path: Path):
    prs = Presentation()
    prs.slide_width = PInches(13.333)
    prs.slide_height = PInches(7.5)
    blank = prs.slide_layouts[6]
    for title, body in SLIDES:
        slide = prs.slides.add_slide(blank)
        fill = slide.background.fill
        fill.solid()
        fill.fore_color.rgb = PRGB(*NAVY)
        box = slide.shapes.add_textbox(PInches(0.8), PInches(1.6), PInches(11.6), PInches(1.4))
        tf = box.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = PPt(40)
        p.font.bold = True
        p.font.color.rgb = PRGB(255, 255, 255)
        p.font.name = "Calibri"
        box2 = slide.shapes.add_textbox(PInches(0.8), PInches(3.2), PInches(11.6), PInches(3.4))
        tf2 = box2.text_frame
        tf2.word_wrap = True
        first = True
        for line in body.split("\n"):
            para = tf2.paragraphs[0] if first else tf2.add_paragraph()
            first = False
            para.text = line
            para.font.size = PPt(22)
            para.font.color.rgb = PRGB(230, 214, 208)
            para.space_after = PPt(8)
        tag = slide.shapes.add_textbox(PInches(0.8), PInches(0.4), PInches(6), PInches(0.4))
        tp = tag.text_frame.paragraphs[0]
        tp.text = "TRENDORA  ·  COLLEGE PROJECT"
        tp.font.size = PPt(12)
        tp.font.color.rgb = PRGB(*ROSE)
    prs.save(path)


def write_markdown():
    report = ["# Trendora — Personalized Smart Shopping", "", "## Project Report (college / vlg 2025-26)", ""]
    for h, b in CHAPTERS:
        report += [f"## {h}", "", b, ""]
    (ROOT / "docs" / "PROJECT_REPORT.md").write_text("\n".join(report), encoding="utf-8")
    built = ["# How Trendora was built", ""]
    for h, b in HOW_BUILT:
        built += [f"## {h}", "", b, ""]
    (ROOT / "docs" / "HOW_IT_WAS_BUILT.md").write_text("\n".join(built), encoding="utf-8")
    slides = ["# Trendora presentation outline", ""]
    for i, (h, b) in enumerate(SLIDES, 1):
        slides += [f"## Slide {i}: {h}", "", b, ""]
    (ROOT / "docs" / "PRESENTATION.md").write_text("\n".join(slides), encoding="utf-8")


def copy_out():
    names = [
        "Trendora_Project_Report.pdf",
        "Trendora_Project_Report.docx",
        "Trendora_How_It_Was_Built.pdf",
        "Trendora_Presentation.pptx",
    ]
    zip_path = OUT / "Trendora_All_Documents.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for name in names:
            src = OUT / name
            if src.exists():
                zf.write(src, name)
                for folder in (DL, COLLEGE):
                    shutil.copy2(src, folder / name)
        zf.write(zip_path, "Trendora_All_Documents.zip") if False else None
    for folder in (DL, COLLEGE):
        shutil.copy2(zip_path, folder / "Trendora_All_Documents.zip")
        for md in ("PROJECT_REPORT.md", "HOW_IT_WAS_BUILT.md", "PRESENTATION.md"):
            shutil.copy2(ROOT / "docs" / md, folder / md)


def main():
    write_markdown()
    write_pdf(
        OUT / "Trendora_Project_Report.pdf",
        "Trendora",
        "Personalized Smart Shopping website\ninspired by Meesho, Myntra and Flipkart\n\nProject report  ·  PDF copy for submission",
        CHAPTERS,
    )
    write_pdf(
        OUT / "Trendora_How_It_Was_Built.pdf",
        "How Trendora was built",
        "Step-by-step construction log for the viva.\nReact 18 · Vite 5 · Smart Shopping · private admin.",
        HOW_BUILT,
    )
    write_docx(OUT / "Trendora_Project_Report.docx")
    write_pptx(OUT / "Trendora_Presentation.pptx")
    copy_out()
    print("Wrote", list(OUT.glob("Trendora_*")))
    print("Also", COLLEGE)


if __name__ == "__main__":
    main()
