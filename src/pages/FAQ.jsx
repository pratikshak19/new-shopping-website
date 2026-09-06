const QA = [
  ['Is this a real store?', 'No. Trendora is an academic shopping-website project. Payments are simulated and no goods ship.'],
  ['What is Personalized Smart Shopping?', 'Open /style — AI outfit prompt, mood shop, budget lock, photo similar search, eco score, smart cart and Student Mode. Same Trendora shop, not a new site.'],
  ['Who can shop?', 'Any customer email can sign in at /login. New emails create a customer after OTP. OTP for every customer and new account is 1923. Demo: demo@trendora.in / demo123 then 1923. Admin: /staff with admin@trendora.in / admin123 (no customer OTP).'],
  ['Is payment real? Why Razorpay?', 'Checkout looks like Razorpay (UPI, cards, netbanking, wallets) so the viva can show payment options. It is test/demo mode: no Razorpay keys, no bank, no charge. A live store would create an order on a server and open real Razorpay Checkout.'],
  ['Is the website fully secure?', 'It is hardened for a college SPA (hashed passwords, OTP, input cleaning, idle logout, no card storage). It is not a bank-grade live store because there is no server. Do not use real card numbers.'],
  ['Can I add or delete products?', 'No. Only the store admin can change the catalogue from a private /staff desk. Shoppers only browse and buy.'],
  ['Which coupons work?', 'TREND10, FESTIVE20, WELCOME100, FREESHIP, INSIDER15 (Elite/Icon).'],
  ['When is delivery free?', 'Orders of ₹999 and above, or coupon FREESHIP.'],
  ['How do returns work?', 'After an order is Delivered, open it and request a return. The admin processes it.'],
  ['Where is data stored?', 'In this browser (localStorage key trendora-store-v2). Clear site data to reset.'],
]

export default function FAQ() {
  return (
    <div className="wrap" style={{ paddingBottom: 72, maxWidth: 800 }}>
      <div className="page-hero">
        <h1>FAQ</h1>
      </div>
      <div className="faq">
        {QA.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p style={{ marginTop: 8, color: '#444' }}>{a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
