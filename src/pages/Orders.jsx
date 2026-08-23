import { Link } from 'react-router-dom'
import { formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'

export default function Orders() {
  const { orders } = useStore()
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Orders</h1>
        <p style={{ color: 'var(--muted)' }}>Track every Trendora haul.</p>
      </div>
      {orders.length === 0 ? (
        <div className="empty">
          <h2>No orders yet</h2>
          <Link className="btn btn-primary" to="/shop">
            Shop something lovely
          </Link>
        </div>
      ) : (
        orders.map((o) => (
          <Link key={o.id} to={`/orders/${o.id}`} className="order-card">
            <div>
              <strong>{o.id}</strong>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                {new Date(o.placedAt).toLocaleString('en-IN')} · {o.items.length} item(s) · {o.status}
              </p>
              <p style={{ fontSize: 14, marginTop: 6 }}>{o.items.map((i) => i.name).join(', ')}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="price">{formatINR(o.totals.grand)}</div>
              <span className="link-more">Details</span>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
