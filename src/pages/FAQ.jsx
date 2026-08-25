const QA = [
  ['Is this a real store?', 'No. Trendora is an academic shopping-website project. Payments are simulated and no goods ship.'],
  ['Which logins exist?', 'Five authorities: Customer demo@trendora.in / demo123 · Reseller reseller@trendora.in / reseller123 · Seller seller@trendora.in / seller123 · Admin admin@trendora.in / admin123 · Owner owner@trendora.in / owner123.'],
  ['Which coupons work?', 'TREND10, FESTIVE20, WELCOME100, FREESHIP, INSIDER15 (Elite/Icon). Admin can add more.'],
  ['When is delivery free?', 'Orders of ₹999 and above (owner can change this), or FREESHIP.'],
  ['How do returns work?', 'Admin marks an order Delivered. Customer opens the order and requests a return. Admin/Owner process it.'],
  ['Where is data stored?', 'localStorage key trendora-store-v2. Clear site data to reset.'],
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
