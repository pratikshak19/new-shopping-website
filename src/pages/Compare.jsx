import { Link } from 'react-router-dom'
import { discountOf, formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductImage from '../components/ProductImage'

export default function Compare() {
  const { compare, getProduct, toggleCompare } = useStore()
  const items = compare.map(getProduct).filter(Boolean)
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Compare</h1>
        <p className="muted">Up to 3 styles, side by side.</p>
      </div>
      {items.length === 0 ? (
        <div className="empty">
          <h2>Nothing to compare</h2>
          <Link className="btn btn-primary" to="/shop">Add from a product page</Link>
        </div>
      ) : (
        <div className="compare-grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map((p) => (
            <article key={p.id} className="summary" style={{ position: 'static' }}>
              <ProductImage src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.brand}</p>
              <p>{formatINR(p.price)} · {discountOf(p)}% off</p>
              <p>Rating {p.rating}</p>
              <p>Stock {p.stock}</p>
              <p>{(p.highlights || []).join(' · ')}</p>
              <Link to={`/product/${p.id}`}>View</Link>
              <button className="linkish" onClick={() => toggleCompare(p.id)}>Remove</button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
