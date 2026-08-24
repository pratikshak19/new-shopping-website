#!/usr/bin/env python3
"""50-60 page beginner handbook: how to use Trendora + free hosting."""
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
SHOT = ROOT / "guide" / "shots"
OUT_DOCS = ROOT / "public" / "docs"
OUT_DL = ROOT / "DOWNLOAD_THESE"
OUT_DOCS.mkdir(parents=True, exist_ok=True)
OUT_DL.mkdir(parents=True, exist_ok=True)

NAVY = (26, 26, 46)
ROSE = (255, 63, 108)
INK = (40, 44, 63)
MUTED = (90, 94, 110)
PAPER = (250, 247, 245)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


class Guide(FPDF):
    def __init__(self):
        super().__init__(format="A4", unit="mm")
        self.set_auto_page_break(auto=True, margin=18)
        self.add_font("DejaVu", "", FONT)
        self.add_font("DejaVu", "B", FONTB)
        self.chapter = ""

    def header(self):
        if self.page_no() <= 2:
            return
        self.set_font("DejaVu", "", 8)
        self.set_text_color(*ROSE)
        self.cell(0, 6, "Trendora  |  Beginner complete guide  |  How to use + free hosting", ln=1)
        self.set_draw_color(*NAVY)
        self.line(15, 12, 195, 12)
        self.ln(4)

    def footer(self):
        self.set_y(-14)
        self.set_font("DejaVu", "", 8)
        self.set_text_color(130, 130, 140)
        self.cell(0, 8, f"Page {self.page_no()}   ·   College project handbook   ·   No real payments", align="C")

    def cover(self):
        self.add_page()
        self.set_fill_color(*NAVY)
        self.rect(0, 0, 210, 297, "F")
        self.set_fill_color(*ROSE)
        self.rect(0, 0, 10, 297, "F")
        self.set_text_color(*ROSE)
        self.set_font("DejaVu", "B", 13)
        self.set_xy(24, 42)
        self.cell(0, 8, "COLLEGE / VLG PROJECT   ·   2025-26")
        self.set_text_color(255, 255, 255)
        self.set_font("DejaVu", "B", 34)
        self.set_xy(24, 68)
        self.multi_cell(170, 14, "Trendora\nBeginner Complete Guide")
        self.set_font("DejaVu", "", 13)
        self.set_xy(24, 118)
        self.multi_cell(
            170,
            7,
            "Step-by-step book for a first-time student.\n"
            "How to click every screen  ·  How to run on your laptop\n"
            "How to put the website on the internet for FREE\n"
            "Screenshots  ·  Hindi-simple notes  ·  50+ pages",
        )
        self.set_font("DejaVu", "", 11)
        self.set_xy(24, 250)
        self.multi_cell(
            170,
            6,
            "You do not need to be a coder to follow Part A (using the site).\n"
            "Part B (hosting) is also written for zero experience.\n"
            "Payments are simulated. No real money is taken.",
        )

    def toc(self, titles):
        self.add_page()
        self.h1("Contents  /  Anukramanika")
        self.p("Do not skip Chapter 0 if English-computer words scare you. Har chapter chhota steps mein hai.")
        self.set_font("DejaVu", "", 11)
        self.set_text_color(*INK)
        for i, t in enumerate(titles, 1):
            self.cell(10, 7, f"{i:02d}", ln=0)
            self.cell(0, 7, t, ln=1)

    def h1(self, text):
        self.chapter = text
        self.add_page()
        self.set_text_color(*ROSE)
        self.set_font("DejaVu", "B", 18)
        self.multi_cell(0, 9, text)
        self.ln(2)

    def h2(self, text):
        if self.get_y() > 250:
            self.add_page()
        self.ln(2)
        self.set_text_color(*NAVY)
        self.set_font("DejaVu", "B", 13)
        self.multi_cell(0, 7, text)
        self.ln(1)

    def p(self, text):
        self.set_text_color(*INK)
        self.set_font("DejaVu", "", 11)
        self.multi_cell(0, 6, text)
        self.ln(1.4)

    def note(self, text, kind="NOTE"):
        if self.get_y() > 250:
            self.add_page()
        colors = {"NOTE": (232, 244, 248), "HINDI": (255, 241, 244), "WARN": (255, 236, 220), "TIP": (232, 245, 233)}
        self.set_fill_color(*colors.get(kind, (240, 240, 240)))
        self.set_x(15)
        y = self.get_y()
        self.set_font("DejaVu", "B", 9)
        self.set_text_color(*ROSE if kind != "WARN" else (180, 83, 9))
        self.multi_cell(180, 5.5, f"{kind}:  {text}")
        self.ln(2)

    def bullets(self, items):
        self.set_text_color(*INK)
        self.set_font("DejaVu", "", 11)
        for it in items:
            self.set_x(20)
            self.multi_cell(170, 6, f"-  {it}")
        self.ln(1.5)

    def step(self, n, title, body=""):
        if self.get_y() > 235:
            self.add_page()
        self.set_fill_color(*NAVY)
        self.set_text_color(255, 255, 255)
        self.set_font("DejaVu", "B", 11)
        self.cell(10, 7, str(n), fill=True, align="C")
        self.set_text_color(*NAVY)
        self.cell(0, 7, "  " + title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)
        if body:
            self.p(body)

    def shot(self, name, caption, h=78):
        path = SHOT / name
        if not path.exists():
            self.note(f"Image missing: {name}", "WARN")
            return
        if self.get_y() + h + 14 > 275:
            self.add_page()
        self.set_font("DejaVu", "", 9)
        self.set_text_color(*MUTED)
        self.multi_cell(0, 5, caption)
        self.image(str(path), w=180, h=h)
        self.ln(3)


def build():
    g = Guide()
    g.cover()
    chapters = [
        "How to read this book (beginner rules)",
        "Computer words in simple language",
        "What Trendora is - and what it is NOT",
        "Open the website right now (preview / live link)",
        "Customer journey with screenshots (shop like Myntra)",
        "Five logins - customer, reseller, seller, admin, owner",
        "Reseller studio (Meesho-style share and earn 8%)",
        "Seller studio (list products, see earnings)",
        "Admin desk (orders, returns, coupons, tickets)",
        "Owner console (people, settings, reports)",
        "Extra storefront: coupons, Insider, Studio, compare, help",
        "Download college PDF / Word / PPT",
        "What is hosting? Why do we need it?",
        "Free hosting map - which site to pick",
        "Install Node.js, Git and VS Code on Windows",
        "Run Trendora on YOUR laptop",
        "Put the code on GitHub (free)",
        "Publish on Vercel (easiest free internet URL)",
        "Publish on Netlify or GitHub Pages (backup methods)",
        "After it is online - test like a teacher",
        "Common errors and exact fixes",
        "Viva / practical exam script",
        "Safety, honesty, and what you should tell the examiner",
        "Glossary + demo passwords + coupons + checklist",
    ]
    g.toc(chapters)

    # 1
    g.h1("1. How to read this book")
    g.p(
        "This handbook is written for a student who has never hosted a website. "
        "If a sentence has a hard English word, the next line says the same thing in simple Hinglish."
    )
    g.note(
        "Aapko pehle se coding aane ki zaroorat nahi. Part A sirf mouse se website chalana sikhata hai. "
        "Part B laptop par chalana aur internet par FREE daalna sikhata hai.",
        "HINDI",
    )
    g.h2("Two parts")
    g.bullets(
        [
            "PART A (Chapters 3-12): Use the ready Trendora site. Shopping, 5 logins, documents.",
            "PART B (Chapters 13-21): Understand hosting, install tools, run locally, put it on the free internet.",
            "PART C (Chapters 22-24): Viva answers, safety, glossary, final checklist.",
        ]
    )
    g.h2("Rules so you do not get lost")
    g.bullets(
        [
            "Do one STEP box at a time. Do not jump.",
            "Pink NOTE boxes are extra help, not extra work.",
            "WARN boxes stop common disasters (wrong folder, paid plan, real card).",
            "Pictures are labelled. Match the picture with your screen. Small design differences are OK.",
            "If a website (GitHub / Vercel) changed their button colour last week, look for the SAME WORDS, not the colour.",
            "Never type your real bank card. This project never needs it.",
        ]
    )
    g.h2("What you need")
    g.bullets(
        [
            "A computer (Windows laptop is assumed; Mac notes are given).",
            "Internet (college Wi-Fi is enough).",
            "A free email (Gmail is perfect).",
            "A browser: Chrome or Edge.",
            "Patience of one afternoon (about 3-4 hours for first-time hosting).",
        ]
    )
    g.p(
        "Time plan: 40 minutes to learn the store (Part A). 30 minutes to install tools. "
        "40 minutes to run on laptop. 40 minutes to put on GitHub. 30 minutes to deploy on Vercel. "
        "30 minutes to test. Rest is buffer when something asks you to verify email."
    )
    g.note("Phone se bhi site dekh sakte ho AFTER it is hosted. Pehle laptop se seekho. Phone par code banana mushkil hai.", "TIP")

    # 2
    g.h1("2. Computer words in simple language")
    g.p(
        "Teachers and YouTube will throw these words. Learn them once. The rest of the book becomes easy."
    )
    pairs = [
        ("Browser", "The app that opens websites: Chrome, Edge, Firefox. Matlab: internet ka darwaza."),
        ("URL / link", "The address in the top bar, like https://trendora.vercel.app. Matlab: ghar ka address."),
        ("Website / web app", "Pages that run in the browser. Trendora is a web app (single page app)."),
        ("Frontend", "What you SEE (buttons, pictures, pages). Trendora is almost all frontend."),
        ("Backend / server / API", "Hidden computer that stores real users and money. This college project does NOT have a paid backend."),
        ("localStorage", "A small diary inside YOUR browser. Trendora saves bag, login and orders here. Another phone will not see your bag."),
        ("Hosting", "Renting a computer on the internet that gives your files to visitors 24 hours. Matlab: website ko 24 ghante online rakhna."),
        ("Domain", "A short name like trendora.in. Free hosts give you a long free name such as something.vercel.app."),
        ("Git", "A save-history tool for code. Like infinite Undo for a whole folder."),
        ("GitHub", "A free website that stores your Git folder in the cloud. Teachers can open it."),
        ("Repository / repo", "One project folder on GitHub."),
        ("Commit", "A named snapshot: 'I added the login page'."),
        ("Push", "Send your commits from laptop to GitHub."),
        ("Clone / pull", "Download the project from GitHub to a laptop."),
        ("Node.js", "A program that lets JavaScript run on the laptop, not only in Chrome."),
        ("npm", "A tool that comes with Node. It installs libraries (React, Vite) written in package.json."),
        ("package.json", "A shopping list of libraries + commands like npm run dev."),
        ("Vite", "The oven that cooks React files into a fast website and also runs the local preview."),
        ("React", "A popular way to build screens from small components (Navbar, Product card)."),
        ("Build (npm run build)", "Creates a dist/ folder of finished HTML/CSS/JS that any host can serve."),
        ("Deploy", "Upload that finished folder (or connect GitHub) so the world can open it."),
        ("SPA", "Single Page Application. One index.html; React changes the screen. Hosts must redirect unknown paths to index.html."),
        ("localhost:5173", "Your own laptop pretending to be a website. Only you can open it, not your friend in another city."),
        ("Preview (Arena / college lab)", "A temporary live window the assistant started for you. It may sleep later. Hosting makes a permanent link."),
        ("Environment / PATH", "Windows must know where node.exe lives. The Node installer usually ticks this box."),
    ]
    for term, meaning in pairs:
        g.h2(term)
        g.p(meaning)
    g.note(
        "Agar ek baar yeh 20 words yaad ho gaye, hosting wala hissa darawna nahi lagega.",
        "HINDI",
    )

    # 3
    g.h1("3. What Trendora is - and what it is NOT")
    g.shot("diagram-five-roles.jpg", "Figure 3.1  Five login authorities in one college project.", 82)
    g.p(
        "Trendora is a shopping website inspired by Myntra (fashion discovery), Meesho (seller + reseller share) "
        "and Flipkart (deals, coupons, COD, order timeline). It was built with Vite + React for a college / vlg project."
    )
    g.h2("What you CAN do")
    g.bullets(
        [
            "Browse 8 categories and 30+ demo products with INR prices.",
            "Search, filter, sort, open a product, pick size/colour, check PIN code.",
            "Wishlist, compare 3 items, apply coupons, gift wrap, simulated checkout.",
            "Track, cancel (before ship), request return after delivery.",
            "Login as 5 authorities. Seller lists products. Admin moves orders. Owner creates staff.",
            "Reseller copies a share link and earns 8% of a referred checkout (simulated).",
            "Download project report PDF, Word, PPT from /documents.",
        ]
    )
    g.h2("What you CANNOT / should not claim")
    g.bullets(
        [
            "No real UPI or card charge. The button says simulated.",
            "No courier will arrive. Stock numbers only change inside the browser.",
            "No real warehouse, GST filing, or SMS OTP.",
            "Passwords are hashed in the browser (SHA-256) for the demo, but this is NOT a bank-grade login.",
            "Data lives in that browser. Clearing site data wipes orders.",
            "Do not tell the examiner 'I launched a startup'. Say 'I built a complete simulated marketplace UX'.",
        ]
    )
    g.shot("diagram-order-flow.jpg", "Figure 3.2  Customer order journey you will click in Chapter 5.", 78)
    g.h2("Demo passwords (learn now, use often)")
    g.p(
        "Customer  demo@trendora.in / demo123\n"
        "Reseller  reseller@trendora.in / reseller123\n"
        "Seller    seller@trendora.in / seller123\n"
        "Admin     admin@trendora.in / admin123\n"
        "Owner     owner@trendora.in / owner123"
    )
    g.note("Login page par role card pe ek click kafi hai. Password type karna zaroori nahi, lekin viva mein type karke dikhana better hai.", "TIP")
    g.p(
        "Coupons you can type in the bag: TREND10 (10% above Rs 799), FESTIVE20 (20% above Rs 1999), "
        "WELCOME100 (Rs 100 above Rs 499), FREESHIP, INSIDER15 (Elite/Icon only)."
    )

    # 4
    g.h1("4. Open the website right now")
    g.h2("Case A - You are inside Arena / the assistant preview")
    g.step(1, "Find the live preview panel",
           "On the right (or a 'Preview' tab) a browser window is already running Trendora. "
           "It is the real site, not a photo.")
    g.step(2, "If it is blank, refresh",
           "Click the refresh icon once. Wait 5 seconds. First load downloads fonts and images.")
    g.step(3, "If preview died",
           "Tell the assistant 'start the site again', or follow Chapter 16 (npm run dev) on your laptop.")
    g.h2("Case B - A friend / teacher sent you a Vercel link")
    g.step(1, "Open Chrome", "Click the Chrome or Edge icon.")
    g.step(2, "Paste the URL",
           "Click the address bar at the top. Paste something like https://new-shopping-website.vercel.app and press Enter.")
    g.step(3, "Accept the home page",
           "You should see 'Trendora' on the left and a big fashion photo. That means it worked.")
    g.h2("Case C - You only have the GitHub folder")
    g.p("Skip to Chapter 15-18. You must run or host it first. A GitHub page of CODE is not the shop until you deploy.")
    g.shot("ui-home.jpg", "Figure 4.1  Home page - dark hero on the left, fashion photo on the right, Tren+dora logo top-left.", 80)
    g.h2("What each top button means")
    g.bullets(
        [
            "Tren dora logo: go home.",
            "Shop / Women / Men / Kids / Electronics: catalogue. Hover for mega menu.",
            "Offers / Studio: deals and lookbook pages.",
            "Search circle: type 'earbuds' or 'saree' and press Enter.",
            "Bell: notifications.",
            "Person icon: login or profile.",
            "Heart: wishlist.",
            "Bag: cart.",
            "Pink chip (after staff login): jump to that role's dashboard.",
        ]
    )
    g.note("Mobile par teen line ka menu button dikhega. Use tap karke saari links khulti hain.", "HINDI")

    # 5
    g.h1("5. Customer journey with screenshots")
    g.p(
        "This is the path a teacher loves in a viva: search a dress, read the page, add to bag, apply a coupon, "
        "checkout with a fake UPI, show the order number."
    )
    g.h2("5.1 Walk the home page")
    g.step(1, "Read the announcement bar",
           "The thin navy strip at the very top is the store message. Owner can change it later. Example: Festive edit is live.")
    g.step(2, "Watch the hero",
           "The big left text + right photo changes every few seconds (fashion / electronics / sale). "
           "Click the small bars to jump slides. Click 'Shop fashion'.")
    g.step(3, "Shop by category",
           "Eight tiles: Women, Men, Kids, Electronics, Home, Beauty, Footwear, Accessories. Click Women.")
    g.shot("ui-shop.jpg", "Figure 5.1  Shop page. Left = filters. Right = product grid with price, MRP and % off.", 82)
    g.h2("5.2 Filter and sort like Myntra")
    g.step(4, "Tick a category", "On the left, Women should already be ticked if you came from that tile.")
    g.step(5, "Drag price", "The price slider hides expensive laptops when you only want clothes.")
    g.step(6, "Discount filter", "Pick 30%+ to see festive markdowns.")
    g.step(7, "Sort", "Top-right dropdown: Popular, Price low to high, Price high to low, Newest.")
    g.step(8, "Search", "Type dress in the header and press Enter. The grid shrinks to matching names.")
    g.h2("5.3 Open a product (PDP)")
    g.step(9, "Click the dress card", "Use 'Blush Garden Floral Midi Dress' (id td-1001). The big page is called PDP - product detail page.")
    g.shot("ui-product.jpg", "Figure 5.2  Product page: photo, price, colour, size, PIN check, Add to bag, Buy now.", 82)
    g.step(10, "Change colour and size", "Click Blush, then M. The selected pill becomes navy.")
    g.step(11, "Open size chart", "Click the small 'size chart' link. A table of bust/waist appears. Click again to hide.")
    g.step(12, "Check PIN code",
           "Type 411001 (Pune) and Check. You should see delivery days and COD. Type 000000 - it must refuse. "
           "This proves the PIN helper works.")
    g.step(13, "Read stock and return line",
           "If stock < 10 it warns 'Only N left'. Try & Buy and 7-day return appear for fashion.")
    g.step(14, "Add to bag", "Pink button. A black toast appears bottom-right: Added to bag. The bag icon gets a pink badge '1'.")
    g.step(15, "Heart it", "Ghost heart button saves wishlist. Heart page is /wishlist. There you can Move to bag.")
    g.step(16, "Optional: Compare", "Chip 'Add to compare'. You can keep 3. Open /compare.")
    g.h2("5.4 Bag and coupon")
    g.step(17, "Open the bag", "Click the bag icon. You see photo, size, qty + / -, remove, price block.")
    g.shot("ui-cart.jpg", "Figure 5.3  Bag with two lines and a price summary. Delivery becomes FREE above Rs 999.", 78)
    g.step(18, "Change quantity", "Plus cannot go above stock. Minus cannot go below 1. Remove deletes the line.")
    g.step(19, "Apply FESTIVE20",
           "Only if subtotal is at least Rs 1999. Otherwise the site says the coupon is not valid. "
           "Add earbuds or a second item, then apply. Toast: Coupon FESTIVE20 applied.")
    g.step(20, "Gift wrap", "If the toggle exists on bag/checkout, it adds Rs 49. Good to mention in viva.")
    g.h2("5.5 Checkout (fake money)")
    g.shot("ui-checkout.jpg", "Figure 5.4  Address form on the left, simulated payment methods on the right.", 78)
    g.step(21, "Click Place order / Checkout", "You land on /checkout with steps Bag, Address, Payment.")
    g.step(22, "Fill address",
           "Name, 10-digit mobile starting 6-9, house line, city, state, 6-digit PIN. Empty fields are blocked.")
    g.step(23, "Pick UPI", "A radio list: UPI, Card, COD, EMI. All are labels only. Nothing is charged.")
    g.step(24, "Submit Place order",
           "If stock ran out, you get an error. If PIN is 999999, delivery is refused. On success you see Order placed and an id like TRD104421.")
    g.shot("ui-order.jpg", "Figure 5.5  Success screen + timeline. Only 'Order placed' is green at first.", 72)
    g.step(25, "Read the timeline",
           "Confirmed -> Packed -> Shipped -> Out for delivery -> Delivered. Customer cannot skip these. Admin/Owner can.")
    g.step(26, "Cancel practice",
           "On a Confirmed order, click Cancel order, confirm the browser popup. Stock comes back. After Shipped, cancel is blocked.")
    g.note(
        "Yeh poora flow 3 minute mein viva mein dikhao. Examiner impressed hota hai jab coupon fail + PIN fail + successful order teeno dikhe.",
        "TIP",
    )

    # 6
    g.h1("6. Five logins in depth")
    g.shot("ui-login.jpg", "Figure 6.1  Five role cards + the type-your-password form.", 80)
    g.shot("mock-login.jpg", "Figure 6.2  Another view of the same login idea (stylised). Use the real /login page in the preview.", 70)
    g.p(
        "Open /login. You will see five big cards and a form. Each card is a different AUTHORITY - "
        "like different keys to different rooms of a mall."
    )
    g.h2("Why five, not one?")
    g.p(
        "Myntra shoppers never see Seller Central. Meesho resellers never see warehouse admin. "
        "Your project is complete only if all rooms exist. Owner is the extra college requirement: a super-admin."
    )
    g.h2("How to login (two ways)")
    g.step(1, "Fast demo click", "Click the Customer card. You jump home as Aisha Verma. Good for practice.")
    g.step(2, "Typed login (viva style)",
           "Type demo@trendora.in and demo123. Press Sign in. Wrong password 6 times locks you for 30 seconds. That is a production feature - mention it.")
    g.step(3, "Register",
           " /register lets a new Customer, Reseller or Seller sign up. Admin and Owner can only be created by the Owner. "
           "Password minimum 6 characters. Phone must be 10 digits starting 6-9.")
    g.h2("Where each role lands")
    g.bullets(
        [
            "Customer -> Home /",
            "Reseller -> /reseller",
            "Seller -> /seller (dark dashboard)",
            "Admin -> /admin",
            "Owner -> /owner",
        ]
    )
    g.h2("Switching roles")
    g.p(
        "Click the person icon -> Profile -> Sign out (or open /login after logout). "
        "Then pick another card. Do not try to be two people in two tabs with the same browser - they share localStorage."
    )
    g.note("Ek hi Chrome profile mein last login jeetega. Examiner ko dikhane ke liye logout karke naya role kholo.", "WARN")
    g.h2("Blocked users")
    g.p("Owner can Block a user. That person sees 'This account is blocked' and cannot enter. Owner cannot be blocked.")

    # 7
    g.h1("7. Reseller studio (Meesho share)")
    g.shot("ui-reseller.jpg", "Figure 7.1  Reseller home: earning total + copy share link on a product.", 78)
    g.p(
        "Meesho became famous because a student or house-entrepreneur can share a catalogue on WhatsApp "
        "WITHOUT buying stock. Trendora copies that idea."
    )
    g.step(1, "Login as reseller", "reseller@trendora.in / reseller123. You land on /reseller.")
    g.step(2, "Open any product", "Example /product/td-1001.")
    g.step(3, "Click Share catalogue",
           "A link like https://YOUR-HOST/product/td-1001?ref=u-reseller is copied. Toast confirms.")
    g.step(4, "Open that link in the same browser (or a new one after logout)",
           "The site stores referral id. Shop and checkout as customer (or guest).")
    g.step(5, "See 8% earning",
           "On success the reseller gets a notification and a row in shares: 8% of grand total. "
           "Example: pay Rs 2000 -> earning Rs 160.")
    g.p(
        "Reseller does not add stock and does not pack parcels. If you login as reseller and try to open /admin, "
        "the guard sends you away. That is RequireRole."
    )
    g.note("Viva line: 'Reseller is Meesho-style social commerce. Commission is 8% of payable amount, coded in placeOrder.'", "TIP")

    # 8
    g.h1("8. Seller studio")
    g.shot("ui-seller.jpg", "Figure 8.1  Seller dashboard - same dark left menu, seller-only numbers.", 78)
    g.step(1, "Login seller@trendora.in / seller123", "Home becomes /seller.")
    g.step(2, "Overview", "Counts of your products and orders that contain your SKUs.")
    g.step(3, "Catalogue",
           "Add a product: name, brand, category, price, MRP, stock, image path (use an existing /images/products/... for the demo). Save. "
           "It appears on /shop immediately.")
    g.step(4, "Hide a product", "Remove / hide sets status hidden. Customers stop seeing it. Data is not deleted.")
    g.step(5, "Orders", "You see lines where sellerId is you. You do not see another seller's saree order.")
    g.step(6, "Earnings",
           "Net = item sale minus owner commission (default 12%). Example Rs 1899 -> about Rs 1671 credited in the table. Simulated.")
    g.p("Seller cannot create admins, cannot change store-wide free-ship, cannot see GMV of the whole mall.")

    # 9
    g.h1("9. Admin desk")
    g.shot("ui-admin.jpg", "Figure 9.1  Admin overview. Left navy rail is the operations desk.", 78)
    g.p("Admin is the mall manager. Login admin@trendora.in / admin123.")
    g.step(1, "Orders pipeline",
           "Open an order. Change status Confirmed -> Packed -> Shipped -> Out for delivery -> Delivered. "
           "Each change writes a toast and fills the timeline date.")
    g.step(2, "Returns",
           "After a customer on a Delivered order requests Return/Exchange, Admin marks Requested -> Approved -> Refunded. "
           "Refunded flips the order to Returned.")
    g.step(3, "Coupons", "Add a code, type percent/flat/shipping, min cart, active flag.")
    g.step(4, "Tickets", "Customers open Help tickets. Admin types a reply and status Replied.")
    g.step(5, "Users", "Admin can see people. Creating staff and changing roles is Owner-only.")
    g.step(6, "Catalogue", "Admin can edit any product, not only their own.")
    g.note("Admin owner nahi hai. Commission % aur announcement bar Owner ke Settings mein hi milte hain.", "HINDI")

    # 10
    g.h1("10. Owner console")
    g.shot("ui-owner.jpg", "Figure 10.1  Owner overview - GMV style numbers for the viva.", 78)
    g.p("Owner is the founder login. owner@trendora.in / owner123. This is the account you show last.")
    g.step(1, "People & authority",
           "Form: name, email, role (admin/seller/reseller/customer), password. Create login. "
           "Then logout and sign in as that new person to prove it works.")
    g.step(2, "Change role", "Dropdown on a row: customer -> seller. They will land on a different home next login.")
    g.step(3, "Block / unblock", "Blocked user cannot sign in. Do not block the owner row - the app refuses.")
    g.step(4, "Settings",
           "Store name, announcement text, freeShipMin (default 999), shipFee (79), commission (12), returnDays (7), tryAndBuy toggle.")
    g.step(5, "Reports", "GMV, order counts, coupon usage - enough charts/tables to speak for 2 minutes.")
    g.p("Owner can also do everything Admin can (orders, returns, coupons). The route /owner/* is guarded so a customer URL-hack fails.")

    # 11
    g.h1("11. Extra storefront features")
    g.h2("Offers / bank strip")
    g.p("Home shows HDFC / SBI / AXIS pills. /offers lists the same. EMI is a payment label, not a bank API.")
    g.h2("Insider loyalty")
    g.p(
        "Points = floor(amount / 10) after each order. Tiers: Member, Elite (>=800), Icon (>=2500). "
        "INSIDER15 coupon only works for Elite/Icon. Page /insider explains perks."
    )
    g.h2("Studio")
    g.p("/studio is the Myntra Studio idea: editorial looks, not a video network. Good screenshot for the report.")
    g.h2("Compare")
    g.p("Add up to 3 products. /compare shows side by side price, rating, category. Fourth add is blocked with a toast.")
    g.h2("Help, FAQ, Contact, tickets")
    g.p(
        "/help and /faq answer returns and COD. /contact sends a ticket into the Admin Tickets table. "
        "Use this if the examiner asks 'is there customer support?'"
    )
    g.h2("Addresses, profile, notifications")
    g.p(
        "/addresses saves multiple addresses per user. /profile edits name/phone. Bell icon lists 'Festive edit is live' "
        "and order events. Mark as read exists in the store."
    )
    g.h2("Keyboard and access")
    g.p(
        "Press Tab after load - a 'Skip to content' pink/navy control appears. Focus rings are rose. "
        "This is the accessibility (a11y) work mentioned in the production commit."
    )

    # 12
    g.h1("12. Download college documents")
    g.shot("ui-documents.jpg", "Figure 12.1  /documents - pink Download buttons for PDF, Word, PPT, ZIP, and this guide.", 78)
    g.step(1, "In the store open Documents", "Footer -> Project files -> PDF · Word · PPT, or type /documents.")
    g.step(2, "Or open /download.html", "A dark page with huge pink buttons. Use this if the fancy page is blocked inside an iframe.")
    g.step(3, "Click Download",
           "Chrome saves to the Downloads folder. If a preview sandbox blocks it, use 'Open in new tab' then Ctrl+S.")
    g.step(4, "Files you must keep",
           "Trendora_Project_Report.pdf / .docx, Trendora_Presentation.pptx, Trendora_How_It_Was_Built.pdf, "
           "Trendora_Beginner_Complete_Guide.pdf (this book), Trendora_All_Documents.zip.")
    g.p("Raw copies also live in the Git folder DOWNLOAD_THESE/ so you can copy to a pen drive without running the site.")
    g.note("PDF kholne ke liye Adobe Reader ya Chrome kafi hai. PPT ke liye MS PowerPoint ya Google Slides (File -> Open).", "HINDI")

    # 13
    g.h1("13. What is hosting? Why do we need it?")
    g.shot("diagram-hosting.jpg", "Figure 13.1  Laptop folder -> free cloud host -> anyone's browser.", 80)
    g.p(
        "When you click npm run dev, only YOUR laptop serves the site at http://localhost:5173. "
        "Your friend in another city cannot open localhost. localhost means 'this machine'."
    )
    g.p(
        "Hosting = we copy the finished files to a computer that is already on the public internet. "
        "That computer has a URL. Anyone with the link can open Trendora."
    )
    g.h2("Who are the free hosts?")
    g.bullets(
        [
            "Vercel - best friend of Vite/React. Recommended in this book.",
            "Netlify - same idea, very popular in colleges.",
            "Cloudflare Pages - also free, a bit more menus.",
            "GitHub Pages - free, but SPA redirects need an extra file. Slightly harder.",
            "Render / Railway free tiers - possible, not needed here.",
        ]
    )
    g.h2("What hosting is NOT")
    g.bullets(
        [
            "It is not Google Drive. Drive links do not run React routes.",
            "It is not WhatsApp. Sending the src folder does not open a shop.",
            "It is not a paid domain. you-name.vercel.app is already a real https website.",
            "It is not a database. Visitors still have their own localStorage. Examiner on his laptop will see empty bag - that is correct.",
        ]
    )
    g.h2("https and the lock icon")
    g.p(
        "Free hosts give HTTPS (the lock). You do not buy an SSL certificate. "
        "If a teacher asks 'is it secure transport?' say 'Yes, Vercel terminates TLS. App login is still a demo.'"
    )
    g.shot("diagram-local-to-online.jpg", "Figure 13.2  The six big actions from zero to online.", 78)

    # 14
    g.h1("14. Free hosting map - which site to pick")
    g.p("Choose ONE path. Do not start all three or you will confuse accounts.")
    g.h2("Path Vercel (recommended)")
    g.bullets(
        [
            "Price: free hobby plan is enough.",
            "Login with GitHub.",
            "Import the repo, Framework Vite is auto-detected.",
            "Each git push can auto-update the live site.",
            "SPA routes (/shop, /login) work without extra config.",
        ]
    )
    g.h2("Path Netlify")
    g.bullets(
        [
            "Also free. Build command npm run build, publish folder dist.",
            "Add a file public/_redirects with:  /*    /index.html   200",
            "Without that, opening /login in a new tab may 404.",
        ]
    )
    g.h2("Path GitHub Pages")
    g.bullets(
        [
            "Settings -> Pages -> GitHub Actions or branch /docs.",
            "Vite may need base: '/new-shopping-website/' if the site is username.github.io/new-shopping-website/.",
            "Only use this if Vercel is blocked on college Wi-Fi.",
        ]
    )
    g.h2("What you will NOT pay")
    g.p(
        "Do not enter a credit card. If a site asks for card to start a 'Pro trial', click Back and stay on Hobby/Free. "
        "This project is static files. Free tier is designed for it."
    )
    g.note("Card mat dalna. Agar screen pe 'Add payment method' aaye to galat plan select ho gaya.", "WARN")
    g.h2("Limits of free plans (be honest in viva)")
    g.bullets(
        [
            "Sleep / fair-use bandwidth - fine for a class of 60.",
            "No custom SMS.",
            "Build minutes are limited - our build is ~2 seconds, not a problem.",
            "Password reset emails do not exist. Demo users are enough.",
        ]
    )

    # 15
    g.h1("15. Install Node.js, Git and VS Code on Windows")
    g.p("Do this only once per laptop. Mac users: the same sites, pick the macOS buttons.")
    g.h2("15.1 Node.js LTS")
    g.shot("mock-nodejs.jpg", "Figure 15.1  nodejs.org - big LTS button for Windows. Always pick LTS, not Current.", 78)
    g.step(1, "Open https://nodejs.org", "Use Chrome.")
    g.step(2, "Click the green LTS button", "A file like node-v22.x.x-x64.msi downloads.")
    g.step(3, "Run the installer", "Next, accept license, keep default folder.")
    g.step(4, "Tick 'Add to PATH' if you see it", "Most modern installers do this automatically.")
    g.step(5, "Finish and CLOSE every old terminal", "PATH updates only in new windows.")
    g.step(6, "Prove it",
           "Click Start, type cmd, open Command Prompt. Type:  node -v   then Enter. You must see v20 or v22 something. "
           "Then type:  npm -v   and Enter. A number like 10.x is success.")
    g.note("Agar 'node is not recognized' aaye to laptop RESTART karo, phir naya cmd kholo. Phir bhi nahi to Node dubara install karo.", "WARN")
    g.h2("15.2 Git")
    g.step(1, "Open https://git-scm.com", "Download for Windows.")
    g.step(2, "Install with defaults", "Just keep clicking Next. Editor can stay Vim or switch to Notepad++ - both OK.")
    g.step(3, "Prove it", "New cmd:  git --version")
    g.step(4, "Tell Git your name (once)",
           "git config --global user.name \"Your Name\"\n"
           "git config --global user.email \"you@gmail.com\"\n"
           "Use the same email you will use on GitHub.")
    g.h2("15.3 VS Code")
    g.shot("mock-vscode.jpg", "Figure 15.2  VS Code with the Trendora folder and a terminal running npm run dev.", 78)
    g.step(1, "Open https://code.visualstudio.com", "Download Windows User installer.")
    g.step(2, "Install", "Tick 'Open with Code' if offered.")
    g.step(3, "Open the project later with File -> Open Folder", "You will do this in the next chapter after the folder exists on the Desktop.")
    g.p("Optional but useful VS Code extensions: ESLint is not required. 'Playwright' is not required. You only need the terminal (Ctrl+`).")
    g.h2("15.4 Create free accounts")
    g.bullets(
        [
            "GitHub.com -> Sign up with Gmail. Verify the email. Pick a simple username you can say in viva.",
            "Vercel.com -> Continue with GitHub. Allow access.",
            "Do not enable paid teams.",
        ]
    )
    g.h2("Mac short notes")
    g.p(
        "Install Node from nodejs.org pkg, or 'brew install node' if you already use Homebrew. "
        "Git is often already there (xcode-select --install). VS Code same website. Terminal.app instead of cmd."
    )
    g.h2("Linux / college lab Ubuntu")
    g.p("sudo apt update && sudo apt install -y nodejs npm git   may give an old Node. Prefer the NodeSource LTS installer or nvm if npm run dev fails.")

    # 16
    g.h1("16. Run Trendora on YOUR laptop")
    g.p("This is called 'running locally'. Teachers love seeing localhost in the address bar.")
    g.step(1, "Get the folder",
           "If the assistant already gave you the project, copy the whole new-shopping-website folder to Desktop. "
           "If you only have GitHub, wait for the next chapter and then come back, OR skip ahead to clone.")
    g.step(2, "Open it in VS Code", "File -> Open Folder -> Desktop/new-shopping-website -> Select Folder.")
    g.step(3, "Open the terminal inside VS Code", "Menu Terminal -> New Terminal, or key Ctrl+` . You must see the project path.")
    g.step(4, "Install libraries (once)",
           "Type exactly:\n\nnpm install\n\nand press Enter. A big node_modules folder appears. This can take 1-3 minutes. "
           "Do not close the window.")
    g.step(5, "Start the dev server",
           "Type:\n\nnpm run dev\n\nYou must see:  Local: http://localhost:5173/")
    g.step(6, "Open Chrome", "Go to http://localhost:5173/  - this is YOUR copy. Login with demo@trendora.in.")
    g.step(7, "Stop the server", "Click the terminal and press Ctrl+C. The site dies until you npm run dev again.")
    g.h2("What those commands did")
    g.p(
        "npm install reads package.json and downloads React, React-DOM, React-Router, Vite into node_modules. "
        "You never edit node_modules. npm run dev starts Vite, which compiles src/*.jsx on the fly."
    )
    g.h2("Production build on laptop")
    g.p(
        "npm run build   creates dist/.\n"
        "npm run preview   serves that finished site on 5173.\n"
        "This is closer to what Vercel runs. If preview works, deploy will work."
    )
    g.note("node_modules ko pen drive pe copy mat karo. Doosre PC par jaake wahan npm install chalao.", "WARN")
    g.h2("Folder map (so you are not afraid)")
    g.bullets(
        [
            "index.html - the only real HTML page.",
            "src/main.jsx - React starts here, wrapped in ErrorBoundary + BrowserRouter + StoreProvider.",
            "src/App.jsx - all routes.",
            "src/context/StoreContext.jsx - bag, login, orders. The brain.",
            "src/data/products.js - catalogue and coupons.",
            "src/lib/security.js - SHA-256, lockout, validation.",
            "public/images - photos. public/docs - PDFs.",
            "vite.config.js - host 0.0.0.0 so preview works, plus download headers for docs.",
        ]
    )

    # 17
    g.h1("17. Put the code on GitHub (free)")
    g.shot("mock-github.jpg", "Figure 17.1  github.com/new - public repository named new-shopping-website.", 78)
    g.p(
        "GitHub is a backpack for code. Vercel will read from here. Even if you never host, submit the GitHub link to your guide."
    )
    g.h2("Create the empty repo")
    g.step(1, "Login at https://github.com", "Top-right + -> New repository.")
    g.step(2, "Repository name", "new-shopping-website (or trendora). Public. Do NOT tick 'Add a README' if your laptop folder already has files.")
    g.step(3, "Create repository", "GitHub shows commands. We will type them in VS Code terminal. Stop the running server first (Ctrl+C).")
    g.h2("Send your laptop folder")
    g.p("In the project folder terminal, type these lines one by one. Replace YOURUSER.")
    g.p(
        "git init\n"
        "git add .\n"
        "git commit -m \"Add Trendora shopping website\"\n"
        "git branch -M main\n"
        "git remote add origin https://github.com/YOURUSER/new-shopping-website.git\n"
        "git push -u origin main"
    )
    g.p(
        "A popup may ask you to login to GitHub in the browser. Allow. If it asks for a password, GitHub no longer accepts your "
        "account password here - it wants a Personal Access Token or the browser login. Follow the browser path. It is easier."
    )
    g.h2("If the project ALREADY has git (this Arena repo)")
    g.p(
        "You may already be on branch arena/01a02fe3-new-shopping-website. Then you only need access to that GitHub remote "
        "and git push. Do not run git init again."
    )
    g.h2("Check success")
    g.p("Refresh the GitHub page. You should see src/, public/, package.json, README.md. Click README - demo passwords are listed.")
    g.note("node_modules aur dist GitHub pe nahi jane chahiye. .gitignore unhe rokta hai. Agar galti se chale gaye to repo bhaari ho jayega.", "TIP")

    # 18
    g.h1("18. Publish on Vercel (easiest free URL)")
    g.shot("mock-vercel.jpg", "Figure 18.1  vercel.com/new - Import Git Repository, Vite preset, Deploy.", 78)
    g.step(1, "Open https://vercel.com", "Continue with GitHub. Authorize Vercel to see your repos.")
    g.step(2, "Add New -> Project", "You will see new-shopping-website in the list. Click Import.")
    g.step(3, "Framework Preset", "Must say Vite. If it says Other, set Build Command to npm run build and Output Directory to dist.")
    g.step(4, "Root directory", "Leave ./  unless the code is inside a subfolder.")
    g.step(5, "Environment variables", "None required. Trendora has no secret API key.")
    g.step(6, "Deploy", "Wait 30-60 seconds. Confetti. Click the screenshot - your shop is LIVE.")
    g.step(7, "Copy the URL",
           "Looks like https://new-shopping-website-xxxx.vercel.app  or a name you choose in Project Settings -> Domains.")
    g.step(8, "Test /login on the live URL", "Use a phone on mobile data. If it opens, you truly hosted it.")
    g.h2("Auto update")
    g.p(
        "Next time you change code: git add .  then  git commit -m \"Fix navbar\"  then  git push. "
        "Vercel builds again. One minute later the live site updates. No FTP, no cPanel, no FileZilla."
    )
    g.h2("SPA refresh tip")
    g.p(
        "Open /shop then press F5. It should still show Shop, not a Vercel 404. Vite on Vercel does this correctly. "
        "If you ever see 404 on refresh, add a vercel.json rewrite to /index.html (see Chapter 21)."
    )
    g.h2("Custom domain later (optional, can cost money)")
    g.p(
        "Buying trendora.in is optional and usually paid (some .in offers exist). Free hosting does NOT require it. "
        "Examiner is happy with vercel.app."
    )

    # 19
    g.h1("19. Publish on Netlify or GitHub Pages")
    g.h2("Netlify")
    g.step(1, "https://app.netlify.com  Sign up with GitHub.")
    g.step(2, "Add new site -> Import from Git -> pick the repo.")
    g.step(3, "Build command: npm run build")
    g.step(4, "Publish directory: dist")
    g.step(5, "Deploy site.")
    g.step(6, "SPA fix: create public/_redirects with one line:   /*    /index.html   200")
    g.p("Commit and push that file, redeploy. Now /checkout refresh works.")
    g.h2("GitHub Pages with Vite")
    g.p(
        "This is the backup road. In vite.config.js set  base: '/REPO_NAME/'  if the site URL will be "
        "https://YOURUSER.github.io/REPO_NAME/ . Then use the official GitHub Action 'Deploy Vite to GitHub Pages', "
        "or build locally and push the dist contents to a gh-pages branch. Also add public/404.html that copies index.html "
        "so deep links work. Prefer Vercel if you are tired."
    )
    g.h2("Cloudflare Pages")
    g.p("dash.cloudflare.com -> Workers & Pages -> Create -> Connect Git. Build npm run build, output dist. Similar to Netlify.")
    g.h2("What about InfinityFree / 000webhost / cPanel?")
    g.p(
        "Those old PHP hosts can serve the dist/ folder if you upload it with FileZilla. "
        "You must also upload a .htaccess that redirects all routes to index.html. "
        "They often break HTTPS or sleep. Use them only if GitHub is banned. Steps: npm run build, upload EVERYTHING inside dist/ "
        "into public_html, add .htaccess:\n\n"
        "RewriteEngine On\nRewriteBase /\nRewriteRule ^index\\.html$ - [L]\n"
        "RewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . /index.html [L]"
    )

    # 20
    g.h1("20. After it is online - test like a teacher")
    g.p("Open the live URL in Incognito (Ctrl+Shift+N) so old localStorage does not lie.")
    g.bullets(
        [
            "Home hero moves. Categories open /shop?cat=women.",
            "Search earbuds finds PulseBuds Pro.",
            "Login typed password works for all 5 roles.",
            "6 wrong passwords lock for 30s.",
            "Add dress + buds, FESTIVE20 applies, grand shrinks.",
            "Checkout with PIN 411001 + UPI creates TRD........",
            "Refresh the order page - order still there (same browser).",
            "Admin marks Packed. Customer timeline updates after refresh.",
            "Reseller share link then customer checkout increases reseller earning.",
            "Owner creates a new seller and that email can login.",
            "/documents PDF downloads with a real file, not an HTML error.",
            "Phone Chrome: menu button works, grid becomes 2 columns.",
            "Unknown URL /foo shows Not Found page, not a white crash.",
        ]
    )
    g.h2("Show two browsers")
    g.p(
        "Chrome guest bag is empty while your main Chrome still has the order. This proves localStorage is per-browser. "
        "Say this before the teacher calls it a bug."
    )
    g.h2("Share the link")
    g.p(
        "WhatsApp the Vercel URL to your guide. Subject: 'Trendora live demo - 5 logins in README'. "
        "Also send this PDF and the GitHub URL."
    )

    # 21
    g.h1("21. Common errors and exact fixes")
    g.h2("'vite is not found' / 'npm run dev' fails")
    g.p("You forgot npm install, or you are in the wrong folder. cd into the folder that CONTAINS package.json. Then npm install.")
    g.h2("'node is not recognized'")
    g.p("Node not installed or PATH missing. Reinstall LTS, reboot, new cmd. Do not use the Microsoft Store Node if it is broken - use nodejs.org.")
    g.h2("Port 5173 already used")
    g.p("Old server still running. Close that terminal or Task Manager node.exe. Or run npx vite --port 5174 and open that port.")
    g.h2("White screen after deploy")
    g.p(
        "Usually a wrong base path (GitHub Pages) or JS error. Open Chrome DevTools (F12) -> Console. "
        "If you see Failed to load module, the asset paths are wrong. On Vercel this is rare."
    )
    g.h2("404 on /login after refresh (Netlify)")
    g.p("Missing _redirects file. Chapter 19 step 6.")
    g.h2("Login 'Invalid email or password' on demo users")
    g.p(
        "Old localStorage from an earlier version. F12 -> Application -> Local Storage -> delete trendora-store-v2 -> refresh. "
        "Seed users reload with hashed passwords."
    )
    g.h2("Too many attempts")
    g.p("Wait 30 seconds or F12 -> Application -> Session Storage -> delete trendora-lock.")
    g.h2("Images missing")
    g.p("Files must live under public/images and be referenced as /images/.... Do not put them only on Desktop.")
    g.h2("Git push rejected")
    g.p(
        "Someone else pushed. git pull --rebase origin main   then fix conflicts, or ask the owner. "
        "Never force-push a shared college repo unless a teacher says so."
    )
    g.h2("Vercel build failed")
    g.p("Open the red build log. Most common: wrong root folder, or Node version. In Project Settings set Node 20.x.")
    g.h2("College proxy blocks vercel.app")
    g.p("Use phone hotspot to demo. Or run npm run preview on the lab PC and show localhost. Mention the live URL still exists.")
    g.h2("Document download is HTML")
    g.p("You opened the GitHub blob page, not /docs/file.pdf on the hosted site. Use the live /download.html.")
    g.h2("I edited code but live site same")
    g.p("You forgot git push, or Vercel is building. Check the Deployments tab.")
    g.h2("Friend cannot see my orders")
    g.p("Not a bug. localStorage. Explain it. Future scope: MongoDB.")

    # 22
    g.h1("22. Viva / practical exam script")
    g.p("Memorise this 6-minute play. Rehearse twice.")
    g.step(1, "Minute 0-1  Home",
           "'This is Trendora, a multi-authority store inspired by Myntra, Meesho and Flipkart. Hero, categories, deal timer, bank offers.'")
    g.step(2, "Minute 1-3  Customer buy",
           "Search dress, size chart, PIN 411001, add to bag, FESTIVE20, checkout UPI, show TRD id. Say 'payment is simulated'.")
    g.step(3, "Minute 3-4  Admin pipeline",
           "Logout, admin123, mark Packed then Shipped. Back to customer, timeline moved.")
    g.step(4, "Minute 4-5  Seller + reseller",
           "Seller lists a SKU. Reseller copies share link, explain 8%.")
    g.step(5, "Minute 5-6  Owner + docs",
           "Owner settings commission. Open /documents, download PDF. Show GitHub + Vercel URLs.")
    g.h2("Likely questions - short answers")
    g.p(
        "Q. Which stack?  A. React 18, Vite 5, React Router 6, Context API, localStorage key trendora-store-v2.\n\n"
        "Q. Why no database?  A. Scope is UX + roles. Context is a stand-in. Future: Express + MongoDB.\n\n"
        "Q. How is password stored?  A. SHA-256 in the browser. Not bcrypt on a server. Honest limitation.\n\n"
        "Q. How does reseller earn?  A. Query ?ref=userId captured; placeOrder adds 8% of grand into shares.\n\n"
        "Q. How did you host?  A. GitHub repo connected to Vercel, npm run build, output dist, free hobby URL.\n\n"
        "Q. Difference Owner vs Admin?  A. Owner creates staff, changes roles, store settings and reports.\n\n"
        "Q. Security?  A. Lockout 6/30s, cleanText strips <>, email/phone regex, Error Boundary, HTTPS on host.\n\n"
        "Q. Testing?  A. 14 manual cases in the project report - coupon min, PIN, stock drop, role guard."
    )

    # 23
    g.h1("23. Safety, honesty, examiner ethics")
    g.bullets(
        [
            "Never collect a friend's real UPI. There is no payout.",
            "Never reuse demo123 as your banking password.",
            "Never claim Myntra source code. You studied the public UX and wrote original React.",
            "Never buy a 'hosting assignment service'. Teachers recognise copied cPanel screenshots.",
            "If you deploy public, people can still only hurt THEIR browser storage, not your laptop.",
            "Do not upload huge personal photos of classmates without permission.",
            "Keep a zip of DOWNLOAD_THESE on a pen drive the night before external viva. College Wi-Fi dies.",
        ]
    )
    g.p(
        "Suggested honesty sentence: 'Trendora is an academic simulation of an Indian marketplace. "
        "It implements real UX flows and role separation. It does not process legal tender or ship SKUs.'"
    )

    # 24
    g.h1("24. Glossary, passwords, coupons, final checklist")
    g.h2("Passwords again")
    g.p(
        "demo@trendora.in / demo123\n"
        "reseller@trendora.in / reseller123\n"
        "seller@trendora.in / seller123\n"
        "admin@trendora.in / admin123\n"
        "owner@trendora.in / owner123"
    )
    g.h2("Coupons again")
    g.p("TREND10 · FESTIVE20 · WELCOME100 · FREESHIP · INSIDER15")
    g.h2("Important URLs on YOUR site")
    g.p(
        "/   home\n/shop   catalogue\n/product/td-1001   sample dress\n/cart  /checkout\n"
        "/login  /register\n/reseller\n/seller  /admin  /owner\n/documents  /download.html\n/help  /faq  /insider  /studio"
    )
    g.h2("Commands cheat-sheet")
    g.p(
        "npm install\n"
        "npm run dev          (develop)\n"
        "npm run build        (make dist)\n"
        "npm run preview      (serve dist)\n"
        "git add .\n"
        "git commit -m \"message\"\n"
        "git push"
    )
    g.h2("Night-before checklist")
    g.bullets(
        [
            "[ ] Live Vercel URL opens on your phone.",
            "[ ] All 5 logins work on that URL.",
            "[ ] One order id written on paper.",
            "[ ] This PDF + project report + PPT on pen drive AND on /documents.",
            "[ ] GitHub README shows passwords.",
            "[ ] You can say the honesty sentence without reading.",
            "[ ] Laptop charged. Hotspot ready if Wi-Fi dies.",
            "[ ] VS Code can npm run dev offline after one successful install (images need the folder, not the net).",
        ]
    )
    g.h2("If you remember only 8 lines")
    g.p(
        "1. Trendora is a simulated Indian shop with 5 logins.\n"
        "2. Customer path: shop -> PDP -> bag -> coupon -> fake pay -> TRD id.\n"
        "3. Reseller shares ?ref= and earns 8%.\n"
        "4. Seller lists SKUs. Admin moves the parcel states. Owner makes staff.\n"
        "5. Data is in localStorage, not MySQL.\n"
        "6. Node + npm run dev = laptop. GitHub + Vercel = internet, free.\n"
        "7. Never add a credit card for hosting.\n"
        "8. Documents are in /documents and DOWNLOAD_THESE."
    )

    # extra pages to ensure depth / page count
    g.h1("Appendix A - Click-by-click Windows install (slower version)")
    g.p(
        "Some students freeze when a screenshot does not match. This appendix uses only words. "
        "Sit at the laptop. Estimated 25 minutes."
    )
    g.h2("Download Node")
    g.step(1, "Open Chrome", "Type nodejs.org in the address bar, Enter.")
    g.step(2, "Look for the word LTS", "It means Long Term Support - the stable school version. Click that big button, not 'Current'.")
    g.step(3, "Wait for the .msi file", "Bottom-left of Chrome shows the file. When it says Open, click Open.")
    g.step(4, "User Account Control", "Windows asks 'Allow this app to make changes?' Click Yes.")
    g.step(5, "Welcome wizard", "Click Next.")
    g.step(6, "License", "Click I accept, then Next.")
    g.step(7, "Folder", "Leave C:\\Program Files\\nodejs\\  Next.")
    g.step(8, "Custom setup", "Leave everything ticked, especially 'Add to PATH'. Next.")
    g.step(9, "Tools for Native Modules", "You can leave the extra tick OFF. Next. Install. Wait for the green bar.")
    g.step(10, "Finish", "Untick 'start a tutorial' if you want. Close.")
    g.step(11, "Restart the laptop", "This is the step people skip and then cry. Save your work and Restart.")
    g.step(12, "Verify",
           "After restart: Start button -> type cmd -> Command Prompt. Type node -v. If you see v18 or higher, go to Git.")
    g.h2("Download Git")
    g.step(13, "Browser", "git-scm.com -> Downloads -> Windows.")
    g.step(14, "64-bit installer", "Run it, Yes to UAC, Next many times. When you see 'Adjusting your PATH environment', keep 'Git from the command line and also from 3rd-party software'.")
    g.step(15, "Verify", "New cmd: git --version")
    g.h2("Download VS Code")
    g.step(16, "code.visualstudio.com -> Download for Windows.")
    g.step(17, "Tick 'Add to PATH' and 'Open with Code'.")
    g.step(18, "Open VS Code once so it finishes first-run.")

    g.h1("Appendix B - Click-by-click first Vercel deploy")
    g.step(1, "Finish Chapter 17 so the code is on GitHub.")
    g.step(2, "vercel.com -> Log in -> Continue with GitHub -> Authorize.")
    g.step(3, "Dashboard -> Add New... -> Project.")
    g.step(4, "If the repo is missing, click 'Adjust GitHub App Permissions' and enable that repository.")
    g.step(5, "Import.")
    g.step(6, "Project Name can stay default.")
    g.step(7, "Framework Preset = Vite.")
    g.step(8, "Build Command = npm run build   (auto).")
    g.step(9, "Output = dist   (auto).")
    g.step(10, "Install Command = npm install   (auto).")
    g.step(11, "Deploy. Do not touch Environment Variables.")
    g.step(12, "When it says Congratulations, click Visit. Bookmark the URL.")
    g.step(13, "Send the URL to yourself on WhatsApp so you do not lose it.")
    g.step(14, "On the phone, login owner@trendora.in and show the dashboard. Mobile proof = real hosting.")
    g.p(
        "If Deploy is grey: you did not pick a repo. If build is red: open Building log, screenshot it, read the last 20 lines. "
        "90% of the time it is 'command not found' because Root Directory was set to something random - clear it."
    )

    g.h1("Appendix C - What to say if you are very nervous")
    g.p(
        "Write these sentences on the last page of your rough book:"
    )
    g.p(
        "My project name is Trendora.\n"
        "It is a shopping website like Myntra and Meesho.\n"
        "There are five logins: customer, reseller, seller, admin, owner.\n"
        "Customer can buy with a fake UPI.\n"
        "Reseller shares a link and gets 8 percent.\n"
        "Seller uploads products.\n"
        "Admin changes order status.\n"
        "Owner creates staff and changes settings.\n"
        "I used React and Vite.\n"
        "Data is saved in the browser localStorage.\n"
        "I hosted it free on Vercel from GitHub.\n"
        "No real money is taken."
    )
    g.p(
        "If your English is weak, saying THESE lines clearly is better than reading a 60-page report in a shaky voice. "
        "The report is for submission. The lines are for speaking."
    )
    g.h2("Hindi bolne ki ijazat")
    g.p(
        "Bahut se external examiners Hindi + English mix accept karte hain. "
        "Bolo: 'Yeh simulated checkout hai, paisa nahi katta. Hosting Vercel pe free hai. Database nahi hai, localStorage hai.' "
        "Woh technically correct hai."
    )

    g.h1("Appendix D - Teacher one-pager (print this)")
    g.p(
        "Project: Trendora - multi-authority shopping website.\n"
        "Inspiration: Myntra + Meesho + Flipkart (UX only).\n"
        "Stack: React 18, Vite 5, React Router 6, Context API.\n"
        "Persistence: localStorage key trendora-store-v2.\n"
        "Auth: 5 roles, SHA-256 demo passwords, 6-fail lockout.\n"
        "Hosting: static SPA on Vercel / Netlify free tier.\n"
        "Payments: simulated UPI / card / COD / EMI.\n"
        "Reseller: ?ref= + 8% of grand.\n"
        "Documents: PDF, DOCX, PPTX, beginner guide.\n"
        "Limitation: no real logistics, no server bcrypt, no shared database across visitors."
    )
    g.p("Live URL: ________________________________")
    g.p("GitHub URL: ______________________________")
    g.p("Student name / roll: _____________________")
    g.p("Guide name: ______________________________")

    g.h1("Appendix E - Picture index")
    g.p("Keep this list when you print a colour copy. Figures are placed in the chapters above.")
    g.bullets(
        [
            "3.1 Five roles infographic",
            "3.2 Order journey flowchart",
            "4.1 Home page UI",
            "5.1 Shop + filters",
            "5.2 Product detail",
            "5.3 Bag / cart",
            "5.4 Checkout",
            "5.5 Order success",
            "6.1 / 6.2 Login",
            "7.1 Reseller studio",
            "8.1 Seller dashboard",
            "9.1 Admin dashboard",
            "10.1 Owner dashboard",
            "12.1 Documents page",
            "13.1 What is hosting",
            "13.2 Local to online pipeline",
            "15.1 Node.js LTS site",
            "15.2 VS Code + terminal",
            "17.1 GitHub new repo",
            "18.1 Vercel import / deploy",
        ]
    )
    g.p(
        "End of handbook. If a button label on GitHub/Vercel changed, trust the WORDS (Import, Deploy, LTS, New repository) "
        "not the colour in the figure."
    )
    g.note("Shubhkaamnayein. Ek baar phone pe live URL khol ke mummy-papa ko dikha dena - uske baad darr khatam ho jata hai.", "HINDI")

    g.h1("Appendix F - Hindi mein poori shopping (ek baar aur, bilkul slow)")
    g.p(
        "Agar English steps tez lage, yahan wahi customer journey Hindi-simple mein hai. "
        "Preview ya Vercel link Chrome mein kholo."
    )
    g.step(1, "Upar Trendora likha dikhna chahiye", "Nahi dikha to refresh. Phir bhi nahi to galat link hai.")
    g.step(2, "Login pe jao", "Upar wala person icon, ya seedha /login type karo.")
    g.step(3, "Customer card dabaao", "demo@trendora.in wala bada card. Ek click. Ab aap Aisha ho.")
    g.step(4, "Search mein dress likho", "Enter dabaao. Floral midi dress dikhegi.")
    g.step(5, "Dress kholo", "Photo badi hogi. Size M chuno. PIN 411001 likho, Check dabaao.")
    g.step(6, "Add to bag", "Gulabi button. Neeche kaala message 'Added to bag'.")
    g.step(7, "Bag icon", "Quantity 1 dikhegi. Coupon box mein FESTIVE20. Agar amount chhota hai to ek aur cheez daalo.")
    g.step(8, "Checkout", "Naam, 10 digit mobile, address, city, PIN. Payment mein UPI. Place order.")
    g.step(9, "TRD number likh lo", "Yahi proof hai ki order bana. Viva mein yeh number bolo.")
    g.step(10, "Logout karke admin123", "Orders mein wahi TRD khojo. Status Packed karo. Wapas customer, timeline aage badhi.")
    g.p("Itna kafi hai din 1 ke liye. Hosting kal karna. Ek din mein dono mat milao warna dimag ghoomega.")

    g.h1("Appendix G - Chrome DevTools (sirf 4 clicks)")
    g.p(
        "Teachers sometimes ask 'where is the data?' Show them this instead of panicking."
    )
    g.step(1, "Chrome mein site kholo", "Login as customer, add one item to bag.")
    g.step(2, "F12 dabaao", "A side panel opens. This is DevTools. It looks scary. Ignore most of it.")
    g.step(3, "Application tab", "Left list -> Local Storage -> your site origin.")
    g.step(4, "Key trendora-store-v2", "Click it. A long JSON appears: user, cart, orders. That is the entire 'database'.")
    g.step(5, "Session Storage", "trendora-lock appears after failed logins.")
    g.p(
        "Say: 'Because this is a frontend-only college build, the document store is Web Storage, not MySQL. "
        "A production swap would be fetch('/api/orders').'"
    )
    g.h2("Console errors")
    g.p(
        "If the screen is white, F12 -> Console. Red text is the clue. Screenshot it. "
        "Do not read every line aloud. Read the FIRST red line only."
    )

    g.h1("Appendix H - vercel.json (only if refresh 404)")
    g.p(
        "Create a file named vercel.json in the project root (same level as package.json) with this exact content, "
        "then git add, commit, push:"
    )
    g.p(
        "{\n"
        "  \"rewrites\": [\n"
        "    { \"source\": \"/(.*)\", \"destination\": \"/index.html\" }\n"
        "  ]\n"
        "}"
    )
    g.p(
        "This tells Vercel: any path that is not a real file (like /login) should still load index.html "
        "so React Router can draw the Login page. Vite usually does this already. Add the file only if you saw a 404."
    )
    g.h2("Netlify public/_redirects")
    g.p("One line file, no JSON:\n\n/*    /index.html   200\n")
    g.h2("Why this exists")
    g.p(
        "A normal server looks for a folder /login/index.html. React does not create that folder. "
        "The rewrite is the small trick that makes a single-page app feel like many pages."
    )

    g.h1("Appendix I - WhatsApp message you can copy")
    g.p("Send this to your project guide after Vercel works:")
    g.p(
        "Respected Sir/Madam,\n\n"
        "Please find the live demo of my project Trendora (multi-authority shopping website).\n\n"
        "Live site: <PASTE VERCEL URL>\n"
        "GitHub: <PASTE GITHUB URL>\n\n"
        "Demo logins (also in README):\n"
        "Customer demo@trendora.in / demo123\n"
        "Reseller reseller@trendora.in / reseller123\n"
        "Seller seller@trendora.in / seller123\n"
        "Admin admin@trendora.in / admin123\n"
        "Owner owner@trendora.in / owner123\n\n"
        "Payment is simulated. Documents PDF/Word/PPT are inside /documents.\n\n"
        "Thank you."
    )
    g.h2("Pen-drive folder names")
    g.p(
        "Make a folder TRENDORA_SUBMISSION with:\n"
        "01_Live_URL.txt\n"
        "02_Trendora_Beginner_Complete_Guide.pdf\n"
        "03_Trendora_Project_Report.pdf\n"
        "04_Trendora_Project_Report.docx\n"
        "05_Trendora_Presentation.pptx\n"
        "06_Trendora_How_It_Was_Built.pdf\n"
        "07_source_zip (optional, without node_modules)"
    )

    g.h1("Appendix J - 30 practice questions (write answers in your journal)")
    g.p("Do not memorise essays. Write 2 lines each.")
    g.bullets(
        [
            "1. What is a SPA?",
            "2. What does npm install do?",
            "3. What does npm run build produce?",
            "4. Why can a friend not open localhost?",
            "5. What is Vercel doing for you?",
            "6. Why is payment simulated?",
            "7. Name the five roles.",
            "8. Who can create an admin?",
            "9. How does the reseller earn 8%?",
            "10. When can a customer cancel?",
            "11. When can they return?",
            "12. What is FESTIVE20 minimum?",
            "13. What is free ship default?",
            "14. What is commission default?",
            "15. Where are passwords stored?",
            "16. What is SHA-256 in one line?",
            "17. What is the lockout rule?",
            "18. What does RequireRole do?",
            "19. Why two browsers show different bags?",
            "20. How do you hide a product?",
            "21. What is Insider Elite?",
            "22. What files are in public/docs?",
            "23. Why not upload node_modules?",
            "24. What is a commit?",
            "25. What is a push?",
            "26. What is a 404 on /login after refresh?",
            "27. How do you fix Netlify 404?",
            "28. What will you say if Wi-Fi dies in viva?",
            "29. What is out of scope?",
            "30. What is your future scope sentence?",
        ]
    )
    g.p(
        "If you can answer 20 of these aloud, you will pass a typical external viva even if you forget a button name."
    )
    g.p("This is the last page of extra practice. Go back to Chapter 5 and actually click the site now.")

    dest1 = OUT_DOCS / "Trendora_Beginner_Complete_Guide.pdf"
    dest2 = OUT_DL / "Trendora_Beginner_Complete_Guide.pdf"
    g.output(str(dest1))
    dest2.write_bytes(dest1.read_bytes())
    pages = g.page_no()
    print(f"Wrote {dest1} pages={pages} bytes={dest1.stat().st_size}")
    if pages < 50 or pages > 70:
        raise SystemExit(f"Page count {pages} outside 50-60 target window (allowing small slack to 70)")
    return pages


if __name__ == "__main__":
    build()
