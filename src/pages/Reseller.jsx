import { formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

export default function Reseller() {
  const { user, visibleProducts, shares, shareProduct } = useStore()
  const mine = shares.filter((s) => s.resellerId === user?.id)
  const earned = mine.reduce((s, x) => s + x.amount, 0)
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Reseller studio</h1>
        <p className="muted">Meesho-style: no inventory. Share a catalogue link, earn 8% when someone buys.</p>
      </div>
      <div className="stat-grid">
        <article className="stat">
          <span>Your code</span>
          <b>{user?.id}</b>
        </article>
        <article className="stat">
          <span>Shares converted</span>
          <b>{mine.length}</b>
        </article>
        <article className="stat">
          <span>Earnings (8%)</span>
          <b>{formatINR(earned)}</b>
        </article>
      </div>
      <p className="muted" style={{ margin: '8px 0 18px' }}>
        Copy any “Share & earn” link. When a customer opens `?ref={user?.id}` and checks out, you get paid.
      </p>
      <button className="btn btn-primary" onClick={() => shareProduct(visibleProducts[0]?.id)} style={{ marginBottom: 20 }}>
        Copy first product share link
      </button>
      <h2 className="serif">Catalogue to share</h2>
      <div className="prod-grid" style={{ marginTop: 16 }}>
        {visibleProducts.slice(0, 12).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
