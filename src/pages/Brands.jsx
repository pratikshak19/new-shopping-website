import { Link } from 'react-router-dom'
import { BRANDS } from '../data/products'

export default function Brands() {
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Brands</h1>
      </div>
      <div className="brand-row">
        {BRANDS.map((b) => (
          <Link key={b} className="chip" to={`/shop?brand=${encodeURIComponent(b)}`}>
            {b}
          </Link>
        ))}
      </div>
    </div>
  )
}
