#!/usr/bin/env python3
"""Compose annotated 'screenshots' from real Trendora product photos."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "images"
OUT = ROOT / "guide" / "shots"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = (26, 26, 46)
ROSE = (255, 63, 108)
PAPER = (250, 247, 245)
INK = (40, 44, 63)
MUTED = (107, 112, 128)
WHITE = (255, 255, 255)
LINE = (232, 228, 223)

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(size, bold=False):
    return ImageFont.truetype(FONTB if bold else FONT, size)


def load(rel, size=None):
    im = Image.open(IMG / rel).convert("RGB")
    if size:
        im = im.copy()
        im.thumbnail(size, Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", size, (238, 232, 226))
        x = (size[0] - im.width) // 2
        y = (size[1] - im.height) // 2
        canvas.paste(im, (x, y))
        return canvas
    return im


def browser(w, h, url, title="Trendora"):
    im = Image.new("RGB", (w, h), PAPER)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, w, 54), fill=(36, 36, 52))
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse((14 + i * 18, 18, 28 + i * 18, 32), fill=c)
    d.rounded_rectangle((90, 12, w - 24, 42), 10, fill=(55, 55, 74))
    d.text((104, 18), url, font=font(14), fill=(210, 206, 200))
    return im, d


def navbar(d, w, y=54, who=None):
    d.rectangle((0, y, w, y + 70), fill=PAPER)
    d.line((0, y + 70, w, y + 70), fill=LINE, width=1)
    d.text((28, y + 22), "Tren", font=font(22, True), fill=NAVY)
    d.text((78, y + 22), "dora", font=font(22, True), fill=ROSE)
    links = ["Shop", "Women", "Men", "Kids", "Electronics", "Offers", "Studio"]
    x = 170
    for L in links:
        d.text((x, y + 26), L, font=font(13), fill=INK)
        x += 78
    d.rounded_rectangle((w - 360, y + 16, w - 210, y + 52), 18, fill=WHITE, outline=LINE)
    d.text((w - 346, y + 26), "Search kurtas, sneakers...", font=font(11), fill=MUTED)
    for i, label in enumerate(["Bag", "Heart", "User"]):
        cx = w - 170 + i * 48
        d.ellipse((cx, y + 18, cx + 34, y + 52), outline=LINE, width=1)
    if who:
        d.rounded_rectangle((w - 430, y + 18, w - 368, y + 50), 14, fill=(255, 241, 244))
        d.text((w - 422, y + 26), who, font=font(11, True), fill=ROSE)
    return y + 70


def card(im, d, box, photo, brand, name, price, mrp):
    x, y, w, h = box
    d.rounded_rectangle((x, y, x + w, y + h), 16, fill=WHITE, outline=LINE)
    ph = load(photo, (w - 16, int(h * 0.62)))
    im.paste(ph, (x + 8, y + 8))
    d.text((x + 12, y + int(h * 0.66)), brand.upper(), font=font(10, True), fill=MUTED)
    d.text((x + 12, y + int(h * 0.72)), name[:28], font=font(13, True), fill=INK)
    d.text((x + 12, y + int(h * 0.82)), price, font=font(14, True), fill=INK)
    d.text((x + 88, y + int(h * 0.83)), mrp, font=font(11), fill=MUTED)
    d.text((x + 150, y + int(h * 0.83)), "46% OFF", font=font(11, True), fill=(10, 143, 90))


def save(im, name):
    path = OUT / name
    im.save(path, "JPEG", quality=88)
    print("wrote", path)


def shot_home():
    im, d = browser(1440, 900, "https://your-site.vercel.app/")
    y = navbar(d, 1440)
    d.rectangle((0, y, 760, 900), fill=NAVY)
    d.text((48, y + 80), "NEW SEASON DROP", font=font(13, True), fill=(255, 179, 197))
    d.text((48, y + 120), "Dress like the occasion", font=font(36, True), fill=WHITE)
    d.text((48, y + 168), "found you.", font=font(36, True), fill=WHITE)
    d.text((48, y + 230), "Festive silks, city tailoring and everyday cottons.", font=font(16), fill=(217, 210, 204))
    d.rounded_rectangle((48, y + 290, 230, y + 340), 22, fill=ROSE)
    d.text((68, y + 304), "Shop fashion", font=font(15, True), fill=WHITE)
    hero = load("hero-fashion.jpg", (680, 900 - y))
    im.paste(hero, (760, y))
    save(im, "ui-home.jpg")


def shot_shop():
    im, d = browser(1440, 900, "https://your-site.vercel.app/shop")
    y = navbar(d, 1440)
    d.rectangle((24, y + 20, 280, 880), fill=WHITE)
    d.text((40, y + 36), "Filters", font=font(16, True), fill=NAVY)
    for i, t in enumerate(["Women", "Men", "Kids", "Electronics", "Beauty", "Home"]):
        d.rectangle((40, y + 80 + i * 28, 54, y + 94 + i * 28), outline=LINE)
        d.text((64, y + 78 + i * 28), t, font=font(13), fill=INK)
    d.text((40, y + 280), "Price  Rs 0 - 55,000", font=font(12), fill=MUTED)
    d.text((40, y + 320), "Discount  10% / 20% / 30%+", font=font(12), fill=MUTED)
    products = [
        ("products/dress.jpg", "Aurelia", "Blush Garden Midi", "Rs 1,899", "Rs 3,499"),
        ("products/saree.jpg", "Aurelia", "Banarasi Silk Saree", "Rs 4,299", "Rs 7,999"),
        ("products/earbuds.jpg", "Voltix", "PulseBuds Pro", "Rs 3,499", "Rs 5,999"),
        ("products/sneakers.jpg", "Stride", "CloudWalk Leather", "Rs 2,999", "Rs 4,999"),
        ("products/phone.jpg", "Voltix", "NexaPhone Air 5G", "Rs 24,999", "Rs 29,999"),
        ("products/kurta.jpg", "Aurelia", "Heritage Kurta Set", "Rs 2,599", "Rs 4,499"),
    ]
    d.text((304, y + 24), "32 styles  ·  Sort: Popular", font=font(14), fill=MUTED)
    for i, p in enumerate(products):
        col, row = i % 3, i // 3
        card(im, d, (304 + col * 370, y + 56 + row * 380, 350, 360), *p)
    save(im, "ui-shop.jpg")


def shot_pdp():
    im, d = browser(1440, 900, "https://your-site.vercel.app/product/td-1001")
    y = navbar(d, 1440)
    photo = load("products/dress.jpg", (620, 760))
    im.paste(photo, (40, y + 30))
    d.text((700, y + 40), "AURELIA", font=font(12, True), fill=MUTED)
    d.text((700, y + 70), "Blush Garden Floral", font=font(30, True), fill=NAVY)
    d.text((700, y + 110), "Midi Dress", font=font(30, True), fill=NAVY)
    d.text((700, y + 170), "Rs 1,899    Rs 3,499    46% off", font=font(18, True), fill=INK)
    d.text((700, y + 220), "Colour", font=font(13, True), fill=INK)
    for i, c in enumerate(["Blush", "Ivory", "Sage"]):
        d.rounded_rectangle((700 + i * 90, y + 248, 780 + i * 90, y + 282), 16, fill=NAVY if i == 0 else WHITE, outline=LINE)
        d.text((714 + i * 90, y + 256), c, font=font(12), fill=WHITE if i == 0 else INK)
    d.text((700, y + 310), "Size     size chart", font=font(13, True), fill=INK)
    for i, s in enumerate(["XS", "S", "M", "L", "XL"]):
        d.rounded_rectangle((700 + i * 70, y + 338, 758 + i * 70, y + 372), 16, fill=NAVY if s == "M" else WHITE, outline=LINE)
        d.text((716 + i * 70, y + 346), s, font=font(12), fill=WHITE if s == "M" else INK)
    d.rounded_rectangle((700, y + 410, 980, y + 468), 24, fill=ROSE)
    d.text((770, y + 428), "Add to bag", font=font(16, True), fill=WHITE)
    d.rounded_rectangle((1000, y + 410, 1200, y + 468), 24, fill=NAVY)
    d.text((1054, y + 428), "Buy now", font=font(16, True), fill=WHITE)
    d.text((700, y + 500), "PIN  411014   Delivery in 2-4 days · COD available", font=font(13), fill=(10, 143, 90))
    d.text((700, y + 540), "18 in stock  ·  Try & Buy  ·  7-day return", font=font(13), fill=MUTED)
    save(im, "ui-product.jpg")


def shot_login():
    im, d = browser(1440, 900, "https://your-site.vercel.app/login")
    y = navbar(d, 1440)
    d.text((48, y + 30), "Sign in by authority", font=font(34, True), fill=NAVY)
    d.text((48, y + 80), "Paanch alag login — customer, reseller, seller, admin, owner.", font=font(15), fill=MUTED)
    roles = [
        ((20, 149, 143), "CUSTOMER", "demo@trendora.in", "demo123"),
        ((124, 58, 237), "RESELLER", "reseller@trendora.in", "reseller123"),
        ((180, 83, 9), "SELLER", "seller@trendora.in", "seller123"),
        ((37, 99, 235), "ADMIN", "admin@trendora.in", "admin123"),
        (ROSE, "OWNER", "owner@trendora.in", "owner123"),
    ]
    for i, (col, name, email, pw) in enumerate(roles):
        x = 48 + i * 274
        d.rounded_rectangle((x, y + 130, x + 258, y + 300), 18, fill=WHITE, outline=LINE)
        d.rounded_rectangle((x + 16, y + 150, x + 130, y + 178), 12, fill=col)
        d.text((x + 24, y + 156), name, font=font(11, True), fill=WHITE)
        d.text((x + 16, y + 200), email, font=font(12, True), fill=INK)
        d.text((x + 16, y + 226), f"password {pw}", font=font(12), fill=MUTED)
        d.text((x + 16, y + 258), f"Enter {name.title()} console", font=font(12, True), fill=ROSE)
    d.rounded_rectangle((420, y + 340, 1020, 860), 24, fill=WHITE)
    d.text((460, y + 370), "OR TYPE CREDENTIALS", font=font(11, True), fill=ROSE)
    d.text((460, y + 400), "Welcome back", font=font(24, True), fill=NAVY)
    d.text((460, y + 450), "Email", font=font(12, True), fill=INK)
    d.rounded_rectangle((460, y + 474, 980, y + 518), 12, outline=LINE)
    d.text((460, y + 536), "Password", font=font(12, True), fill=INK)
    d.rounded_rectangle((460, y + 560, 980, y + 604), 12, outline=LINE)
    d.rounded_rectangle((460, y + 630, 980, y + 682), 24, fill=ROSE)
    d.text((670, y + 646), "Sign in", font=font(16, True), fill=WHITE)
    save(im, "ui-login.jpg")


def shot_cart():
    im, d = browser(1440, 900, "https://your-site.vercel.app/cart")
    y = navbar(d, 1440)
    d.text((48, y + 24), "Your bag", font=font(32, True), fill=NAVY)
    items = [
        ("products/dress.jpg", "Blush Garden Floral Midi", "Blush · M · Qty 1", "Rs 1,899"),
        ("products/earbuds.jpg", "PulseBuds Pro", "Black · One Size · Qty 1", "Rs 3,499"),
    ]
    for i, (ph, name, meta, price) in enumerate(items):
        top = y + 90 + i * 170
        d.rounded_rectangle((48, top, 900, top + 156), 18, fill=WHITE)
        pic = load(ph, (120, 140))
        im.paste(pic, (60, top + 8))
        d.text((200, top + 24), name, font=font(16, True), fill=INK)
        d.text((200, top + 56), meta, font=font(13), fill=MUTED)
        d.text((780, top + 60), price, font=font(16, True), fill=INK)
    d.rounded_rectangle((940, y + 90, 1400, y + 520), 20, fill=WHITE)
    d.text((968, y + 114), "Price details", font=font(20, True), fill=NAVY)
    rows = [("MRP", "Rs 9,498"), ("Discount", "- Rs 4,100"), ("Coupon FESTIVE20", "- Rs 1,080"), ("Delivery", "FREE"), ("To pay", "Rs 4,318")]
    for i, (a, b) in enumerate(rows):
        d.text((968, y + 170 + i * 40), a, font=font(14, True if i == 4 else False), fill=INK)
        d.text((1240, y + 170 + i * 40), b, font=font(14, True), fill=INK)
    d.rounded_rectangle((968, y + 420, 1372, y + 478), 24, fill=ROSE)
    d.text((1088, y + 438), "Place order", font=font(16, True), fill=WHITE)
    save(im, "ui-cart.jpg")


def shot_checkout():
    im, d = browser(1440, 900, "https://your-site.vercel.app/checkout")
    y = navbar(d, 1440)
    d.text((48, y + 20), "Checkout", font=font(30, True), fill=NAVY)
    d.text((48, y + 64), "BAG   →   ADDRESS   →   PAYMENT", font=font(12, True), fill=ROSE)
    d.rounded_rectangle((48, y + 100, 880, 860), 20, fill=WHITE)
    d.text((72, y + 124), "Delivery address", font=font(20, True), fill=NAVY)
    fields = ["Full name  Aisha Verma", "Mobile  9876543210", "Address  12 MG Road, Koregaon Park", "City  Pune     State  Maharashtra", "PIN code  411001"]
    for i, f in enumerate(fields):
        d.rounded_rectangle((72, y + 170 + i * 70, 840, y + 222 + i * 70), 12, outline=LINE)
        d.text((88, y + 186 + i * 70), f, font=font(13), fill=INK)
    d.rounded_rectangle((920, y + 100, 1400, y + 520), 20, fill=WHITE)
    d.text((948, y + 124), "Payment (simulated)", font=font(18, True), fill=NAVY)
    for i, p in enumerate(["UPI — GPay / PhonePe", "Credit or debit card", "Cash on delivery", "No-cost EMI"]):
        d.rounded_rectangle((948, y + 180 + i * 56, 1372, y + 224 + i * 56), 12, fill=(255, 245, 247) if i == 0 else WHITE, outline=ROSE if i == 0 else LINE)
        d.text((968, y + 192 + i * 56), p, font=font(13), fill=INK)
    d.text((948, y + 430), "College project — no real money.", font=font(12), fill=MUTED)
    save(im, "ui-checkout.jpg")


def shot_dash(name, role, color, items, url):
    im, d = browser(1440, 900, url)
    d.rectangle((0, 54, 260, 900), fill=NAVY)
    d.text((24, 80), "TRENDORA", font=font(12, True), fill=ROSE)
    d.text((24, 110), role.upper(), font=font(11, True), fill=color)
    d.text((24, 140), name, font=font(16, True), fill=WHITE)
    for i, item in enumerate(["Overview", "Catalogue", "Orders", "People", "Coupons", "Returns", "Tickets", "Settings", "Reports"]):
        yy = 190 + i * 40
        if i == 0:
            d.rounded_rectangle((16, yy - 6, 244, yy + 26), 8, fill=(255, 255, 255, ))
            d.rectangle((16, yy - 6, 244, yy + 26), fill=(48, 48, 72))
        d.text((28, yy), item, font=font(13), fill=WHITE)
    d.text((300, 80), f"{role} overview", font=font(28, True), fill=NAVY)
    stats = [("Orders", "128"), ("GMV", "Rs 4.2L"), ("Users", "5"), ("Returns", "3")]
    for i, (k, v) in enumerate(stats):
        x = 300 + i * 270
        d.rounded_rectangle((x, 140, x + 250, 240), 16, fill=WHITE)
        d.text((x + 20, 158), k.upper(), font=font(11, True), fill=MUTED)
        d.text((x + 20, 186), v, font=font(24, True), fill=NAVY)
    d.rounded_rectangle((300, 270, 1380, 860), 16, fill=WHITE)
    d.text((324, 294), "Latest orders", font=font(18, True), fill=NAVY)
    for i, row in enumerate(["TRD104421  Confirmed   Dress x1   Rs 1,899", "TRD104418  Packed   Earbuds x1   Rs 3,499", "TRD104390  Delivered   Sneakers x1   Rs 2,999"]):
        d.text((324, 350 + i * 40), row, font=font(14), fill=INK)
    save(im, f"ui-{role.lower()}.jpg")


def shot_reseller():
    im, d = browser(1440, 900, "https://your-site.vercel.app/reseller", )
    y = navbar(d, 1440, who="Reseller")
    d.text((48, y + 24), "Reseller studio", font=font(30, True), fill=NAVY)
    d.text((48, y + 72), "Share catalogue. No stock. Earn 8% when someone buys your link.", font=font(15), fill=MUTED)
    d.rounded_rectangle((48, y + 120, 700, y + 280), 18, fill=WHITE)
    d.text((72, y + 144), "Your earning", font=font(14), fill=MUTED)
    d.text((72, y + 180), "Rs 640", font=font(36, True), fill=(124, 58, 237))
    d.text((72, y + 236), "from referred checkouts", font=font(13), fill=MUTED)
    photo = load("products/dress.jpg", (280, 340))
    im.paste(photo, (760, y + 120))
    d.text((1060, y + 140), "Blush Garden Midi", font=font(18, True), fill=INK)
    d.rounded_rectangle((1060, y + 200, 1360, y + 250), 20, fill=(124, 58, 237))
    d.text((1100, y + 214), "Copy share link", font=font(14, True), fill=WHITE)
    d.text((1060, y + 280), "/product/td-1001?ref=u-reseller", font=font(12), fill=MUTED)
    save(im, "ui-reseller.jpg")


def shot_docs():
    im, d = browser(1440, 900, "https://your-site.vercel.app/documents")
    y = navbar(d, 1440)
    d.text((48, y + 24), "Download documents", font=font(32, True), fill=NAVY)
    files = [
        "All documents (ZIP)",
        "Project report (PDF)",
        "Project report (Word)",
        "Presentation (PPT)",
        "How it was built (PDF)",
        "BEGINNER GUIDE (this book)",
    ]
    for i, name in enumerate(files):
        col, row = i % 3, i // 3
        x, yy = 48 + col * 450, y + 100 + row * 280
        d.rounded_rectangle((x, yy, x + 420, yy + 250), 18, fill=WHITE)
        d.text((x + 24, yy + 40), name, font=font(18, True), fill=NAVY)
        d.text((x + 24, yy + 90), "Pink button = save file to Downloads.", font=font(13), fill=MUTED)
        d.rounded_rectangle((x + 24, yy + 160, x + 200, yy + 210), 22, fill=ROSE)
        d.text((x + 56, yy + 174), "Download", font=font(14, True), fill=WHITE)
    save(im, "ui-documents.jpg")


def shot_order():
    im, d = browser(1440, 900, "https://your-site.vercel.app/orders/TRD104421")
    y = navbar(d, 1440, who="Aisha")
    d.ellipse((680, y + 20, 760, y + 100), fill=(231, 247, 239))
    d.text((706, y + 42), "OK", font=font(18, True), fill=(10, 143, 90))
    d.text((48, y + 120), "Order placed   TRD104421", font=font(28, True), fill=NAVY)
    steps = ["Order placed", "Packed", "Shipped", "Out for delivery", "Delivered"]
    for i, s in enumerate(steps):
        x = 80 + i * 260
        d.ellipse((x, y + 190, x + 18, y + 208), fill=(10, 143, 90) if i == 0 else LINE)
        if i < 4:
            d.line((x + 18, y + 199, x + 260, y + 199), fill=LINE, width=3)
        d.text((x - 20, y + 220), s, font=font(12), fill=INK)
    pic = load("products/dress.jpg", (140, 170))
    im.paste(pic, (48, y + 280))
    d.text((210, y + 300), "Blush Garden Floral Midi", font=font(16, True), fill=INK)
    d.text((210, y + 336), "Blush · M · Qty 1", font=font(13), fill=MUTED)
    d.text((210, y + 370), "Deliver to Aisha · Pune 411001", font=font(13), fill=MUTED)
    d.text((210, y + 410), "Paid Rs 1,899  ·  UPI (simulated)", font=font(14, True), fill=INK)
    save(im, "ui-order.jpg")


if __name__ == "__main__":
    shot_home()
    shot_shop()
    shot_pdp()
    shot_login()
    shot_cart()
    shot_checkout()
    shot_dash("Priya Shah", "Owner", ROSE, [], "https://your-site.vercel.app/owner")
    shot_dash("Rahul Desai", "Admin", (37, 99, 235), [], "https://your-site.vercel.app/admin")
    shot_dash("Meera Crafts", "Seller", (180, 83, 9), [], "https://your-site.vercel.app/seller")
    shot_reseller()
    shot_docs()
    shot_order()
    print("done")
