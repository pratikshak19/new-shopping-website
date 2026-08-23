import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { wishlist } = useStore()
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id))
  return (
    <div className="wrap">
      <div className="page-hero">
        <h1>Wishlist</h1>
        <p style={{ color: 'var(--muted)' }}>{items.length} saved</p>
      </div>
      {items.length === 0 ? (
        <div className="empty">
          <h2>No favourites yet</h2>
          <p>Tap the heart on any product to save it here.</p>
          <Link className="btn btn-primary" to="/shop" style={{ marginTop: 16 }}>
            Discover styles
          </Link>
        </div>
      ) : (
        <div className="prod-grid" style={{ paddingBottom: 72 }}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
