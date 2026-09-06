import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function MyReturns() {
  const { returns, user } = useStore()
  const mine = returns.filter((r) => r.userId === user?.id)
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>My returns</h1>
      </div>
      {mine.map((r) => (
        <article key={r.id} className="order-card">
          <div>
            <strong>{r.id}</strong>
            <p>
              Order {r.orderId} · {r.reason} · {r.status}
            </p>
          </div>
          <Link to={`/orders/${r.orderId}`}>View order</Link>
        </article>
      ))}
      {mine.length === 0 && (
        <div className="empty">
          <h2>No returns</h2>
          <p>After an order is marked Delivered (admin console), you can request a return.</p>
        </div>
      )}
    </div>
  )
}
