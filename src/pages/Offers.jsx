import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Offers() {
  const { coupons } = useStore()
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Offers</h1>
        <p className="muted">Bank-night energy, coupon engine, like Flipkart / Myntra sale rail.</p>
      </div>
      <div className="prod-grid">
        {coupons.filter((c) => c.active).map((c) => (
          <article key={c.code} className="summary" style={{ position: 'static' }}>
            <div className="eyebrow">{c.type}</div>
            <h2 className="serif">{c.code}</h2>
            <p>{c.label}</p>
            <p className="muted">Min cart ₹{c.min}</p>
            <Link className="btn btn-primary" to="/shop">Shop with {c.code}</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
