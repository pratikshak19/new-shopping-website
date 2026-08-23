const QA = [
  ['Is this a real store?', 'No. Trendora is an academic shopping-website project. Payments are simulated and no goods ship.'],
  ['How do I login for the demo?', 'Use “Use demo account” on the login page, or register any email. Data stays in this browser.'],
  ['Which coupons work?', 'TREND10 (10% above ₹799), FESTIVE20 (20% above ₹1,999), WELCOME100 (₹100 above ₹499), FREESHIP.'],
  ['When is delivery free?', 'Orders of ₹999 and above, or any order with the FREESHIP coupon.'],
  ['Can I return items?', 'The site describes a 7-day return policy like Myntra. In the demo, returns are not processed.'],
  ['Where is my data stored?', 'localStorage in your browser under the key trendora-store-v1. Clearing site data resets the shop.'],
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
