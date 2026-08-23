import { formatINR } from '../../data/products'
import { useStore } from '../../context/StoreContext'

export default function SellerEarnings() {
  const { orders, user, settings } = useStore()
  const lines = orders.flatMap((o) =>
    o.items
      .filter((i) => i.sellerId === user.id)
      .map((i) => ({ ...i, orderId: o.id, status: o.status, sale: i.price * i.qty }))
  )
  const sale = lines.filter((l) => l.status !== 'Cancelled').reduce((s, l) => s + l.sale, 0)
  const fee = Math.round((sale * settings.commission) / 100)
  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30 }}>
        Earnings
      </h1>
      <p className="muted">Meesho-style supplier payout = sale − platform commission ({settings.commission}%).</p>
      <div className="stat-grid">
        <article className="stat">
          <span>Gross sales</span>
          <b>{formatINR(sale)}</b>
        </article>
        <article className="stat">
          <span>Commission</span>
          <b>{formatINR(fee)}</b>
        </article>
        <article className="stat">
          <span>Net payout</span>
          <b>{formatINR(sale - fee)}</b>
        </article>
      </div>
      <ul className="plain-list">
        {lines.map((l, i) => (
          <li key={i}>
            {l.orderId} · {l.name} × {l.qty} · {formatINR(l.sale)} · {l.status}
          </li>
        ))}
        {lines.length === 0 && <li>No seller lines yet.</li>}
      </ul>
    </div>
  )
}
